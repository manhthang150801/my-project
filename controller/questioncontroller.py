from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..dto.questiondto import QuestionResponseDTO, QuestionRequestDTO
from ..service.impl.questionserviceimpl import QuestionServiceImpl
from ..utils.authutils.authutils import verify_token

router = APIRouter()
question_service = QuestionServiceImpl()

@router.post("/questions", response_model=dict)
def create_question(question_request_dto: QuestionRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        question_service.create_question(db, question_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/questions", response_model=list[QuestionResponseDTO])
def read_questions(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return question_service.get_questions(db)

@router.get("/guest/questions", response_model=list[QuestionResponseDTO])
def get_questions(db: Session = Depends(get_db)):
    return question_service.get_questions(db)

@router.get("/questions/{question_id}", response_model=QuestionResponseDTO)
def read_question_by_id(question_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    question = question_service.get_question_by_id(db, question_id)
    if question is None:
        raise HTTPException(status_code=404, detail="not_found")
    return question

@router.get("/questions/{topic_id}", response_model=QuestionResponseDTO)
def read_question_by_topic(topic_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    question = question_service.get_questions_by_topic(db, topic_id)
    if question is None:
        raise HTTPException(status_code=404, detail="not_found")
    return question

@router.put("/questions", response_model=dict)
def update_question(question_dto: QuestionRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        question_service.update_question(db, question_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}

@router.delete("/questions/{question_id}")
def delete_question(question_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        question_service.delete_question(db, question_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}