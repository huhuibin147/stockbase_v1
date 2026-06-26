"""新闻相关API"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.news_service import NewsService

router = APIRouter()


@router.get("")
async def list_news(
    company_code: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """获取新闻列表"""
    service = NewsService(db)
    return service.list_news(company_code=company_code, limit=limit, offset=offset)


@router.get("/latest")
async def latest_news(limit: int = 10, db: Session = Depends(get_db)):
    """获取最新新闻"""
    service = NewsService(db)
    return service.latest_news(limit=limit)


@router.get("/{news_id}")
async def get_news(news_id: str, db: Session = Depends(get_db)):
    """获取新闻详情"""
    service = NewsService(db)
    news = service.get_news(news_id)
    if not news:
        raise HTTPException(status_code=404, detail="新闻不存在")
    return news
