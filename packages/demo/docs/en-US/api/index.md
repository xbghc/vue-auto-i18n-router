# API Reference

## Plugin Configuration

### vitepressAutoI18nRouter(config)

Creates the VitePress automatic i18n router plugin.

#### Parameters

- `config` - `I18nRouterConfig` - Plugin configuration object

#### Returns

- Vite plugin object

#### Example

```typescript
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

vitepressAutoI18nRouter({
  locales: ['zh-CN', 'en-US'],
  defaultLocale: 'zh-CN'
})
```

## Type Definitions

### I18nRouterConfig

Plugin configuration interface.

```typescript
interface I18nRouterConfig {
  /**
   * List of supported locales
   * Can be an array of locale codes or an object mapping locale codes to URL paths
   * Examples:
   * - Array: ['zh-CN', 'en-US'] - uses locale codes as URL paths
   * - Object: { 'zh-CN': 'zh', 'en-US': 'en' } - maps zh-CN to /zh/, en-US to /en/
   */
  locales: string[] | Record<string, string>
  
  /**
   * Default locale
   * Used when user preference cannot be detected
   */
  defaultLocale: string
  
  /**
   * Custom route rewrites (optional)
   * @experimental
   */
  rewrites?: Record<string, string>
  
  /**
   * Position of locale switcher component (optional)
   * @default 'nav'
   * @experimental - This feature is not yet implemented
   */
  switcherPosition?: 'nav' | 'sidebar' | 'none'
}
```

## Composables

### useI18nRouter()

Vue composable function for handling language switching.

#### Returns

```typescript
interface UseI18nRouterReturn {
  /**
   * Currently active locale code
   * Automatically extracted from URL path
   */
  currentLocale: ComputedRef<string | null>
  
  /**
   * Array of all available locale codes
   * Automatically read from VitePress configuration
   */
  availableLocales: ComputedRef<string[]>
  
  /**
   * Switch to specified locale
   * @param locale - Target locale code
   */
  switchLocale: (locale: string) => void
}
```

#### Example

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { 
  currentLocale, 
  availableLocales, 
  switchLocale 
} = useI18nRouter()

console.log(currentLocale.value)      // 'en-US'
console.log(availableLocales.value)   // ['zh-CN', 'en-US']

// Switch to Chinese
switchLocale('zh-CN')
</script>
```

## Theme Integration

### Default Theme

Directly export the enhanced default theme:

```typescript
// .vitepress/theme/index.ts
export { default } from 'vitepress-auto-i18n-router/vitepress'
```

### enhanceWithI18n(theme)

Add i18n functionality to an existing theme.

#### Parameters

- `theme` - `Theme` - VitePress theme object

#### Returns

- Enhanced theme object

#### Example

```typescript
import CustomTheme from './MyTheme'
import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'

export default enhanceWithI18n(CustomTheme)
```

## Core Classes (Advanced Users)

### RouteParser

Route parser class for parsing and generating multilingual routes.

```typescript
class RouteParser {
  constructor(config: I18nRouterConfig)
  
  /**
   * Parse URL to extract locale and path
   */
  parse(url: string): { locale: string | null, path: string }
  
  /**
   * Generate URL for specified locale
   */
  generate(locale: string, path: string): string
}
```

### BrowserLanguageDetector

Browser language detector class.

```typescript
class BrowserLanguageDetector {
  constructor(config: I18nRouterConfig)
  
  /**
   * Detect best matching locale
   */
  detect(): string
  
  /**
   * Get saved locale preference
   */
  getSavedLocale(): string | null
  
  /**
   * Save locale preference
   */
  saveLocale(locale: string): void
}
```

### LocalePathMapper

Bidirectional mapper between locale codes and URL paths.

```typescript
class LocalePathMapper {
  constructor(locales: string[] | Record<string, string>)
  
  /**
   * Get URL path for a given locale
   */
  getPathForLocale(locale: string): string | undefined
  
  /**
   * Get locale for a given URL path
   */
  getLocaleForPath(path: string): string | undefined
  
  /**
   * Get all supported locales
   */
  getAllLocales(): string[]
  
  /**
   * Get all URL paths
   */
  getAllPaths(): string[]
  
  /**
   * Check if locale is valid
   */
  isValidLocale(locale: string): boolean
  
  /**
   * Check if path is valid
   */
  isValidPath(path: string): boolean
  
  /**
   * Find best matching locale
   * Supports exact match, language family match, and simple language match
   */
  findBestMatchingLocale(browserLang: string): string | null
}
```

## Internal Mechanisms

### Language Detection Priority

1. **Saved preference**: Read from cookie or localStorage
2. **Browser language**: From Accept-Language header or navigator.language
3. **Default locale**: Use defaultLocale from configuration

### Language Matching Strategy

1. **Exact match**: `zh-CN` exactly matches `zh-CN`
2. **Language family match**: `zh-HK` matches `zh-CN` (if `zh-CN` is configured)
3. **Simple language match**: `zh` matches `zh-CN` (if only `zh-CN` is configured)

### Storage Mechanism

- **Cookie**: `vitepress-locale`, expires in 1 year
- **LocalStorage**: `vitepress-preferred-lang`

### Development vs Production

- **Development mode**: Server-side redirect via Vite middleware
- **Production mode**: Client-side language detection and routing via JavaScript

## Export Paths

```typescript
// Main entry
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

// Composables
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

// Theme
import Theme from 'vitepress-auto-i18n-router/vitepress'
import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'

// Core classes (advanced users)
import { 
  RouteParser, 
  BrowserLanguageDetector, 
  LocalePathMapper 
} from 'vitepress-auto-i18n-router'
```