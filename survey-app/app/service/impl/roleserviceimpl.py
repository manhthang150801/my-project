from typing import List

from sqlalchemy.orm import Session

from app.dto.roledto import RoleRequestDTO
from app.model.role import Role
from app.repository.rolerepository import RoleRepository
from app.service.roleservice import RoleService

class RoleServiceImpl(RoleService):

    def __init__(self):
        self.repository = RoleRepository()

    def initialize_roles(self, db: Session):
        existing_roles = self.repository.get_all(db)
        if not existing_roles:
            roles = [Role(name="ADMIN"), Role(name="USER")]
            for role in roles:
                self.repository.create(db, role)

    def create_role(self, db: Session, role_request_dto: RoleRequestDTO) -> Role:
        role_entity = Role(name=role_request_dto.name)
        return self.repository.create(db, role_entity)

    def get_roles(self, db: Session) -> List[Role]:
        return self.repository.get_all(db)

    def get_role_by_id(self, db: Session, role_id: str) -> Role:
        return self.repository.get_by_id(db, role_id)

    def update_role(self, db: Session, role_request_dto: RoleRequestDTO) -> Role:
        role = self.repository.get_by_id(db, role_request_dto.id)
        if role:
            role.name = role_request_dto.name
            return self.repository.update(db, role)
        return None

    def delete_role(self, db: Session, role_id: str) -> Role:
        return self.repository.delete(db, role_id)
