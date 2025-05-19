from sqlalchemy.orm import Session
from app.model.survey import Survey

class SurveyRepository:

    def create(self, db: Session, survey: Survey):
        db.add(survey)
        db.commit()
        db.refresh(survey)
        return survey

    def get_all(self, db: Session):
        return db.query(Survey).all()

    def get_by_id(self, db: Session, survey_id: str):
        return db.query(Survey).filter(Survey.id == survey_id).first()

    def update(self, db: Session, survey: Survey):
        db.add(survey)
        db.commit()
        db.refresh(survey)
        return survey

    def delete(self, db: Session, survey_id: str):
        survey = db.query(Survey).filter(Survey.id == survey_id).first()
        if survey:
            db.delete(survey)
            db.commit()
        return survey
