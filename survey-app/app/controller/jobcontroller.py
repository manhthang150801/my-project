from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.jobdto import JobResponseDTO, JobRequestDTO
from app.service.impl.jobserviceimpl import JobServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
job_service = JobServiceImpl()

@router.post("/jobs", response_model=dict)
def create_job(job_request_dto: JobRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        job_service.create_job(db, job_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/jobs", response_model=List[JobResponseDTO])
def read_jobs(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return job_service.get_jobs(db)

@router.get("/guest/jobs", response_model=List[JobResponseDTO])
def get_jobs(db: Session = Depends(get_db)):
    return job_service.get_jobs(db)

@router.get("/jobs/{job_id}", response_model=JobResponseDTO)
def read_job_by_id(job_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    job = job_service.get_job_by_id(db, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="not_found")
    return job

@router.put("/jobs", response_model=dict)
def update_job(job_request_dto: JobRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        job_service.update_job(db, job_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/jobs/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        job_service.delete_job(db, job_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}

@router.get("/all-jobs")
def get_all_jobs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    jobs = job_service.get_all_jobs(db, skip=skip, limit=limit)
    total_count = job_service.count_job(db)
    return {
        'content': jobs,
        'totalCount': total_count,
    }