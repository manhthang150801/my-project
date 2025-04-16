from typing import List

from sqlalchemy.orm import Session

from app.dto.questiondto import QuestionRequestDTO, QuestionResponseDTO
from app.model.question import Question

class QuestionService:
    def create_question(self, db: Session, question_request_dto: QuestionRequestDTO) -> Question:
        pass

    def get_questions(self, db: Session) -> List[QuestionResponseDTO]:
        pass

    def get_question_by_id(self, db: Session, question_id: str) -> QuestionResponseDTO:
        pass

    def get_questions_by_topic(self, db: Session, topic_id: str) -> List[QuestionResponseDTO]:
        pass

    def update_question(self, db: Session, question_request_dto: QuestionRequestDTO) -> Question:
        pass

    def delete_question(self, db: Session, question_id: str) -> Question:
        pass
