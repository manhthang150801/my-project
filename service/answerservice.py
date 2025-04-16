from typing import List
from sqlalchemy.orm import Session
from app.dto.answerdto import AnswerRequestDTO
from app.model.answer import Answer

class AnswerService:

    def create_answer(self, db: Session, answer_request_dto: AnswerRequestDTO) -> Answer:
        pass

    def get_answers(self, db: Session) -> List[Answer]:
        pass

    def get_answer_by_id(self, db: Session, answer_id: str) -> Answer:
        pass

    def update_answer(self, db: Session, answer_request_dto: AnswerRequestDTO) -> Answer:
        pass

    def delete_answer(self, db: Session, answer_id: str) -> Answer:
        pass