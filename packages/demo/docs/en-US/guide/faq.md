# Frequently Asked Questions

## Basic Questions

### What does this plugin do?

vitepress-auto-i18n-router is a VitePress plugin that provides:
- Automatic detection of user's language preference
- Smart redirection to the appropriate language version
- Remembering user's language choice
- Support for custom URL path mapping

### How is it different from VitePress native i18n?

VitePress native i18n requires users to manually select a language. This plugin adds:
- **Automatic language detection**: Auto-selects based on browser language
- **Preference memory**: Remembers user's choice
- **Smart matching**: Supports language family matching (e.g., zh-HK → zh-CN)
- **Path mapping**: Supports custom URL structures

## Configuration Issues

### Why isn't language switching working?

Check the following:

1. **Configuration consistency**: Ensure plugin config matches VitePress locales config
2. **Directory structure**: Confirm document directories match configured paths
3. **Theme integration**: Confirm theme is correctly exported

```typescript
// ✅ Correct configuration
// VitePress locales
locales: {
  'zh-CN': { link: '/zh-CN/' },
  'en-US': { link: '/en-US/' }
}

// Plugin config
locales: ['zh-CN', 'en-US']
```

### How to use custom paths?

Use object format for locales configuration:

```typescript
vitepressAutoI18nRouter({
  locales: {
    'zh-CN': 'zh',  // /zh-CN/ → /zh/
    'en-US': 'en'   // /en-US/ → /en/
  },
  defaultLocale: 'zh-CN'
})
```

Also adjust VitePress configuration and directory structure accordingly.

### Where does the plugin configuration go?

In `.vitepress/config.ts` under `vite.plugins`:

```typescript
export default defineConfig({
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        // configuration options
      })
    ]
  }
})
```

## Usage Questions

### How to create a custom language switcher?

Use the `useI18nRouter` composable:

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

### How to get language display names?

Use VitePress's `useData`:

```vue
<script setup>
import { useData } from 'vitepress'
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { site } = useData()
const { currentLocale } = useI18nRouter()

// Get current language display name
const currentLocaleName = computed(() => {
  return site.value.locales[currentLocale.value]?.label || currentLocale.value
})
</script>
```

### Where are language preferences saved?

Saved in two places:
- **Cookie**: `vitepress-locale` (expires in 1 year)
- **LocalStorage**: `vitepress-preferred-lang`

### How to clear language preferences?

Execute in browser console:

```javascript
// Clear cookie
document.cookie = 'vitepress-locale=; max-age=0; path=/'

// Clear localStorage
localStorage.removeItem('vitepress-preferred-lang')
```

## Compatibility Issues

### Which VitePress versions are supported?

Supports VitePress 1.0.0 and above.

### Does it support SSR/SSG?

- **Development mode**: Supported via server middleware
- **Production mode**: Supported via client-side JavaScript
- Fully compatible with VitePress static site generation

### What if it conflicts with other Vite plugins?

Ensure correct plugin order, typically place this plugin last:

```typescript
plugins: [
  otherPlugin1(),
  otherPlugin2(),
  vitepressAutoI18nRouter({...})  // Place last
]
```

## Advanced Usage

### How to implement more complex language matching logic?

Use the `LocalePathMapper` class:

```typescript
import { LocalePathMapper } from 'vitepress-auto-i18n-router'

const mapper = new LocalePathMapper({
  'zh-CN': 'zh',
  'zh-TW': 'zh-tw',
  'en-US': 'en'
})

// Custom matching logic
function customMatch(browserLang: string): string {
  // Your custom logic
  return mapper.findBestMatchingLocale(browserLang) || 'en-US'
}
```

### How to use outside VitePress environment?

Core classes can be used independently:

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

### How to debug language detection?

Check in browser console:

```javascript
// View current saved language preference
console.log('Cookie:', document.cookie)
console.log('LocalStorage:', localStorage.getItem('vitepress-preferred-lang'))

// View browser language
console.log('Browser language:', navigator.language)
console.log('Browser languages:', navigator.languages)
```

## Troubleshooting

### "Expected a JavaScript module but got text/html" error

This usually happens when middleware intercepts requests it shouldn't. Ensure:
1. Plugin configuration is correct
2. Directory structure matches configuration
3. No other middleware conflicts

### Page keeps redirecting

Possible causes:
1. Configured `defaultLocale` is not in `locales` list
2. VitePress config doesn't match plugin config
3. Incorrect directory structure

### Doesn't work in production

Confirm:
1. Properly built: `pnpm docs:build`
2. Theme is correctly exported
3. Production server supports client-side routing

## Performance Optimization

### How to reduce redirects?

1. Use shorter paths (e.g., `/zh/` instead of `/zh-CN/`)
2. Set reasonable cookie expiration time
3. Consider using CDN geolocation features

### Does it affect SEO?

No. The plugin:
- Uses standard HTTP redirects
- Maintains separate URLs for each language version
- Supports search engine crawlers

## Contributing & Support

### How to report issues?

Submit issues on [GitHub Issues](https://github.com/xbghc/vue-auto-i18n-router/issues).

### How to contribute code?

1. Fork the project
2. Create a feature branch
3. Submit a Pull Request

### Where to get help?

- Check the [documentation](https://github.com/xbghc/vue-auto-i18n-router)
- Submit an [Issue](https://github.com/xbghc/vue-auto-i18n-router/issues)
- Check the [example project](https://github.com/xbghc/vue-auto-i18n-router/tree/main/packages/demo)