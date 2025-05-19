import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.base import Base


class JobRecommend(Base):
    __tablename__ = "job_recommend"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    jobrecommendCode = Column(String, nullable=False)
    jobrecommendValue = Column(String, nullable=False)

    survey_id = Column(UUID(as_uuid=True), ForeignKey("surveys.id", ondelete="CASCADE"), nullable=False)
    survey = relationship("Survey", back_populates="job_recommends")
