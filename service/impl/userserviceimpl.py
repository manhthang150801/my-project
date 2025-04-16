from datetime import timedelta
from typing import List
from sqlalchemy.orm import Session, joinedload
from passlib.context import CryptContext

from app.dto.roledto import RoleResponseDTO
from app.dto.userdto import UserRequestDTO, LoginRequestDTO, UserResponseDTO, AccountUpdateRequestDTO
from app.model.role import Role
from app.model.user import User
from app.repository.userrepository import UserRepository
from app.service.userservice import UserService
from app.utils.authutils.authutils import verify_password, create_access_token


class UserServiceImpl(UserService):

    def __init__(self):
        self.repository = UserRepository()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def create_user(self, db: Session, user_request_dto: UserRequestDTO) -> User:
        default_role = db.query(Role).filter(Role.name == "USER").first()

        hashed_password = self.pwd_context.hash(user_request_dto.password)

        user_entity = User(
            username=user_request_dto.username,
            email=user_request_dto.email,
            password=hashed_password,
        )
        user_entity.roles.append(default_role)

        return self.repository.create(db, user_entity)

    def get_users(self, db: Session, skip: int = 0, limit: int = 10) -> List[User]:
        return self.repository.get_all(db, skip, limit)

    def get_user_by_id(self, db: Session, user_id: str) -> UserResponseDTO:
        user = self.repository.get_by_id(db, user_id)
        if user is None:
            return None

        roles = [RoleResponseDTO(id=role.id, name=role.name) for role in user.roles]

        return UserResponseDTO(
            id=user.id,
            username=user.username,
            email=user.email,
            roles=roles
        )

    def update_user(self, db: Session, account_update_request_dto: AccountUpdateRequestDTO) -> User:
        user = self.repository.get_account(db, account_update_request_dto.id)
        if user:
            user.username = account_update_request_dto.username
            user.email = account_update_request_dto.email

            if account_update_request_dto.password:
                user.password = self.pwd_context.hash(account_update_request_dto.password)

            user.roles = []
            if account_update_request_dto.roles:
                for role_name in account_update_request_dto.roles:
                    role = db.query(Role).filter(Role.id == role_name).first()
                    if role:
                        user.roles.append(role)

            return self.repository.update(db, user)

        return None

    def delete_user(self, db: Session, user_id: str) -> User:
        return self.repository.delete(db, user_id)

    def get_by_username(self, db: Session, username: str) -> User:
        return self.repository.get_by_username(db, username)

    def get_by_email(self, db: Session, email: str) -> User:
        return self.repository.get_by_email(db, email)

    def authenticate_user(self, db: Session, username: str, password: str):
        user = db.query(User).options(joinedload(User.roles)).filter(User.username == username).first()
        if user and verify_password(password, user.password):
            return user
        return None

    def login_user(self, db: Session, login_dto: LoginRequestDTO):
        user = self.authenticate_user(db, login_dto.username, login_dto.password)
        if not user:
            return None
        access_token = create_access_token(user_id=user.id, expires_delta=timedelta(minutes=1440))
        roles = [role.name for role in user.roles]
        return {
            "token": access_token,
            "token_type": "bearer",
            "username": user.username,
            "roles": roles
        }

    def count_users(self, db: Session) -> int:
        return self.repository.count_users(db)

    def get_account(self, db: Session, user_id: str):
        return self.repository.get_account(db, user_id)

    def initialize_account(self, db: Session):
        admin_user = db.query(User).filter(User.username == 'admin').first()

        if not admin_user:
            hashed_password = self.pwd_context.hash('12345678@')

            admin_user = User(
                username='admin',
                email='khaosat123@gmail.com',
                password=hashed_password,
            )

            admin_role = db.query(Role).filter(Role.name == 'ADMIN').first()
            user_role = db.query(Role).filter(Role.name == 'USER').first()

            admin_user.roles = []
            if admin_role:
                admin_user.roles.append(admin_role)
            if user_role:
                admin_user.roles.append(user_role)

            return self.repository.create(db, admin_user)
        return None