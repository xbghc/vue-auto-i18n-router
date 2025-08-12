# 快速开始

本指南将帮助你在 5 分钟内为你的 VitePress 站点添加自动多语言路由支持。

## 安装

使用你喜欢的包管理器安装插件：

```bash
# pnpm (推荐)
pnpm add -D vitepress-auto-i18n-router

# npm
npm install -D vitepress-auto-i18n-router

# yarn
yarn add -D vitepress-auto-i18n-router
```

## 三步配置

### 第一步：配置 VitePress

在你的 VitePress 配置文件中添加插件：

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

export default defineConfig({
  title: 'My Docs',
  
  // 配置 VitePress 原生的多语言
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/'
    },
    en: {
      label: 'English',
      lang: 'en-US', 
      link: '/en/'
    }
  },
  
  // 添加自动路由插件
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh', 'en'],
        defaultLocale: 'zh',
        localeNames: {
          zh: '简体中文',
          en: 'English'
        }
      })
    ]
  }
})
```

### 第二步：增强主题

创建或修改 `.vitepress/theme/index.ts`：

```typescript
// .vitepress/theme/index.ts

// 最简单的方式 - 直接使用增强后的主题
export { default } from 'vitepress-auto-i18n-router/vitepress'
```

或者如果你有自定义主题：

```typescript
// .vitepress/theme/index.ts
import MyTheme from './MyTheme'
import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'

export default enhanceWithI18n(MyTheme)
```

### 第三步：组织文档结构

按语言组织你的文档目录：

```
docs/
├── index.md          # 根页面（会自动重定向）
├── zh/               # 中文内容
│   ├── index.md      
│   ├── guide/
│   │   └── intro.md
│   └── api/
│       └── config.md
└── en/               # 英文内容
    ├── index.md      
    ├── guide/
    │   └── intro.md
    └── api/
        └── config.md
```

## 运行项目

```bash
# 开发模式
pnpm docs:dev

# 构建生产版本
pnpm docs:build

# 预览生产构建
pnpm docs:preview
```

## 功能验证

配置完成后，你可以通过以下方式验证功能：

1. **自动重定向**：访问根路径 `/`，应该自动跳转到合适的语言版本
2. **语言检测**：首次访问会根据浏览器语言自动选择
3. **偏好记忆**：刷新页面后会保持之前选择的语言
4. **无缝切换**：使用 VitePress 的语言切换器可以流畅切换

## 配置选项

### 基础配置

```typescript
interface I18nRouterConfig {
  // 可用的语言代码
  locales: string[]        // 例如：['zh', 'en', 'ja']
  
  // 默认语言（当无法检测时使用）
  defaultLocale: string    // 例如：'zh'
  
  // 语言显示名称（可选）
  localeNames?: Record<string, string>  // 例如：{ zh: '简体中文', en: 'English' }
}
```

### 完整示例

```typescript
vitepressAutoI18nRouter({
  locales: ['zh', 'en', 'ja', 'ko'],
  defaultLocale: 'zh',
  localeNames: {
    zh: '简体中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어'
  }
})
```

## 常见问题

### 根页面 index.md 应该写什么？

根目录的 `index.md` 只是一个占位文件，用户访问时会被自动重定向。建议内容：

```markdown
# Redirecting...

Please wait while we detect your language preference...
```

### 如何处理不对称的内容？

如果某些页面只存在于特定语言，插件会正常工作。用户访问不存在的页面时会看到 404 页面。

### 支持哪些托管平台？

插件在所有静态托管平台上都能工作：
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- 自托管服务器

## 下一步

- 查看[介绍](./intro)了解工作原理
- 探索[高级配置](../api/config)选项
- 参考[部署指南](../guide/deployment)优化生产环境