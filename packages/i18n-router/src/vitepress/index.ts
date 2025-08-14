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
        // Extract path segment from URL
        const match = path.match(/^\/([\w-]+)\//)
        if (!match) return null
        
        const pathSegment = match[1]
        
        // Get locales from VitePress config
        const siteData = (window as any).__VP_SITE_DATA__
        const locales = siteData?.locales ? Object.keys(siteData.locales) : []
        
        // Check if this path segment is a configured locale
        // VitePress locales object uses the actual path as key
        if (locales.includes(pathSegment)) {
          return pathSegment
        }
        
        // If not found directly, it might be a custom path mapping
        // We need to check if any locale's link matches this path
        for (const locale of locales) {
          const localeConfig = siteData.locales[locale]
          if (localeConfig?.link && localeConfig.link.startsWith(`/${pathSegment}/`)) {
            return locale
          }
        }
        
        return null
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
        
        // Helper function to find best matching locale
        const findBestMatch = (browserLang: string, availableLocales: string[]): string | null => {
          const normalized = browserLang.replace('_', '-')
          
          // 1. Exact match
          const exactMatch = availableLocales.find(l => l.toLowerCase() === normalized.toLowerCase())
          if (exactMatch) return exactMatch
          
          // 2. Language family match
          const langPrefix = normalized.toLowerCase().split('-')[0]
          const familyMatch = availableLocales.find(l => l.toLowerCase().startsWith(langPrefix + '-'))
          if (familyMatch) return familyMatch
          
          // 3. Simple language match
          const simpleMatch = availableLocales.find(l => l.toLowerCase() === langPrefix)
          if (simpleMatch) return simpleMatch
          
          return null
        }
        
        // 1. Check saved preference
        const savedLocale = localStorage.getItem('vitepress-preferred-lang')
        if (savedLocale && locales.includes(savedLocale)) {
          targetLocale = savedLocale
        } else {
          // 2. Check browser language with intelligent matching
          const browserLang = navigator.language || ''
          const match = findBestMatch(browserLang, locales)
          if (match) {
            targetLocale = match
          }
        }
        
        // Redirect to locale version
        // Get base path from site data (includes trailing slash in production)
        const base = siteData?.base || '/'
        // Construct the correct URL with base path
        const targetPath = `${base}${targetLocale}/`.replace('//', '/')
        // Use window.location for full page reload to ensure proper initialization
        window.location.href = targetPath
        return // Exit early to avoid saving incorrect locale
      }
      
      // Save initial locale if we have one  
      if (currentLocale) {
        saveLocalePreference(currentLocale)
      }
      
      // Use router's onAfterRouteChange hook
      router.onAfterRouteChange = (to: string) => {
        const locale = extractLocaleFromPath(to)
        if (locale) {
          saveLocalePreference(locale)
        }
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