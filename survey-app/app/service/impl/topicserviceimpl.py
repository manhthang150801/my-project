from typing import List

from sqlalchemy.orm import Session

from app.dto.topicdto import TopicRequestDTO
from app.model.topic import Topic
from app.repository.topicrepository import TopicRepository
from app.service.topicservice import TopicService


class TopicServiceImpl(TopicService):

    def __init__(self):
        self.repository = TopicRepository()

    def create_topic(self, db: Session, topic_request_dto: TopicRequestDTO) -> Topic:
        topic_entity = Topic(topicName=topic_request_dto.topicName)
        return self.repository.create(db, topic_entity)

    def get_topics(self, db: Session) -> List[Topic]:
        return self.repository.get_all(db)

    def get_topic_by_id(self, db: Session, topic_id: str) -> Topic:
        return self.repository.get_by_id(db, topic_id)

    def update_topic(self, db: Session, topic_request_dto: TopicRequestDTO) -> Topic:
        topic = self.repository.get_by_id(db, topic_request_dto.id)
        if topic:
            topic.topicName = topic_request_dto.topicName
            return self.repository.update(db, topic)
        return None

    def delete_topic(self, db: Session, topic_id: str) -> Topic:
        return self.repository.delete(db, topic_id)