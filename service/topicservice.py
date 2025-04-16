from typing import List

from sqlalchemy.orm import Session

from app.dto.topicdto import TopicRequestDTO
from app.model.topic import Topic

class TopicService:
    def create_topic(self, db: Session, topic_request_dto: TopicRequestDTO) -> Topic:
        pass

    def get_topics(self, db: Session) -> List[Topic]:
        pass

    def get_topic_by_id(self, db: Session, topic_id: str) -> Topic:
        pass

    def update_topic(self, db: Session, topic_request_dto: TopicRequestDTO) -> Topic:
        pass

    def delete_topic(self, db: Session, topic_id: str) -> Topic:
        pass