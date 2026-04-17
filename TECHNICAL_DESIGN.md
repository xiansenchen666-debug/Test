# 高端现代化网站技术方案

## 1. 系统架构图与接口契约

### 1.1 系统架构图
系统采用典型的前后端分离架构，通过 Nginx（或 Keno 平台提供的反向代理）作为入口网关，后端使用 Node.js (TypeScript) 提供 RESTful API 服务，前端通过纯静态文件部署。
```text
[用户浏览器/客户端]
       │
       ▼ (HTTPS / HTTP/2)
[ CDN / 边缘节点 (静态资源加速) ]
       │
       ▼
[ Keno 平台反向代理 / Nginx ]
       ├───> [ 静态资源服务 (前端 HTML/CSS/JS) ]
       │
       └───> [ 后端 Node.js + TS (RESTful API) ]
                 ├── Controller (路由/输入验证)
                 ├── Service (核心业务逻辑)
                 └── Repository (数据访问层)
                       │
                       ▼
                 [ 数据库 (MySQL/PostgreSQL) ]
```

### 1.2 接口契约规范
*   **通信协议**：HTTPS + HTTP/2。
*   **API 风格**：RESTful API（GET / POST / PUT / DELETE）。
*   **数据格式**：统一采用 `application/json`。
*   **统一响应格式**：
    ```json
    {
      "code": 200,          // 业务状态码 (200=成功，400=参数错误，401=未授权，500=服务器内部错误)
      "message": "Success", // 提示信息
      "data": {}            // 响应负载数据
    }
    ```
*   **状态码约定**：遵循标准 HTTP 状态码，结合业务 `code` 进行精细化错误处理。

## 2. 前端设计方案
前端采用**原生 HTML/CSS/JavaScript**开发，追求极致的性能和加载速度（目标 Lighthouse 评分 ≥90）。

### 2.1 页面原型设计 (共 5 个页面)
1.  **首页 (Home)**：大图轮播首屏、核心业务摘要、动态数字统计、客户评价滚动。
2.  **关于我们 (About)**：公司简介、发展历程（时间轴）、团队风采、企业文化。
3.  **服务项目 (Services)**：卡片式服务列表、服务详情弹窗、服务流程介绍。
4.  **案例展示 (Portfolio)**：瀑布流或网格布局、多条件过滤筛选、案例详情页。
5.  **联系我们 (Contact)**：交互式地图集成、Ajax 表单提交、联系方式与地址。

### 2.2 核心特性
*   **主题切换**：支持基于 CSS 变量 (`var(--primary-color)`) 的暗黑/亮色主题实时切换，并持久化到 `localStorage`。
*   **响应式布局**：基于 CSS Flexbox/Grid 和 Media Queries，适配移动端、平板、桌面端。
*   **PWA 支持**：配置 `manifest.json` 和 Service Worker，实现核心资源的离线缓存，支持“添加到主屏幕”。
*   **性能优化**：图片懒加载（`loading="lazy"`）、CSS/JS 资源压缩合并、关键 CSS 内联。

## 3. 后端服务设计
后端采用 Node.js + TypeScript 开发，使用 Express 框架，注重代码结构与可维护性。

### 3.1 核心架构
*   **三层架构**：
    *   **Controller 层**：负责接收 HTTP 请求、参数校验（如使用 Joi 或 class-validator）、调用 Service、格式化返回结果。
    *   **Service 层**：承载核心业务逻辑，事务处理。
    *   **Repository 层**：负责数据库交互，封装 CRUD 操作（可使用 TypeORM 或 Prisma）。
*   **认证授权**：基于 JWT (JSON Web Token) 的无状态鉴权，自定义 Auth Middleware 拦截受保护路由。
*   **全局异常处理**：统一定义 `ErrorHandler` 中间件，捕获所有未处理异常并返回标准格式 JSON，避免信息泄露。
*   **API 文档**：集成 `swagger-ui-express`，通过代码注释自动生成 OpenAPI 规范文档。
*   **单元测试**：使用 Jest + Supertest，确保 Controller 与 Service 核心逻辑测试覆盖率 ≥80%。

## 4. 部署流水线设计 (Keno 平台适配)
采用 Docker 容器化方案，结合 GitHub Actions 实现自动化部署。

### 4.1 容器化配置
*   **Dockerfile (多阶段构建)**：
    ```dockerfile
    # Build stage
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build
    
    # Production stage
    FROM node:18-alpine
    WORKDIR /app
    COPY --from=builder /app/dist ./dist
    COPY package*.json ./
    RUN npm ci --production
    EXPOSE 3000
    CMD ["node", "dist/main.js"]
    ```
*   **docker-compose.yml**：编排 Node.js 应用与依赖数据库（如 MySQL、Redis）。

### 4.2 CI/CD GitHub Actions 工作流
1.  **触发条件**：推送到 `main` 分支或创建 Release 标签。
2.  **Lint & Test**：运行 ESLint 静态检查，执行 Jest 单元测试并生成覆盖率报告。
3.  **Build**：构建 Docker 镜像。
4.  **Push**：将镜像推送到 Keno 支持的容器镜像仓库（如 Docker Hub 或云厂商私有仓库）。
5.  **Deploy**：通过 SSH 或 Keno CLI 触发平台部署更新。
6.  **健康检查与回滚**：部署后进行 `/health` 接口探活，若连续 3 次失败则触发上一版本镜像的回滚操作。

## 5. 性能与安全基线

### 5.1 前端基线
*   **资源压缩**：使用构建工具（如 Webpack/Vite 配合 HTML/JS/CSS 压缩插件，虽不依赖前端框架，但使用构建工具优化静态产物）。
*   **HTTP/2 & CDN**：在反向代理配置 HTTP/2 协议，静态资源强制接入 CDN 并设置强缓存（Cache-Control）。

### 5.2 后端安全基线
*   **限流 (Rate Limiting)**：使用 `express-rate-limit` 防止暴力破解和 DDoS 攻击。
*   **安全响应头**：集成 `helmet` 中间件，自动设置 HSTS、X-XSS-Protection、X-Frame-Options 等安全 Header。
*   **CSP 策略**：配置 Content-Security-Policy，限制外部脚本与资源的加载，防范 XSS。
*   **防 SQL 注入**：严格使用 ORM 参数化查询，杜绝拼接 SQL。
*   **数据加密**：用户密码使用 bcrypt 加盐哈希；敏感环境变量（如数据库密码、JWT Secret）使用 dotenv 加密存储或依托 Keno 平台的 Secret 管理机制。
*   **HTTPS 强制**：在 Nginx 或 Node.js 层面进行 HTTP 到 HTTPS 的强制重定向。
