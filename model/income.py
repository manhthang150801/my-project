import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class Income(Base):
    __tablename__ = "income"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    incomeCode = Column(String, nullable=False, unique=True)
    incomeName = Column(String, nullable=False)