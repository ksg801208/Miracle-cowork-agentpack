from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = "Miracle-Cowork AgentPack"
    database_url: str = "sqlite:///./miracle_agentpack.db"
    config_dir: Path = Path(__file__).parent.parent.parent.parent / "config"

    # LLM 연동 설정
    agent_runner_mode: str = "mock"          # "mock" | "llm"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-6"

    # JWT 인증 설정
    jwt_secret_key: str = "change-this-to-a-random-secret-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
