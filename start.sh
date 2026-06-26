#!/bin/bash

# StockBase 启动/停止脚本

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
PID_DIR="$SCRIPT_DIR/.pids"

mkdir -p "$PID_DIR"

start_backend() {
    echo "启动后端服务..."
    cd "$BACKEND_DIR"
    source venv/bin/activate
    nohup uvicorn app.main:app --reload --port 8000 > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
    echo $! > "$PID_DIR/backend.pid"
    echo "后端服务已启动 (PID: $(cat $PID_DIR/backend.pid))"
}

start_frontend() {
    echo "启动前端服务..."
    cd "$FRONTEND_DIR"
    nohup yarn dev > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &
    echo $! > "$PID_DIR/frontend.pid"
    echo "前端服务已启动 (PID: $(cat $PID_DIR/frontend.pid))"
}

stop_backend() {
    echo "停止后端服务..."
    # 通过端口查找并杀死进程
    PID=$(lsof -ti :8000 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "找到后端进程 (PID: $PID)，正在停止..."
        kill -9 $PID 2>/dev/null
        echo "后端服务已停止"
    else
        echo "后端服务未运行"
    fi
    # 清理PID文件
    rm -f "$PID_DIR/backend.pid"
}

stop_frontend() {
    echo "停止前端服务..."
    # 通过端口查找并杀死进程（尝试多个端口）
    for PORT in 5173 5174 5175; do
        PID=$(lsof -ti :$PORT 2>/dev/null)
        if [ -n "$PID" ]; then
            echo "找到前端进程 (端口: $PORT, PID: $PID)，正在停止..."
            kill -9 $PID 2>/dev/null
        fi
    done
    echo "前端服务已停止"
    # 清理PID文件
    rm -f "$PID_DIR/frontend.pid"
}

status() {
    echo "=== StockBase 服务状态 ==="
    
    # 通过端口检查后端状态
    BACKEND_PID=$(lsof -ti :8000 2>/dev/null)
    if [ -n "$BACKEND_PID" ]; then
        echo "后端: 运行中 (PID: $BACKEND_PID) - http://localhost:8000"
    else
        echo "后端: 未运行"
    fi
    
    # 通过端口检查前端状态
    FRONTEND_PID=""
    FRONTEND_PORT=""
    for PORT in 5173 5174 5175; do
        PID=$(lsof -ti :$PORT 2>/dev/null)
        if [ -n "$PID" ]; then
            FRONTEND_PID=$PID
            FRONTEND_PORT=$PORT
            break
        fi
    done
    
    if [ -n "$FRONTEND_PID" ]; then
        echo "前端: 运行中 (PID: $FRONTEND_PID) - http://localhost:$FRONTEND_PORT"
    else
        echo "前端: 未运行"
    fi
}

case "$1" in
    start)
        mkdir -p "$SCRIPT_DIR/logs"
        # 启动前先停止旧进程，避免端口冲突
        stop_backend
        stop_frontend
        sleep 1
        start_backend
        start_frontend
        echo ""
        echo "服务启动完成"
        echo "前端: http://localhost:5173"
        echo "后端: http://localhost:8000"
        echo "API文档: http://localhost:8000/docs"
        ;;
    stop)
        stop_backend
        stop_frontend
        echo ""
        echo "服务已停止"
        ;;
    restart)
        stop_backend
        stop_frontend
        sleep 2
        mkdir -p "$SCRIPT_DIR/logs"
        start_backend
        start_frontend
        echo ""
        echo "服务重启完成"
        ;;
    status)
        status
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status}"
        echo ""
        echo "  start   - 启动前后端服务"
        echo "  stop    - 停止前后端服务"
        echo "  restart - 重启前后端服务"
        echo "  status  - 查看服务状态"
        exit 1
        ;;
esac
