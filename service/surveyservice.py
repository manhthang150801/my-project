from typing import List
from sqlalchemy.orm import Session
from app.dto.surveydto import SurveyRequestDTO
from app.model.survey import Survey

class SurveyService:

    def create_survey(self, db: Session, survey_request_dto: SurveyRequestDTO) -> Survey:
        pass

    def get_surveys(self, db: Session) -> List[Survey]:
        pass

    def get_survey_by_id(self, db: Session, survey_id: str) -> Survey:
        pass

    def update_survey(self, db: Session, survey_request_dto: SurveyRequestDTO) -> Survey:
        pass

    def delete_survey(self, db: Session, survey_id: str) -> Survey:
        pass
