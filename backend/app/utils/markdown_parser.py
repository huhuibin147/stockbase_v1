"""Markdown解析工具"""

import os
import re
from typing import Optional


def parse_markdown_file(file_path: str) -> Optional[dict]:
    """解析Markdown文件，提取结构化信息"""
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 提取标题
    title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    title = title_match.group(1) if title_match else os.path.basename(file_path)

    # 提取表格数据
    tables = extract_tables(content)

    # 提取各章节
    sections = extract_sections(content)

    return {
        "title": title,
        "content": content,
        "tables": tables,
        "sections": sections,
    }


def extract_tables(content: str) -> list:
    """提取Markdown表格"""
    tables = []
    table_pattern = re.compile(
        r"(\|.+\|)\n(\|[-: ]+\|)\n((?:\|.+\|\n?)+)", re.MULTILINE
    )

    for match in table_pattern.finditer(content):
        header_line = match.group(1)
        rows_text = match.group(3)

        # 解析表头
        headers = [h.strip() for h in header_line.split("|") if h.strip()]

        # 解析行
        rows = []
        for row_line in rows_text.strip().split("\n"):
            if row_line.strip():
                cells = [c.strip() for c in row_line.split("|") if c.strip()]
                if cells:
                    rows.append(cells)

        if headers and rows:
            tables.append({"headers": headers, "rows": rows})

    return tables


def extract_sections(content: str) -> dict:
    """提取Markdown各章节"""
    sections = {}
    current_section = None
    current_content = []

    for line in content.split("\n"):
        # 检测标题
        header_match = re.match(r"^(#{1,4})\s+(.+)$", line)
        if header_match:
            # 保存上一个章节
            if current_section:
                sections[current_section] = "\n".join(current_content).strip()
            current_section = header_match.group(2)
            current_content = []
        elif current_section:
            current_content.append(line)

    # 保存最后一个章节
    if current_section:
        sections[current_section] = "\n".join(current_content).strip()

    return sections


def parse_company_folder(folder_path: str) -> dict:
    """解析公司文件夹"""
    result = {
        "basic_info": None,
        "financial": None,
        "industry_tech": None,
        "notes": None,
        "news": [],
    }

    if not os.path.exists(folder_path):
        return result

    # 解析各个文件
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)

        if file_name == "basic_info.md":
            result["basic_info"] = parse_markdown_file(file_path)
        elif file_name == "financial.md":
            result["financial"] = parse_markdown_file(file_path)
        elif file_name == "industry_tech.md":
            result["industry_tech"] = parse_markdown_file(file_path)
        elif file_name == "notes.md":
            result["notes"] = parse_markdown_file(file_path)
        elif file_name == "news" and os.path.isdir(file_path):
            # 解析新闻文件夹
            for news_file in os.listdir(file_path):
                if news_file.endswith(".md"):
                    news_path = os.path.join(file_path, news_file)
                    news_data = parse_markdown_file(news_path)
                    if news_data:
                        news_data["filename"] = news_file
                        result["news"].append(news_data)

    return result
