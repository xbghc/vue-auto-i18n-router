# Getting Started

This guide will help you add automatic multi-language routing to your VitePress site in just 5 minutes.

## Installation

Install the plugin using your favorite package manager:

```bash
# pnpm (recommended)
pnpm add -D vitepress-auto-i18n-router

# npm
npm install -D vitepress-auto-i18n-router

# yarn
yarn add -D vitepress-auto-i18n-router
```

## Three-Step Setup

### Step 1: Configure VitePress

Add the plugin to your VitePress config file:

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

export default defineConfig({
  title: 'My Docs',
  
  // Configure VitePress native locales
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-CN/'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en-US/'
    }
  },
  
  // Add the auto-routing plugin
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

### Step 2: Enhance the Theme

Create or modify `.vitepress/theme/index.ts`:

```typescript
// .vitepress/theme/index.ts

// The simplest way - use the enhanced theme directly
export { default } from 'vitepress-auto-i18n-router/vitepress'
```

Or if you have a custom theme:

```typescript
// .vitepress/theme/index.ts
import MyTheme from './MyTheme'
import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'

export default enhanceWithI18n(MyTheme)
```

### Step 3: Organize Document Structure

Organize your documentation by language:

```
docs/
├── index.md          # Root page (will auto-redirect)
├── zh/               # Chinese content
│   ├── index.md      
│   ├── guide/
│   │   └── intro.md
│   └── api/
│       └── config.md
└── en/               # English content
    ├── index.md      
    ├── guide/
    │   └── intro.md
    └── api/
        └── config.md
```

## Run the Project

```bash
# Development mode
pnpm docs:dev

# Build for production
pnpm docs:build

# Preview production build
pnpm docs:preview
```

## Feature Verification

After configuration, you can verify the features:

1. **Auto-redirect**: Visit root path `/`, should automatically redirect to appropriate language version
2. **Language detection**: First visit will auto-select based on browser language
3. **Preference memory**: Refreshing the page maintains previously selected language
4. **Seamless switching**: Use VitePress language switcher for smooth transitions

## Configuration Options

### Basic Configuration

```typescript
interface I18nRouterConfig {
  // Available locale codes
  locales: string[]        // e.g., ['zh-CN', 'en-US', 'ja']
  
  // Default locale (used when detection fails)
  defaultLocale: string    // e.g., 'zh-CN'
}
```

### Complete Example

```typescript
vitepressAutoI18nRouter({
  locales: ['zh-CN', 'en-US', 'ja', 'ko'],
  defaultLocale: 'zh-CN'
})
```

## FAQs

### What should the root index.md contain?

The root `index.md` is just a placeholder file that users will be redirected from. Suggested content:

```markdown
# Redirecting...

Please wait while we detect your language preference...
```

### How to handle asymmetric content?

If some pages only exist in certain languages, the plugin will work normally. Users accessing non-existent pages will see a 404 page.

### Which hosting platforms are supported?

The plugin works on all static hosting platforms:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Self-hosted servers

## Next Steps

- Check the [Introduction](./intro) to understand how it works
- Explore [Advanced Configuration](../api/config) options
- Refer to the [Deployment Guide](../guide/deployment) for production optimization