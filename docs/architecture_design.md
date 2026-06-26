# StockBase 前后端系统设计文档

## 1. 系统概述

StockBase 是一个AI驱动的A股基本面分析系统，本文档描述前后端系统的架构设计。

### 1.1 设计目标

- **简洁**: 使用主流技术栈，降低维护成本
- **可扩展**: 模块化设计，便于后续添加新功能
- **文档驱动**: 与现有Markdown文档系统无缝集成

### 1.2 技术选型

| 层级 | 技术栈 | 说明 |
|------|--------|------|
| 前端 | React 18 + Vite + TailwindCSS | 现代化前端，轻量高效 |
| 后端 | Python + FastAPI | 异步高性能，自动生成API文档 |
| 数据 | SQLite + Markdown | 结构化数据+文档混合存储 |
| 行情 | 预留接口 | 后续可接入Tushare/AKShare |

## 2. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (React)                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │
│  │ 公司列表 │  │ 公司详情 │  │ 新闻中心 │  │  行情(预留)  │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
┌────────────────────────────┴────────────────────────────────┐
│                      后端 (FastAPI)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │
│  │ 公司API │  │ 文档API │  │ 新闻API │  │  采集(预留)  │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                        数据层                                │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   SQLite数据库   │  │   Markdown文件   │                  │
│  │   (元数据/索引)   │  │   (详细内容)     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 3. 目录结构设计

```
stockbase_v1/
├── docs/                          # 现有文档目录（保持不变）
├── frontend/                      # 前端项目
│   ├── src/
│   │   ├── components/           # 通用组件
│   │   │   ├── Layout/          # 布局组件
│   │   │   ├── Table/           # 表格组件
│   │   │   └── Card/            # 卡片组件
│   │   ├── pages/               # 页面组件
│   │   │   ├── CompanyList/    # 公司列表页
│   │   │   ├── CompanyDetail/  # 公司详情页
│   │   │   ├── NewsCenter/     # 新闻中心
│   │   │   └── Dashboard/      # 仪表盘
│   │   ├── services/            # API服务
│   │   ├── hooks/               # 自定义Hooks
│   │   ├── store/               # 状态管理
│   │   └── utils/               # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                       # 后端项目
│   ├── app/
│   │   ├── api/                  # API路由
│   │   │   ├── __init__.py
│   │   │   ├── companies.py    # 公司相关API
│   │   │   ├── news.py         # 新闻相关API
│   │   │   └── market.py       # 行情API（预留）
│   │   ├── core/                # 核心配置
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/              # 数据模型
│   │   │   ├── company.py
│   │   │   └── news.py
│   │   ├── services/            # 业务逻辑
│   │   │   ├── company_service.py
│   │   │   ├── news_service.py
│   │   │   └── collector/      # 采集模块（预留）
│   │   ├── utils/               # 工具函数
│   │   │   └── markdown_parser.py
│   │   └── main.py              # 应用入口
│   ├── requirements.txt
│   └── pyproject.toml
│
└── data/                          # 数据目录
    ├── stockbase.db              # SQLite数据库
    └── cache/                    # 缓存目录
```

## 4. API设计

### 4.1 公司相关

```
GET    /api/companies              # 获取公司列表
GET    /api/companies/{code}       # 获取公司详情
GET    /api/companies/{code}/basic # 获取基本信息
GET    /api/companies/{code}/financial  # 获取财务数据
GET    /api/companies/{code}/news  # 获取公司新闻
POST   /api/companies              # 添加公司
PUT    /api/companies/{code}       # 更新公司信息
```

### 4.2 新闻相关

```
GET    /api/news                   # 获取新闻列表
GET    /api/news/{id}              # 获取新闻详情
GET    /api/news/latest            # 获取最新新闻
```

### 4.3 行情相关（预留）

```
GET    /api/market/quote/{code}    # 获取实时行情
GET    /api/market/history/{code}  # 获取历史行情
GET    /api/market/index           # 获取指数行情
```

### 4.4 系统相关

```
GET    /api/system/status          # 系统状态
POST   /api/system/sync            # 同步文档到数据库
```

## 5. 数据模型

### 5.1 Company（公司）

```python
class Company:
    code: str           # 股票代码
    name: str           # 公司名称
    market: str         # 市场（A股/港股/美股）
    industry: str       # 所属行业
    tags: List[str]     # 标签
    created_at: datetime
    updated_at: datetime
```

### 5.2 News（新闻）

```python
class News:
    id: str             # 唯一标识
    company_code: str   # 关联公司代码
    title: str          # 标题
    date: str           # 发布日期
    source: str         # 来源
    url: str            # 原文链接
    summary: str        # 摘要
    content: str        # 正文内容
    file_path: str      # 文件路径
```

### 5.3 MarketData（行情数据，预留）

```python
class MarketData:
    code: str           # 股票代码
    date: str           # 日期
    open: float         # 开盘价
    high: float         # 最高价
    low: float          # 最低价
    close: float        # 收盘价
    volume: int         # 成交量
    amount: float       # 成交额
```

## 6. 前端页面设计

### 6.1 页面结构

```
├── 仪表盘（Dashboard）
│   ├── 公司数量统计
│   ├── 最新新闻摘要
│   └── 快速入口
│
├── 公司列表（CompanyList）
│   ├── 搜索/筛选
│   ├── 表格展示
│   └── 分页
│
├── 公司详情（CompanyDetail）
│   ├── 基本信息卡片
│   ├── 财务数据表格
│   ├── 新闻时间线
│   └── 投资笔记
│
├── 新闻中心（NewsCenter）
│   ├── 按时间排序
│   ├── 按公司筛选
│   └── 新闻详情
│
└── 行情中心（MarketCenter）- 预留
    ├── 实时行情
    ├── K线图
    └── 自选股
```

### 6.2 UI设计原则

- **简洁**: 使用卡片布局，信息层次清晰
- **响应式**: 支持桌面和移动端
- **主题**: 支持亮色/暗色主题切换

## 7. 扩展性设计

### 7.1 采集模块（预留）

```python
# backend/app/services/collector/
├── __init__.py
├── base_collector.py       # 采集器基类
├── news_collector.py       # 新闻采集
├── financial_collector.py  # 财务数据采集
└── market_collector.py     # 行情数据采集
```

采集器接口设计：
```python
class BaseCollector(ABC):
    @abstractmethod
    async def collect(self, params: dict) -> List[dict]:
        """采集数据"""
        pass

    @abstractmethod
    async def parse(self, raw_data: Any) -> dict:
        """解析数据"""
        pass
```

### 7.2 分类模块（预留）

```python
# backend/app/services/classifier/
├── __init__.py
├── industry_classifier.py  # 行业分类
├── sentiment_classifier.py # 情感分类
└── topic_classifier.py     # 主题分类
```

### 7.3 行情模块（预留）

```python
# backend/app/services/market/
├── __init__.py
├── tushare_provider.py     # Tushare数据源
├── akshare_provider.py     # AKShare数据源
└── market_service.py       # 行情服务
```

## 8. 开发计划

### Phase 1: 基础架构（当前）
- [x] 设计文档
- [ ] 后端项目搭建
- [ ] 前端项目搭建
- [ ] 基础API实现

### Phase 2: 核心功能
- [ ] 公司CRUD
- [ ] 文档解析
- [ ] 页面联调

### Phase 3: 扩展功能
- [ ] 采集模块
- [ ] 行情接入
- [ ] 数据可视化

## 9. 快速启动

### 后端

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问地址：
- 前端: http://localhost:5173
- 后端API文档: http://localhost:8000/docs
