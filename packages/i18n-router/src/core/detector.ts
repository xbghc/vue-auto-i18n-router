import type { I18nRouterConfig } from '../types'

/**
 * Browser language detector
 */
export class BrowserLanguageDetector {
  private readonly STORAGE_KEY = 'vitepress-locale'
  
  constructor(private config: I18nRouterConfig) {}
  
  /**
   * Detect the best matching locale
   */
  detect(): string {
    // Check if running in browser
    if (typeof window === 'undefined') {
      return this.config.defaultLocale
    }
    
    // 1. Check saved preference
    const saved = this.getSavedLocale()
    if (saved && this.config.locales.includes(saved)) {
      return saved
    }
    
    // 2. Check browser language
    const browserLocale = this.getBrowserLocale()
    if (browserLocale && this.config.locales.includes(browserLocale)) {
      return browserLocale
    }
    
    // 3. Fallback to default
    return this.config.defaultLocale
  }
  
  /**
   * Get saved locale from localStorage
   */
  getSavedLocale(): string | null {
    if (typeof window === 'undefined') return null
    
    try {
      return localStorage.getItem(this.STORAGE_KEY)
    } catch {
      return null
    }
  }
  
  /**
   * Save locale preference
   */
  saveLocale(locale: string): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, locale)
    } catch {
      // Ignore localStorage errors
    }
  }
  
  /**
   * Get browser locale
   */
  private getBrowserLocale(): string | null {
    if (typeof navigator === 'undefined') return null
    
    // Get browser language
    const lang = navigator.language || (navigator as any).userLanguage || ''
    if (!lang) return null
    
    // Normalize format: en_US -> en-US, zh_CN -> zh-CN
    const normalizedLang = lang.replace('_', '-')
    
    // Try exact match first (e.g., zh-CN matches zh-CN)
    for (const locale of this.config.locales) {
      if (locale.toLowerCase() === normalizedLang.toLowerCase()) {
        return locale
      }
    }
    
    // Try language family match (e.g., zh-HK matches zh-TW if available)
    const langPrefix = normalizedLang.toLowerCase().split('-')[0]
    for (const locale of this.config.locales) {
      if (locale.toLowerCase().startsWith(langPrefix + '-')) {
        return locale
      }
    }
    
    // Try simple language match (e.g., zh matches zh if available)
    for (const locale of this.config.locales) {
      if (locale.toLowerCase() === langPrefix) {
        return locale
      }
    }
    
    return null
  }
  
}