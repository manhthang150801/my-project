from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.interestdto import InterestResponseDTO, InterestRequestDTO
from app.service.impl.interestserviceimpl import InterestServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
interest_service = InterestServiceImpl()

@router.post("/interests", response_model=dict)
def create_interest(interest_request_dto: InterestRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        interest_service.create_interest(db, interest_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/interests")
def read_interests(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    interests = interest_service.get_interests(db, skip=skip, limit=limit)
    total_count = interest_service.count_interests(db)
    return {
        'content': interests,
        'totalCount': total_count,
    }

@router.get("/interests/{interest_id}", response_model=InterestResponseDTO)
def read_interest_by_id(interest_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    interest = interest_service.get_interest_by_id(db, interest_id)
    if interest is None:
        raise HTTPException(status_code=404, detail="not_found")
    return interest

@router.put("/interests", response_model=dict)
def update_interest(interest_request_dto: InterestRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        interest_service.update_interest(db, interest_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/interests/{interest_id}")
def delete_interest(interest_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        interest_service.delete_interest(db, interest_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}