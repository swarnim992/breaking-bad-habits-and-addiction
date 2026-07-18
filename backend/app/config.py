from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Project Info ──────────────────────────────────────────────────────────
    PROJECT_NAME: str = "PromptWar API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI backend for PromptWar"
    API_V1_STR: str = "/api/v1"

    # ── CORS ──────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # ── Environment ───────────────────────────────────────────────────────────
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///./app.db"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
