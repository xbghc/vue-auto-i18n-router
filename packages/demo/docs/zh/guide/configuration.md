# 配置选项

本页面详细介绍 VitePress Auto i18n Router 的所有配置选项。

## 基础配置

### locales

- **类型：** `string[]`
- **必需：** 是
- **示例：** `['zh', 'en', 'ja']`

定义站点支持的语言列表。每个语言代码应该是一个简短的标识符，通常使用 ISO 639-1 标准。

```typescript
vitepressAutoI18nRouter({
  locales: ['zh', 'en', 'ja', 'ko']
})
```

### defaultLocale

- **类型：** `string`
- **必需：** 是
- **示例：** `'zh'`

当无法检测到用户语言偏好时使用的默认语言。必须是 `locales` 数组中的一个值。

```typescript
vitepressAutoI18nRouter({
  locales: ['zh', 'en'],
  defaultLocale: 'zh'  // 默认使用中文
})
```

### localeNames

- **类型：** `Record<string, string>`
- **必需：** 否
- **默认值：** `{}`
- **示例：** `{ zh: '简体中文', en: 'English' }`

为每个语言代码提供可读的显示名称。主要用于语言切换器的显示。

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

## 完整配置示例

### 基础配置

最简单的配置，只需指定语言列表和默认语言：

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

export default defineConfig({
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh', 'en'],
        defaultLocale: 'zh'
      })
    ]
  }
})
```

### 完整配置

包含所有选项的完整配置示例：

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

export default defineConfig({
  // VitePress 原生多语言配置
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: '我的文档',
      description: '项目文档'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'My Docs',
      description: 'Project Documentation'
    },
    ja: {
      label: '日本語',
      lang: 'ja-JP',
      link: '/ja/',
      title: 'ドキュメント',
      description: 'プロジェクトドキュメント'
    }
  },
  
  // 插件配置
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh', 'en', 'ja'],
        defaultLocale: 'zh',
        localeNames: {
          zh: '简体中文',
          en: 'English',
          ja: '日本語'
        }
      })
    ]
  }
})
```

## 与 VitePress 配置的关系

### locales 配置协调

插件的 `locales` 配置应该与 VitePress 的 `locales` 配置保持一致：

```typescript
export default defineConfig({
  // VitePress locales
  locales: {
    zh: { /* ... */ },
    en: { /* ... */ }
  },
  
  // 插件 locales 应该匹配
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh', 'en'],  // 与上面的 keys 一致
        // ...
      })
    ]
  }
})
```

### 主题配置

记得在主题中启用语言追踪：

```typescript
// .vitepress/theme/index.ts
export { default } from 'vitepress-auto-i18n-router/vitepress'
```

## 高级配置

### 自定义语言检测逻辑

虽然插件提供了自动语言检测，但你可以通过环境变量或其他方式覆盖默认行为：

```typescript
// 在你的应用代码中
if (import.meta.env.VITE_FORCE_LOCALE) {
  localStorage.setItem('vitepress-preferred-lang', import.meta.env.VITE_FORCE_LOCALE)
}
```

### 排除特定路径

如果你有一些路径不需要语言路由（如 API 文档），可以在 VitePress 配置中处理：

```typescript
export default defineConfig({
  rewrites: {
    'api/:path*': ':path*'  // API 路径不添加语言前缀
  }
})
```

## 配置检查清单

配置插件时，请确保：

- ✅ `locales` 数组包含所有支持的语言代码
- ✅ `defaultLocale` 是 `locales` 中的一个值
- ✅ VitePress 的 `locales` 配置与插件配置一致
- ✅ 主题文件正确导出增强后的主题
- ✅ 文档目录结构按语言组织

## 故障排查

### 配置不生效

如果配置似乎没有生效，检查：

1. 插件是否在 `vite.plugins` 数组中
2. 主题是否正确导出
3. 开发服务器是否已重启

### 语言检测不准确

检查浏览器的语言设置：
- Chrome: 设置 → 语言
- Firefox: 设置 → 常规 → 语言
- Safari: 系统偏好设置 → 语言与地区

### TypeScript 类型提示

如需 TypeScript 类型提示，可以导入配置类型：

```typescript
import type { I18nRouterConfig } from 'vitepress-auto-i18n-router'

const config: I18nRouterConfig = {
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localeNames: {
    zh: '简体中文',
    en: 'English'
  }
}
```