# API 参考

## 插件配置

### vitepressAutoI18nRouter(config)

创建 VitePress 自动 i18n 路由插件。

#### 参数

- `config` - `I18nRouterConfig` - 插件配置对象

#### 返回值

- Vite 插件对象

#### 示例

```typescript
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

vitepressAutoI18nRouter({
  locales: ['zh-CN', 'en-US'],
  defaultLocale: 'zh-CN'
})
```

## 类型定义

### I18nRouterConfig

插件配置接口。

```typescript
interface I18nRouterConfig {
  /**
   * 支持的语言列表
   * 可以是语言代码数组或语言代码到 URL 路径的映射对象
   * 示例：
   * - 数组：['zh-CN', 'en-US'] - 使用语言代码作为 URL 路径
   * - 对象：{ 'zh-CN': 'zh', 'en-US': 'en' } - 映射 zh-CN 到 /zh/，en-US 到 /en/
   */
  locales: string[] | Record<string, string>
  
  /**
   * 默认语言
   * 当无法检测到用户偏好时使用
   */
  defaultLocale: string
  
  /**
   * 自定义路由重写规则（可选）
   * @experimental
   */
  rewrites?: Record<string, string>
  
  /**
   * 语言切换器组件位置（可选）
   * @default 'nav'
   * @experimental - 此功能尚未实现
   */
  switcherPosition?: 'nav' | 'sidebar' | 'none'
}
```

## Composables

### useI18nRouter()

用于处理语言切换的 Vue 组合式函数。

#### 返回值

```typescript
interface UseI18nRouterReturn {
  /**
   * 当前激活的语言代码
   * 从 URL 路径中自动提取
   */
  currentLocale: ComputedRef<string | null>
  
  /**
   * 所有可用的语言代码数组
   * 从 VitePress 配置中自动读取
   */
  availableLocales: ComputedRef<string[]>
  
  /**
   * 切换到指定语言
   * @param locale - 目标语言代码
   */
  switchLocale: (locale: string) => void
}
```

#### 示例

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { 
  currentLocale, 
  availableLocales, 
  switchLocale 
} = useI18nRouter()

console.log(currentLocale.value)      // 'zh-CN'
console.log(availableLocales.value)   // ['zh-CN', 'en-US']

// 切换到英文
switchLocale('en-US')
</script>
```

## 主题集成

### 默认主题

直接导出增强后的默认主题：

```typescript
// .vitepress/theme/index.ts
export { default } from 'vitepress-auto-i18n-router/vitepress'
```

### enhanceWithI18n(theme)

为现有主题添加 i18n 功能。

#### 参数

- `theme` - `Theme` - VitePress 主题对象

#### 返回值

- 增强后的主题对象

#### 示例

```typescript
import CustomTheme from './MyTheme'
import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'

export default enhanceWithI18n(CustomTheme)
```

## 核心类（高级用户）

### RouteParser

路由解析器类，用于解析和生成多语言路由。

```typescript
class RouteParser {
  constructor(config: I18nRouterConfig)
  
  /**
   * 解析 URL，提取语言和路径
   */
  parse(url: string): { locale: string | null, path: string }
  
  /**
   * 生成指定语言的 URL
   */
  generate(locale: string, path: string): string
}
```

### BrowserLanguageDetector

浏览器语言检测器类。

```typescript
class BrowserLanguageDetector {
  constructor(config: I18nRouterConfig)
  
  /**
   * 检测最佳匹配的语言
   */
  detect(): string
  
  /**
   * 获取保存的语言偏好
   */
  getSavedLocale(): string | null
  
  /**
   * 保存语言偏好
   */
  saveLocale(locale: string): void
}
```

### LocalePathMapper

语言代码与 URL 路径双向映射管理器。

```typescript
class LocalePathMapper {
  constructor(locales: string[] | Record<string, string>)
  
  /**
   * 获取语言代码对应的 URL 路径
   */
  getPathForLocale(locale: string): string | undefined
  
  /**
   * 获取 URL 路径对应的语言代码
   */
  getLocaleForPath(path: string): string | undefined
  
  /**
   * 获取所有支持的语言代码
   */
  getAllLocales(): string[]
  
  /**
   * 获取所有 URL 路径
   */
  getAllPaths(): string[]
  
  /**
   * 检查语言代码是否有效
   */
  isValidLocale(locale: string): boolean
  
  /**
   * 检查路径是否有效
   */
  isValidPath(path: string): boolean
  
  /**
   * 查找最佳匹配的语言
   * 支持精确匹配、语言家族匹配和简单语言匹配
   */
  findBestMatchingLocale(browserLang: string): string | null
}
```

## 内部机制

### 语言检测优先级

1. **保存的偏好**：从 cookie 或 localStorage 读取
2. **浏览器语言**：从 Accept-Language 请求头或 navigator.language 获取
3. **默认语言**：使用配置中的 defaultLocale

### 语言匹配策略

1. **精确匹配**：`zh-CN` 完全匹配 `zh-CN`
2. **语言家族匹配**：`zh-HK` 匹配到 `zh-CN`（如果配置了 `zh-CN`）
3. **简单语言匹配**：`zh` 匹配到 `zh-CN`（如果只配置了 `zh-CN`）

### 存储机制

- **Cookie**：`vitepress-locale`，有效期 1 年
- **LocalStorage**：`vitepress-preferred-lang`

### 开发与生产模式

- **开发模式**：通过 Vite 中间件在服务器端处理重定向
- **生产模式**：通过客户端 JavaScript 处理语言检测和路由

## 导出路径

```typescript
// 主入口
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

// Composables
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

// 主题
import Theme from 'vitepress-auto-i18n-router/vitepress'
import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'

// 核心类（高级用户）
import { 
  RouteParser, 
  BrowserLanguageDetector, 
  LocalePathMapper 
} from 'vitepress-auto-i18n-router'
```