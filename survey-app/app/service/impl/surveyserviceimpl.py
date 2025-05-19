from typing import List

from sqlalchemy.orm import Session

from app.dto.surveydto import SurveyRequestDTO
from app.model.survey import Survey
from app.repository.surveyrepository import SurveyRepository
from app.service.surveyservice import SurveyService

class SurveyServiceImpl(SurveyService):

    def __init__(self):
        self.repository = SurveyRepository()

    def create_survey(self, db: Session, survey_request_dto: SurveyRequestDTO) -> Survey:
        survey_entity = Survey(
            information_id=survey_request_dto.information_id
        )
        return self.repository.create(db, survey_entity)

    def get_surveys(self, db: Session) -> List[Survey]:
        return self.repository.get_all(db)

    def get_survey_by_id(self, db: Session, survey_id: str) -> Survey:
        return self.repository.get_by_id(db, survey_id)

    def update_survey(self, db: Session, survey_request_dto: SurveyRequestDTO) -> Survey:
        survey = self.repository.get_by_id(db, survey_request_dto.id)
        if survey:
            survey.information_id = survey_request_dto.information_id
            return self.repository.update(db, survey)
        return None

    def delete_survey(self, db: Session, survey_id: str) -> Survey:
        return self.repository.delete(db, survey_id)
