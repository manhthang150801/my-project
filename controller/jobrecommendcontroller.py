from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.jobrecommenddto import JobRecommendResponseDTO, JobRecommendRequestDTO
from app.service.impl.jobrecommendserviceimpl import JobRecommendServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
jobrecommend_service = JobRecommendServiceImpl()

@router.post("/jobrecommends", response_model=dict)
def create_job_recommend(job_recommend_request_dto: JobRecommendRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        jobrecommend_service.create_job_recommend(db, job_recommend_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/jobrecommends", response_model=List[JobRecommendResponseDTO])
def read_job_recommends(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return jobrecommend_service.get_job_recommends(db)

@router.get("/guest/jobrecommends", response_model=List[JobRecommendResponseDTO])
def get_job_recommends(db: Session = Depends(get_db)):
    return jobrecommend_service.get_job_recommends(db)

@router.get("/jobrecommends/{job_recommend_id}", response_model=JobRecommendResponseDTO)
def read_job_recommend_by_id(job_recommend_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    job_recommend = jobrecommend_service.get_job_recommend_by_id(db, job_recommend_id)
    if job_recommend is None:
        raise HTTPException(status_code=404, detail="not_found")
    return job_recommend

@router.put("/jobrecommends", response_model=dict)
def update_job_recommend(job_recommend_request_dto: JobRecommendRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        jobrecommend_service.update_job_recommend(db, job_recommend_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/jobrecommends/{job_recommend_id}")
def delete_job_recommend(job_recommend_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        jobrecommend_service.delete_job_recommend(db, job_recommend_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}
