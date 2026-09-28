from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, Literal

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Productivity Assistant Service"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    DATABASE_URL: Optional[str] = "postgresql://postgres:postgres@localhost:5432/productivity_assistant_db"
    
    # LLM Settings
    LLM_PROVIDER: Literal["gemini", "openai", "mock"] = "mock"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AI_MODEL_NAME: str = "gemini-1.5-flash"
    EMBEDDING_MODEL_NAME: str = "text-embedding-004"
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
