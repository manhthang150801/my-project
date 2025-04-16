import uuid
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base
from sqlalchemy.orm import relationship

class Information(Base):
    __tablename__ = "informations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    gender = Column(String, nullable=False)
    age = Column(String, nullable=False)
    education = Column(String, nullable=False)
    income = Column(String, nullable=False)
    employed = Column(String, nullable=False)
    profession = Column(String, nullable=False)
    vernacular = Column(String, nullable=False)

    surveys = relationship("Survey", back_populates="information", cascade="all, delete")