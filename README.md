# vitepress-auto-i18n-router

Automatic language detection and routing for VitePress static sites.

## Features

- 🌍 **Automatic Language Detection** - Detects user's preferred language from browser settings
- 🔄 **Smart Routing** - Automatically redirects to the appropriate language version
- 💾 **Preference Memory** - Remembers user's language choice across sessions
- 🎯 **Flexible Path Mapping** - Support custom URL paths for different languages
- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 🎨 **Vue Composables** - Easy-to-use API for custom language switchers
- 🔧 **VitePress Native** - Seamlessly integrates with VitePress's i18n features

## Installation

```bash
npm install vitepress-auto-i18n-router
# or
pnpm add vitepress-auto-i18n-router
# or
yarn add vitepress-auto-i18n-router
```

## Quick Start

### 1. Configure the Plugin

In your `.vitepress/config.ts`:

```typescript
import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

export default defineConfig({
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh-CN', 'en-US'],
        defaultLocale: 'zh-CN'
      })
    ]
  }
})
```

### 2. Extend the Theme

In your `.vitepress/theme/index.ts`:

```typescript
export { default } from 'vitepress-auto-i18n-router/vitepress'
```

## Advanced Usage

### Custom Path Mapping

Map language codes to custom URL paths:

```typescript
vitepressAutoI18nRouter({
  locales: {
    'zh-CN': 'zh',    // zh-CN language -> /zh/ path
    'en-US': 'en',    // en-US language -> /en/ path
    'ja-JP': 'ja'     // ja-JP language -> /ja/ path
  },
  defaultLocale: 'zh-CN'
})
```

### Vue Composables

Create custom language switchers with the built-in composable:

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale, currentLocale, availableLocales } = useI18nRouter()
</script>

<template>
  <select :value="currentLocale" @change="e => switchLocale(e.target.value)">
    <option v-for="locale in availableLocales" :key="locale" :value="locale">
      {{ locale }}
    </option>
  </select>
</template>
```

### Custom Theme Integration

If you have a custom theme:

```typescript
import CustomTheme from './MyTheme'
import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'

export default enhanceWithI18n(CustomTheme)
```

## How It Works

1. **Development Mode**: A Vite middleware intercepts requests and redirects based on language preference
2. **Production Mode**: Client-side JavaScript handles language detection and routing
3. **Language Detection Priority**:
   - Saved preference (cookie/localStorage)
   - Browser language (Accept-Language header)
   - Default locale from configuration

## API Reference

### Plugin Configuration

```typescript
interface I18nRouterConfig {
  // Array format: uses locale codes as paths
  // Object format: maps locale codes to custom paths
  locales: string[] | Record<string, string>
  
  // Default locale to use when no preference is detected
  defaultLocale: string
}
```

### Composables

```typescript
function useI18nRouter(): {
  // Currently active locale
  currentLocale: ComputedRef<string | null>
  
  // All available locales
  availableLocales: ComputedRef<string[]>
  
  // Switch to a different locale
  switchLocale: (locale: string) => void
}
```

## Language Matching Strategy

The plugin uses intelligent language matching:

1. **Exact match**: `zh-CN` matches `zh-CN` exactly
2. **Language family match**: `zh-HK` falls back to `zh-CN` if available
3. **Simple language match**: `zh` matches `zh-CN` if configured

## Requirements

- VitePress 1.0.0 or higher
- Vue 3.3.0 or higher
- Vite 5.0.0 or higher

## Examples

Check out the [demo site](packages/demo) for a complete working example.

## Development

```bash
# Clone the repository
git clone https://github.com/xbghc/vue-auto-i18n-router.git

# Install dependencies
pnpm install

# Run demo site
pnpm docs:dev

# Build library
pnpm build
```

## License

MIT License © 2024-present

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Built with ❤️ for the VitePress community.