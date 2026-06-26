"""行情相关API（预留）"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/quote/{code}")
async def get_quote(code: str):
    """获取实时行情（预留）"""
    return {"message": "行情模块开发中", "code": code}


@router.get("/history/{code}")
async def get_history(code: str):
    """获取历史行情（预留）"""
    return {"message": "行情模块开发中", "code": code}


@router.get("/index")
async def get_index():
    """获取指数行情（预留）"""
    return {"message": "行情模块开发中"}
