from typing import List

from sqlalchemy.orm import Session

from app.dto.interestdto import InterestRequestDTO
from app.model.interest import Interest
from app.repository.interestrepository import InterestRepository
from app.service.interestservice import IInterestService

class InterestServiceImpl(IInterestService):

    def __init__(self):
        self.repository = InterestRepository()

    def create_interest(self, db: Session, interest_request_dto: InterestRequestDTO) -> Interest:
        interest_entity = Interest(
            netSocCode=interest_request_dto.netSocCode,
            title=interest_request_dto.title,
            elementId=interest_request_dto.elementId,
            elementName=interest_request_dto.elementName,
            scaleId=interest_request_dto.scaleId,
            scaleName=interest_request_dto.scaleName,
            dataValue=interest_request_dto.dataValue
        )
        return self.repository.create(db, interest_entity)

    def get_interests(self, db: Session, skip: int = 0, limit: int = 10) -> List[Interest]:
        return self.repository.get_all(db, skip, limit)

    def get_interest_by_id(self, db: Session, interest_id: str) -> Interest:
        return self.repository.get_by_id(db, interest_id)

    def update_interest(self, db: Session, interest_request_dto: InterestRequestDTO) -> Interest:
        interest = self.repository.get_by_id(db, interest_request_dto.id)
        if interest:
            interest.netSocCode = interest_request_dto.netSocCode
            interest.title = interest_request_dto.title
            interest.elementId = interest_request_dto.elementId
            interest.elementName = interest_request_dto.elementName
            interest.scaleId = interest_request_dto.scaleId
            interest.scaleName = interest_request_dto.scaleName
            interest.dataValue = interest_request_dto.dataValue
            return self.repository.update(db, interest)
        return None

    def delete_interest(self, db: Session, interest_id: str) -> Interest:
        return self.repository.delete(db, interest_id)

    def count_interests(self, db: Session) -> int:
        return self.repository.count_interests(db)

    def get_by_net_soc_code(self, db: Session, net_soc_code: str) -> List[Interest]:
        return self.repository.get_by_net_soc_code(db, net_soc_code)

    def get_all_interest(self, db: Session) -> List[Interest]:
        return self.repository.get_all_interest(db)