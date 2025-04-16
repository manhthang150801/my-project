from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.answerdto import AnswerResponseDTO, AnswerRequestDTO
from app.service.impl.answerserviceimpl import AnswerServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
answer_service = AnswerServiceImpl()

@router.post("/answers", response_model=dict)
def create_answer(answer_request_dto: AnswerRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        answer_service.create_answer(db, answer_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/answers", response_model=List[AnswerResponseDTO])
def read_answers(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return answer_service.get_answers(db)

@router.get("/guest/answers", response_model=List[AnswerResponseDTO])
def get_answers(db: Session = Depends(get_db)):
    return answer_service.get_answers(db)

@router.get("/answers/{answer_id}", response_model=AnswerResponseDTO)
def read_answer_by_id(answer_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    answer = answer_service.get_answer_by_id(db, answer_id)
    if answer is None:
        raise HTTPException(status_code=404, detail="not_found")
    return answer

@router.put("/answers", response_model=dict)
def update_answer(answer_request_dto: AnswerRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        answer_service.update_answer(db, answer_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/answers/{answer_id}")
def delete_answer(answer_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        answer_service.delete_answer(db, answer_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}