import type { ParsedRoute, I18nRouterConfig } from '../types'
import { LocalePathMapper } from './LocalePathMapper'

/**
 * Route parser for extracting locale and path from URL
 */
export class RouteParser {
  private mapper: LocalePathMapper
  
  constructor(config: I18nRouterConfig) {
    this.mapper = new LocalePathMapper(config.locales)
  }
  
  /**
   * Parse URL to extract locale and path
   */
  parse(url: string): ParsedRoute {
    // Remove query and hash
    const cleanUrl = url.split('?')[0].split('#')[0]
    
    // Check if URL has locale prefix using paths from mapper
    const paths = this.mapper.getAllPaths()
    const pathPattern = new RegExp(`^/(${paths.join('|')})(/.*)?$`)
    const match = cleanUrl.match(pathPattern)
    
    if (match) {
      const matchedPath = match[1]
      // Get locale code from the matched path
      const locale = this.mapper.getLocaleForPath(matchedPath) || ''
      return {
        locale: locale,
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
    // Get the URL path for this locale
    const urlPath = this.mapper.getPathForLocale(locale) || locale
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    
    // For index page
    if (normalizedPath === '/') {
      return `/${urlPath}/`
    }
    
    // For other pages
    return `/${urlPath}${normalizedPath}`
  }
  
  /**
   * Get alternate URLs for all locales
   */
  getAlternateUrls(currentUrl: string): Record<string, string> {
    const { path } = this.parse(currentUrl)
    const alternates: Record<string, string> = {}
    
    // Use all locale codes from mapper
    for (const locale of this.mapper.getAllLocales()) {
      alternates[locale] = this.generate(locale, path)
    }
    
    return alternates
  }
}