from typing import Optional
from uuid import UUID

from pydantic import BaseModel

class RoleRequestDTO(BaseModel):
    id: Optional[str] = None
    name: str

class RoleResponseDTO(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True
