from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class IncomeRequestDTO(BaseModel):
    id: Optional[str] = None
    incomeCode: str
    incomeName: str

class IncomeResponseDTO(BaseModel):
    id: UUID
    incomeCode: str
    incomeName: str

    class Config:
        from_attributes = True
