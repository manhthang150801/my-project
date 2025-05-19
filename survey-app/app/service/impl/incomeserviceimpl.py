from typing import List

from sqlalchemy.orm import Session

from app.dto.incomedto import IncomeRequestDTO
from app.model.income import Income
from app.repository.incomerepository import IncomeRepository
from app.service.incomeservice import IncomeService

class IncomeServiceImpl(IncomeService):

    def __init__(self):
        self.repository = IncomeRepository()

    def create_income(self, db: Session, income_request_dto: IncomeRequestDTO) -> Income:
        income_entity = Income(
            incomeCode=income_request_dto.incomeCode,
            incomeName=income_request_dto.incomeName
        )
        return self.repository.create(db, income_entity)

    def get_incomes(self, db: Session) -> List[Income]:
        return self.repository.get_all(db)

    def get_income_by_id(self, db: Session, income_id: str) -> Income:
        return self.repository.get_by_id(db, income_id)

    def update_income(self, db: Session, income_request_dto: IncomeRequestDTO) -> Income:
        income = self.repository.get_by_id(db, income_request_dto.id)
        if income:
            income.incomeCode = income_request_dto.incomeCode
            income.incomeName = income_request_dto.incomeName
            return self.repository.update(db, income)
        return None

    def delete_income(self, db: Session, income_id: str) -> Income:
        return self.repository.delete(db, income_id)
