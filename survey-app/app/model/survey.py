import uuid
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.base import Base

class Survey(Base):
    __tablename__ = "surveys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    information_id = Column(UUID(as_uuid=True), ForeignKey("informations.id", ondelete="CASCADE"), nullable=False)

    information = relationship("Information", back_populates="surveys")
    surveyres = relationship("SurveyRes", back_populates="survey", cascade="all, delete")
    job_recommends = relationship("JobRecommend", back_populates="survey", cascade="all, delete")