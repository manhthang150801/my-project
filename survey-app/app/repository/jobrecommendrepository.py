from sqlalchemy.orm import Session
from app.model.jobrecommend import JobRecommend

class JobRecommendRepository:

    def create(self, db: Session, job_recommend: JobRecommend):
        db.add(job_recommend)
        db.commit()
        db.refresh(job_recommend)
        return job_recommend

    def get_all(self, db: Session):
        return db.query(JobRecommend).all()

    def get_by_id(self, db: Session, job_recommend_id: str):
        return db.query(JobRecommend).filter(JobRecommend.id == job_recommend_id).first()

    def update(self, db: Session, job_recommend: JobRecommend):
        db.add(job_recommend)
        db.commit()
        db.refresh(job_recommend)
        return job_recommend

    def delete(self, db: Session, job_recommend_id: str):
        job_recommend = db.query(JobRecommend).filter(JobRecommend.id == job_recommend_id).first()
        if job_recommend:
            db.delete(job_recommend)
            db.commit()
        return job_recommend

    def count_job_recommend(self, db: Session) -> int:
        return db.query(JobRecommend).count()
