# GitHub Pages 部署

本指南介绍如何将使用 vitepress-auto-i18n-router 的 VitePress 站点部署到 GitHub Pages。

## 配置步骤

### 1. 更新 VitePress 配置

在 `.vitepress/config.ts` 中设置正确的 `base` 路径：

```typescript
export default defineConfig({
  // 对于 GitHub Pages，使用你的仓库名
  base: process.env.GITHUB_ACTIONS ? '/your-repo-name/' : '/',
  
  // ... 其他配置
})
```

::: tip 为什么需要 base 配置？
GitHub Pages 项目站点的 URL 结构是 `https://username.github.io/repository-name/`，而不是根路径。

如果不配置 `base`：
- 所有资源（CSS、JS、图片）都会 404
- 导航链接会指向错误的路径
- 语言切换功能会失效

`process.env.GITHUB_ACTIONS` 环境变量让我们可以：
- 本地开发时使用 `/`
- GitHub Actions 构建时自动使用 `/repository-name/`
:::

::: tip
将 `your-repo-name` 替换为你的 GitHub 仓库名称。
:::

### 2. 创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 或者你的默认分支
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
        with:
          fetch-depth: 0

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

      - name: Build VitePress site
        run: pnpm docs:build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist  # 调整为你的构建输出路径

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

### 3. 配置 GitHub Pages

1. 进入 GitHub 仓库设置（Settings）
2. 找到 "Pages" 部分
3. 在 "Source" 下选择 "GitHub Actions"
4. 保存设置

### 4. 推送代码

将代码推送到主分支，GitHub Actions 会自动构建并部署你的站点。

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

## 验证部署

部署完成后，你的站点将可以通过以下地址访问：

```
https://[你的用户名].github.io/[仓库名]/
```

### 测试多语言功能

1. 访问根路径，应该自动重定向到默认语言
2. 手动访问不同语言版本（如 `/zh-CN/`、`/en-US/`）
3. 验证语言切换功能是否正常工作

## 常见问题

### 404 错误

如果遇到 404 错误，检查：
- `base` 配置是否正确
- GitHub Pages 是否已启用
- 部署工作流是否成功完成

### 语言重定向不工作

在静态托管环境中，自动语言重定向依赖客户端 JavaScript。确保：
- VitePress 主题已正确增强
- JavaScript 已启用
- 浏览器支持现代 JavaScript 特性

### 自定义域名

如果使用自定义域名：

1. 在 `docs/.vitepress/public/` 创建 `CNAME` 文件
2. 添加你的域名（如 `example.com`）
3. 更新 `base` 配置为 `/`

```typescript
base: '/',  // 自定义域名使用根路径
```

## 其他部署选项

除了 GitHub Pages，你还可以部署到：

- **Netlify**: 支持服务器端重定向规则
- **Vercel**: 提供边缘函数支持
- **Cloudflare Pages**: 支持自定义路由规则

这些平台可能提供更好的服务器端语言检测支持。

## 示例项目

查看 [demo](https://github.com/xbghc/vue-auto-i18n-router) 项目的完整配置示例。