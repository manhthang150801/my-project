from typing import List
from sqlalchemy.orm import Session
from app.dto.jobrecommenddto import JobRecommendRequestDTO
from app.model.jobrecommend import JobRecommend
from app.repository.jobrecommendrepository import JobRecommendRepository
from app.service.jobrecommendservice import JobRecommendService


class JobRecommendServiceImpl(JobRecommendService):

    def __init__(self):
        self.repository = JobRecommendRepository()

    def create_job_recommend(self, db: Session, job_recommend_request_dto: JobRecommendRequestDTO) -> JobRecommend:
        job_recommend_entity = JobRecommend(
            jobrecommendCode=job_recommend_request_dto.jobrecommendCode,
            jobrecommendValue=job_recommend_request_dto.jobrecommendValue,
            survey_id=job_recommend_request_dto.survey_id
        )
        return self.repository.create(db, job_recommend_entity)

    def get_job_recommends(self, db: Session) -> List[JobRecommend]:
        return self.repository.get_all(db)

    def get_job_recommend_by_id(self, db: Session, job_recommend_id: str) -> JobRecommend:
        return self.repository.get_by_id(db, job_recommend_id)

    def update_job_recommend(self, db: Session, job_recommend_request_dto: JobRecommendRequestDTO) -> JobRecommend:
        job_recommend = self.repository.get_by_id(db, job_recommend_request_dto.id)
        if job_recommend:
            job_recommend.jobrecommendCode = job_recommend_request_dto.jobrecommendCode
            job_recommend.jobrecommendValue = job_recommend_request_dto.jobrecommendValue
            job_recommend.survey_id=job_recommend_request_dto.survey_id
            return self.repository.update(db, job_recommend)
        return None

    def delete_job_recommend(self, db: Session, job_recommend_id: str) -> JobRecommend:
        return self.repository.delete(db, job_recommend_id)

    def count_job_recommend(self, db: Session) -> int:
        return self.repository.count_job_recommend(db)