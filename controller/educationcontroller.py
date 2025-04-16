from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.educationdto import EducationResponseDTO, EducationRequestDTO
from app.service.impl.educationserviceimpl import EducationServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
education_service = EducationServiceImpl()

@router.post("/educations", response_model=dict)
def create_education(education_request_dto: EducationRequestDTO, db: Session = Depends(get_db),user_id: UUID = Depends(verify_token)):
    try:
        education_service.create_education(db, education_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/educations", response_model=List[EducationResponseDTO])
def read_educations(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return education_service.get_educations(db)

@router.get("/guest/educations", response_model=List[EducationResponseDTO])
def get_educations(db: Session = Depends(get_db)):
    return education_service.get_educations(db)

@router.get("/educations/{education_id}", response_model=EducationResponseDTO)
def read_education_by_id(education_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    education = education_service.get_education_by_id(db, education_id)
    if education is None:
        raise HTTPException(status_code=404, detail="not_found")
    return education

@router.put("/educations", response_model=dict)
def update_education(education_request_dto: EducationRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        education_service.update_education(db, education_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/educations/{education_id}")
def delete_education(education_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        education_service.delete_education(db, education_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}
