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
      
      /**
       * Automatically detect the base path from the page
       * This works reliably without any manual configuration
       */
      const detectBasePath = (): string => {
        // Detect from resource paths - this is the most reliable method
        // VitePress always includes assets with the correct base path
        const resources = document.querySelectorAll<HTMLElement>('link[href*="/assets/"], script[src*="/assets/"], link[href*="/vp-icons.css"]')
        for (const resource of resources) {
          const url = (resource as HTMLLinkElement).href || (resource as HTMLScriptElement).src
          if (url) {
            // Get the pathname part from the full URL
            const urlObj = new URL(url, window.location.origin)
            const pathname = urlObj.pathname
            // Find where /assets/ or /vp-icons.css starts
            const assetsIndex = pathname.search(/\/(assets\/|vp-icons\.css)/)
            if (assetsIndex > 0) {
              // Has base path before assets
              return pathname.substring(0, assetsIndex + 1)
            } else if (assetsIndex === 0) {
              // Assets at root, no base path
              return '/'
            }
          }
        }
        
        // Fallback to root if no resources found (shouldn't happen in practice)
        return '/'
      }
      
      const extractLocaleFromPath = (path: string, availableLocales?: string[]): string | null => {
        // Extract path segment from URL
        const match = path.match(/^\/([\w-]+)\//)
        if (!match) return null
        
        const pathSegment = match[1]
        
        // Get locales - use provided list or try to get from VitePress config
        const locales = availableLocales || (() => {
          const siteData = (window as any).__VP_SITE_DATA__
          return siteData?.locales ? Object.keys(siteData.locales) : []
        })()
        
        // Check if this path segment is a configured locale
        // VitePress locales object uses the actual path as key
        if (locales.includes(pathSegment)) {
          return pathSegment
        }
        
        // If not found directly, it might be a custom path mapping
        // We need to check if any locale's link matches this path
        const siteData = (window as any).__VP_SITE_DATA__
        if (siteData?.locales) {
          for (const locale of locales) {
            const localeConfig = siteData.locales[locale]
            if (localeConfig?.link && localeConfig.link.startsWith(`/${pathSegment}/`)) {
              return locale
            }
          }
        }
        
        return null
      }
      
      // Auto-redirect on initial load if needed (for production)
      const currentPath = window.location.pathname
      const base = detectBasePath()
      
      // Remove base from path for locale detection
      const pathWithoutBase = base !== '/' && currentPath.startsWith(base) 
        ? currentPath.slice(base.length - 1) // Keep the leading slash
        : currentPath
      
      const currentLocale = extractLocaleFromPath(pathWithoutBase)
      
      // Check if we're at the root (with or without base path)
      const isAtRoot = pathWithoutBase === '/' || pathWithoutBase === ''
      
      // If no locale in path (e.g., visiting root "/" or "/base/" in production)
      if (!currentLocale && isAtRoot) {
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
        // Construct the correct URL with base path
        // Base already includes trailing slash when needed
        const targetPath = base === '/' 
          ? `/${targetLocale}/`
          : `${base}${targetLocale}/`
        
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