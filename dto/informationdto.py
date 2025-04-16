from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class InformationRequestDTO(BaseModel):
    id: Optional[str] = None
    gender: str
    age: str
    education: str
    income: str
    employed: str
    profession: str
    vernacular: str

class InformationResponseDTO(BaseModel):
    id: UUID
    gender: str
    age: str
    education: str
    income: str
    employed: str
    profession: str
    vernacular: str

    class Config:
        from_attributes = True
