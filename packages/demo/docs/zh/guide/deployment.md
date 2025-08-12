# 部署指南

本指南介绍如何在不同平台上部署使用 VitePress Auto i18n Router 的站点。

## 构建生产版本

首先，构建你的 VitePress 站点：

```bash
# 构建生产版本
pnpm docs:build

# 预览构建结果
pnpm docs:preview
```

构建输出将在 `.vitepress/dist` 目录中。

## 部署平台

### GitHub Pages

GitHub Pages 是最流行的免费静态站点托管服务。

#### 1. 创建部署脚本

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm docs:build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 2. 配置 base URL

如果你的项目不是部署在根路径，需要配置 base：

```typescript
// .vitepress/config.ts
export default defineConfig({
  base: '/your-repo-name/',  // 替换为你的仓库名
  // ...
})
```

### Netlify

Netlify 提供了出色的静态站点托管服务，支持自动部署。

#### 1. 创建配置文件

在项目根目录创建 `netlify.toml`：

```toml
[build]
  command = "pnpm docs:build"
  publish = "docs/.vitepress/dist"

[build.environment]
  NODE_VERSION = "20"

# 优化：服务端重定向规则
[[redirects]]
  from = "/"
  to = "/zh/"
  status = 302
  conditions = {Language = ["zh", "zh-CN", "zh-TW"]}

[[redirects]]
  from = "/"
  to = "/en/"
  status = 302
  conditions = {Language = ["en"]}

[[redirects]]
  from = "/"
  to = "/zh/"
  status = 302

# 处理 SPA 路由
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. 部署步骤

1. 将代码推送到 GitHub
2. 在 Netlify 中导入项目
3. 自动检测构建设置
4. 点击部署

### Vercel

Vercel 是另一个优秀的部署平台，对 Vite 项目有极好的支持。

#### 1. 创建配置文件

在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "pnpm docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "framework": "vitepress",
  "rewrites": [
    {
      "source": "/",
      "destination": "/zh/"
    },
    {
      "source": "/:path((?!zh|en).*)",
      "destination": "/zh/:path"
    }
  ]
}
```

#### 2. 部署步骤

1. 安装 Vercel CLI：`npm i -g vercel`
2. 运行 `vercel` 命令
3. 按提示完成配置

### Cloudflare Pages

Cloudflare Pages 提供全球 CDN 和出色的性能。

#### 1. 构建配置

- **构建命令：** `pnpm docs:build`
- **构建输出目录：** `docs/.vitepress/dist`
- **环境变量：**
  - `NODE_VERSION`: `20`

#### 2. 重定向规则

创建 `docs/public/_redirects`：

```
/  /zh/  302  Language=zh
/  /en/  302  Language=en
/  /zh/  302
```

### 自托管 (Nginx)

如果你使用自己的服务器，可以使用 Nginx 配置：

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/docs;
    index index.html;

    # 语言检测和重定向
    location = / {
        # 检测中文
        if ($http_accept_language ~* "^zh") {
            return 302 /zh/;
        }
        # 检测英文
        if ($http_accept_language ~* "^en") {
            return 302 /en/;
        }
        # 默认重定向
        return 302 /zh/;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker 部署

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制源代码并构建
COPY . .
RUN pnpm docs:build

# 运行阶段
FROM nginx:alpine

# 复制构建结果
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 性能优化

### 1. 启用压缩

在 VitePress 配置中启用构建压缩：

```typescript
// .vitepress/config.ts
export default defineConfig({
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  }
})
```

### 2. PWA 支持

添加 PWA 支持以提供离线访问：

```bash
pnpm add -D @vite-pwa/vitepress
```

```typescript
// .vitepress/config.ts
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(defineConfig({
  // ... 你的配置
  pwa: {
    manifest: {
      name: 'VitePress Auto i18n Router',
      short_name: 'i18n Router',
      theme_color: '#5f67ee',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    }
  }
}))
```

### 3. CDN 配置

使用 CDN 加速静态资源：

```typescript
// .vitepress/config.ts
export default defineConfig({
  vite: {
    build: {
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  }
})
```

## 部署检查清单

部署前确保：

- ✅ 本地构建成功 (`pnpm docs:build`)
- ✅ 本地预览正常 (`pnpm docs:preview`)
- ✅ 所有链接都正确（没有 404）
- ✅ 语言切换功能正常
- ✅ 搜索功能正常
- ✅ 如果使用子路径，已配置 `base`
- ✅ 已配置合适的缓存策略
- ✅ 已启用 HTTPS（推荐）

## 常见问题

### 404 错误

如果部署后出现 404 错误：
1. 检查 `base` 配置是否正确
2. 确保服务器配置了正确的 fallback 规则
3. 验证构建输出目录路径

### 语言重定向不工作

生产环境的语言重定向依赖客户端 JavaScript。如需服务端重定向：
1. 使用平台提供的重定向规则（Netlify、Vercel）
2. 配置 Web 服务器（Nginx、Apache）
3. 使用边缘函数（Cloudflare Workers）

### 静态资源 404

确保：
1. 资源文件在 `public` 目录中
2. 使用正确的路径引用
3. 配置了正确的 `base` URL