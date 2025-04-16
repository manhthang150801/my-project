from typing import List
from sqlalchemy.orm import Session
from app.dto.jobrecommenddto import JobRecommendRequestDTO
from app.model.jobrecommend import JobRecommend

class JobRecommendService:

    def create_job_recommend(self, db: Session, job_recommend_request_dto: JobRecommendRequestDTO) -> JobRecommend:
        pass

    def get_job_recommends(self, db: Session) -> List[JobRecommend]:
        pass

    def get_job_recommend_by_id(self, db: Session, job_recommend_id: str) -> JobRecommend:
        pass

    def update_job_recommend(self, db: Session, job_recommend_request_dto: JobRecommendRequestDTO) -> JobRecommend:
        pass

    def delete_job_recommend(self, db: Session, job_recommend_id: str) -> JobRecommend:
        pass

    def count_job_recommend(self, db: Session) -> int:
        pass
