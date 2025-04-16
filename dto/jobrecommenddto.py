from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class JobRecommendRequestDTO(BaseModel):
    id: Optional[str] = None
    jobrecommendCode: str
    jobrecommendValue: str
    survey_id: str

class JobRecommendResponseDTO(BaseModel):
    id: Optional[UUID] = None
    jobrecommendCode: str
    jobrecommendValue: str

    class Config:
        from_attributes = True
