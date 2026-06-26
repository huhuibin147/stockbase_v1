"""公司模型"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON
from app.core.database import Base


class Company(Base):
    __tablename__ = "companies"

    code = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    market = Column(String, default="A股")  # A股/港股/美股
    industry = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    folder_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
