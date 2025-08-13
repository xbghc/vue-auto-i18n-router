# GitHub Pages Deployment

This guide explains how to deploy a VitePress site using vitepress-auto-i18n-router to GitHub Pages.

## Setup Steps

### 1. Update VitePress Configuration

Set the correct `base` path in `.vitepress/config.ts`:

```typescript
export default defineConfig({
  // For GitHub Pages, use your repository name
  base: process.env.GITHUB_ACTIONS ? '/your-repo-name/' : '/',
  
  // ... other configuration
})
```

::: tip Why is base configuration needed?
GitHub Pages project sites have the URL structure `https://username.github.io/repository-name/`, not the root path.

Without `base` configuration:
- All assets (CSS, JS, images) will 404
- Navigation links will point to wrong paths
- Language switching will fail

The `process.env.GITHUB_ACTIONS` environment variable allows us to:
- Use `/` for local development
- Automatically use `/repository-name/` when building in GitHub Actions
:::

::: tip
Replace `your-repo-name` with your GitHub repository name.
:::

### 2. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml` in your project root:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or your default branch
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
        with:
          fetch-depth: 0

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

      - name: Build VitePress site
        run: pnpm docs:build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist  # adjust to your build output path

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

### 3. Configure GitHub Pages

1. Go to your GitHub repository Settings
2. Find the "Pages" section
3. Under "Source", select "GitHub Actions"
4. Save the settings

### 4. Push Your Code

Push your code to the main branch, and GitHub Actions will automatically build and deploy your site.

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

## Verify Deployment

After deployment, your site will be accessible at:

```
https://[your-username].github.io/[repository-name]/
```

### Test Multi-language Features

1. Visit the root path - should auto-redirect to default language
2. Manually visit different language versions (e.g., `/zh-CN/`, `/en-US/`)
3. Verify language switching works correctly

## Troubleshooting

### 404 Errors

If you encounter 404 errors, check:
- `base` configuration is correct
- GitHub Pages is enabled
- Deployment workflow completed successfully

### Language Redirect Not Working

In static hosting environments, automatic language redirect relies on client-side JavaScript. Ensure:
- VitePress theme is properly enhanced
- JavaScript is enabled
- Browser supports modern JavaScript features

### Custom Domain

If using a custom domain:

1. Create a `CNAME` file in `docs/.vitepress/public/`
2. Add your domain (e.g., `example.com`)
3. Update `base` configuration to `/`

```typescript
base: '/',  // Use root path for custom domain
```

## Alternative Deployment Options

Besides GitHub Pages, you can deploy to:

- **Netlify**: Supports server-side redirect rules
- **Vercel**: Provides edge function support
- **Cloudflare Pages**: Supports custom routing rules

These platforms may provide better server-side language detection support.

## Example Project

Check out the [demo](https://github.com/xbghc/vue-auto-i18n-router) project for complete configuration examples.