from pydantic import BaseModel, field_validator
from typing import Optional
import re


# Custom email validation that allows special-use domains
def validate_email_format(v: str) -> str:
    """Validate email format, allowing special-use domains like .local"""
    if not isinstance(v, str):
        raise ValueError("Email must be a string")
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, v):
        raise ValueError("Invalid email format")
    return v


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        """Validate email, allowing special-use domains like .local"""
        return validate_email_format(v)

