from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class AnswerRequestDTO(BaseModel):
    id: Optional[str] = None
    answerName: str
    answerValue: str

class AnswerResponseDTO(BaseModel):
    id: UUID
    answerName: str
    answerValue: str

    class Config:
        from_attributes = True