from typing import List

from sqlalchemy.orm import Session

from app.dto.userdto import UserRequestDTO, LoginRequestDTO, UserResponseDTO, AccountUpdateRequestDTO
from app.model.user import User
from app.repository.userrepository import UserRepository

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create_user(self, db: Session, user_request_dto: UserRequestDTO) -> User:
        pass

    def get_users(self, db: Session, skip: int = 0, limit: int = 10) -> List[User]:
        pass

    def get_user_by_id(self, db: Session, user_id: str) -> UserResponseDTO:
        pass

    def update_user(self, db: Session, account_update_request_dto: AccountUpdateRequestDTO) -> User:
        pass

    def delete_user(self, db: Session, user_id: str) -> User:
        pass

    def get_by_username(self, db: Session, username: str) -> User:
        pass

    def get_by_email(self, db: Session, email: str) -> User:
        pass

    def authenticate_user(self, db: Session, username: str, password: str):
        pass

    def login_user(self, db: Session, login_dto: LoginRequestDTO):
        pass

    def count_users(self, db: Session) -> int:
        pass

    def get_account(self, db: Session, user_id: str):
        pass

    def initialize_account(self, db: Session):
        pass