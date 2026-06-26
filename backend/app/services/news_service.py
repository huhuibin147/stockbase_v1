"""新闻服务"""

from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.news import News


class NewsService:
    def __init__(self, db: Session):
        self.db = db

    def list_news(
        self,
        company_code: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> dict:
        """获取新闻列表"""
        query = self.db.query(News)

        if company_code:
            query = query.filter(News.company_code == company_code)

        total = query.count()
        news_list = query.order_by(News.date.desc()).offset(offset).limit(limit).all()

        return {
            "total": total,
            "items": [self._news_to_dict(n) for n in news_list],
        }

    def latest_news(self, limit: int = 10) -> List[dict]:
        """获取最新新闻"""
        news_list = (
            self.db.query(News)
            .order_by(News.date.desc())
            .limit(limit)
            .all()
        )
        return [self._news_to_dict(n) for n in news_list]

    def get_news(self, news_id: str) -> Optional[dict]:
        """获取新闻详情"""
        news = self.db.query(News).filter(News.id == news_id).first()
        if not news:
            return None
        return self._news_to_dict(news, include_content=True)

    def _news_to_dict(self, news: News, include_content: bool = False) -> dict:
        """转换为字典"""
        result = {
            "id": news.id,
            "company_code": news.company_code,
            "company_name": news.company_name,
            "title": news.title,
            "date": news.date,
            "source": news.source,
            "url": news.url,
            "summary": news.summary,
        }
        if include_content:
            result["content"] = news.content
        return result
