# 常见问题解答

## 基础问题

### 这个插件是做什么的？

vitepress-auto-i18n-router 是一个 VitePress 插件，提供：
- 自动检测用户的语言偏好
- 智能重定向到对应的语言版本
- 记住用户的语言选择
- 支持自定义 URL 路径映射

### 与 VitePress 原生 i18n 有什么区别？

VitePress 原生的 i18n 功能需要用户手动选择语言。本插件增加了：
- **自动语言检测**：基于浏览器语言自动选择
- **偏好记忆**：记住用户的选择
- **智能匹配**：支持语言家族匹配（如 zh-HK → zh-CN）
- **路径映射**：支持自定义 URL 结构

## 配置问题

### 为什么语言切换不工作？

检查以下几点：

1. **配置一致性**：确保插件配置与 VitePress locales 配置匹配
2. **目录结构**：确认文档目录与配置的路径对应
3. **主题集成**：确认已正确导出增强后的主题

```typescript
// ✅ 正确的配置
// VitePress locales
locales: {
  'zh-CN': { link: '/zh-CN/' },
  'en-US': { link: '/en-US/' }
}

// 插件配置
locales: ['zh-CN', 'en-US']
```

### 如何使用自定义路径？

使用对象格式配置 locales：

```typescript
vitepressAutoI18nRouter({
  locales: {
    'zh-CN': 'zh',  // /zh-CN/ → /zh/
    'en-US': 'en'   // /en-US/ → /en/
  },
  defaultLocale: 'zh-CN'
})
```

同时调整 VitePress 配置和目录结构。

### 插件配置放在哪里？

在 `.vitepress/config.ts` 的 `vite.plugins` 中：

```typescript
export default defineConfig({
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        // 配置项
      })
    ]
  }
})
```

## 使用问题

### 如何创建自定义语言切换器？

使用 `useI18nRouter` composable：

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale, currentLocale, availableLocales } = useI18nRouter()
</script>

<template>
  <select :value="currentLocale" @change="e => switchLocale(e.target.value)">
    <option v-for="locale in availableLocales" :value="locale">
      {{ locale }}
    </option>
  </select>
</template>
```

### 如何获取语言的显示名称？

使用 VitePress 的 `useData`：

```vue
<script setup>
import { useData } from 'vitepress'
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { site } = useData()
const { currentLocale } = useI18nRouter()

// 获取当前语言的显示名称
const currentLocaleName = computed(() => {
  return site.value.locales[currentLocale.value]?.label || currentLocale.value
})
</script>
```

### 语言偏好保存在哪里？

保存在两个地方：
- **Cookie**: `vitepress-locale`（有效期 1 年）
- **LocalStorage**: `vitepress-preferred-lang`

### 如何清除语言偏好？

在浏览器控制台执行：

```javascript
// 清除 cookie
document.cookie = 'vitepress-locale=; max-age=0; path=/'

// 清除 localStorage
localStorage.removeItem('vitepress-preferred-lang')
```

## 兼容性问题

### 支持哪些 VitePress 版本？

支持 VitePress 1.0.0 及以上版本。

### 是否支持 SSR/SSG？

- **开发模式**：通过服务器中间件支持
- **生产模式**：通过客户端 JavaScript 支持
- 完全兼容 VitePress 的静态站点生成

### 与其他 Vite 插件冲突怎么办？

确保插件顺序正确，通常将本插件放在最后：

```typescript
plugins: [
  otherPlugin1(),
  otherPlugin2(),
  vitepressAutoI18nRouter({...})  // 放在最后
]
```

## 高级用法

### 如何实现更复杂的语言匹配逻辑？

使用 `LocalePathMapper` 类：

```typescript
import { LocalePathMapper } from 'vitepress-auto-i18n-router'

const mapper = new LocalePathMapper({
  'zh-CN': 'zh',
  'zh-TW': 'zh-tw',
  'en-US': 'en'
})

// 自定义匹配逻辑
function customMatch(browserLang: string): string {
  // 你的自定义逻辑
  return mapper.findBestMatchingLocale(browserLang) || 'en-US'
}
```

### 如何在非 VitePress 环境使用？

核心类可以独立使用：

```typescript
import { RouteParser, BrowserLanguageDetector } from 'vitepress-auto-i18n-router'

const parser = new RouteParser({
  locales: ['zh-CN', 'en-US'],
  defaultLocale: 'zh-CN'
})

const detector = new BrowserLanguageDetector({
  locales: ['zh-CN', 'en-US'],
  defaultLocale: 'zh-CN'
})
```

### 如何调试语言检测？

在浏览器控制台查看：

```javascript
// 查看当前保存的语言偏好
console.log('Cookie:', document.cookie)
console.log('LocalStorage:', localStorage.getItem('vitepress-preferred-lang'))

// 查看浏览器语言
console.log('Browser language:', navigator.language)
console.log('Browser languages:', navigator.languages)
```

## 故障排查

### "Expected a JavaScript module but got text/html" 错误

这通常是因为中间件拦截了不该拦截的请求。确保：
1. 插件配置正确
2. 目录结构与配置匹配
3. 没有其他中间件冲突

### 页面一直重定向

可能原因：
1. 配置的 `defaultLocale` 不在 `locales` 列表中
2. VitePress 配置与插件配置不一致
3. 目录结构不正确

### 生产环境不工作

确认：
1. 已正确构建：`pnpm docs:build`
2. 主题已正确导出
3. 生产服务器支持客户端路由

## 性能优化

### 如何减少重定向？

1. 使用更短的路径（如 `/zh/` 而不是 `/zh-CN/`）
2. 设置合理的 cookie 过期时间
3. 考虑使用 CDN 的地理位置功能

### 是否影响 SEO？

不会。插件：
- 使用标准的 HTTP 重定向
- 保持每个语言版本的独立 URL
- 支持搜索引擎爬虫

## 贡献与支持

### 如何报告问题？

在 [GitHub Issues](https://github.com/xbghc/vue-auto-i18n-router/issues) 提交问题。

### 如何贡献代码？

1. Fork 项目
2. 创建功能分支
3. 提交 Pull Request

### 在哪里获取帮助？

- 查看[文档](https://github.com/xbghc/vue-auto-i18n-router)
- 提交 [Issue](https://github.com/xbghc/vue-auto-i18n-router/issues)
- 查看[示例项目](https://github.com/xbghc/vue-auto-i18n-router/tree/main/packages/demo)