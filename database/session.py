from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.base import Base

DATABASE_URL = "postgresql+psycopg2://postgres:123456@localhost/surveydb"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# alembic revision --autogenerate -m "Added description column to Topic"
# alembic upgrade head
