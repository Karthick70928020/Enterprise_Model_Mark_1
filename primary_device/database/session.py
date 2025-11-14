from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import config

# Create database engine
engine = create_engine(
    config.database_url, 
    connect_args={"check_same_thread": False}  # SQLite specific
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Database dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()