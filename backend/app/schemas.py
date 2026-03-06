from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime
from .models import ProjectType

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    type: ProjectType
    env_vars: Dict[str, Any] = {}

class ProjectOut(BaseModel):
    id: int
    name: str
    type: ProjectType
    status: str
    container_id: Optional[str]
    port: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
