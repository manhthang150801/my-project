from typing import List

from sqlalchemy.orm import Session

from app.dto.answerdto import AnswerRequestDTO
from app.model.answer import Answer
from app.repository.answerrepository import AnswerRepository
from app.service.answerservice import AnswerService

class AnswerServiceImpl(AnswerService):

    def __init__(self):
        self.repository = AnswerRepository()

    def create_answer(self, db: Session, answer_request_dto: AnswerRequestDTO) -> Answer:
        answer_entity = Answer(
            answerName=answer_request_dto.answerName,
            answerValue=answer_request_dto.answerValue
        )
        return self.repository.create(db, answer_entity)

    def get_answers(self, db: Session) -> List[Answer]:
        return self.repository.get_all(db)

    def get_answer_by_id(self, db: Session, answer_id: str) -> Answer:
        return self.repository.get_by_id(db, answer_id)

    def update_answer(self, db: Session, answer_request_dto: AnswerRequestDTO) -> Answer:
        answer = self.repository.get_by_id(db, answer_request_dto.id)
        if answer:
            answer.answerName = answer_request_dto.answerName
            answer.answerValue = answer_request_dto.answerValue
            return self.repository.update(db, answer)
        return None

    def delete_answer(self, db: Session, answer_id: str) -> Answer:
        return self.repository.delete(db, answer_id)