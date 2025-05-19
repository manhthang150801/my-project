from typing import List
from sqlalchemy.orm import Session
from app.dto.jobdto import JobRequestDTO
from app.model.job import Job

class JobService:

    def create_job(self, db: Session, job_request_dto: JobRequestDTO) -> Job:
        pass

    def get_jobs(self, db: Session) -> List[Job]:
        pass

    def get_job_by_id(self, db: Session, job_id: str) -> Job:
        pass

    def update_job(self, db: Session, job_request_dto: JobRequestDTO) -> Job:
        pass

    def delete_job(self, db: Session, job_id: str) -> Job:
        pass

    def get_by_job_code(self, db: Session, job_code: str) -> Job:
        pass

    def count_job(self, db: Session) -> int:
        pass

    def get_all_jobs(self, db: Session, skip: int = 0, limit: int = 10) -> List[Job]:
        pass
