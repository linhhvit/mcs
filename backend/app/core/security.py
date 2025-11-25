from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from .config import settings

# Bcrypt has a 72-byte limit for passwords
BCRYPT_MAX_PASSWORD_LENGTH = 72


def _ensure_password_bytes(password: str) -> bytes:
    """Ensure password is within bcrypt's 72-byte limit and return as bytes"""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > BCRYPT_MAX_PASSWORD_LENGTH:
        return password_bytes[:BCRYPT_MAX_PASSWORD_LENGTH]
    return password_bytes


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    if not plain_password or not hashed_password:
        return False
    
    try:
        # Ensure password is within bcrypt's limit
        password_bytes = _ensure_password_bytes(plain_password)
        # Convert hash string to bytes if needed
        if isinstance(hashed_password, str):
            hash_bytes = hashed_password.encode('utf-8')
        else:
            hash_bytes = hashed_password
        
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except (ValueError, TypeError, UnicodeDecodeError) as e:
        # Log error but don't expose details to prevent information leakage
        print(f"Password verification error: {type(e).__name__}")
        return False
    except Exception as e:
        # Catch any other unexpected errors
        print(f"Unexpected password verification error: {type(e).__name__}")
        return False


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    if not password:
        raise ValueError("Password cannot be empty")
    
    try:
        # Ensure password is within bcrypt's limit
        password_bytes = _ensure_password_bytes(password)
        # Generate salt and hash
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        # Return as string
        return hashed.decode('utf-8')
    except (ValueError, TypeError) as e:
        raise ValueError(f"Error hashing password: {str(e)}")
    except Exception as e:
        raise ValueError(f"Unexpected error hashing password: {type(e).__name__}")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

