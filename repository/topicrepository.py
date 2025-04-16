from sqlalchemy.orm import Session

from app.model.topic import Topic

class TopicRepository:

    def create(self, db: Session, topic: Topic):
        db.add(topic)
        db.commit()
        db.refresh(topic)
        return topic

    def get_all(self, db: Session):
        return db.query(Topic).all()

    def get_by_id(self, db: Session, topic_id: str):
        return db.query(Topic).filter(Topic.id == topic_id).first()

    def update(self, db: Session, topic: Topic):
        db.add(topic)
        db.commit()
        db.refresh(topic)
        return topic

    def delete(self, db: Session, topic_id: str):
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        db.delete(topic)
        db.commit()
        return topic