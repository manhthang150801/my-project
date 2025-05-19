from typing import List

from sqlalchemy.orm import Session

from app.dto.roledto import RoleRequestDTO
from app.model.role import Role

class RoleService:
    def initialize_roles(self, db: Session):
        pass

    def create_role(self, db: Session, role_request_dto: RoleRequestDTO) -> Role:
        pass

    def get_roles(self, db: Session) -> List[Role]:
        pass

    def get_role_by_id(self, db: Session, role_id: str) -> Role:
        pass

    def update_role(self, db: Session, role_request_dto: RoleRequestDTO) -> Role:
        pass

    def delete_role(self, db: Session, role_id: str) -> Role:
        pass
