from typing import List
from sqlalchemy.orm import Session
from app.dto.educationdto import EducationRequestDTO
from app.model.education import Education

class EducationService:

    def create_education(self, db: Session, education_request_dto: EducationRequestDTO) -> Education:
        pass

    def get_educations(self, db: Session) -> List[Education]:
        pass

    def get_education_by_id(self, db: Session, education_id: str) -> Education:
        pass

    def update_education(self, db: Session, education_request_dto: EducationRequestDTO) -> Education:
        pass

    def delete_education(self, db: Session, education_id: str) -> Education:
        pass