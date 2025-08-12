import type { I18nRouterConfig } from './types'
import { createI18nRouterPlugin } from './plugin'

// Export types
export * from './types'

// Export core classes (for advanced users)
export { RouteParser } from './core/router'
export { BrowserLanguageDetector } from './core/detector'

/**
 * VitePress Auto i18n Router Plugin
 * Returns any to be compatible with different Vite versions
 */
export function vitepressAutoI18nRouter(config: I18nRouterConfig): any {
  // Validate config
  if (!config.locales || config.locales.length === 0) {
    throw new Error('At least one locale must be configured')
  }
  
  if (!config.defaultLocale) {
    throw new Error('Default locale must be specified')
  }
  
  if (!config.locales.includes(config.defaultLocale)) {
    throw new Error('Default locale must be one of the configured locales')
  }
  
  // Create and return the plugin
  return createI18nRouterPlugin(config)
}

// Default export
export default vitepressAutoI18nRouter