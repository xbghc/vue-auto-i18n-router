/// <reference types="vite/client" />
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

/**
 * Enhanced VitePress theme with automatic locale tracking
 * 
 * Usage in .vitepress/theme/index.ts:
 * ```ts
 * export { default } from 'vitepress-auto-i18n-router/vitepress'
 * ```
 */
const EnhancedTheme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    // Track and save locale preference on client side
    if (!import.meta.env.SSR) {
      const saveLocalePreference = (locale: string) => {
        localStorage.setItem('vitepress-preferred-lang', locale)
        document.cookie = `vitepress-locale=${locale};path=/;max-age=31536000`
      }
      
      const extractLocaleFromPath = (path: string): string | null => {
        const match = path.match(/^\/([\w-]+)\//)
        return match ? match[1] : null
      }
      
      // Auto-redirect on initial load if needed (for production)
      const currentPath = window.location.pathname
      const currentLocale = extractLocaleFromPath(currentPath)
      
      // If no locale in path (e.g., visiting root "/" in production)
      if (!currentLocale && currentPath === '/') {
        // Get available locales from VitePress config
        const siteData = (window as any).__VP_SITE_DATA__
        const locales = siteData?.locales ? Object.keys(siteData.locales) : ['zh', 'en']
        const defaultLocale = locales[0] || 'zh'
        
        // Detect user preference
        let targetLocale = defaultLocale
        
        // 1. Check saved preference
        const savedLocale = localStorage.getItem('vitepress-preferred-lang')
        if (savedLocale && locales.includes(savedLocale)) {
          targetLocale = savedLocale
        } else {
          // 2. Check browser language with intelligent matching
          const browserLang = (navigator.language || '').replace('_', '-')
          
          // Try exact match first (e.g., zh-CN matches zh-CN)
          const exactMatch = locales.find(l => l.toLowerCase() === browserLang.toLowerCase())
          if (exactMatch) {
            targetLocale = exactMatch
          } else {
            // Try language family match (e.g., zh-HK matches zh-TW)
            const langPrefix = browserLang.toLowerCase().split('-')[0]
            const familyMatch = locales.find(l => l.toLowerCase().startsWith(langPrefix + '-'))
            if (familyMatch) {
              targetLocale = familyMatch
            } else {
              // Try simple language match (e.g., zh matches zh)
              const simpleMatch = locales.find(l => l.toLowerCase() === langPrefix)
              if (simpleMatch) {
                targetLocale = simpleMatch
              }
            }
          }
        }
        
        // Redirect to locale version
        router.go(`/${targetLocale}/`)
        return // Exit early to avoid saving incorrect locale
      }
      
      // Use router's onAfterRouteChange hook
      router.onAfterRouteChange = (to: string) => {
        const locale = extractLocaleFromPath(to)
        if (locale) {
          saveLocalePreference(locale)
        }
      }
      
      // Save initial locale if we have one
      if (currentLocale) {
        saveLocalePreference(currentLocale)
      }
    }
  }
}

export default EnhancedTheme

/**
 * Enhance an existing VitePress theme with locale tracking
 * 
 * Usage:
 * ```ts
 * import CustomTheme from './MyTheme'
 * import { enhanceWithI18n } from 'vitepress-auto-i18n-router/vitepress'
 * 
 * export default enhanceWithI18n(CustomTheme)
 * ```
 */
export function enhanceWithI18n(theme: Theme): Theme {
  const originalEnhanceApp = theme.enhanceApp
  
  return {
    ...theme,
    enhanceApp(ctx) {
      // Call original enhanceApp if exists
      if (originalEnhanceApp) {
        originalEnhanceApp(ctx)
      }
      
      // Add locale tracking
      EnhancedTheme.enhanceApp?.(ctx)
    }
  }
}