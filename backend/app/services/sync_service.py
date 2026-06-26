"""同步服务 - 将Markdown文档同步到数据库"""

import os
import re
from typing import List, Dict
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.company import Company
from app.models.news import News


class SyncService:
    def __init__(self, db: Session):
        self.db = db

    def get_stats(self) -> dict:
        """获取统计信息"""
        company_count = self.db.query(Company).count()
        news_count = self.db.query(News).count()
        return {
            "companies": company_count,
            "news": news_count,
        }

    def sync_all(self) -> dict:
        """同步所有文档"""
        companies_synced = self.sync_companies()
        news_synced = self.sync_news()
        global_news_synced = self.sync_global_news()
        return {
            "companies": companies_synced,
            "news": news_synced,
            "global_news": global_news_synced,
        }

    def sync_companies(self) -> int:
        """同步公司信息"""
        companies_dir = settings.COMPANIES_DIR
        if not companies_dir.exists():
            return 0

        count = 0
        for folder_name in os.listdir(companies_dir):
            folder_path = companies_dir / folder_name
            if not folder_path.is_dir():
                continue

            # 解析文件夹名称：股票代码_公司名称
            parts = folder_name.split("_", 1)
            if len(parts) != 2:
                continue

            code, name = parts
            relative_path = f"docs/companies/{folder_name}"

            # 判断市场
            market = "A股"
            if code.isalpha():
                market = "美股"

            # 检查是否已存在
            existing = self.db.query(Company).filter(Company.code == code).first()
            if existing:
                existing.name = name
                existing.folder_path = relative_path
            else:
                company = Company(
                    code=code,
                    name=name,
                    market=market,
                    folder_path=relative_path,
                )
                self.db.add(company)
            count += 1

        self.db.commit()
        return count

    def sync_news(self) -> int:
        """同步新闻"""
        companies_dir = settings.COMPANIES_DIR
        if not companies_dir.exists():
            return 0

        count = 0
        for folder_name in os.listdir(companies_dir):
            folder_path = companies_dir / folder_name
            news_dir = folder_path / "news"
            if not news_dir.exists():
                continue

            code = folder_name.split("_")[0]
            company_name = folder_name.split("_")[1] if "_" in folder_name else ""

            for news_file in news_dir.glob("*.md"):
                # 读取文件内容
                try:
                    with open(news_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                except Exception:
                    content = ""

                # 解析文件中的多个资讯
                articles = self._parse_articles(content, code, company_name, news_file.name)
                
                for article in articles:
                    news_id = article["id"]
                    
                    # 检查是否已存在
                    existing = self.db.query(News).filter(News.id == news_id).first()
                    if existing:
                        # 更新内容
                        for key, value in article.items():
                            if hasattr(existing, key) and value is not None:
                                setattr(existing, key, value)
                    else:
                        news = News(**article)
                        self.db.add(news)
                    count += 1

        self.db.commit()
        return count

    def sync_global_news(self) -> int:
        """同步全局新闻（docs/news/目录）"""
        news_dir = settings.DOCS_DIR / "news"
        if not news_dir.exists():
            return 0

        count = 0
        # 遍历年份/月份目录
        for year_dir in news_dir.iterdir():
            if not year_dir.is_dir():
                continue
            for month_dir in year_dir.iterdir():
                if not month_dir.is_dir():
                    continue
                for news_file in month_dir.glob("*.md"):
                    try:
                        with open(news_file, 'r', encoding='utf-8') as f:
                            content = f.read()
                    except Exception:
                        content = ""

                    # 解析文件中的多个资讯
                    articles = self._parse_global_articles(content, news_file.name, f"docs/news/{year_dir.name}/{month_dir.name}")
                    
                    for article in articles:
                        news_id = article["id"]
                        existing = self.db.query(News).filter(News.id == news_id).first()
                        if existing:
                            for key, value in article.items():
                                if hasattr(existing, key) and value is not None:
                                    setattr(existing, key, value)
                        else:
                            news = News(**article)
                            self.db.add(news)
                        count += 1

        self.db.commit()
        return count

    def _parse_global_articles(self, content: str, filename: str, dir_path: str) -> list:
        """解析全局新闻文件中的多个资讯"""
        articles = []
        
        # 解析文件名获取日期
        date_match = re.match(r"(\d{4}-\d{2}-\d{2})_(.*)", filename.replace('.md', ''))
        file_date = date_match.group(1) if date_match else ""
        
        # 尝试按 ### 分割
        sections = re.split(r'\n###\s+', content)
        
        # 如果没有 ### 分割，尝试按 ## 分割
        if len(sections) <= 1:
            sections = re.split(r'\n##\s+', content)
        
        for i, section in enumerate(sections):
            # 跳过文件头部（第一个section通常是标题）
            if i == 0:
                continue
            
            # 解析标题
            title_match = re.match(r'(.+?)(?:\n|$)', section)
            section_title = title_match.group(1).strip() if title_match else ""
            
            # 清理标题中的序号和日期前缀
            section_title = re.sub(r'^\d+\.\s*', '', section_title)
            section_title = re.sub(r'^\d{4}-\d{2}-\d{2}\s*', '', section_title)
            
            # 解析各字段 - 支持两种格式
            title = self._extract_field(section, r'\*\*标题\*\*[：:]\s*(.+)') or section_title
            source = self._extract_field(section, r'\*\*来源\*\*[：:]\s*(.+)') or \
                     self._extract_field(section, r'-\s*来源[：:]\s*(.+)')
            url = self._extract_field(section, r'\*\*URL\*\*[：:]\s*(https?://\S+)') or \
                  self._extract_field(section, r'-\s*URL[：:]\s*(https?://\S+)')
            date = self._extract_field(section, r'\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})') or \
                   self._extract_field(section, r'-\s*发布时间[：:]\s*(\d{4}-\d{2}-\d{2})') or file_date
            
            # 提取标签中的公司代码
            tags_match = re.search(r'-\s*标签[：:]\s*(.+)', section)
            company_code = None
            company_name = None
            if tags_match:
                tags = tags_match.group(1)
                # 尝试提取 #CODE_NAME 格式的标签
                code_match = re.search(r'#(\d{6})_([^\s#]+)', tags)
                if code_match:
                    company_code = code_match.group(1)
                    company_name = code_match.group(2)
                else:
                    code_match = re.search(r'#([A-Z]+)_([^\s#]+)', tags)
                    if code_match:
                        company_code = code_match.group(1)
                        company_name = code_match.group(2)
            
            # 解析摘要
            summary = self._extract_field(section, r'-\s*摘要[：:]\s*(.+)') or \
                      self._extract_field(section, r'\*\*摘要\*\*[：:]\s*(.+)')
            
            # 生成唯一ID
            article_id = f"global_{date}_{section_title[:20]}" if section_title else f"global_{filename}_{i}"
            
            # 只添加有效的资讯（有标题的）
            if section_title and section_title not in ["重点资讯", "市场概况", "待跟踪事项", "备注"]:
                articles.append({
                    "id": article_id,
                    "company_code": company_code,
                    "company_name": company_name,
                    "title": title or section_title,
                    "date": date,
                    "source": source,
                    "url": url,
                    "summary": summary,
                    "content": section,
                    "file_path": f"{dir_path}/{filename}",
                })
        
        return articles

    def _parse_articles(self, content: str, code: str, company_name: str, filename: str) -> list:
        """解析文件中的多个资讯"""
        articles = []
        
        # 解析文件名获取日期
        date_match = re.match(r"(\d{4}-\d{2}-\d{2})_(.*)", filename.replace('.md', ''))
        file_date = date_match.group(1) if date_match else ""
        
        # 尝试按 ### 分割
        sections = re.split(r'\n###\s+', content)
        
        # 如果没有 ### 分割，尝试按 ## 分割
        if len(sections) <= 1:
            sections = re.split(r'\n##\s+', content)
        
        for i, section in enumerate(sections):
            # 跳过文件头部（第一个section通常是标题）
            if i == 0:
                continue
            
            # 解析标题
            title_match = re.match(r'(.+?)(?:\n|$)', section)
            section_title = title_match.group(1).strip() if title_match else ""
            
            # 清理标题中的日期前缀（如 "2026-04-26 xxx"）
            section_title = re.sub(r'^\d{4}-\d{2}-\d{2}\s*', '', section_title)
            
            # 解析各字段 - 支持两种格式
            # 格式1: **标题**：xxx
            # 格式2: - 来源: xxx
            title = self._extract_field(section, r'\*\*标题\*\*[：:]\s*(.+)') or section_title
            source = self._extract_field(section, r'\*\*来源\*\*[：:]\s*(.+)') or \
                     self._extract_field(section, r'-\s*来源[：:]\s*(.+)')
            url = self._extract_field(section, r'\*\*URL\*\*[：:]\s*(https?://\S+)') or \
                  self._extract_field(section, r'-\s*URL[：:]\s*(https?://\S+)')
            date = self._extract_field(section, r'\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})') or \
                   self._extract_field(section, r'-\s*发布时间[：:]\s*(\d{4}-\d{2}-\d{2})') or file_date
            
            # 解析摘要 - 尝试多种格式
            summary = None
            # 格式1: **摘要**：\n- xxx
            summary_match = re.search(r'\*\*摘要\*\*[：:]\s*\n((?:- .+\n?)+)', section)
            if summary_match:
                summary_lines = summary_match.group(1).strip().split('\n')
                summary = ' '.join([line.lstrip('- ').strip() for line in summary_lines[:2]])
            else:
                # 格式2: **内容摘要**\nxxx
                summary_match = re.search(r'\*\*内容摘要\*\*\s*\n(.+?)(?:\n\n|\n\*\*|$)', section, re.DOTALL)
                if summary_match:
                    summary = summary_match.group(1).strip()[:200]
            
            # 生成唯一ID
            article_id = f"{code}_{date}_{section_title[:20]}" if section_title else f"{code}_{filename}_{i}"
            
            # 只添加有效的资讯（有标题的）
            if section_title:
                articles.append({
                    "id": article_id,
                    "company_code": code,
                    "company_name": company_name,
                    "title": title or section_title,
                    "date": date,
                    "source": source,
                    "url": url,
                    "summary": summary,
                    "content": section,
                    "file_path": f"docs/companies/{code}_{company_name}/news/{filename}",
                })
        
        return articles

    def _extract_field(self, text: str, pattern: str) -> str:
        """从文本中提取字段"""
        match = re.search(pattern, text)
        return match.group(1).strip() if match else None
