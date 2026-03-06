from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@db:5432/nexus"
    REDIS_URL: str = "redis://redis:6379/0"
    JWT_SECRET_KEY: str = "change_this_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DOCKER_NETWORK: str = "nexusdeploy_default"

    class Config:
        env_file = ".env"

settings = Settings()
