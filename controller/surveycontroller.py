from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.surveydto import SurveyResponseDTO, SurveyRequestDTO
from app.service.impl.surveyserviceimpl import SurveyServiceImpl

router = APIRouter()
survey_service = SurveyServiceImpl()

@router.post("/surveys", response_model=dict)
def create_survey(survey_request_dto: SurveyRequestDTO, db: Session = Depends(get_db)):
    try:
        survey_service.create_survey(db, survey_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/surveys", response_model=List[SurveyResponseDTO])
def read_surveys(db: Session = Depends(get_db)):
    return survey_service.get_surveys(db)

@router.get("/surveys/{survey_id}", response_model=SurveyResponseDTO)
def read_survey_by_id(survey_id: str, db: Session = Depends(get_db)):
    survey = survey_service.get_survey_by_id(db, survey_id)
    if survey is None:
        raise HTTPException(status_code=404, detail="not_found")
    return survey

@router.put("/surveys", response_model=dict)
def update_survey(survey_request_dto: SurveyRequestDTO, db: Session = Depends(get_db)):
    try:
        survey_service.update_survey(db, survey_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/surveys/{survey_id}")
def delete_survey(survey_id: str, db: Session = Depends(get_db)):
    try:
        survey_service.delete_survey(db, survey_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}
