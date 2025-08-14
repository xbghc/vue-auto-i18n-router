import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from '../../../i18n-router/src/index'

export default defineConfig({
  title: 'VitePress Auto i18n Router',
  description: 'Automatic language detection and routing for VitePress static sites',

  // Base path is automatically detected by the i18n-router plugin
  // No manual base configuration needed - the plugin will detect it from the deployed site

  // Locales configuration for VitePress native language switcher
  locales: {
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-CN/',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh-CN/guide/intro', activeMatch: '/zh-CN/guide/' },
          { text: '快速开始', link: '/zh-CN/guide/getting-started' },
          {
            text: '相关链接',
            items: [
              { text: 'VitePress', link: 'https://vitepress.dev/zh/' },
              { text: 'Vue.js', link: 'https://cn.vuejs.org/' }
            ]
          }
        ],
        sidebar: {
          '/zh-CN/guide/': [
            {
              text: '开始',
              items: [
                { text: '介绍', link: '/zh-CN/guide/intro' },
                { text: '快速开始', link: '/zh-CN/guide/getting-started' }
              ]
            },
            {
              text: '核心概念',
              items: [
                { text: '主题集成', link: '/zh-CN/guide/theme-integration' },
                { text: '配置选项', link: '/zh-CN/guide/configuration' },
                { text: 'Composables API', link: '/zh-CN/guide/composables' },
                { text: '路径映射', link: '/zh-CN/guide/path-mapping' },
                { text: '环境差异', link: '/zh-CN/guide/environments' }
              ]
            },
            {
              text: '部署',
              items: [
                { text: '部署指南', link: '/zh-CN/guide/deployment' },
                { text: 'GitHub Pages', link: '/zh-CN/guide/github-pages' }
              ]
            },
            {
              text: '参考',
              items: [
                { text: 'API 参考', link: '/zh-CN/api/' },
                { text: '常见问题', link: '/zh-CN/guide/faq' }
              ]
            }
          ],
          '/zh-CN/api/': [
            {
              text: '开始',
              items: [
                { text: '介绍', link: '/zh-CN/guide/intro' },
                { text: '快速开始', link: '/zh-CN/guide/getting-started' }
              ]
            },
            {
              text: '核心概念',
              items: [
                { text: '主题集成', link: '/zh-CN/guide/theme-integration' },
                { text: '配置选项', link: '/zh-CN/guide/configuration' },
                { text: 'Composables API', link: '/zh-CN/guide/composables' },
                { text: '路径映射', link: '/zh-CN/guide/path-mapping' },
                { text: '环境差异', link: '/zh-CN/guide/environments' }
              ]
            },
            {
              text: '部署',
              items: [
                { text: '部署指南', link: '/zh-CN/guide/deployment' },
                { text: 'GitHub Pages', link: '/zh-CN/guide/github-pages' }
              ]
            },
            {
              text: '参考',
              items: [
                { text: 'API 参考', link: '/zh-CN/api/' },
                { text: '常见问题', link: '/zh-CN/guide/faq' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/xbghc/vue-auto-i18n-router/edit/main/packages/demo/docs/:path',
          text: '在 GitHub 上编辑此页'
        },
        footer: {
          message: '基于 MIT 许可发布',
          copyright: '版权所有 © 2024-present'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '多语言',
        externalLinkIcon: true
      }
    },
    'en-US': {
      label: 'English',
      lang: 'en-US',
      link: '/en-US/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en-US/guide/intro', activeMatch: '/en-US/guide/' },
          { text: 'Quick Start', link: '/en-US/guide/getting-started' },
          {
            text: 'Resources',
            items: [
              { text: 'VitePress', link: 'https://vitepress.dev/' },
              { text: 'Vue.js', link: 'https://vuejs.org/' }
            ]
          }
        ],
        sidebar: {
          '/en-US/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/en-US/guide/intro' },
                { text: 'Quick Start', link: '/en-US/guide/getting-started' }
              ]
            },
            {
              text: 'Core Concepts',
              items: [
                { text: 'Theme Integration', link: '/en-US/guide/theme-integration' },
                { text: 'Configuration', link: '/en-US/guide/configuration' },
                { text: 'Composables API', link: '/en-US/guide/composables' },
                { text: 'Path Mapping', link: '/en-US/guide/path-mapping' },
                { text: 'Environments', link: '/en-US/guide/environments' }
              ]
            },
            {
              text: 'Deployment',
              items: [
                { text: 'Deployment Guide', link: '/en-US/guide/deployment' },
                { text: 'GitHub Pages', link: '/en-US/guide/github-pages' }
              ]
            },
            {
              text: 'Reference',
              items: [
                { text: 'API Reference', link: '/en-US/api/' },
                { text: 'FAQ', link: '/en-US/guide/faq' }
              ]
            }
          ],
          '/en-US/api/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/en-US/guide/intro' },
                { text: 'Quick Start', link: '/en-US/guide/getting-started' }
              ]
            },
            {
              text: 'Core Concepts',
              items: [
                { text: 'Theme Integration', link: '/en-US/guide/theme-integration' },
                { text: 'Configuration', link: '/en-US/guide/configuration' },
                { text: 'Composables API', link: '/en-US/guide/composables' },
                { text: 'Path Mapping', link: '/en-US/guide/path-mapping' },
                { text: 'Environments', link: '/en-US/guide/environments' }
              ]
            },
            {
              text: 'Deployment',
              items: [
                { text: 'Deployment Guide', link: '/en-US/guide/deployment' },
                { text: 'GitHub Pages', link: '/en-US/guide/github-pages' }
              ]
            },
            {
              text: 'Reference',
              items: [
                { text: 'API Reference', link: '/en-US/api/' },
                { text: 'FAQ', link: '/en-US/guide/faq' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/xbghc/vue-auto-i18n-router/edit/main/packages/demo/docs/:path',
          text: 'Edit this page on GitHub'
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2024-present'
        }
      }
    }
  },

  // Global theme configuration
  themeConfig: {
    // Logo
    logo: '/logo.svg',

    // Social links (global)
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xbghc/vue-auto-i18n-router' }
    ],

    // Search (global)
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  },

  // Use our i18n router plugin for auto language tracking
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: {
          'zh-CN': 'zh-CN',    // zh-CN language maps to /zh-CN/ directory
          'en-US': 'en-US'     // en-US language maps to /en-US/ directory
        },
        defaultLocale: 'zh-CN'
      })
    ]
  }
})
