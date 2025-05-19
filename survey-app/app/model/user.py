import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base
from sqlalchemy import Table

user_role_association = Table(
    'user_role_association', Base.metadata,
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id', ondelete="CASCADE"), primary_key=True),
    Column('role_id', UUID(as_uuid=True), ForeignKey('roles.id', ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    roles = relationship("Role", secondary=user_role_association, back_populates="users")
