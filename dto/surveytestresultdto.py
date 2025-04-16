from typing import List

from pydantic import BaseModel

from app.dto.jobrecommenddto import JobRecommendResponseDTO


class AverageScoresDTO(BaseModel):
    topicName: str
    score: float

class PredictedRiasecTypeDTO(BaseModel):
    topicName: str

class SurveyTestResultDTO(BaseModel):
    predictedRiasecType: PredictedRiasecTypeDTO
    jobRecommendations: List[JobRecommendResponseDTO]

class SurveyResultDTO(BaseModel):
    averageScores: List[AverageScoresDTO]
    professionSelected: str
    topicSelected: str
    predictedRiasecType: PredictedRiasecTypeDTO
    jobRecommendations: List[JobRecommendResponseDTO]