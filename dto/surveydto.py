from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class SurveyRequestDTO(BaseModel):
    id: Optional[str] = None
    information_id: UUID

class SurveyResponseDTO(BaseModel):
    id: UUID
    information_id: UUID

    class Config:
        from_attributes = True
