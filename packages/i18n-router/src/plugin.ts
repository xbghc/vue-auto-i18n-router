import type { I18nRouterConfig } from './types'
import type { ViteDevServer } from 'vite'
import { RouteParser } from './core/router'

/**
 * Create middleware for dev server
 */
function createDevMiddleware(config: I18nRouterConfig) {
  const parser = new RouteParser(config)
  
  return (req: any, res: any, next: any) => {
    const url = req.url || ''
    
    // Skip static assets and special paths
    if (
      url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
      url.startsWith('/@') ||
      url.startsWith('/__') ||
      url.includes('/.vitepress/')  // Skip VitePress internal paths
    ) {
      return next()
    }
    
    // Parse URL
    const { locale, path } = parser.parse(url)
    
    // Handle locale without trailing slash (e.g., /en -> /en/)
    if (locale && !url.endsWith('/') && path === '/') {
      res.writeHead(301, { Location: `/${locale}/` })
      res.end()
      return
    }
    
    // Handle root path and paths without locale prefix
    if (!locale) {
      // For root path, check cookie first, then browser language
      let targetLocale = config.defaultLocale
      
      // Check cookie for saved preference
      const cookies = req.headers.cookie || ''
      const savedLocale = cookies.split(';')
        .find((c: string) => c.trim().startsWith('vitepress-locale='))
        ?.split('=')[1]
      
      if (savedLocale && config.locales.includes(savedLocale)) {
        targetLocale = savedLocale
      } else {
        // Detect from Accept-Language header
        const acceptLanguage = req.headers['accept-language'] || ''
        const browserLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase()
        
        if (config.locales.includes(browserLang)) {
          targetLocale = browserLang
        }
      }
      
      // Redirect to locale version
      const targetUrl = parser.generate(targetLocale, url)
      res.writeHead(302, { Location: targetUrl })
      res.end()
      return
    }
    
    next()
  }
}

/**
 * Main plugin implementation
 */
export function createI18nRouterPlugin(config: I18nRouterConfig): any {
  return {
    name: 'vitepress-auto-i18n-router',
    
    // Configure dev server
    configureServer(server: ViteDevServer) {
      // Add middleware for language detection and redirect
      server.middlewares.use(createDevMiddleware(config))
    }
  }
}