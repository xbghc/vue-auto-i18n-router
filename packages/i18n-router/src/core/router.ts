import type { ParsedRoute, I18nRouterConfig } from '../types'

/**
 * Route parser for extracting locale and path from URL
 */
export class RouteParser {
  constructor(private config: I18nRouterConfig) {}
  
  /**
   * Parse URL to extract locale and path
   */
  parse(url: string): ParsedRoute {
    // Remove query and hash
    const cleanUrl = url.split('?')[0].split('#')[0]
    
    // Check if URL has locale prefix
    const localePattern = new RegExp(`^/(${this.config.locales.join('|')})(/.*)?$`)
    const match = cleanUrl.match(localePattern)
    
    if (match) {
      return {
        locale: match[1],
        path: match[2] || '/'
      }
    }
    
    // No locale prefix found
    return {
      locale: '',
      path: cleanUrl
    }
  }
  
  /**
   * Generate URL with locale prefix
   */
  generate(locale: string, path: string): string {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    
    // For index page
    if (normalizedPath === '/') {
      return `/${locale}/`
    }
    
    // For other pages
    return `/${locale}${normalizedPath}`
  }
  
  /**
   * Get alternate URLs for all locales
   */
  getAlternateUrls(currentUrl: string): Record<string, string> {
    const { path } = this.parse(currentUrl)
    const alternates: Record<string, string> = {}
    
    for (const locale of this.config.locales) {
      alternates[locale] = this.generate(locale, path)
    }
    
    return alternates
  }
}