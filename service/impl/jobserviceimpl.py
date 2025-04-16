from typing import List

from sqlalchemy.orm import Session

from app.dto.jobdto import JobRequestDTO
from app.model.job import Job
from app.repository.jobrepository import JobRepository
from app.service.jobservice import JobService

class JobServiceImpl(JobService):

    def __init__(self):
        self.repository = JobRepository()

    def create_job(self, db: Session, job_request_dto: JobRequestDTO) -> Job:
        job_entity = Job(
            jobCode=job_request_dto.jobCode,
            jobName=job_request_dto.jobName
        )
        return self.repository.create(db, job_entity)

    def get_jobs(self, db: Session) -> List[Job]:
        return self.repository.get_all(db)

    def get_job_by_id(self, db: Session, job_id: str) -> Job:
        return self.repository.get_by_id(db, job_id)

    def update_job(self, db: Session, job_request_dto: JobRequestDTO) -> Job:
        job = self.repository.get_by_id(db, job_request_dto.id)
        if job:
            job.jobCode = job_request_dto.jobCode
            job.jobName = job_request_dto.jobName
            return self.repository.update(db, job)
        return None

    def delete_job(self, db: Session, job_id: str) -> Job:
        return self.repository.delete(db, job_id)

    def get_by_job_code(self, db: Session, job_code: str) -> Job:
        return self.repository.get_by_job_code(db, job_code)

    def count_job(self, db: Session) -> int:
        return self.repository.count_job(db)

    def get_all_jobs(self, db: Session, skip: int = 0, limit: int = 10) -> List[Job]:
        return self.repository.get_all_jobs(db, skip, limit)
