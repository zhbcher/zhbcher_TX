# 🚀 快速开始指南

## 安装依赖

```bash
npm install
```

## 启动服务器

**生产环境：**
```bash
npm start
```

**开发环境（支持热重载）：**
```bash
npm run dev
```

## 访问应用

- **前端页面**: http://localhost:3000
- **后台管理**: http://localhost:3000/admin.html
- **API测试**: http://localhost:3000/api/health

## 默认账号

- 用户名: `min1`
- 性别: `男`
- 出生日期: `1978-09-18`
- 退休年龄: 60岁
- 预计退休日期: 2038年9月18日

## 功能说明

### 前端页面
- **首页**: 退休倒计时、用户信息、温馨提示
- **资讯**: 退休政策新闻
- **计算**: 退休金计算器（支持从档案加载）
- **我的**: 个人信息管理

### 后台管理
- **数据看板**: 用户统计、资讯统计
- **用户管理**: 查看、添加、编辑、删除用户
- **资讯管理**: 发布、编辑、删除资讯
- **计算记录**: 查看计算历史

## 计算公式

### 基础养老金
基础养老金 = (退休时当地上年度在岗职工月平均工资 × (1 + 本人平均缴费工资指数) ÷ 2) × 缴费年限 × 1%

### 个人账户养老金
个人账户养老金 = 个人账户储存额 ÷ 计发月数

### 过渡性养老金
过渡性养老金 = 退休时当地上年度在岗职工月平均工资 × 本人平均缴费工资指数 × 1997年前缴费年限 × 1.4%

### 计发月数（根据退休年龄）
- 50岁: 195个月
- 55岁: 170个月
- 60岁: 139个月

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **后端**: Node.js + Express
- **数据库**: SQLite3
- **API**: RESTful

## 项目结构

```
zhbcher_TX/
├── index.html          # 前端首页
├── admin.html          # 后台管理
├── server.js           # Express 服务器
├── package.json        # 项目依赖
├── css/
│   ├── style.css       # 前端样式
│   ├── home.css        # 首页样式（备用）
│   └── admin.css       # 后台样式
├── js/
│   ├── app.js          # 前端逻辑
│   └── admin.js        # 后台脚本
└── README.md           # 详细文档
```

## 数据库

数据库文件 `retirement.db` 会在首次运行时自动创建。

## 部署

### GitHub Pages（仅前端）
```bash
npm run build
# 上传 dist 目录到 GitHub Pages
```

### 云服务器
```bash
npm install
npm start

# 使用 PM2 守护进程
pm2 start server.js --name retirement-app
```

### Docker
```bash
docker build -t retirement-app .
docker run -p 3000:3000 retirement-app
```

## 常见问题

**Q: 修改端口号？**
```bash
PORT=8080 npm start
```

**Q: 重置数据库？**
删除 `retirement.db` 文件，重启服务器即可。

**Q: API 请求失败？**
确保服务器已启动：`npm start`

## 技术支持

如有问题，请提交 Issue 或联系开发者。
