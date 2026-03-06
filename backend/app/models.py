from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import enum

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    api_key = Column(String, unique=True, index=True)

class ProjectType(str, enum.Enum):
    TELEGRAM = "telegram"
    DISCORD = "discord"
    FLASK = "flask"

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(Enum(ProjectType))
    user_id = Column(Integer, ForeignKey("users.id"))
    env_vars = Column(JSON, default={})
    status = Column(String, default="created")
    container_id = Column(String, nullable=True)
    port = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
