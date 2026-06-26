"""公司服务"""

import os
from typing import Optional, List
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.company import Company
from app.models.news import News
from app.utils.markdown_parser import parse_company_folder, parse_markdown_file


class CompanyService:
    def __init__(self, db: Session):
        self.db = db

    def list_companies(
        self,
        keyword: Optional[str] = None,
        industry: Optional[str] = None,
        market: Optional[str] = None,
    ) -> List[dict]:
        """获取公司列表"""
        query = self.db.query(Company)

        if keyword:
            query = query.filter(
                (Company.code.contains(keyword)) | (Company.name.contains(keyword))
            )
        if industry:
            query = query.filter(Company.industry == industry)
        if market:
            query = query.filter(Company.market == market)

        companies = query.order_by(Company.code).all()
        return [self._company_to_dict(c) for c in companies]

    def get_company(self, code: str) -> Optional[dict]:
        """获取公司详情"""
        company = self.db.query(Company).filter(Company.code == code).first()
        if not company:
            return None
        return self._company_to_dict(company)

    def get_basic_info(self, code: str) -> Optional[dict]:
        """获取基本信息（从Markdown解析）"""
        company = self.db.query(Company).filter(Company.code == code).first()
        if not company or not company.folder_path:
            return None

        basic_file = os.path.join(settings.BASE_DIR, company.folder_path, "basic_info.md")
        if not os.path.exists(basic_file):
            return None

        return parse_markdown_file(basic_file)

    def get_financial(self, code: str) -> Optional[dict]:
        """获取财务数据（从Markdown解析）"""
        company = self.db.query(Company).filter(Company.code == code).first()
        if not company or not company.folder_path:
            return None

        financial_file = os.path.join(settings.BASE_DIR, company.folder_path, "financial.md")
        if not os.path.exists(financial_file):
            return None

        return parse_markdown_file(financial_file)

    def get_industry_tech(self, code: str) -> Optional[dict]:
        """获取行业技术（从Markdown解析）"""
        company = self.db.query(Company).filter(Company.code == code).first()
        if not company or not company.folder_path:
            return None

        file_path = os.path.join(settings.BASE_DIR, company.folder_path, "industry_tech.md")
        if not os.path.exists(file_path):
            return None

        return parse_markdown_file(file_path)

    def get_notes(self, code: str) -> Optional[dict]:
        """获取投资笔记（从Markdown解析）"""
        company = self.db.query(Company).filter(Company.code == code).first()
        if not company or not company.folder_path:
            return None

        file_path = os.path.join(settings.BASE_DIR, company.folder_path, "notes.md")
        if not os.path.exists(file_path):
            return None

        return parse_markdown_file(file_path)

    def get_company_news(self, code: str) -> List[dict]:
        """获取公司新闻"""
        company = self.db.query(Company).filter(Company.code == code).first()
        if not company:
            return []

        # 从数据库获取
        news_list = (
            self.db.query(News)
            .filter(News.company_code == code)
            .order_by(News.date.desc())
            .all()
        )
        return [self._news_to_dict(n) for n in news_list]

    def create_company(self, data: dict) -> dict:
        """添加公司"""
        code = data.get("code")
        if not code:
            raise ValueError("股票代码不能为空")

        existing = self.db.query(Company).filter(Company.code == code).first()
        if existing:
            raise ValueError(f"公司 {code} 已存在")

        company = Company(
            code=code,
            name=data.get("name", ""),
            market=data.get("market", "A股"),
            industry=data.get("industry"),
            tags=data.get("tags", []),
            folder_path=data.get("folder_path"),
        )
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return self._company_to_dict(company)

    def update_company(self, code: str, data: dict) -> dict:
        """更新公司信息"""
        company = self.db.query(Company).filter(Company.code == code).first()
        if not company:
            raise ValueError(f"公司 {code} 不存在")

        for key, value in data.items():
            if hasattr(company, key):
                setattr(company, key, value)

        self.db.commit()
        self.db.refresh(company)
        return self._company_to_dict(company)

    def _company_to_dict(self, company: Company) -> dict:
        """转换为字典"""
        return {
            "code": company.code,
            "name": company.name,
            "market": company.market,
            "industry": company.industry,
            "tags": company.tags or [],
            "folder_path": company.folder_path,
            "created_at": company.created_at.isoformat() if company.created_at else None,
            "updated_at": company.updated_at.isoformat() if company.updated_at else None,
        }

    def _news_to_dict(self, news: News) -> dict:
        """转换为字典"""
        return {
            "id": news.id,
            "company_code": news.company_code,
            "company_name": news.company_name,
            "title": news.title,
            "date": news.date,
            "source": news.source,
            "url": news.url,
            "summary": news.summary,
        }
