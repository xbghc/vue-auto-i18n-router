export interface I18nRouterConfig {
  /**
   * Supported locales configuration
   * - Array format: ['zh-CN', 'en-US'] (locales as directory names)
   * - Object format: { 'zh-CN': 'cn', 'en-US': 'en' } (locale to directory mapping)
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

export interface InternalConfig {
  locales: string[]
  pathToLocale: Record<string, string>
  localeToPath: Record<string, string>
  defaultLocale: string
  localeNames?: Record<string, string>
  rewrites?: Record<string, string>
  switcherPosition?: 'nav' | 'sidebar' | 'none'
}

export interface LocaleRoute {
  locale: string
  url: string
  active: boolean
}