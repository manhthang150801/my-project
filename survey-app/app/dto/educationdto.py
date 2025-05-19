from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class EducationRequestDTO(BaseModel):
    id: Optional[str] = None
    educationCode: str
    educationName: str

class EducationResponseDTO(BaseModel):
    id: UUID
    educationCode: str
    educationName: str

    class Config:
        from_attributes = True
