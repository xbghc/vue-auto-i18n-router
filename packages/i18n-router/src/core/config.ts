import type { I18nRouterConfig, InternalConfig } from '../types'

/**
 * Normalize user config into internal config format
 */
export function normalizeConfig(userConfig: I18nRouterConfig): InternalConfig {
  let locales: string[]
  let pathToLocale: Record<string, string>
  let localeToPath: Record<string, string>

  if (Array.isArray(userConfig.locales)) {
    // Array format: ['zh-CN', 'en-US']
    locales = userConfig.locales
    pathToLocale = {}
    localeToPath = {}
    
    // Use locale as path (existing behavior)
    for (const locale of locales) {
      pathToLocale[locale] = locale
      localeToPath[locale] = locale
    }
  } else {
    // Object format: { 'zh-CN': 'cn', 'en-US': 'en' }
    locales = Object.keys(userConfig.locales)
    pathToLocale = {}
    localeToPath = userConfig.locales
    
    // Create reverse mapping
    for (const [locale, path] of Object.entries(userConfig.locales)) {
      pathToLocale[path] = locale
    }
  }

  return {
    locales,
    pathToLocale,
    localeToPath,
    defaultLocale: userConfig.defaultLocale,
    localeNames: userConfig.localeNames,
    rewrites: userConfig.rewrites,
    switcherPosition: userConfig.switcherPosition
  }
}