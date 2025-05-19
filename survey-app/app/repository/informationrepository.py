from sqlalchemy.orm import Session, joinedload
from app.model.information import Information
from app.model.survey import Survey


class InformationRepository:

    def create(self, db: Session, information: Information):
        db.add(information)
        db.commit()
        db.refresh(information)
        return information

    def get_all(self, db: Session):
        return db.query(Information).all()

    def get_by_id(self, db: Session, information_id: str):
        return db.query(Information).filter(Information.id == information_id).first()

    def update(self, db: Session, information: Information):
        db.add(information)
        db.commit()
        db.refresh(information)
        return information

    def delete(self, db: Session, information_id: str):
        information = db.query(Information).filter(Information.id == information_id).first()
        if information:
            db.delete(information)
            db.commit()
        return information

    def get_data_information(self, db: Session, skip: int = 0, limit: int = 10):
        return (
            db.query(Information)
            .options(
                joinedload(Information.surveys).joinedload(Survey.surveyres),
                joinedload(Information.surveys).joinedload(Survey.job_recommends)
            )
            .offset(skip).limit(limit)
            .all()
        )

    def get_data_information_file(self, db: Session):
        return (
            db.query(Information)
            .options(
                joinedload(Information.surveys).joinedload(Survey.surveyres),
                joinedload(Information.surveys).joinedload(Survey.job_recommends)
            ).all()
        )

    def count_information(self, db: Session) -> int:
        return db.query(Information).count()

