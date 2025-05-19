from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database.base import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    question = Column(String, nullable=False)
    type = Column(String, nullable=False)

    topicId = Column(UUID(as_uuid=True), ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    topic = relationship("Topic", back_populates="questions")
