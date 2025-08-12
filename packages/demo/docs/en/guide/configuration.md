# Configuration Options

This page details all configuration options for VitePress Auto i18n Router.

## Basic Configuration

### locales

- **Type:** `string[]`
- **Required:** Yes
- **Example:** `['zh', 'en', 'ja']`

Defines the list of supported languages for your site. Each language code should be a short identifier, typically using the ISO 639-1 standard.

```typescript
vitepressAutoI18nRouter({
  locales: ['zh', 'en', 'ja', 'ko']
})
```

### defaultLocale

- **Type:** `string`
- **Required:** Yes
- **Example:** `'zh'`

The default language to use when user preference cannot be detected. Must be one of the values in the `locales` array.

```typescript
vitepressAutoI18nRouter({
  locales: ['zh', 'en'],
  defaultLocale: 'zh'  // Default to Chinese
})
```

### localeNames

- **Type:** `Record<string, string>`
- **Required:** No
- **Default:** `{}`
- **Example:** `{ zh: '简体中文', en: 'English' }`

Provides readable display names for each language code. Primarily used for language switcher display.

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

## Complete Configuration Examples

### Basic Configuration

The simplest configuration, just specify language list and default language:

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

### Full Configuration

Complete configuration example with all options:

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

export default defineConfig({
  // VitePress native locale configuration
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'My Docs',
      description: 'Project Documentation'
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
  
  // Plugin configuration
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

## Relationship with VitePress Configuration

### Coordinating locales Configuration

The plugin's `locales` configuration should be consistent with VitePress's `locales` configuration:

```typescript
export default defineConfig({
  // VitePress locales
  locales: {
    zh: { /* ... */ },
    en: { /* ... */ }
  },
  
  // Plugin locales should match
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh', 'en'],  // Consistent with above keys
        // ...
      })
    ]
  }
})
```

### Theme Configuration

Remember to enable language tracking in the theme:

```typescript
// .vitepress/theme/index.ts
export { default } from 'vitepress-auto-i18n-router/vitepress'
```

## Advanced Configuration

### Custom Language Detection Logic

While the plugin provides automatic language detection, you can override the default behavior through environment variables or other methods:

```typescript
// In your application code
if (import.meta.env.VITE_FORCE_LOCALE) {
  localStorage.setItem('vitepress-preferred-lang', import.meta.env.VITE_FORCE_LOCALE)
}
```

### Excluding Specific Paths

If you have paths that don't need language routing (like API docs), you can handle them in VitePress configuration:

```typescript
export default defineConfig({
  rewrites: {
    'api/:path*': ':path*'  // API paths without language prefix
  }
})
```

## Configuration Checklist

When configuring the plugin, ensure:

- ✅ `locales` array contains all supported language codes
- ✅ `defaultLocale` is one of the values in `locales`
- ✅ VitePress `locales` configuration is consistent with plugin configuration
- ✅ Theme file correctly exports the enhanced theme
- ✅ Document directory structure is organized by language

## Troubleshooting

### Configuration Not Taking Effect

If configuration doesn't seem to work, check:

1. Plugin is in the `vite.plugins` array
2. Theme is correctly exported
3. Development server has been restarted

### Inaccurate Language Detection

Check browser language settings:
- Chrome: Settings → Languages
- Firefox: Settings → General → Language
- Safari: System Preferences → Language & Region

### TypeScript Type Hints

For TypeScript type hints, import the configuration type:

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