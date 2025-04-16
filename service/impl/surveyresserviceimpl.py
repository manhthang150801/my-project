import random

import pandas as pd
import numpy as np
import joblib
from sklearn.neighbors import KNeighborsRegressor
from typing import List

from sqlalchemy.orm import Session

from app.dto.informationdto import InformationResponseDTO
from app.dto.interestdto import InterestResponseDTO
from app.dto.jobrecommenddto import JobRecommendRequestDTO, JobRecommendResponseDTO
from app.dto.surveydatadto import SurveyDataRequestDTO, SurveyDataResponseDTO
from app.dto.surveydto import SurveyRequestDTO, SurveyResponseDTO
from app.dto.surveyresdto import SurveyResRequestDTO, SurveyResResponseDTO
from app.dto.surveytestresultdto import SurveyTestResultDTO, PredictedRiasecTypeDTO, AverageScoresDTO, \
    SurveyResultDTO
from app.model.answer import Answer
from app.model.question import Question
from app.model.survey import Survey
from app.model.surveyres import SurveyRes
from app.model.topic import Topic
from app.repository.surveyresrepository import SurveyResRepository
from app.service.impl.informationserviceimpl import InformationServiceImpl
from app.service.impl.interestserviceimpl import InterestServiceImpl
from app.service.impl.jobrecommendserviceimpl import JobRecommendServiceImpl
from app.service.impl.jobserviceimpl import JobServiceImpl
from app.service.impl.surveyserviceimpl import SurveyServiceImpl
from app.service.surveyresservice import SurveyResService

class SurveyResServiceImpl(SurveyResService):

    def __init__(self):
        self.repository = SurveyResRepository()
        self.information_service = InformationServiceImpl()
        self.survey_service = SurveyServiceImpl()
        self.interest_service = InterestServiceImpl()
        self.job_service = JobServiceImpl()
        self.job_recommend_service = JobRecommendServiceImpl()

    def create_survey_res(self, db: Session, survey_res_request_dto: SurveyResRequestDTO) -> SurveyRes:
        survey_res_entity = SurveyRes(
            survey_id=survey_res_request_dto.survey_id,
            question_id=survey_res_request_dto.question_id,
            selected_answer=survey_res_request_dto.selected_answer
        )
        return self.repository.create(db, survey_res_entity)

    def get_survey_res(self, db: Session) -> List[SurveyRes]:
        return self.repository.get_all(db)

    def get_survey_res_by_id(self, db: Session, survey_res_id: str) -> SurveyRes:
        return self.repository.get_by_id(db, survey_res_id)

    def update_survey_res(self, db: Session, survey_res_request_dto: SurveyResRequestDTO) -> SurveyRes:
        survey_res = self.repository.get_by_id(db, survey_res_request_dto.id)
        if survey_res:
            survey_res.survey_id = survey_res_request_dto.survey_id
            survey_res.question_id = survey_res_request_dto.question_id
            survey_res.selected_answer = survey_res_request_dto.selected_answer
            return self.repository.update(db, survey_res)
        return None

    def delete_survey_res(self, db: Session, survey_res_id: str) -> SurveyRes:
        return self.repository.delete(db, survey_res_id)

    def process_survey(self, db: Session, survey_data_request_dto: SurveyDataRequestDTO) -> SurveyResultDTO:
        response = self.handle_data_survey(db, survey_data_request_dto)
        if response:
            average_scores = self.calculate_average_by_topic(db, str(response.user_infor.id))
            interest = self.get_by_net_soc_code(db, str(response.user_infor.profession))

            job_selected = self.job_service.get_by_job_code(db, response.user_infor.profession)
            max_interest = max(interest, key=lambda x: float(x.dataValue))

            average_scores_dto: List[AverageScoresDTO] = [
                AverageScoresDTO(topicName=topic, score=score)
                for topic, score in average_scores.items()
            ]

            result = self.process_survey_testing(db, average_scores, interest)

            for job in result.jobRecommendations:
                job_recommend_dto = JobRecommendRequestDTO(
                    jobrecommendCode=job.jobrecommendCode,
                    jobrecommendValue=job.jobrecommendValue,
                    survey_id=str(response.survey.id)
                )
                self.job_recommend_service.create_job_recommend(db, job_recommend_dto)

            survey_result_dto = SurveyResultDTO(
                averageScores=average_scores_dto,
                professionSelected=job_selected.jobName,
                topicSelected=max_interest.elementName,
                predictedRiasecType=result.predictedRiasecType,
                jobRecommendations=result.jobRecommendations
            )

            return survey_result_dto
        return None

    def handle_data_survey(self, db: Session, survey_data_request_dto: SurveyDataRequestDTO) -> SurveyDataResponseDTO:
        try:
            information_entity = self.information_service.create_information(db, survey_data_request_dto.user_info)

            survey_request_dto = SurveyRequestDTO(
                information_id=information_entity.id
            )
            survey_entity = self.survey_service.create_survey(db, survey_request_dto)

            survey_responses = []
            for question_id, selected_answer in survey_data_request_dto.selected_answers.items():
                survey_res = SurveyRes (
                    survey_id=survey_entity.id,
                    question_id=question_id,
                    selected_answer=selected_answer
                )
                survey_res_entity = self.create_survey_res(db, survey_res)
                survey_responses.append(
                    SurveyResResponseDTO(
                        id=survey_res_entity.id,
                        survey_id=survey_res_entity.survey_id,
                        question_id=survey_res_entity.question_id,
                        selected_answer=survey_res_entity.selected_answer
                    )
                )

            response = SurveyDataResponseDTO(
                user_infor=InformationResponseDTO(
                    id=information_entity.id,
                    gender=information_entity.gender,
                    age=information_entity.age,
                    education=information_entity.education,
                    income=information_entity.income,
                    employed=information_entity.employed,
                    profession=information_entity.profession,
                    vernacular=information_entity.vernacular
                ),
                survey=SurveyResponseDTO(
                    id=survey_entity.id,
                    information_id=survey_entity.information_id
                ),
                survey_res=survey_responses
            )

            db.commit()

            return response
        except Exception:
            db.rollback()
            return None

    def calculate_average_by_topic(self, db: Session, information_id: str):
        try:
            latest_survey = db.query(Survey).filter(Survey.information_id == information_id).order_by(Survey.id.desc()).first()

            if not latest_survey:
                return None

            questions = db.query(Question).join(Topic).filter(Topic.id.in_(
                db.query(Question.topicId).filter(Question.id.in_(
                    db.query(SurveyRes.question_id).filter(SurveyRes.survey_id == latest_survey.id)
                ))
            )).all()

            topic_map = {topic.id: topic.topicName for topic in db.query(Topic).all()}

            topic_results = {}

            for question in questions:
                answers = db.query(SurveyRes.selected_answer).filter(SurveyRes.survey_id == latest_survey.id, SurveyRes.question_id == question.id).all()

                total_weighted = 0
                total_type = 0

                for answer in answers:
                    answer_value = db.query(Answer.answerValue).filter(Answer.id == answer[0]).first()
                    if answer_value:
                        answer_value = int(answer_value[0])
                        total_weighted += answer_value * int(question.type)
                        total_type += int(question.type)

                topic_id = question.topicId
                topic_name = topic_map.get(topic_id, "Unknown")

                if topic_name not in topic_results:
                    topic_results[topic_name] = {"total_weighted": 0, "total_type": 0}

                topic_results[topic_name]["total_weighted"] += total_weighted
                topic_results[topic_name]["total_type"] += total_type

            averages = {}
            for topic_name, data in topic_results.items():
                if data["total_type"] > 0:
                    averages[topic_name] = data["total_weighted"] / data["total_type"]
                else:
                    averages[topic_name] = None

            return averages

        except Exception as e:
            return None

    def process_survey_res_for_answer_value(self, db: Session, survey_res):
        result = {}

        for res in survey_res:
            question_id = res.question_id
            selected_answer_id = res.selected_answer

            answer_value = db.query(Answer.answerValue).filter(Answer.id == selected_answer_id).first()

            if answer_value:
                result[question_id] = answer_value[0]

        return result

    def map_survey_response_to_questions(self, survey_response):
        return {f"question{i + 1}": score for i, score in enumerate(survey_response.values())}

    def map_average_scores(self, average_scores):
        return {f"{key}.ind": float(value) if isinstance(value, (int, float)) else np.nan for key, value in average_scores.items()}

    def map_interest(self, interest: List[InterestResponseDTO]) -> dict:
        return {
            f"{item.elementName.lower()}.ch": float(item.dataValue)
            if isinstance(item.dataValue, str) and item.dataValue.replace('.', '', 1).isdigit()
            else np.nan
            for item in interest
        }

    def get_by_net_soc_code(self, db: Session, net_soc_code: str) -> List[InterestResponseDTO]:
        interests = self.interest_service.get_by_net_soc_code(db, net_soc_code)
        return [InterestResponseDTO.from_orm(interest) for interest in interests]

    def process_survey_testing(self, db: Session, average_scores, interest) -> SurveyTestResultDTO:
        try:
            average_mapping = self.map_average_scores(average_scores)

            interest_mapping = self.map_interest(interest)

            latest_data = {}

            for feature, value in average_mapping.items():
                latest_data[feature] = value

            for target, value in interest_mapping.items():
                latest_data[target] = value

            latest_data = pd.Series(latest_data)

            set_X = [
                'realistic.ch', 'investigative.ch', 'artistic.ch', 'social.ch',
                'enterprising.ch', 'conventional.ch'
            ]

            set_y = [
                'Realistic.ind', 'Investigative.ind', 'Artistic.ind', 'Social.ind',
                'Enterprising.ind', 'Conventional.ind'
            ]

            X_latest = latest_data[set_X].values.reshape(1, -1)
            y_latest = latest_data[set_y].values.reshape(1, -1)

            models = joblib.load("models/combined_models.pkl")

            model = models.get('neural')
            predicted_riasec_type = "Unknown"

            if model:
                if not hasattr(model, "coefs_"):
                    if isinstance(model, KNeighborsRegressor) and len(X_latest) < model.n_neighbors:
                        model.set_params(n_neighbors=len(X_latest))
                    model.fit(X_latest, y_latest)

                y_pred = model.predict(X_latest)
                highest_scoring_dimension = y_pred.argmax(axis=1)[0] if len(y_pred.shape) > 1 else y_pred[0]
                riasec_mapping = {0: 'Realistic', 1: 'Investigative', 2: 'Artistic', 3: 'Social', 4: 'Enterprising',
                                  5: 'Conventional'}
                predicted_riasec_type = riasec_mapping.get(highest_scoring_dimension, "Unknown")

            predicted_riasec_type_dto = PredictedRiasecTypeDTO(topicName=predicted_riasec_type)

            interest_all = self.interest_service.get_all_interest(db)

            job_recommendations = []

            matched_interests = [interest_item for interest_item in interest_all if
                                 interest_item.elementName == predicted_riasec_type]

            if matched_interests:
                closest_jobs = random.sample(matched_interests, 5) if len(matched_interests) >= 5 else matched_interests

                for job in closest_jobs:
                    job_recommendations.append(JobRecommendResponseDTO(
                        jobrecommendCode=job.netSocCode,
                        jobrecommendValue=job.title
                    ))
            else:
                job_recommendations = []

            result_dto = SurveyTestResultDTO(
                predictedRiasecType=predicted_riasec_type_dto,
                jobRecommendations=job_recommendations
            )

            return result_dto

        except Exception:
            return None