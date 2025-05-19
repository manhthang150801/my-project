from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.informationdto import InformationResponseDTO, InformationRequestDTO
from app.service.impl.informationserviceimpl import InformationServiceImpl
from app.service.impl.jobrecommendserviceimpl import JobRecommendServiceImpl
from app.service.impl.jobserviceimpl import JobServiceImpl
from app.service.impl.userserviceimpl import UserServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
information_service = InformationServiceImpl()
jobrecommend_service = JobRecommendServiceImpl()
user_service = UserServiceImpl()
job_service = JobServiceImpl()

@router.post("/informations", response_model=dict)
def create_information(information_request_dto: InformationRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        information_service.create_information(db, information_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/informations", response_model=List[InformationResponseDTO])
def read_informations(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return information_service.get_informations(db)

@router.get("/informations/{information_id}", response_model=InformationResponseDTO)
def read_information_by_id(information_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    information = information_service.get_information_by_id(db, information_id)
    if information is None:
        raise HTTPException(status_code=404, detail="not_found")
    return information

@router.put("/informations", response_model=dict)
def update_information(information_request_dto: InformationRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        information_service.update_information(db, information_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/informations/{information_id}")
def delete_information(information_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        information_service.delete_information(db, information_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}

@router.get("/get-data-train")
def get_data_information(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    data_information = information_service.get_data_information(db)
    total_count = information_service.count_information(db)
    return {
        'content': data_information,
        'totalCount': total_count,
    }

@router.get("/get-file")
def get_data_information_file(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return information_service.get_data_information_file(db)

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return  {
        'information': information_service.count_information(db),
        'jobRecommend': jobrecommend_service.count_job_recommend(db),
        'user': user_service.count_users(db),
        'job': job_service.count_job(db)
    }

