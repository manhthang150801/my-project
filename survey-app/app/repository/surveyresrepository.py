from sqlalchemy.orm import Session, joinedload
from app.model.question import Question
from app.model.survey import Survey
from app.model.surveyres import SurveyRes
from app.model.topic import Topic

from sqlalchemy import cast, Integer


class SurveyResRepository:

    def create(self, db: Session, survey_res: SurveyRes):
        db.add(survey_res)
        db.commit()
        db.refresh(survey_res)
        return survey_res

    def get_all(self, db: Session):
        return db.query(SurveyRes).all()

    def get_by_id(self, db: Session, survey_res_id: str):
        return db.query(SurveyRes).filter(SurveyRes.id == survey_res_id).first()

    def update(self, db: Session, survey_res: SurveyRes):
        db.add(survey_res)
        db.commit()
        db.refresh(survey_res)
        return survey_res

    def delete(self, db: Session, survey_res_id: str):
        survey_res= db.query(SurveyRes).filter(SurveyRes.id == survey_res_id).first()
        if survey_res:
            db.delete(survey_res)
            db.commit()
        return survey_res