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
    
    // Extract language code (e.g., 'en-US' -> 'en')
    const shortLang = lang.toLowerCase().split('-')[0]
    
    return shortLang || null
  }
  
}