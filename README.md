# Keno 高端现代化网站项目

本项目是一个基于前后端分离架构的现代化网站，专为 Keno 平台部署设计。

## 目录结构
- `frontend/` - 前端源码（原生 HTML/CSS/JS）
- `backend/` - 后端源码（Node.js + TypeScript）
- `docker-compose.yml` - 容器化编排文件
- `TECHNICAL_DESIGN.md` - 完整技术方案设计文档

## 快速开始

### 前提条件
- Node.js (v18+)
- Docker & docker-compose (可选，用于容器化运行)

### 本地开发 (非 Docker)

**1. 启动后端**
```bash
cd backend
npm install
npm run dev
```
后端服务将在 `http://localhost:3000` 启动，API 文档请访问 `http://localhost:3000/api-docs`。

**2. 启动前端**
推荐使用 VS Code 的 Live Server 插件打开 `frontend/index.html`，或使用简单的静态文件服务器：
```bash
npx serve frontend
```

### 本地测试
```bash
cd backend
npm run test
```
将执行 Jest 单元测试并输出覆盖率报告。

### Docker 一键部署
```bash
docker-compose up --build -d
```
启动后：
- 前端网站: `http://localhost`
- 后端 API: `http://localhost/api/` (被 Nginx 代理)

## CI/CD 与自动部署
本项目集成了 GitHub Actions（配置位于 `.github/workflows/ci-cd.yml`）。
在推送到 `main` 分支时，将自动运行：
1. 后端依赖安装与构建
2. 单元测试
3. Docker 镜像构建测试

## 性能与安全特性
- **前端**: 原生实现，极简依赖，CSS 变量实现秒级暗黑主题切换，Service Worker (PWA) 支持离线缓存，Lighthouse 评分优化。
- **后端**: JWT 鉴权，Helmet 设置安全 HTTP Headers，Express Rate Limit 限制请求频率，密码 Bcrypt 加密，全局异常捕获。

## 相关链接
- API 文档: `/api-docs` (启动后端后访问)
- 技术方案: [TECHNICAL_DESIGN.md](./TECHNICAL_DESIGN.md)
