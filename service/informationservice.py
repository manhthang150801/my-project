from typing import List
from sqlalchemy.orm import Session

from app.dto.datatraindto import DataTrainResponseDTO
from app.dto.informationdto import InformationRequestDTO
from app.model.information import Information

class InformationService:

    def create_information(self, db: Session, information_request_dto: InformationRequestDTO) -> Information:
        pass

    def get_informations(self, db: Session) -> List[Information]:
        pass

    def get_information_by_id(self, db: Session, information_id: str) -> Information:
        pass

    def update_information(self, db: Session, information_request_dto: InformationRequestDTO) -> Information:
        pass

    def delete_information(self, db: Session, information_id: str) -> Information:
        pass

    def get_data_information(self, db: Session, skip: int = 0, limit: int = 10) -> List[DataTrainResponseDTO]:
        pass

    def get_data_information_file(self, db: Session) -> List[DataTrainResponseDTO]:
        pass

    def count_information(self, db: Session) -> int:
        pass
