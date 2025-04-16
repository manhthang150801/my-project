from typing import List

from sqlalchemy.orm import Session

from app.dto.educationdto import EducationRequestDTO
from app.model.education import Education
from app.repository.educationrepository import EducationRepository
from app.service.educationservice import EducationService

class EducationServiceImpl(EducationService):

    def __init__(self):
        self.repository = EducationRepository()

    def create_education(self, db: Session, education_request_dto: EducationRequestDTO) -> Education:
        education_entity = Education(
            educationCode=education_request_dto.educationCode,
            educationName=education_request_dto.educationName
        )
        return self.repository.create(db, education_entity)

    def get_educations(self, db: Session) -> List[Education]:
        return self.repository.get_all(db)

    def get_education_by_id(self, db: Session, education_id: str) -> Education:
        return self.repository.get_by_id(db, education_id)

    def update_education(self, db: Session, education_request_dto: EducationRequestDTO) -> Education:
        education = self.repository.get_by_id(db, education_request_dto.id)
        if education:
            education.educationCode = education_request_dto.educationCode
            education.educationName = education_request_dto.educationName
            return self.repository.update(db, education)
        return None

    def delete_education(self, db: Session, education_id: str) -> Education:
        return self.repository.delete(db, education_id)
