import type { I18nRouterConfig } from './types'
import type { ViteDevServer } from 'vite'
import { RouteParser } from './core/router'
import { normalizeConfig } from './core/config'

/**
 * Create middleware for dev server
 */
function createDevMiddleware(config: I18nRouterConfig) {
  const internalConfig = normalizeConfig(config)
  const parser = new RouteParser(internalConfig)
  
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
    
    // Handle path without trailing slash (e.g., /en -> /en/)
    if (locale && !url.endsWith('/') && path === '/') {
      const pathSegment = internalConfig.localeToPath[locale]
      res.writeHead(301, { Location: `/${pathSegment}/` })
      res.end()
      return
    }
    
    // Handle root path and paths without locale prefix
    if (!locale) {
      // For root path, check cookie first, then browser language
      let targetLocale = internalConfig.defaultLocale
      
      // Check cookie for saved preference
      const cookies = req.headers.cookie || ''
      const savedLocale = cookies.split(';')
        .find((c: string) => c.trim().startsWith('vitepress-locale='))
        ?.split('=')[1]
      
      if (savedLocale && internalConfig.locales.includes(savedLocale)) {
        targetLocale = savedLocale
      } else {
        // Detect from Accept-Language header
        const acceptLanguage = req.headers['accept-language'] || ''
        const languages = acceptLanguage.split(',').map((lang: string) => {
          const [code] = lang.trim().split(';')
          // Normalize format: en_US -> en-US
          return code.replace('_', '-')
        })
        
        // Try to find best match
        for (const browserLang of languages) {
          // Try exact match (e.g., zh-CN matches zh-CN)
          const exactMatch = internalConfig.locales.find(
            locale => locale.toLowerCase() === browserLang.toLowerCase()
          )
          if (exactMatch) {
            targetLocale = exactMatch
            break
          }
          
          // Try language family match (e.g., zh-HK matches zh-TW)
          const langPrefix = browserLang.toLowerCase().split('-')[0]
          const familyMatch = internalConfig.locales.find(
            locale => locale.toLowerCase().startsWith(langPrefix + '-')
          )
          if (familyMatch) {
            targetLocale = familyMatch
            break
          }
          
          // Try simple language match (e.g., zh matches zh)
          const simpleMatch = internalConfig.locales.find(
            locale => locale.toLowerCase() === langPrefix
          )
          if (simpleMatch) {
            targetLocale = simpleMatch
            break
          }
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
  const internalConfig = normalizeConfig(config)
  
  return {
    name: 'vitepress-auto-i18n-router',
    
    // Configure dev server
    configureServer(server: ViteDevServer) {
      // Add middleware for language detection and redirect
      server.middlewares.use(createDevMiddleware(config))
    },
    
    // Inject config for client-side use
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'i18n-router-config.js',
        source: `window.__I18N_ROUTER_CONFIG__ = ${JSON.stringify(internalConfig)};`
      })
    }
  }
}