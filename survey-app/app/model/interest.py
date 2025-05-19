import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class Interest(Base):
    __tablename__ = 'interests'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    netSocCode = Column(String, nullable=False)
    title = Column(String, nullable=False)
    elementId = Column(String, nullable=False)
    elementName = Column(String, nullable=False)
    scaleId = Column(String, nullable=False)
    scaleName = Column(String, nullable=False)
    dataValue = Column(String, nullable=False)