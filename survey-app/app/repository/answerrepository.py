from sqlalchemy.orm import Session
from app.model.answer import Answer

class AnswerRepository:

    def create(self, db: Session, answer: Answer):
        db.add(answer)
        db.commit()
        db.refresh(answer)
        return answer

    def get_all(self, db: Session):
        return db.query(Answer).all()

    def get_by_id(self, db: Session, answer_id: str):
        return db.query(Answer).filter(Answer.id == answer_id).first()

    def update(self, db: Session, answer: Answer):
        db.add(answer)
        db.commit()
        db.refresh(answer)
        return answer

    def delete(self, db: Session, answer_id: str):
        answer = db.query(Answer).filter(Answer.id == answer_id).first()
        db.delete(answer)
        db.commit()
        return answer