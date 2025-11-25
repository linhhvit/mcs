from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
import re


# Custom email type that allows special-use domains
def validate_email_format(v: str) -> str:
    """Validate email format, allowing special-use domains like .local"""
    if not isinstance(v, str):
        raise ValueError("Email must be a string")
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, v):
        raise ValueError("Invalid email format")
    return v


class UserBase(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    status: str = "Active"
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        """Validate email, allowing special-use domains like .local"""
        return validate_email_format(v)


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    status: Optional[str] = None
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        """Validate email, allowing special-use domains like .local"""
        if v is None:
            return v
        return validate_email_format(v)


class RoleBase(BaseModel):
    role_name: str
    description: Optional[str] = None


class RoleCreate(RoleBase):
    pass


class Role(RoleBase):
    role_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserBase):
    user_id: int
    created_at: datetime
    updated_at: datetime
    roles: List[Role] = []

    class Config:
        from_attributes = True

