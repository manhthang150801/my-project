from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class TopicRequestDTO(BaseModel):
    id: Optional[str] = None
    topicName: str

class TopicResponseDTO(BaseModel):
    id: UUID
    topicName: str

    class Config:
        from_attributes = True