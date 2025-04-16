from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.roledto import RoleResponseDTO, RoleRequestDTO
from app.service.impl.roleserviceimpl import RoleServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
role_service = RoleServiceImpl()

@router.post("/roles", response_model=dict)
def create_role(role_request_dto: RoleRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        role_service.create_role(db, role_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/roles", response_model=List[RoleResponseDTO])
def read_roles(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return role_service.get_roles(db)

@router.get("/roles/{role_id}", response_model=RoleResponseDTO)
def read_role_by_id(role_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    role = role_service.get_role_by_id(db, role_id)
    if role is None:
        raise HTTPException(status_code=404, detail="not_found")
    return role

@router.put("/roles", response_model=dict)
def update_role(role_request_dto: RoleRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        role_service.update_role(db, role_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/roles/{role_id}")
def delete_role(role_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        role_service.delete_role(db, role_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}
