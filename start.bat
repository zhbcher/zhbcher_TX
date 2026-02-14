@echo off
chcp 65001 >nul
title 退休工资计算APP - 启动脚本

echo 🚀 退休工资计算APP - 快速启动
echo ================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

✅ 检测到 Node.js
node -v
✅ 检测到 npm
npm -v
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
    echo.
)

REM 启动服务器
echo 🚀 正在启动服务器...
echo.
echo ================================
echo 📱 前端页面: http://localhost:3000
echo 🔧 后台管理: http://localhost:3000/admin.html
echo 💚 API健康: http://localhost:3000/api/health
echo ================================
echo.

call npm start

pause
