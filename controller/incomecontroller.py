from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.incomedto import IncomeResponseDTO, IncomeRequestDTO
from app.service.impl.incomeserviceimpl import IncomeServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
income_service = IncomeServiceImpl()

@router.post("/incomes", response_model=dict)
def create_income(income_request_dto: IncomeRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        income_service.create_income(db, income_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/incomes", response_model=List[IncomeResponseDTO])
def read_incomes(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return income_service.get_incomes(db)

@router.get("/guest/incomes", response_model=List[IncomeResponseDTO])
def get_incomes(db: Session = Depends(get_db)):
    return income_service.get_incomes(db)

@router.get("/incomes/{income_id}", response_model=IncomeResponseDTO)
def read_income_by_id(income_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    income = income_service.get_income_by_id(db, income_id)
    if income is None:
        raise HTTPException(status_code=404, detail="not_found")
    return income

@router.put("/incomes", response_model=dict)
def update_income(income_request_dto: IncomeRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        income_service.update_income(db, income_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/incomes/{income_id}")
def delete_income(income_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        income_service.delete_income(db, income_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}
