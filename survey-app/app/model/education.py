import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class Education(Base):
    __tablename__ = "education"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    educationCode = Column(String, nullable=False, unique=True)
    educationName = Column(String, nullable=False)