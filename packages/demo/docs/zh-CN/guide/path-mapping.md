# 路径映射功能

vitepress-auto-i18n-router 支持灵活的语言到路径映射，让您可以自定义 URL 结构。

## 为什么需要路径映射？

默认情况下，语言代码直接用作 URL 路径：
- `zh-CN` → `/zh-CN/`
- `en-US` → `/en-US/`

但有时您可能希望使用更简短或不同的路径：
- `zh-CN` → `/zh/`
- `en-US` → `/en/`
- `ja-JP` → `/jp/`

## 配置方式

### 数组格式（默认）

语言代码直接作为路径使用：

```typescript
vitepressAutoI18nRouter({
  locales: ['zh-CN', 'en-US', 'ja-JP'],
  defaultLocale: 'zh-CN'
})
```

生成的路径：
- `/zh-CN/` - 中文
- `/en-US/` - 英文
- `/ja-JP/` - 日文

### 对象格式（自定义映射）

使用对象格式定义语言代码到路径的映射：

```typescript
vitepressAutoI18nRouter({
  locales: {
    'zh-CN': 'zh',    // 语言代码 → URL 路径
    'en-US': 'en',
    'ja-JP': 'jp'
  },
  defaultLocale: 'zh-CN'
})
```

生成的路径：
- `/zh/` - 中文（语言代码：zh-CN）
- `/en/` - 英文（语言代码：en-US）
- `/jp/` - 日文（语言代码：ja-JP）

## 与 VitePress 配置同步

**重要**：插件配置必须与 VitePress 的 locales 配置保持一致。

### 示例：使用默认路径

```typescript
// .vitepress/config.ts
export default defineConfig({
  // VitePress locales 配置
  locales: {
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-CN/'
    },
    'en-US': {
      label: 'English',
      lang: 'en-US',
      link: '/en-US/'
    }
  },
  
  // 插件配置
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh-CN', 'en-US'],  // 键必须匹配
        defaultLocale: 'zh-CN'
      })
    ]
  }
})
```

### 示例：使用自定义路径

```typescript
// .vitepress/config.ts
export default defineConfig({
  // VitePress locales 配置 - 使用简短路径作为键
  locales: {
    'zh': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/'
    },
    'en': {
      label: 'English',
      lang: 'en-US',
      link: '/en/'
    }
  },
  
  // 插件配置 - 映射语言代码到路径
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: {
          'zh-CN': 'zh',    // 语言检测使用 zh-CN，URL 使用 /zh/
          'en-US': 'en'     // 语言检测使用 en-US，URL 使用 /en/
        },
        defaultLocale: 'zh-CN'
      })
    ]
  }
})
```

## 目录结构

根据您的路径配置，相应地组织文档目录：

### 使用默认路径
```
docs/
├── zh-CN/
│   ├── index.md
│   └── guide/
│       └── intro.md
└── en-US/
    ├── index.md
    └── guide/
        └── intro.md
```

### 使用自定义路径
```
docs/
├── zh/           # 对应 'zh-CN': 'zh' 映射
│   ├── index.md
│   └── guide/
│       └── intro.md
└── en/           # 对应 'en-US': 'en' 映射
    ├── index.md
    └── guide/
        └── intro.md
```

## 在 Composables 中使用

使用 `useI18nRouter` 时，无需关心路径映射细节：

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale } = useI18nRouter()

// 始终使用语言代码，不是路径
switchLocale('zh-CN')  // 自动导航到 /zh/ 或 /zh-CN/
switchLocale('en-US')  // 自动导航到 /en/ 或 /en-US/
</script>
```

## 语言匹配逻辑

插件会智能匹配用户的浏览器语言：

1. **精确匹配**：`zh-CN` 完全匹配配置的 `zh-CN`
2. **语言家族匹配**：`zh-HK` 或 `zh-TW` 会匹配到 `zh-CN`（如果没有配置 `zh-TW`）
3. **简单语言匹配**：`zh` 会匹配到 `zh-CN`

这意味着即使用户的浏览器语言是 `zh-HK`，插件也能智能地将其导向中文版本。

## 最佳实践

### 1. 保持一致性

确保插件配置与 VitePress 配置一致：

```typescript
// ✅ 正确：配置一致
// VitePress
locales: {
  'zh': { ... },
  'en': { ... }
}

// 插件
locales: {
  'zh-CN': 'zh',
  'en-US': 'en'
}
```

```typescript
// ❌ 错误：配置不一致
// VitePress
locales: {
  'zh-CN': { ... },
  'en-US': { ... }
}

// 插件
locales: {
  'zh-CN': 'zh',  // 路径不匹配！
  'en-US': 'en'   // 路径不匹配！
}
```

### 2. 选择合适的路径格式

- **使用完整语言代码**（如 `/zh-CN/`）：当需要区分地区变体时
- **使用简短路径**（如 `/zh/`）：当只有一个地区变体时

### 3. SEO 考虑

- 保持 URL 结构简洁
- 使用标准的语言代码
- 确保每个语言版本有独立的 URL

## 调试技巧

如果路径映射不工作：

1. 检查浏览器控制台是否有错误
2. 确认目录结构与配置匹配
3. 验证 VitePress 和插件配置一致
4. 检查 cookie 中的语言偏好设置

## 示例项目

查看 [demo](https://github.com/xbghc/vue-auto-i18n-router/tree/main/packages/demo) 项目了解完整的配置示例。