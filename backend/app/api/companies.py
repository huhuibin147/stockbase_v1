"""公司相关API"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company import Company
from app.services.company_service import CompanyService

router = APIRouter()


@router.get("")
async def list_companies(
    keyword: Optional[str] = None,
    industry: Optional[str] = None,
    market: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """获取公司列表"""
    service = CompanyService(db)
    return service.list_companies(keyword=keyword, industry=industry, market=market)


@router.get("/{code}")
async def get_company(code: str, db: Session = Depends(get_db)):
    """获取公司详情"""
    service = CompanyService(db)
    company = service.get_company(code)
    if not company:
        raise HTTPException(status_code=404, detail="公司不存在")
    return company


@router.get("/{code}/basic")
async def get_basic_info(code: str, db: Session = Depends(get_db)):
    """获取公司基本信息（从Markdown解析）"""
    service = CompanyService(db)
    return service.get_basic_info(code)


@router.get("/{code}/financial")
async def get_financial(code: str, db: Session = Depends(get_db)):
    """获取财务数据（从Markdown解析）"""
    service = CompanyService(db)
    return service.get_financial(code)


@router.get("/{code}/industry-tech")
async def get_industry_tech(code: str, db: Session = Depends(get_db)):
    """获取行业技术（从Markdown解析）"""
    service = CompanyService(db)
    return service.get_industry_tech(code)


@router.get("/{code}/notes")
async def get_notes(code: str, db: Session = Depends(get_db)):
    """获取投资笔记（从Markdown解析）"""
    service = CompanyService(db)
    return service.get_notes(code)


@router.get("/{code}/news")
async def get_company_news(code: str, db: Session = Depends(get_db)):
    """获取公司新闻"""
    service = CompanyService(db)
    return service.get_company_news(code)


@router.post("")
async def create_company(data: dict, db: Session = Depends(get_db)):
    """添加公司"""
    service = CompanyService(db)
    return service.create_company(data)


@router.put("/{code}")
async def update_company(code: str, data: dict, db: Session = Depends(get_db)):
    """更新公司信息"""
    service = CompanyService(db)
    return service.update_company(code, data)
