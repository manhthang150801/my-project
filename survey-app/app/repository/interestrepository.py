from typing import List

from sqlalchemy.orm import Session
from app.model.interest import Interest

class InterestRepository:

    def create(self, db: Session, interest: Interest):
        db.add(interest)
        db.commit()
        db.refresh(interest)
        return interest

    def get_all(self, db: Session, skip: int = 0, limit: int = 10) -> List[Interest]:
        return db.query(Interest).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, interest_id: str):
        return db.query(Interest).filter(Interest.id == interest_id).first()

    def update(self, db: Session, interest: Interest):
        db.add(interest)
        db.commit()
        db.refresh(interest)
        return interest

    def delete(self, db: Session, interest_id: str):
        interest = db.query(Interest).filter(Interest.id == interest_id).first()
        db.delete(interest)
        db.commit()
        return interest

    def count_interests(self, db: Session) -> int:
        return db.query(Interest).count()

    def get_by_net_soc_code(self, db: Session, net_soc_code: str):
        return db.query(Interest).filter(
        Interest.netSocCode == net_soc_code,
        ~Interest.elementName.in_([
            "First Interest High-Point",
            "Second Interest High-Point",
            "Third Interest High-Point"
        ])
    ).all()

    def get_all_interest(self, db: Session) -> List[Interest]:
        return db.query(Interest).all()
