export interface I18nRouterConfig {
  /**
   * List of supported locales
   * Can be an array of locale codes or an object mapping locale codes to URL paths
   * Examples:
   * - Array: ['zh-CN', 'en-US'] - uses locale codes as URL paths
   * - Object: { 'zh-CN': 'zh', 'en-US': 'en' } - maps zh-CN to /zh/, en-US to /en/
   */
  locales: string[] | Record<string, string>
  
  /**
   * Default locale
   */
  defaultLocale: string
  
  /**
   * Locale display names for UI
   */
  localeNames?: Record<string, string>
  
  /**
   * Custom route rewrites
   */
  rewrites?: Record<string, string>
  
  /**
   * Position of locale switcher component
   * @default 'nav'
   */
  switcherPosition?: 'nav' | 'sidebar' | 'none'
}

export interface ParsedRoute {
  locale: string
  path: string
}

export interface LocaleRoute {
  locale: string
  url: string
  active: boolean
}