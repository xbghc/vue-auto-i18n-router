# Path Mapping

vitepress-auto-i18n-router supports flexible language-to-path mapping, allowing you to customize your URL structure.

## Why Path Mapping?

By default, language codes are used directly as URL paths:
- `zh-CN` → `/zh-CN/`
- `en-US` → `/en-US/`

But sometimes you might want shorter or different paths:
- `zh-CN` → `/zh/`
- `en-US` → `/en/`
- `ja-JP` → `/jp/`

## Configuration

### Array Format (Default)

Language codes are used directly as paths:

```typescript
vitepressAutoI18nRouter({
  locales: ['zh-CN', 'en-US', 'ja-JP'],
  defaultLocale: 'zh-CN'
})
```

Generated paths:
- `/zh-CN/` - Chinese
- `/en-US/` - English
- `/ja-JP/` - Japanese

### Object Format (Custom Mapping)

Use object format to define language code to path mappings:

```typescript
vitepressAutoI18nRouter({
  locales: {
    'zh-CN': 'zh',    // language code → URL path
    'en-US': 'en',
    'ja-JP': 'jp'
  },
  defaultLocale: 'zh-CN'
})
```

Generated paths:
- `/zh/` - Chinese (language code: zh-CN)
- `/en/` - English (language code: en-US)
- `/jp/` - Japanese (language code: ja-JP)

## Syncing with VitePress Config

**Important**: Plugin configuration must match VitePress's locales configuration.

### Example: Using Default Paths

```typescript
// .vitepress/config.ts
export default defineConfig({
  // VitePress locales config
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
  
  // Plugin config
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh-CN', 'en-US'],  // keys must match
        defaultLocale: 'zh-CN'
      })
    ]
  }
})
```

### Example: Using Custom Paths

```typescript
// .vitepress/config.ts
export default defineConfig({
  // VitePress locales config - using short paths as keys
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
  
  // Plugin config - mapping language codes to paths
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: {
          'zh-CN': 'zh',    // language detection uses zh-CN, URL uses /zh/
          'en-US': 'en'     // language detection uses en-US, URL uses /en/
        },
        defaultLocale: 'zh-CN'
      })
    ]
  }
})
```

## Directory Structure

Organize your documentation directories according to your path configuration:

### Using Default Paths
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

### Using Custom Paths
```
docs/
├── zh/           # corresponds to 'zh-CN': 'zh' mapping
│   ├── index.md
│   └── guide/
│       └── intro.md
└── en/           # corresponds to 'en-US': 'en' mapping
    ├── index.md
    └── guide/
        └── intro.md
```

## Using with Composables

When using `useI18nRouter`, you don't need to worry about path mapping details:

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale } = useI18nRouter()

// Always use language codes, not paths
switchLocale('zh-CN')  // automatically navigates to /zh/ or /zh-CN/
switchLocale('en-US')  // automatically navigates to /en/ or /en-US/
</script>
```

## Language Matching Logic

The plugin intelligently matches user's browser language:

1. **Exact match**: `zh-CN` exactly matches configured `zh-CN`
2. **Language family match**: `zh-HK` or `zh-TW` matches `zh-CN` (if `zh-TW` is not configured)
3. **Simple language match**: `zh` matches `zh-CN`

This means even if a user's browser language is `zh-HK`, the plugin can intelligently direct them to the Chinese version.

## Best Practices

### 1. Maintain Consistency

Ensure plugin configuration matches VitePress configuration:

```typescript
// ✅ Correct: Consistent configuration
// VitePress
locales: {
  'zh': { ... },
  'en': { ... }
}

// Plugin
locales: {
  'zh-CN': 'zh',
  'en-US': 'en'
}
```

```typescript
// ❌ Wrong: Inconsistent configuration
// VitePress
locales: {
  'zh-CN': { ... },
  'en-US': { ... }
}

// Plugin
locales: {
  'zh-CN': 'zh',  // Path mismatch!
  'en-US': 'en'   // Path mismatch!
}
```

### 2. Choose Appropriate Path Format

- **Use full language codes** (e.g., `/zh-CN/`): When you need to distinguish regional variants
- **Use short paths** (e.g., `/zh/`): When you have only one regional variant

### 3. SEO Considerations

- Keep URL structure clean
- Use standard language codes
- Ensure each language version has a unique URL

## Debugging Tips

If path mapping isn't working:

1. Check browser console for errors
2. Confirm directory structure matches configuration
3. Verify VitePress and plugin configurations are consistent
4. Check language preference in cookies

## Example Project

Check out the [demo](https://github.com/xbghc/vue-auto-i18n-router/tree/main/packages/demo) project for complete configuration examples.