import { BiMap } from 'mnemonist'

/**
 * Manages bidirectional mapping between locale codes and URL paths
 * Supports both array format (locale as path) and object format (custom mapping)
 */
export class LocalePathMapper {
  private biMap: BiMap<string, string>
  
  constructor(locales: string[] | Record<string, string>) {
    this.biMap = new BiMap()
    this.initialize(locales)
  }
  
  private initialize(locales: string[] | Record<string, string>) {
    if (Array.isArray(locales)) {
      // Array format: locale code is used as path
      // e.g., ['zh-CN', 'en-US'] -> zh-CN maps to zh-CN, en-US maps to en-US
      locales.forEach(locale => {
        this.biMap.set(locale, locale)
      })
    } else {
      // Object format: explicit mapping
      // e.g., { 'zh-CN': 'zh', 'en-US': 'en' } -> zh-CN maps to zh, en-US maps to en
      Object.entries(locales).forEach(([locale, path]) => {
        this.biMap.set(locale, path)
      })
    }
  }
  
  /**
   * Get URL path for a given locale
   */
  getPathForLocale(locale: string): string | undefined {
    return this.biMap.get(locale)
  }
  
  /**
   * Get locale for a given URL path
   */
  getLocaleForPath(path: string): string | undefined {
    return this.biMap.inverse.get(path)
  }
  
  /**
   * Get all supported locales
   */
  getAllLocales(): string[] {
    return Array.from(this.biMap.keys())
  }
  
  /**
   * Get all URL paths
   */
  getAllPaths(): string[] {
    return Array.from(this.biMap.values())
  }
  
  /**
   * Check if a locale is valid
   */
  isValidLocale(locale: string): boolean {
    return this.biMap.has(locale)
  }
  
  /**
   * Check if a path is valid
   */
  isValidPath(path: string): boolean {
    return this.biMap.inverse.has(path)
  }
  
  /**
   * Get the size of the mapping
   */
  get size(): number {
    return this.biMap.size
  }
  
  /**
   * Find the best matching locale for a given browser language
   * Tries exact match, language family match, and simple language match
   * @param browserLang Browser language code (e.g., 'en-US', 'zh-CN', 'zh-HK')
   * @returns Best matching locale or null if no match found
   */
  findBestMatchingLocale(browserLang: string): string | null {
    // Normalize format: en_US -> en-US
    const normalized = browserLang.replace('_', '-')
    const allLocales = this.getAllLocales()
    
    // 1. Try exact match (e.g., zh-CN matches zh-CN)
    const exactMatch = allLocales.find(
      locale => locale.toLowerCase() === normalized.toLowerCase()
    )
    if (exactMatch) {
      return exactMatch
    }
    
    // 2. Try language family match (e.g., zh-HK matches zh-CN if zh-CN is available)
    const langPrefix = normalized.toLowerCase().split('-')[0]
    const familyMatch = allLocales.find(
      locale => locale.toLowerCase().startsWith(langPrefix + '-')
    )
    if (familyMatch) {
      return familyMatch
    }
    
    // 3. Try simple language match (e.g., 'zh' matches 'zh' if available)
    const simpleMatch = allLocales.find(
      locale => locale.toLowerCase() === langPrefix
    )
    if (simpleMatch) {
      return simpleMatch
    }
    
    return null
  }
}