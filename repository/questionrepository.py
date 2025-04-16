from sqlalchemy.orm import Session, joinedload
from app.model.question import Question
from app.model.topic import Topic


class QuestionRepository:

    def create(self, db: Session, question: Question):
        db.add(question)
        db.commit()
        db.refresh(question)
        return question

    def get_all(self, db: Session):
        questions = db.query(Question).options(joinedload(Question.topic)).all()
        return questions

    def get_by_id(self, db: Session, question_id: str):
        return db.query(Question).filter(Question.id == question_id).first()

    def get_by_topic_id(self, db: Session, topic_id: str):
        questions = db.query(Question).options(joinedload(Question.topic)) \
            .filter(Question.topicId == topic_id) \
            .all()
        return questions

    def update(self, db: Session, question: Question):
        db.add(question)
        db.commit()
        db.refresh(question)
        return question

    def delete(self, db: Session, question_id: str):
        question = db.query(Question).filter(Question.id == question_id).first()
        if question:
            db.delete(question)
            db.commit()
        return question