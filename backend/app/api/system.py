"""系统相关API"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.sync_service import SyncService

router = APIRouter()


@router.get("/status")
async def system_status(db: Session = Depends(get_db)):
    """系统状态"""
    sync_service = SyncService(db)
    stats = sync_service.get_stats()
    return {
        "status": "ok",
        "stats": stats,
    }


@router.post("/sync")
async def sync_docs(db: Session = Depends(get_db)):
    """同步文档到数据库"""
    sync_service = SyncService(db)
    result = sync_service.sync_all()
    return {"message": "同步完成", "result": result}
