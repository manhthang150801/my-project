from typing import List
from sqlalchemy.orm import Session
from app.dto.incomedto import IncomeRequestDTO
from app.model.income import Income

class IncomeService:

    def create_income(self, db: Session, income_request_dto: IncomeRequestDTO) -> Income:
        pass

    def get_incomes(self, db: Session) -> List[Income]:
        pass

    def get_income_by_id(self, db: Session, income_id: str) -> Income:
        pass

    def update_income(self, db: Session, income_request_dto: IncomeRequestDTO) -> Income:
        pass

    def delete_income(self, db: Session, income_id: str) -> Income:
        pass
