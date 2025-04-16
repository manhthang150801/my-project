from typing import Dict, List
from uuid import UUID
from pydantic import BaseModel

from app.dto.informationdto import InformationResponseDTO, InformationRequestDTO
from app.dto.surveydto import SurveyResponseDTO
from app.dto.surveyresdto import SurveyResResponseDTO

class SurveyDataRequestDTO(BaseModel):
    user_info: InformationRequestDTO
    selected_answers: Dict[UUID, UUID]

class SurveyDataResponseDTO(BaseModel):
    user_infor: InformationResponseDTO
    survey: SurveyResponseDTO
    survey_res: List[SurveyResResponseDTO]

