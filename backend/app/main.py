"""StockBase 后端应用入口"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import companies, news, market, system
from app.core.config import settings
from app.core.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化数据库
    init_db()
    yield


app = FastAPI(
    title="StockBase API",
    description="AI驱动的A股基本面分析系统 API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(companies.router, prefix="/api/companies", tags=["公司"])
app.include_router(news.router, prefix="/api/news", tags=["新闻"])
app.include_router(market.router, prefix="/api/market", tags=["行情"])
app.include_router(system.router, prefix="/api/system", tags=["系统"])


@app.get("/")
async def root():
    return {"message": "StockBase API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
