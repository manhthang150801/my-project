from typing import List

from sqlalchemy.orm import Session
from app.model.job import Job

class JobRepository:

    def create(self, db: Session, job: Job):
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    def get_all(self, db: Session):
        return db.query(Job).all()

    def get_by_id(self, db: Session, job_id: str):
        return db.query(Job).filter(Job.id == job_id).first()

    def update(self, db: Session, job: Job):
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    def delete(self, db: Session, job_id: str):
        job = db.query(Job).filter(Job.id == job_id).first()
        db.delete(job)
        db.commit()
        return job

    def get_by_job_code(self, db: Session, job_code: str) -> Job:
        return db.query(Job).filter(Job.jobCode == job_code).first()

    def count_job(self, db: Session) -> int:
        return db.query(Job).count()

    def get_all_jobs(self, db: Session, skip: int = 0, limit: int = 10) -> List[Job]:
        return db.query(Job).offset(skip).limit(limit).all()
