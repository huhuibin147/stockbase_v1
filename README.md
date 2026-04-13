# StockBase - AI驱动的A股基本面分析系统

## 项目简介

StockBase 是一个基于AI驱动的A股基本面信息收集与分析系统。项目以文档(.md)数据为核心，结合大语言模型进行智能分析，辅助投资决策。

### 核心特点

- **文档驱动**: 以Markdown文档为主要数据载体，便于版本管理和协作
- **AI赋能**: 利用大语言模型进行信息提取、分析和总结
- **结构化存储**: 按照公司、行业、框架等维度组织信息
- **可扩展**: 预留脚本接口，支持后期自动化数据采集

## 项目结构

```
stockbase_v1/
├── README.md                    # 项目说明文档
├── docs/                        # 文档目录
│   ├── companies/              # 公司分析文档
│   │   └── {股票代码}_{公司名称}/
│   │       ├── basic_info.md   # 基本信息
│   │       ├── financial.md    # 财务分析
│   │       └── notes.md        # 投资笔记
│   ├── industries/             # 行业分析文档
│   │   └── {行业名称}/
│   │       ├── overview.md     # 行业概览
│   │       └── companies.md    # 重点公司
│   ├── frameworks/             # 分析框架和方法论
│   │   ├── valuation.md        # 估值方法
│   │   ├── financial_analysis.md # 财务分析框架
│   │   └── industry_research.md # 行业研究框架
│   └── reports/                # 研究报告
│       └── {日期}_{主题}.md
├── data/                        # 数据存储
│   ├── raw/                    # 原始数据
│   └── processed/              # 处理后的数据
├── prompts/                     # AI提示词模板
│   ├── analysis/               # 分析相关提示词
│   │   ├── financial_analysis.md
│   │   └── industry_analysis.md
│   └── extraction/             # 信息提取提示词
│       ├── extract_financial.md
│       └── extract_news.md
├── scripts/                     # 抓取脚本（后期开发）
│   └── crawlers/               # 爬虫脚本
│       ├── news_crawler.py
│       └── financial_crawler.py
└── templates/                   # 文档模板
    └── analysis/               # 分析报告模板
        ├── company_analysis.md
        └── industry_analysis.md
```

## 使用指南

### 1. 公司分析

在 `docs/companies/` 下创建以 `{股票代码}_{公司名称}` 命名的文件夹，例如：
- `600519_贵州茅台/`
- `000858_五粮液/`

每个公司文件夹可包含：
- `basic_info.md` - 公司基本信息、主营业务、股权结构等
- `financial.md` - 财务数据分析、盈利能力、成长性等
- `notes.md` - 个人投资笔记、思考过程

### 2. 行业研究

在 `docs/industries/` 下创建以行业名称命名的文件夹，例如：
- `白酒行业/`
- `新能源行业/`

### 3. 分析框架

`docs/frameworks/` 存放分析方法论，包括：
- 估值方法（PE、PB、DCF等）
- 财务分析框架
- 行业研究框架
- 投资决策流程

### 4. AI辅助分析

使用 `prompts/` 目录下的提示词模板，配合大语言模型进行：
- 财务数据解读
- 行业趋势分析
- 信息提取和总结
- 投资逻辑梳理

## 数据来源

- 公司公告、财报
- 券商研究报告
- 财经新闻资讯
- 行业数据统计
- 个人调研记录

## 后续规划

- [ ] 自动化数据采集脚本
- [ ] 数据库集成
- [ ] 可视化分析工具
- [ ] 多人协作支持
- [ ] API接口开发

## 注意事项

1. 所有文档使用UTF-8编码
2. 文件命名使用下划线分隔，避免空格
3. 重要数据需标注来源和时间
4. 定期备份和版本管理

## 版本历史

- v0.1.0 (2026-04-13) - 项目初始化，基础结构搭建

---

**免责声明**: 本系统仅供学习和研究使用，不构成任何投资建议。投资有风险，决策需谨慎。
