# Deployment Guide

This guide covers how to deploy sites using VitePress Auto i18n Router on different platforms.

## Building for Production

First, build your VitePress site:

```bash
# Build for production
pnpm docs:build

# Preview the build
pnpm docs:preview
```

The build output will be in the `.vitepress/dist` directory.

## Deployment Platforms

### GitHub Pages

GitHub Pages is the most popular free static site hosting service.

#### 1. Create Deployment Script

Create `.github/workflows/deploy.yml` in your project root:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm docs:build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 2. Configure Base URL

If your project is not deployed at the root path, configure the base:

```typescript
// .vitepress/config.ts
export default defineConfig({
  base: '/your-repo-name/',  // Replace with your repository name
  // ...
})
```

### Netlify

Netlify provides excellent static site hosting with automatic deployments.

#### 1. Create Configuration File

Create `netlify.toml` in your project root:

```toml
[build]
  command = "pnpm docs:build"
  publish = "docs/.vitepress/dist"

[build.environment]
  NODE_VERSION = "20"

# Optimization: Server-side redirect rules
[[redirects]]
  from = "/"
  to = "/zh-CN/"
  status = 302
  conditions = {Language = ["zh", "zh-CN", "zh-TW"]}

[[redirects]]
  from = "/"
  to = "/en-US/"
  status = 302
  conditions = {Language = ["en"]}

[[redirects]]
  from = "/"
  to = "/zh-CN/"
  status = 302

# Handle SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deployment Steps

1. Push code to GitHub
2. Import project in Netlify
3. Auto-detect build settings
4. Click deploy

### Vercel

Vercel is another excellent deployment platform with great Vite support.

#### 1. Create Configuration File

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "pnpm docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "framework": "vitepress",
  "rewrites": [
    {
      "source": "/",
      "destination": "/zh-CN/"
    },
    {
      "source": "/:path((?!zh|en).*)",
      "destination": "/zh-CN/:path"
    }
  ]
}
```

#### 2. Deployment Steps

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` command
3. Follow prompts to complete configuration

### Cloudflare Pages

Cloudflare Pages provides global CDN and excellent performance.

#### 1. Build Configuration

- **Build command:** `pnpm docs:build`
- **Build output directory:** `docs/.vitepress/dist`
- **Environment variables:**
  - `NODE_VERSION`: `20`

#### 2. Redirect Rules

Create `docs/public/_redirects`:

```
/  /zh-CN/  302  Language=zh
/  /en-US/  302  Language=en
/  /zh-CN/  302
```

### Self-hosting (Nginx)

If using your own server, you can use Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/docs;
    index index.html;

    # Language detection and redirect
    location = / {
        # Detect Chinese
        if ($http_accept_language ~* "^zh") {
            return 302 /zh-CN/;
        }
        # Detect English
        if ($http_accept_language ~* "^en") {
            return 302 /en-US/;
        }
        # Default redirect
        return 302 /zh-CN/;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static resource caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm docs:build

# Runtime stage
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Performance Optimization

### 1. Enable Compression

Enable build compression in VitePress configuration:

```typescript
// .vitepress/config.ts
export default defineConfig({
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  }
})
```

### 2. PWA Support

Add PWA support for offline access:

```bash
pnpm add -D @vite-pwa/vitepress
```

```typescript
// .vitepress/config.ts
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(defineConfig({
  // ... your configuration
  pwa: {
    manifest: {
      name: 'VitePress Auto i18n Router',
      short_name: 'i18n Router',
      theme_color: '#5f67ee',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    }
  }
}))
```

### 3. CDN Configuration

Use CDN to accelerate static resources:

```typescript
// .vitepress/config.ts
export default defineConfig({
  vite: {
    build: {
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  }
})
```

## Deployment Checklist

Before deployment, ensure:

- ✅ Local build succeeds (`pnpm docs:build`)
- ✅ Local preview works (`pnpm docs:preview`)
- ✅ All links are correct (no 404s)
- ✅ Language switching works properly
- ✅ Search functionality works
- ✅ If using subpath, `base` is configured
- ✅ Appropriate caching strategy is configured
- ✅ HTTPS is enabled (recommended)

## Common Issues

### 404 Errors

If you encounter 404 errors after deployment:
1. Check if `base` configuration is correct
2. Ensure server has correct fallback rules configured
3. Verify build output directory path

### Language Redirect Not Working

Production language redirect relies on client-side JavaScript. For server-side redirect:
1. Use platform-provided redirect rules (Netlify, Vercel)
2. Configure web server (Nginx, Apache)
3. Use edge functions (Cloudflare Workers)

### Static Resource 404

Ensure:
1. Resource files are in `public` directory
2. Using correct path references
3. Configured correct `base` URL