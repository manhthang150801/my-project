from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.userdto import UserRequestDTO, UserResponseDTO, AccountUpdateRequestDTO
from app.service.impl.userserviceimpl import UserServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
user_service = UserServiceImpl()

@router.post("/users", response_model=dict)
def create_user(user_request_dto: UserRequestDTO, db: Session = Depends(get_db)):
    try:
        user = user_service.get_by_username(db, user_request_dto.username)

        if user:
            return {"message": "user_existed"}

        email = user_service.get_by_email(db, user_request_dto.email)

        if email:
            return {"message": "email_existed"}

        user_service.create_user(db, user_request_dto)

        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/users")
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    user = user_service.get_users(db, skip=skip, limit=limit)
    total_count = user_service.count_users(db)
    return {
        'content': user,
        'totalCount': total_count,
    }

@router.get("/users/{userid}", response_model=UserResponseDTO)
def read_user_by_id(userid: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    user = user_service.get_user_by_id(db, userid)
    if user is None:
        raise HTTPException(status_code=404, detail="not_found")
    return user

@router.put("/users", response_model=dict)
def update_user(account_update_request_dto: AccountUpdateRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        account = user_service.get_account(db, account_update_request_dto.id)

        if account.username != account_update_request_dto.username and account_update_request_dto.username is not None:
            user = user_service.get_by_username(db, account_update_request_dto.username)
            if user:
                return {"message": "user_existed"}

        if account.email != account_update_request_dto.email and account_update_request_dto.email is not None:
            email = user_service.get_by_email(db, account_update_request_dto.email)
            if email:
                return {"message": "email_existed"}

        updated_user = user_service.update_user(db, account_update_request_dto)
        if updated_user:
            return {"message": "updated"}
        else:
            return {"message": "error"}
    except Exception:
        return {"message": "error"}

@router.delete("/users/{userid}")
def delete_user(userid: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        deleted_user = user_service.delete_user(db, userid)
        if deleted_user:
            return {"message": "deleted"}
        else:
            return {"message": "error"}
    except Exception:
        return {"message": "error"}
