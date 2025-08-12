---
layout: home

hero:
  name: VitePress Auto i18n Router
  text: Automatic Language Detection & Routing
  tagline: Zero-config internationalization for VitePress static sites
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/getting-started
    - theme: alt
      text: Learn More
      link: /en/guide/intro

features:
  - title: ✨ Automatic Language Detection
    details: Intelligently detects user's language preference and redirects to the appropriate version
  - title: 🚀 Zero Configuration
    details: Works out of the box - add multi-language support to your VitePress site in just 3 steps
  - title: 💾 Preference Persistence
    details: Remembers user's language choice and automatically uses it on next visit
  - title: ⚡ Performance Optimized
    details: Lightweight implementation with no impact on build size, supports both SSG and SPA modes
  - title: 🎯 SEO Friendly
    details: Uses standard HTTP redirects, maintains clean URLs, search engine friendly
  - title: 🔄 Seamless Switching
    details: Client-side routing in production for instant language switching without page refresh
---

## Why VitePress Auto i18n Router?

Traditional VitePress multi-language setup requires manual handling of routing and language detection. This plugin provides an elegant automated solution, letting you focus on content creation instead of routing configuration.

### Key Benefits

- **Simple Integration** - Just add the plugin and theme enhancement, no need to modify existing code
- **Smart Detection** - Automatically detects and remembers user language preferences
- **Development Friendly** - Works perfectly in both development and production environments
- **Platform Compatible** - Supports all static hosting platforms (GitHub Pages, Netlify, Vercel, etc.)

### Quick Start

```bash
# Install the plugin
pnpm add -D vitepress-auto-i18n-router

# Configure and start
pnpm docs:dev
```

Visit the site root, and the plugin will automatically detect your browser language and redirect to the appropriate version!