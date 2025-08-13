---
layout: home

hero:
  name: VitePress Auto i18n Router
  text: 自动语言检测与路由
  tagline: 为 VitePress 静态站点提供零配置的国际化路由方案
  actions:
    - theme: brand
      text: 快速开始
      link: /cn/guide/getting-started
    - theme: alt
      text: 了解更多
      link: /cn/guide/intro

features:
  - title: ✨ 自动语言检测
    details: 智能检测用户的语言偏好，自动跳转到对应语言版本
  - title: 🚀 零配置
    details: 开箱即用，只需三步即可为你的 VitePress 站点添加多语言支持
  - title: 💾 偏好持久化
    details: 记住用户的语言选择，下次访问自动跳转到偏好语言
  - title: ⚡ 性能优化
    details: 轻量级实现，不影响构建体积，支持 SSG 和 SPA 模式
  - title: 🎯 SEO 友好
    details: 使用标准 HTTP 重定向，保持 URL 清晰，对搜索引擎友好
  - title: 🔄 无缝切换
    details: 在生产环境使用客户端路由，无刷新切换语言版本
---

## 为什么选择 VitePress Auto i18n Router？

传统的 VitePress 多语言配置需要手动处理路由跳转和语言检测。本插件提供了一个优雅的自动化解决方案，让你专注于内容创作而不是路由配置。

### 主要优势

- **简单集成** - 只需添加插件和主题增强，无需修改现有代码
- **智能检测** - 自动检测并记住用户的语言偏好
- **开发友好** - 开发和生产环境都能完美工作
- **平台兼容** - 支持所有静态托管平台（GitHub Pages、Netlify、Vercel等）

### 快速体验

```bash
# 安装插件
pnpm add -D vitepress-auto-i18n-router

# 配置并启动
pnpm docs:dev
```

访问站点根路径，插件会自动检测你的浏览器语言并跳转到对应版本！