from sqlalchemy.orm import Session
from app.model.income import Income

class IncomeRepository:

    def create(self, db: Session, income: Income):
        db.add(income)
        db.commit()
        db.refresh(income)
        return income

    def get_all(self, db: Session):
        return db.query(Income).all()

    def get_by_id(self, db: Session, income_id: str):
        return db.query(Income).filter(Income.id == income_id).first()

    def update(self, db: Session, income: Income):
        db.add(income)
        db.commit()
        db.refresh(income)
        return income

    def delete(self, db: Session, income_id: str):
        income = db.query(Income).filter(Income.id == income_id).first()
        db.delete(income)
        db.commit()
        return income
