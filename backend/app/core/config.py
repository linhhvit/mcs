from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional, Union


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://mcs_user:mcs_password@postgres:5432/mcs_db"
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Application
    PROJECT_NAME: str = "MCS - Camera Monitoring System"
    API_V1_STR: str = "/api/v1"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: Union[bool, str] = True
    
    # Ports (for reference, actual ports are in docker-compose)
    POSTGRES_PORT: int = 5432
    FRONTEND_PORT: int = 8501
    
    @field_validator('DEBUG', mode='before')
    @classmethod
    def parse_debug(cls, v):
        """Parse DEBUG field, handling string values and avoiding conflicts with logging DEBUG"""
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            # Handle common string boolean values
            v_lower = v.lower().strip()
            if v_lower in ('true', '1', 'yes', 'on'):
                return True
            elif v_lower in ('false', '0', 'no', 'off', 'warn', 'warning', 'error', 'info'):
                return False
        # Default to False if can't parse
        return False
    
    @property
    def debug_mode(self) -> bool:
        """Get debug mode as boolean"""
        return bool(self.DEBUG) if isinstance(self.DEBUG, (bool, str)) else False
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        # Ignore extra fields that might conflict (like logging DEBUG)
        extra = "ignore"


settings = Settings()

