"""新闻模型"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from app.core.database import Base


class News(Base):
    __tablename__ = "news"

    id = Column(String, primary_key=True, index=True)
    company_code = Column(String, index=True, nullable=True)
    company_name = Column(String, nullable=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=False)
    source = Column(String, nullable=True)
    url = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
