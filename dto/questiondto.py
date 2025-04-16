from uuid import UUID
from typing import Optional
from pydantic import BaseModel

class QuestionRequestDTO(BaseModel):
    id: Optional[str] = None
    question: str
    type: Optional[str] = None
    topicId: str

class QuestionResponseDTO(BaseModel):
    id: UUID
    question: str
    type: Optional[str] = None
    topicId: UUID
    topicName: Optional[str] = None

    class Config:
        from_attributes = True
