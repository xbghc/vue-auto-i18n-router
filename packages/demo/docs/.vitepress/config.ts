import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from '../../../i18n-router/src/index'

export default defineConfig({
  title: 'VitePress Auto i18n Router',
  description: 'Automatic language detection and routing for VitePress static sites',
  
  // Base configuration
  base: '/',
  
  // Locales configuration for VitePress native language switcher
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/'
    },
    en: {
      label: 'English', 
      lang: 'en-US',
      link: '/en/'
    }
  },
  
  // Theme configuration
  themeConfig: {
    
    sidebar: {
      '/zh/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/zh/guide/intro' },
            { text: '快速开始', link: '/zh/guide/getting-started' }
          ]
        }
      ],
      '/en/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/en/guide/intro' },
            { text: 'Getting Started', link: '/en/guide/getting-started' }
          ]
        }
      ]
    }
  },
  
  // Use our i18n router plugin for auto language tracking
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh', 'en'],
        defaultLocale: 'zh',
        localeNames: {
          zh: '简体中文',
          en: 'English'
        }
      })
    ]
  }
})