import type { ParsedRoute, InternalConfig } from '../types'

/**
 * Route parser for extracting locale and path from URL
 */
export class RouteParser {
  constructor(private config: InternalConfig) {}
  
  /**
   * Parse URL to extract locale and path
   */
  parse(url: string): ParsedRoute {
    // Remove query and hash
    const cleanUrl = url.split('?')[0].split('#')[0]
    
    // Get all possible paths from the mapping
    const paths = Object.keys(this.config.pathToLocale)
    
    // Check if URL has path prefix
    const pathPattern = new RegExp(`^/(${paths.join('|')})(/.*)?$`)
    const match = cleanUrl.match(pathPattern)
    
    if (match) {
      const pathSegment = match[1]
      const locale = this.config.pathToLocale[pathSegment]
      return {
        locale,
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
    
    // Get the path segment for this locale
    const pathSegment = this.config.localeToPath[locale]
    
    // For index page
    if (normalizedPath === '/') {
      return `/${pathSegment}/`
    }
    
    // For other pages
    return `/${pathSegment}${normalizedPath}`
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