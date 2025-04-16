from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from app.dto.datatraindto import DataTrainResponseDTO, SurveyAnswersDTO
from app.dto.informationdto import InformationRequestDTO
from app.dto.jobrecommenddto import JobRecommendResponseDTO
from app.model.information import Information
from app.repository.answerrepository import AnswerRepository
from app.repository.educationrepository import EducationRepository
from app.repository.incomerepository import IncomeRepository
from app.repository.informationrepository import InformationRepository
from app.repository.jobrepository import JobRepository
from app.service.informationservice import InformationService

class InformationServiceImpl(InformationService):

    def __init__(self):
        self.repository = InformationRepository()
        self.job_repository = JobRepository()
        self.education_repository = EducationRepository()
        self.income_repository = IncomeRepository()
        self.answer_repository = AnswerRepository()

    def create_information(self, db: Session, information_request_dto: InformationRequestDTO) -> Information:
        information_entity = Information(
            gender=information_request_dto.gender,
            age=information_request_dto.age,
            education=information_request_dto.education,
            income=information_request_dto.income,
            employed=information_request_dto.employed,
            profession=information_request_dto.profession,
            vernacular=information_request_dto.vernacular
        )
        return self.repository.create(db, information_entity)

    def get_informations(self, db: Session) -> List[Information]:
        return self.repository.get_all(db)

    def get_information_by_id(self, db: Session, information_id: str) -> Information:
        return self.repository.get_by_id(db, information_id)

    def update_information(self, db: Session, information_request_dto: InformationRequestDTO) -> Information:
        information = self.repository.get_by_id(db, information_request_dto.id)
        if information:
            information.gender = information_request_dto.gender
            information.age = information_request_dto.age
            information.education = information_request_dto.education
            information.income = information_request_dto.income
            information.employed = information_request_dto.employed
            information.profession = information_request_dto.profession
            information.vernacular = information_request_dto.vernacular
            return self.repository.update(db, information)
        return None

    def delete_information(self, db: Session, information_id: str) -> Information:
        return self.repository.delete(db, information_id)

    def get_data_information(self, db: Session, skip: int = 0, limit: int = 10) -> List[DataTrainResponseDTO]:
        data_train = self.repository.get_data_information(db, skip, limit)

        jobs = {job.jobCode: job.jobName for job in self.job_repository.get_all(db)}
        educations = {edu.educationCode: edu.educationName for edu in self.education_repository.get_all(db)}
        incomes = {inc.incomeCode: inc.incomeName for inc in self.income_repository.get_all(db)}
        answer_values = {ans.id: ans.answerValue for ans in self.answer_repository.get_all(db)}

        response_data = []
        for info in data_train:
            for survey in info.surveys:
                list_answer = [
                    SurveyAnswersDTO(
                        question_name=f"question{index + 1}",
                        selected_answer=answer_values.get(UUID(survey_res.selected_answer), "Unknow")
                    ) for index, survey_res in enumerate(survey.surveyres)
                ]

                list_job_comment = [
                    JobRecommendResponseDTO(
                        jobrecommendCode=job_rec.jobrecommendCode,
                        jobrecommendValue=job_rec.jobrecommendValue
                    ) for job_rec in survey.job_recommends
                ]

                response_data.append(DataTrainResponseDTO(
                    id=info.id,
                    gender="Nam" if info.gender == "0" else "Nữ",
                    age=info.age,
                    education=educations.get(info.education, "Unknow"),
                    income=incomes.get(info.income, "Unknow"),
                    employed=info.employed,
                    jobCode=info.profession,
                    profession=jobs.get(info.profession, "Unknow"),
                    listAnswer=list_answer,
                    listJobcomment=list_job_comment
                ))

        return response_data

    def get_data_information_file(self, db: Session) -> List[DataTrainResponseDTO]:
        data_train = self.repository.get_data_information_file(db)

        jobs = {job.jobCode: job.jobName for job in self.job_repository.get_all(db)}
        educations = {edu.educationCode: edu.educationName for edu in self.education_repository.get_all(db)}
        incomes = {inc.incomeCode: inc.incomeName for inc in self.income_repository.get_all(db)}
        answer_values = {ans.id: ans.answerValue for ans in self.answer_repository.get_all(db)}

        response_data = []
        for info in data_train:
            for survey in info.surveys:
                list_answer = [
                    SurveyAnswersDTO(
                        question_name=f"question{index + 1}",
                        selected_answer=answer_values.get(UUID(survey_res.selected_answer), "Unknow")
                    ) for index, survey_res in enumerate(survey.surveyres)
                ]

                list_job_comment = [
                    JobRecommendResponseDTO(
                        jobrecommendCode=job_rec.jobrecommendCode,
                        jobrecommendValue=job_rec.jobrecommendValue
                    ) for job_rec in survey.job_recommends
                ]

                response_data.append(DataTrainResponseDTO(
                    id=info.id,
                    gender="Nam" if info.gender == "0" else "Nữ",
                    age=info.age,
                    education=educations.get(info.education, "Unknow"),
                    income=incomes.get(info.income, "Unknow"),
                    employed=info.employed,
                    jobCode=info.profession,
                    profession=jobs.get(info.profession, "Unknow"),
                    listAnswer=list_answer,
                    listJobcomment=list_job_comment
                ))

        return response_data

    def count_information(self, db: Session) -> int:
        return self.repository.count_information(db)