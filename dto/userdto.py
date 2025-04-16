from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

from app.dto.roledto import RoleResponseDTO


class UserRequestDTO(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    password: str
    roles: List[str] = None

class UserResponseDTO(BaseModel):
    id: UUID
    username: str
    email: str
    roles: List[RoleResponseDTO]

class LoginRequestDTO(BaseModel):
    username: str
    password: str

class AccountUpdateRequestDTO(BaseModel):
    id: str
    username: str
    email: str
    password: Optional[str] = None
    roles: List[str]

    class Config:
        from_attributes = True
