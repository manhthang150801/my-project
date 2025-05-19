from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from app.dto.questiondto import QuestionRequestDTO, QuestionResponseDTO
from app.model.question import Question
from app.repository.questionrepository import QuestionRepository
from app.service.questionservice import QuestionService

class QuestionServiceImpl(QuestionService):

    def __init__(self):
        self.repository = QuestionRepository()

    def create_question(self, db: Session, question_request_dto: QuestionRequestDTO) -> Question:
        question_entity = Question(
            question=question_request_dto.question,
            type=question_request_dto.type,
            topicId=question_request_dto.topicId
        )
        return self.repository.create(db, question_entity)

    def get_questions(self, db: Session) -> List[QuestionResponseDTO]:
        questions = self.repository.get_all(db)
        return [
            QuestionResponseDTO(
                id=question.id,
                question=question.question,
                type=question.type,
                topicId=question.topicId,
                topicName=question.topic.topicName if question.topic else None
            )
            for question in questions
        ]

    def get_all_page(self, db: Session, skip: int = 0, limit: int = 10) -> List[QuestionResponseDTO]:
        questions = self.repository.get_all_page(db, skip, limit)
        return [
            QuestionResponseDTO(
                id=question.id,
                question=question.question,
                type=question.type,
                topicId=question.topicId,
                topicName=question.topic.topicName if question.topic else None
            )
            for question in questions
        ]

    def get_question_by_id(self, db: Session, question_id: str) -> QuestionResponseDTO:
        question = self.repository.get_by_id(db, question_id)
        if question:
            return QuestionResponseDTO(
                id=question.id,
                question=question.question,
                type=question.type,
                topicId=question.topicId,
                topicName=question.topic.topicName if question.topic else None
            )
        return None

    def get_questions_by_topic(self, db: Session, topic_id: str) -> List[QuestionResponseDTO]:
        questions = self.repository.get_by_topic_id(db, topic_id)
        return [
            QuestionResponseDTO(
                id=question.id,
                question=question.question,
                type=question.type,
                topicId=question.topicId,
                topicName=question.topic.topicName if question.topic else None
            )
            for question in questions
        ]

    def update_question(self, db: Session, question_request_dto: QuestionRequestDTO) -> Question:
        question = self.repository.get_by_id(db, question_request_dto.id)
        if question:
            question.question = question_request_dto.question
            question.type = question_request_dto.type
            question.topicId = question_request_dto.topicId
            return self.repository.update(db, question)
        return None

    def delete_question(self, db: Session, question_id: str) -> Question:
        return self.repository.delete(db, question_id)

    def count_questions(self, db: Session) -> int:
        return self.repository.count_questions(db)