from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, sourced from environment variables / .env."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    database_url: str
    api_port: int = 8000


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor, used as a FastAPI dependency."""
    return Settings()
