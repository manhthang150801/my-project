import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database.base import Base

class SurveyRes(Base):
    __tablename__ = "surveyres"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    survey_id = Column(UUID(as_uuid=True), ForeignKey("surveys.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_answer = Column(String, nullable=False)

    survey = relationship("Survey", back_populates="surveyres")
    question = relationship("Question")