"""应用配置"""

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # 项目路径
    BASE_DIR: Path = Path(__file__).parent.parent.parent.parent
    DOCS_DIR: Path = BASE_DIR / "docs"
    DATA_DIR: Path = BASE_DIR / "data"
    COMPANIES_DIR: Path = DOCS_DIR / "companies"

    # 数据库
    DATABASE_URL: str = f"sqlite:///{DATA_DIR / 'stockbase.db'}"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # API配置
    API_PREFIX: str = "/api"

    class Config:
        env_file = ".env"


settings = Settings()
