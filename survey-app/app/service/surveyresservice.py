from typing import List, Dict
from sqlalchemy.orm import Session

from app.dto.interestdto import InterestResponseDTO
from app.dto.surveydatadto import SurveyDataRequestDTO, SurveyDataResponseDTO
from app.dto.surveyresdto import SurveyResRequestDTO
from app.model.surveyres import SurveyRes


class SurveyResService:

    def create_survey_res(self, db: Session, survey_res_request_dto: SurveyResRequestDTO) -> SurveyRes:
        pass

    def get_survey_res(self, db: Session) -> List[SurveyRes]:
        pass

    def get_survey_res_by_id(self, db: Session, survey_res_id: str) -> SurveyRes:
        pass

    def update_survey_res(self, db: Session, survey_res_request_dto: SurveyResRequestDTO) -> SurveyRes:
        pass

    def delete_survey_res(self, db: Session, survey_res_id: str) -> SurveyRes:
        pass

    def process_survey(self, db: Session, survey_data_request_dto: SurveyDataRequestDTO):
        pass

    def handle_data_survey(self, db: Session, survey_data_request_dto: SurveyDataRequestDTO) -> SurveyDataResponseDTO:
        pass

    def calculate_average_by_topic(self, db: Session, information_id: str) -> Dict[str, float]:
        pass

    def get_by_net_soc_code(self, db: Session, net_soc_code: str) -> List[InterestResponseDTO]:
        pass