from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.dto.userdto import LoginRequestDTO
from app.service.impl.userserviceimpl import UserServiceImpl

router = APIRouter()
user_service = UserServiceImpl()

@router.post("/login")
def login(login_dto: LoginRequestDTO, db: Session = Depends(get_db)):
    result = user_service.login_user(db, login_dto)
    if not result:
        raise HTTPException(status_code=401, detail="login_failed")
    return result
