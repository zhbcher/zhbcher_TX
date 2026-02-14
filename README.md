# 🎯 退休工资计算APP (H5版 + 后台管理系统)

一个功能完整的退休工资计算Web应用，包含现代化H5前端界面和完善的后台管理系统。

## 📱 功能特性

### 前端页面 (H5)

#### 🏠 首页
- 退休倒计时显示（4599天）
- 用户信息展示（姓名、性别、出生日期、退休年龄、预计退休日期）
- 温馨提示（3条建议）
- 可编辑用户信息

#### 📰 资讯页
- 最新退休政策新闻
- 卡片式新闻列表
- 自动加载最新资讯

#### 💰 计算页
- 退休工资计算器
- 从档案加载用户数据
- 输入参数：工龄、缴费工资、平均工资、缴费系数、退休年龄
- 详细计算结果（基础养老金、个人账户养老金、过渡性养老金）
- 预估月养老金显示

#### 👤 我的
- 个人信息管理
- 计算历史记录
- 设置和关于

### 后台管理系统

#### 📊 数据看板
- 总用户数统计
- 资讯数量统计
- 平均退休金计算
- 最近活动记录
- 实时数据刷新

#### 👥 用户管理
- 查看用户列表
- 新增用户
- 编辑用户信息
- 删除用户
- 数据表格展示

#### 📰 资讯管理
- 发布新资讯
- 编辑现有资讯
- 删除资讯
- 资讯日期管理

#### 📝 计算记录
- 查看所有计算记录
- 用户计算历史
- 计算参数展示
- 时间排序

### 数据库功能
- SQLite 数据库自动创建
- 用户信息管理表
- 资讯内容管理表
- 计算记录存储表
- 系统设置表

## 🛠 技术栈

### 前端
- HTML5 + CSS3 + JavaScript (原生)
- 现代化渐变色UI设计
- 响应式设计（移动端优先）
- 本地数据存储 (LocalStorage)

### 后端
- Node.js + Express.js
- SQLite3 数据库
- RESTful API 设计
- CORS 跨域支持

### 管理后台
- 原生 HTML + CSS + JavaScript
- 渐变色主题设计
- 数据表格展示
- 模态框表单
- 实时数据刷新

## 📦 安装和运行

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 启动服务器

**生产环境：**
```bash
npm start
```

**开发环境（支持热重载）：**
```bash
npm run dev
```

### 3️⃣ 访问应用

- **前端页面**: http://localhost:3000
- **后台管理**: http://localhost:3000/admin.html
- **API健康检查**: http://localhost:3000/api/health

## 📂 项目结构

```
zhbcher_TX/
├── index.html              # 前端首页（H5）
├── admin.html              # 后台管理系统
├── server.js               # Express 服务器
├── package.json            # 项目依赖
├── QUICKSTART.md           # 快速开始指南
├── css/
│   ├── style.css           # 前端主样式
│   ├── home.css            # 首页样式
│   └── admin.css           # 后台样式
├── js/
│   ├── app.js              # 前端业务逻辑
│   └── admin.js            # 后台管理脚本
├── retirement.db           # SQLite 数据库（自动创建）
└── README.md               # 项目文档
```

## 🗄️ API 接口

### 用户管理
```
GET    /api/users           # 获取用户列表
POST   /api/users           # 新增用户
PUT    /api/users/:id       # 更新用户
DELETE /api/users/:id       # 删除用户
```

### 资讯管理
```
GET    /api/news            # 获取资讯列表
POST   /api/news            # 发布资讯
PUT    /api/news/:id        # 更新资讯
DELETE /api/news/:id        # 删除资讯
```

### 计算记录
```
GET    /api/calculations    # 获取计算记录
POST   /api/calculations    # 保存计算记录
```

### 统计数据
```
GET    /api/stats           # 获取统计数据
GET    /api/health          # 健康检查
```

## 💾 数据库表结构

### users (用户表)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,              -- 姓名
    gender TEXT,                     -- 性别
    birth_date TEXT,                 -- 出生日期
    retirement_age INTEGER,          -- 退休年龄
    email TEXT,                      -- 邮箱
    phone TEXT,                      -- 手机号
    created_at DATETIME,             -- 创建时间
    updated_at DATETIME              -- 更新时间
);
```

### news (资讯表)
```sql
CREATE TABLE news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,             -- 标题
    content TEXT,                    -- 内容
    summary TEXT,                    -- 摘要
    publish_date TEXT,               -- 发布日期
    created_at DATETIME              -- 创建时间
);
```

### calculations (计算记录表)
```sql
CREATE TABLE calculations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,                 -- 用户ID
    work_years INTEGER,              -- 工龄
    basic_salary REAL,               -- 本地工资
    social_rate REAL,                -- 社保比例（缴费系数）
    retirement_age INTEGER,          -- 退休年龄
    pension REAL,                    -- 计算结果
    created_at DATETIME              -- 创建时间
);
```

### settings (系统设置表)
```sql
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE,                 -- 配置键
    value TEXT,                      -- 配置值
    created_at DATETIME              -- 创建时间
);
```

## 🔢 退休金计算公式

### 1️⃣ 基础养老金
```
基础养老金 = (退休时当地上年度在岗职工月平均工资 × (1 + 本人平均缴费工资指数) ÷ 2) × 缴费年限 × 1%
```

### 2️⃣ 个人账户养老金
```
个人账户养老金 = 个人账户储存额 ÷ 计发月数
```

### 3️⃣ 过渡性养老金
```
过渡性养老金 = 退休时当地上年度在岗职工月平均工资 × 本人平均缴费工资指数 × 1997年前缴费年限 × 1.4%
```

### 4️⃣ 计发月数（根据退休年龄）
- 50岁: 195个月
- 55岁: 170个月
- 60岁: 139个月

### 5️⃣ 总养老金
```
总养老金 = 基础养老金 + 个人账户养老金 + 过渡性养老金
```

## 🎨 UI 设计

### 首页 UI
```
退休倒计时
计划您的美好退休生活
⏰ 距离退休还有 4599 天

退休信息 [修改]
姓名：用户 min1
性别：男
出生日期：1978-09-18
退休年龄：60岁
预计退休日期：2038年9月18日

💡 温馨提示
• 提前规划退休生活，享受美好时光
• 关注养老金政策变化
• 保持健康的生活方式
```

### 计算页 UI
```
退休工资计算器
预估您的退休养老金

[从档案加载]

输入参数：
工龄（年）：19
缴费工资（元）：220000
平均工资（元）：8000
缴费系数：2
  通常在0.6-3.0之间，1.0表示按平均工资缴费
退休年龄：60岁 (男职工)

[开始计算]

计算结果 [预估]
预计月养老金：XXX 元
基础养老金：XXX 元
个人账户养老金：XXX 元
过渡性养老金：XXX 元

※ 计算结果仅供参考，实际退休金以社保部门核定为准
```

## 🔧 配置说明

### 端口配置
默认端口为 3000，可通过环境变量修改：

```bash
PORT=8080 npm start
```

### 数据库配置
数据库文件默认为 `retirement.db`，首次运行会自动创建表结构。

## 📝 部署说明

### 1️⃣ 部署到 GitHub Pages（仅前端）

```bash
# 构建前端
npm run build

# 上传 dist 目录到 GitHub Pages
```

### 2️⃣ 部署到云服务器

```bash
# 安装依赖
npm install

# 启动服务
npm start

# 使用 PM2 守护进程
pm2 start server.js --name retirement-app
```

### 3️⃣ Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

构建和运行:

```bash
docker build -t retirement-app .
docker run -p 3000:3000 retirement-app
```

## 🔒 安全说明

在生产环境中，请确保：
1. ✅ 修改默认端口
2. ✅ 添加认证中间件
3. ✅ 使用 HTTPS
4. ✅ 验证输入数据
5. ✅ 定期备份数据库
6. ✅ 设置 CORS 白名单
7. ✅ 限制 API 请求频率

## 🚀 功能亮点

- 🎨 **现代化UI**: 渐变色设计，视觉效果优美
- 📱 **响应式设计**: 完美适配手机端
- ⚡ **快速响应**: 原生 JavaScript，性能优秀
- 💾 **数据持久化**: SQLite 数据库存储
- 🔐 **安全可靠**: 输入验证，防止注入攻击
- 📊 **数据可视化**: 后台统计图表
- 🔄 **实时更新**: 数据实时刷新
- 🌐 **RESTful API**: 标准化接口设计

## 📄 许可证

MIT License

## 👤 作者

zhbcher

## 🙏 致谢

感谢所有开源项目和贡献者的支持！

---

**📁 项目地址**: https://github.com/zhbcher/zhbcher_TX

**📧 联系邮箱**: zhbcher@gmail.com

---

**⚡ 如有问题请提交 Issue 或 Pull Request**
