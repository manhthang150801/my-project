from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.dto.jobrecommenddto import JobRecommendResponseDTO


class SurveyAnswersDTO(BaseModel):
    question_name: str
    selected_answer: str

class DataTrainResponseDTO(BaseModel):
    id: UUID
    gender: str
    age: str
    education: str
    income: str
    employed: str
    jobCode: str
    profession: str
    listAnswer: List[SurveyAnswersDTO]
    listJobcomment: List[JobRecommendResponseDTO]

    class Config:
        from_attributes = True