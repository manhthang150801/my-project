from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class InterestRequestDTO(BaseModel):
    id: Optional[str] = None
    netSocCode: str
    title: str
    elementId: str
    elementName: str
    scaleId: str
    scaleName: str
    dataValue: str

class InterestResponseDTO(BaseModel):
    id: UUID
    netSocCode: str
    title: str
    elementId: str
    elementName: str
    scaleId: str
    scaleName: str
    dataValue: str

    class Config:
        from_attributes = True