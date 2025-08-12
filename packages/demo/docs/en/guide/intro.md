# Introduction

VitePress Auto i18n Router is a plugin that provides automatic internationalization routing for VitePress static sites. It helps you easily create multi-language documentation sites without manually managing complex route configurations.

## Core Features

### 🎯 Unified URL Structure

All language versions use consistent URL prefix structure:

- `/zh/` - Chinese version
- `/en/` - English version
- `/` - Auto-redirect to appropriate language

### 🔍 Smart Language Detection

The plugin automatically detects user language preferences:

1. First checks user's previous selection (stored in localStorage)
2. Then detects browser language settings
3. Finally falls back to default language

### 🚀 Automation Features

- **Automatic Route Mapping**: Scan document directories and generate multi-language routes
- **Smart Redirect**: Auto-redirect based on user preferences
- **Language Switcher**: Auto-inject into navigation bar or sidebar
- **SEO Optimization**: Auto-generate hreflang tags

## How It Works

When users visit your site:

1. If URL has no language prefix (e.g., `/guide/intro`), the plugin auto-detects appropriate language and redirects
2. If user switches language, the plugin remembers the choice and applies it on next visit
3. Each page automatically generates corresponding multi-language links

## Why Choose This Plugin?

- **Easy to Use**: Minimal configuration, maximum functionality
- **Excellent Performance**: Routes generated at build time, minimal runtime overhead
- **Developer Friendly**: Clear TypeScript types and error messages
- **Fully Compatible**: Works perfectly with all VitePress features