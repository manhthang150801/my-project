from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class SurveyResRequestDTO(BaseModel):
    id: Optional[str] = None
    survey_id: UUID
    question_id: UUID
    selected_answer: str

class SurveyResResponseDTO(BaseModel):
    id: UUID
    survey_id: UUID
    question_id: UUID
    selected_answer: str

    class Config:
        from_attributes = True
