from typing import List
from sqlalchemy.orm import Session
from app.dto.interestdto import InterestRequestDTO
from app.model.interest import Interest

class IInterestService:

    def create_interest(self, db: Session, interest_request_dto: InterestRequestDTO) -> Interest:
        pass

    def get_interests(self, db: Session, skip: int = 0, limit: int = 10) -> List[Interest]:
        pass

    def get_interest_by_id(self, db: Session, interest_id: str) -> Interest:
        pass

    def update_interest(self, db: Session, interest_request_dto: InterestRequestDTO) -> Interest:
        pass

    def delete_interest(self, db: Session, interest_id: str) -> Interest:
        pass

    def count_interests(self, db: Session) -> int:
        pass

    def get_by_net_soc_code(self, db: Session, net_soc_code: str) -> List[Interest]:
        pass

    def get_all_interest(self, db: Session) -> List[Interest]:
        pass