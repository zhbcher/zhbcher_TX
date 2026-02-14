# 使用官方Node.js镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /workspaces/zhbcher_TX

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install --no-audit --no-fund

# 复制源代码
COPY . .

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if(r.statusCode===200)process.exit(0);else process.exit(1)})"

# 暴露端口
EXPOSE 3000

# 启动命令（Codespaces会自动运行）
CMD ["npm", "start"]
