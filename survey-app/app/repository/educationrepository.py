from sqlalchemy.orm import Session
from app.model.education import Education

class EducationRepository:

    def create(self, db: Session, education: Education):
        db.add(education)
        db.commit()
        db.refresh(education)
        return education

    def get_all(self, db: Session):
        return db.query(Education).all()

    def get_by_id(self, db: Session, education_id: str):
        return db.query(Education).filter(Education.id == education_id).first()

    def update(self, db: Session, education: Education):
        db.add(education)
        db.commit()
        db.refresh(education)
        return education

    def delete(self, db: Session, education_id: str):
        education = db.query(Education).filter(Education.id == education_id).first()
        db.delete(education)
        db.commit()
        return education
