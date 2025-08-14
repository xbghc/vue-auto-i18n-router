# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for **vitepress-auto-i18n-router**, a Vite plugin that provides automatic language detection and routing for VitePress static sites. The project consists of two packages:

1. **`packages/i18n-router`** - The core library that provides the Vite plugin and VitePress theme enhancements
2. **`packages/demo`** - A demo VitePress site showcasing the library's functionality

## Development Commands

### Monorepo Root Commands
```bash
# Install dependencies (uses pnpm)
pnpm install

# Run demo VitePress dev server (most common for testing)
pnpm docs:dev

# Build VitePress documentation
pnpm docs:build

# Run demo Vue app
pnpm dev

# Build the i18n-router library
pnpm build
```

### Working in packages/demo
```bash
# VitePress documentation commands
pnpm docs:dev      # Start VitePress dev server (port 5173)
pnpm docs:build    # Build static site
pnpm docs:preview  # Preview built site (port 4173)

# Vue app commands (less commonly used)
pnpm dev           # Vue app dev server
pnpm build         # Build Vue app
pnpm test:unit     # Run Vitest tests
pnpm test:e2e      # Run Playwright tests
pnpm type-check    # TypeScript type checking
pnpm lint          # ESLint
pnpm format        # Prettier formatting
```

### Working in packages/i18n-router
```bash
pnpm build         # Build the library
pnpm type-check    # TypeScript type checking
pnpm dev           # Watch mode build
```

## Architecture Overview

### Core Library Structure (packages/i18n-router)

The library provides automatic i18n routing through three main components:

1. **Vite Plugin** (`src/plugin.ts`)
   - Provides development server middleware that intercepts requests
   - Detects user language from cookies or Accept-Language headers
   - Supports full language-region codes (e.g., `zh-CN`, `en-US`) with intelligent fallback
   - Redirects root path (`/`) to appropriate locale (`/zh-CN/` or `/en-US/`)
   - Skips processing for static assets, Vite internals (`/@`, `/__`), and VitePress internals (`/.vitepress/`)

2. **VitePress Theme Enhancement** (`src/vitepress/index.ts`)
   - Extends the default VitePress theme
   - Tracks user language preference in localStorage and cookies
   - In production, handles client-side routing for language detection
   - Automatically redirects root path visits based on saved preference or browser language

3. **Composables API** (`src/composables.ts`, exported via `src/client.ts`)
   - Provides `useI18nRouter()` composable for Vue components
   - Must be imported from `/client` path to avoid server-side loading issues
   - Enables custom language switchers with reactive state

### How It Works

**Development Environment:**
- Server-side middleware handles all routing
- Detects language preference from cookies first, then Accept-Language header
- Returns HTTP redirects (302 for root, 301 for paths without trailing slash)

**Production Environment:**
- Client-side JavaScript in the VitePress theme handles detection
- Uses VitePress router for SPA navigation (no page refresh)
- Reads language config from `window.__VP_SITE_DATA__`

### Key Implementation Details

1. **Language Detection Priority:**
   - Saved preference (cookie/localStorage)
   - Browser language (Accept-Language/navigator.language)
   - Default locale from config

2. **Language Matching Strategy:**
   - **Exact match**: `zh-CN` matches `zh-CN` exactly
   - **Language family match**: `zh-HK` or `zh-TW` falls back to `zh-CN` if `zh-TW` is not configured
   - **Simple language match**: `zh` matches `zh-CN` if only `zh-CN` is configured
   - This allows supporting specific regions while providing intelligent fallbacks

3. **Path Handling:**
   - The middleware must skip `.vitepress` paths to avoid breaking VitePress's module loading
   - Paths like `/en-US` are redirected to `/en-US/` (with trailing slash)
   - Static assets and Vite special paths are passed through unchanged

4. **Core Files and Their Roles:**
   - `src/plugin.ts` - Main plugin implementation with dev server middleware
   - `src/core/router.ts` - Route parsing and generation logic
   - `src/core/detector.ts` - Browser language detection utilities
   - `src/core/LocalePathMapper.ts` - Bidirectional locale-to-path mapping with intelligent matching
   - `src/vitepress/index.ts` - Theme enhancement for client-side routing
   - `src/composables.ts` - Vue composable for language switching
   - `src/client.ts` - Client-side only exports (composables)
   - `src/types.ts` - TypeScript definitions
   - `src/index.ts` - Main package entry point (server-safe exports)

### Integration in Demo Site

The demo site uses the library in multiple ways:

1. **VitePress Config** (`docs/.vitepress/config.ts`):
   ```typescript
   vite: {
     plugins: [
       vitepressAutoI18nRouter({
         // Array format (locale as path)
         locales: ['zh-CN', 'en-US'],
         // OR object format (custom path mapping)
         locales: { 'zh-CN': 'zh', 'en-US': 'en' },
         defaultLocale: 'zh-CN'
       })
     ]
   }
   ```

2. **VitePress Theme** (`docs/.vitepress/theme/index.ts`):
   ```typescript
   export { default } from 'vitepress-auto-i18n-router/vitepress'
   ```

3. **Custom Components** (Vue files):
   ```typescript
   import { useI18nRouter } from 'vitepress-auto-i18n-router/client'
   const { switchLocale, currentLocale, availableLocales } = useI18nRouter()
   ```

## Package Management

- Uses **pnpm** as the package manager (not npm or yarn)
- Monorepo managed via `pnpm-workspace.yaml`
- Internal packages referenced with `workspace:*` protocol

## Node Version Requirements

- Node.js: ^20.19.0 || >=22.12.0

## Build & Test Automation

- **Pre-commit hook** (via Husky): Automatically runs `pnpm docs:build` before each commit to ensure the documentation builds successfully
- **GitHub Actions**: Deploy workflow builds and publishes to GitHub Pages on push to main branch
- **GitHub Pages base path**: Automatically sets base URL to `/vue-auto-i18n-router/` when `GITHUB_ACTIONS` env var is present

## Known Issues and Solutions

1. **MIME Type Errors in Development:**
   - Symptom: "Expected a JavaScript module but got text/html"
   - Cause: VitePress requests like `/en-US/.vitepress/cache/deps/...` being intercepted
   - Solution: Middleware skips any path containing `/.vitepress/`

2. **Production Build:**
   - The `generateBundle` hook doesn't work with VitePress (it generates its own index.html)
   - Production routing relies entirely on client-side JavaScript in the theme

3. **Import Errors with Composables:**
   - Symptom: "does not provide an export named 'useData'" when importing from main package
   - Cause: VitePress client APIs cannot be imported in server/config context
   - Solution: Import composables from `/client` path: `'vitepress-auto-i18n-router/client'`

## Important Configuration Notes

1. **Path Mapping Consistency:**
   - Plugin `locales` config must match VitePress `locales` keys
   - When using custom paths, both configs must align:
     ```typescript
     // VitePress locales
     locales: { 'zh': {...}, 'en': {...} }
     // Plugin config
     locales: { 'zh-CN': 'zh', 'en-US': 'en' }
     ```

2. **Directory Structure:**
   - Must match the configured paths (e.g., `/zh/` requires `docs/zh/` directory)
   - Each locale directory needs its own `index.md`

3. **Sidebar Configuration:**
   - VitePress sidebars are path-based
   - Need separate configs for each path pattern (`/zh-CN/guide/`, `/zh-CN/api/`, etc.)