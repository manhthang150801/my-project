from sqlalchemy.orm import Session, joinedload
from app.model.user import User  # Import model User

class UserRepository:

    def create(self, db: Session, user: User):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_all(self, db: Session, skip: int = 0, limit: int = 10):
        return db.query(User).offset(skip).limit(limit).all()

    def get_by_id(self, db: Session, user_id: str):
        return db.query(User).options(joinedload(User.roles)).filter(User.id == user_id).first()

    def get_by_username(self, db: Session, username: str):
        return db.query(User).filter(User.username == username).first()

    def get_by_email(self, db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    def update(self, db: Session, user: User):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def delete(self, db: Session, user_id: str):
        user = db.query(User).filter(User.id == user_id).first()
        db.delete(user)
        db.commit()
        return user

    def count_users(self, db: Session) -> int:
        return db.query(User).count()

    def get_account(self, db: Session, user_id: str):
        return db.query(User).filter(User.id == user_id).first()
