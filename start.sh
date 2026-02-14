#!/bin/bash

echo "🚀 退休工资计算APP - 快速启动"
echo "================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo ""
fi

# 启动服务器
echo "🚀 正在启动服务器..."
echo ""
echo "================================"
echo "📱 前端页面: http://localhost:3000"
echo "🔧 后台管理: http://localhost:3000/admin.html"
echo "💚 API健康: http://localhost:3000/api/health"
echo "================================"
echo ""

npm start
