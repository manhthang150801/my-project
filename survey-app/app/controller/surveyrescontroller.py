from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.surveydatadto import SurveyDataRequestDTO
from app.dto.surveyresdto import SurveyResRequestDTO, SurveyResResponseDTO
from app.dto.surveytestresultdto import SurveyResultDTO
from app.service.impl.surveyresserviceimpl import SurveyResServiceImpl

router = APIRouter()
survey_res_service = SurveyResServiceImpl()

@router.post("/survey-res", response_model=SurveyResultDTO)
def create_survey_res(survey_data_request_dto: SurveyDataRequestDTO, db: Session = Depends(get_db)):
    result = survey_res_service.process_survey(db, survey_data_request_dto)

    if result:
        return result
    return None

@router.get("/survey_res", response_model=List[SurveyResResponseDTO])
def read_survey_res(db: Session = Depends(get_db)):
    return survey_res_service.get_survey_res(db)

@router.get("/survey_res/{survey_res_id}", response_model=SurveyResResponseDTO)
def read_survey_res_by_id(survey_res_id: str, db: Session = Depends(get_db)):
    survey_res = survey_res_service.get_survey_res_by_id(db, survey_res_id)
    if survey_res is None:
        raise HTTPException(status_code=404, detail="not_found")
    return survey_res

@router.put("/survey_res", response_model=dict)
def update_survey_res(survey_res_request_dto: SurveyResRequestDTO, db: Session = Depends(get_db)):
    try:
        survey_res_service.update_survey_res(db, survey_res_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/survey_res/{survey_res_id}")
def delete_survey_res(survey_res_id: str, db: Session = Depends(get_db)):
    try:
        survey_res_service.delete_survey_res(db, survey_res_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}
