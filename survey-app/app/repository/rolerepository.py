from sqlalchemy.orm import Session

from app.model.role import Role

class RoleRepository:

    def create(self, db: Session, role: Role):
        db.add(role)
        db.commit()
        db.refresh(role)
        return role

    def get_all(self, db: Session):
        return db.query(Role).all()

    def get_by_id(self, db: Session, role_id: str):
        return db.query(Role).filter(Role.id == role_id).first()

    def update(self, db: Session, role: Role):
        db.add(role)
        db.commit()
        db.refresh(role)
        return role

    def delete(self, db: Session, role_id: str):
        role = db.query(Role).filter(Role.id == role_id).first()
        if role:
            db.delete(role)
            db.commit()
        return role
