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
    if [ -f "$PID_DIR/backend.pid" ]; then
        PID=$(cat "$PID_DIR/backend.pid")
        if kill -0 "$PID" 2>/dev/null; then
            echo "停止后端服务 (PID: $PID)..."
            kill "$PID"
            rm "$PID_DIR/backend.pid"
        else
            echo "后端服务未运行"
            rm "$PID_DIR/backend.pid"
        fi
    else
        echo "后端服务未运行"
    fi
}

stop_frontend() {
    if [ -f "$PID_DIR/frontend.pid" ]; then
        PID=$(cat "$PID_DIR/frontend.pid")
        if kill -0 "$PID" 2>/dev/null; then
            echo "停止前端服务 (PID: $PID)..."
            kill "$PID"
            rm "$PID_DIR/frontend.pid"
        else
            echo "前端服务未运行"
            rm "$PID_DIR/frontend.pid"
        fi
    else
        echo "前端服务未运行"
    fi
}

status() {
    echo "=== StockBase 服务状态 ==="
    
    if [ -f "$PID_DIR/backend.pid" ]; then
        PID=$(cat "$PID_DIR/backend.pid")
        if kill -0 "$PID" 2>/dev/null; then
            echo "后端: 运行中 (PID: $PID) - http://localhost:8000"
        else
            echo "后端: 未运行"
        fi
    else
        echo "后端: 未运行"
    fi
    
    if [ -f "$PID_DIR/frontend.pid" ]; then
        PID=$(cat "$PID_DIR/frontend.pid")
        if kill -0 "$PID" 2>/dev/null; then
            echo "前端: 运行中 (PID: $PID) - http://localhost:5173"
        else
            echo "前端: 未运行"
        fi
    else
        echo "前端: 未运行"
    fi
}

case "$1" in
    start)
        mkdir -p "$SCRIPT_DIR/logs"
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
