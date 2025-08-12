export interface I18nRouterConfig {
  /**
   * List of supported locales
   */
  locales: string[]
  
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