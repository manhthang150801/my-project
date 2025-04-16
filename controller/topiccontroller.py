from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dto.topicdto import TopicResponseDTO, TopicRequestDTO
from app.service.impl.topicserviceimpl import TopicServiceImpl
from app.utils.authutils.authutils import verify_token

router = APIRouter()
topic_service = TopicServiceImpl()

@router.post("/topics", response_model=dict)
def create_topic(topic_request_dto: TopicRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        topic_service.create_topic(db, topic_request_dto)
        return {"message": "saved"}
    except Exception:
        return {"message": "error"}

@router.get("/topics", response_model=List[TopicResponseDTO])
def read_topics(db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    return topic_service.get_topics(db)

@router.get("/topics/{topic_id}", response_model=TopicResponseDTO)
def read_topic_by_id(topic_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    topic = topic_service.get_topic_by_id(db, topic_id)
    if topic is None:
        raise HTTPException(status_code=404, detail="not_found")
    return topic

@router.put("/topics", response_model=dict)
def update_topic(topic_request_dto: TopicRequestDTO, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        topic_service.update_topic(db, topic_request_dto)
        return {"message": "updated"}
    except Exception:
        return {"message": "error"}


@router.delete("/topics/{topic_id}")
def delete_topic(topic_id: str, db: Session = Depends(get_db), user_id: UUID = Depends(verify_token)):
    try:
        topic_service.delete_topic(db, topic_id)
        return {"message": "deleted"}
    except Exception:
        return {"message": "error"}