from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class JobRequestDTO(BaseModel):
    id: Optional[str] = None
    jobCode: str
    jobName: str

class JobResponseDTO(BaseModel):
    id: UUID
    jobCode: str
    jobName: str

    class Config:
        from_attributes = True
