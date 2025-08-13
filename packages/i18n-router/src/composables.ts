import { computed, type ComputedRef } from 'vue'
import { useRouter, useData } from 'vitepress'
import type { Router } from 'vitepress'

export interface UseI18nRouterReturn {
  currentLocale: ComputedRef<string | null>
  availableLocales: ComputedRef<string[]>
  switchLocale: (locale: string) => void
}

/**
 * Composable for i18n routing in VitePress
 * Provides language switching functionality with path mapping support
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useI18nRouter } from 'vitepress-auto-i18n-router/client'
 * 
 * const { switchLocale, currentLocale, availableLocales } = useI18nRouter()
 * </script>
 * 
 * <template>
 *   <button @click="switchLocale('en-US')">English</button>
 *   <button @click="switchLocale('zh-CN')">中文</button>
 * </template>
 * ```
 */
export function useI18nRouter(): UseI18nRouterReturn {
  const router = useRouter() as Router
  const { site, page } = useData()
  
  // Extract current locale from URL path
  const currentLocale = computed(() => {
    const path = page.value.relativePath
    const match = path.match(/^([\w-]+)\//)
    if (!match) return null
    
    const pathSegment = match[1]
    const locales = site.value.locales ? Object.keys(site.value.locales) : []
    
    // Check if this path segment is a configured locale
    // First check exact match
    if (locales.includes(pathSegment)) {
      return pathSegment
    }
    
    // Then check if it's a custom path mapping
    for (const locale of locales) {
      const localeConfig = site.value.locales?.[locale]
      if (localeConfig?.link && localeConfig.link.startsWith(`/${pathSegment}/`)) {
        return locale
      }
    }
    
    return null
  })
  
  // Get all available locales
  const availableLocales = computed(() => {
    return site.value.locales ? Object.keys(site.value.locales) : []
  })
  
  // Switch to a different locale
  function switchLocale(targetLocale: string): void {
    const localeConfig = site.value.locales?.[targetLocale]
    if (!localeConfig) {
      console.warn(`[vitepress-auto-i18n-router] Locale "${targetLocale}" not found in configuration`)
      return
    }
    
    // Get the target path from locale config
    const targetBasePath = localeConfig.link || `/${targetLocale}/`
    
    // Get current page path without locale prefix
    const currentPath = page.value.relativePath
    const pathWithoutLocale = currentPath.replace(/^[\w-]+\//, '')
    
    // Build the full target URL
    // If we're at the root of a locale (e.g., "zh-CN/index.md"), 
    // navigate to the root of target locale
    const targetUrl = pathWithoutLocale === 'index.md' 
      ? targetBasePath 
      : targetBasePath + pathWithoutLocale.replace(/\.md$/, '')
    
    // Navigate to the target page
    router.go(targetUrl)
  }
  
  return {
    currentLocale,
    availableLocales,
    switchLocale
  }
}