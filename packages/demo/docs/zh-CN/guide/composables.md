# Composables API

vitepress-auto-i18n-router 提供了 Vue Composables API，让语言切换变得简单优雅。

## useI18nRouter

用于在 Vue 组件中处理语言切换的组合式函数。

### 基本用法

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale, currentLocale, availableLocales } = useI18nRouter()
</script>

<template>
  <div class="language-switcher">
    <button 
      v-for="locale in availableLocales" 
      :key="locale"
      :class="{ active: locale === currentLocale }"
      @click="switchLocale(locale)"
    >
      {{ locale }}
    </button>
  </div>
</template>

<style>
.language-switcher button.active {
  font-weight: bold;
  color: var(--vp-c-brand);
}
</style>
```

### API 说明

#### 返回值

- **`currentLocale`** - `ComputedRef<string | null>`
  - 当前激活的语言代码
  - 自动从 URL 路径中提取
  - 响应式，会随路由变化自动更新

- **`availableLocales`** - `ComputedRef<string[]>`
  - 所有可用的语言代码数组
  - 从 VitePress 配置中自动读取

- **`switchLocale(locale: string)`** - `Function`
  - 切换到指定语言
  - 参数：目标语言代码（如 'zh-CN', 'en-US'）
  - 自动处理路径映射
  - 保持当前页面位置

### 高级示例

#### 自定义语言选择器

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale, currentLocale, availableLocales } = useI18nRouter()

// 语言显示名称映射
const localeNames = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja': '日本語'
}

// 获取语言显示名称
function getLocaleName(locale) {
  return localeNames[locale] || locale
}
</script>

<template>
  <div class="custom-lang-selector">
    <button class="current-lang">
      {{ getLocaleName(currentLocale) }}
      <span class="arrow">▼</span>
    </button>
    <div class="dropdown">
      <button 
        v-for="locale in availableLocales" 
        :key="locale"
        @click="switchLocale(locale)"
      >
        {{ getLocaleName(locale) }}
        <span v-if="locale === currentLocale">✓</span>
      </button>
    </div>
  </div>
</template>
```

#### 与路径映射配合使用

当使用自定义路径映射时，composable 会自动处理：

```ts
// .vitepress/config.ts
export default defineConfig({
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        // 使用对象格式定义路径映射
        locales: {
          'zh-CN': 'zh',    // zh-CN 映射到 /zh/ 路径
          'en-US': 'en'     // en-US 映射到 /en/ 路径
        },
        defaultLocale: 'zh-CN'
      })
    ]
  }
})
```

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale } = useI18nRouter()

// 用户只需传入语言代码，无需关心实际路径
// 插件会自动将 'en-US' 映射到 '/en/' 路径
function switchToEnglish() {
  switchLocale('en-US')
}
</script>
```

### 特性

#### 自动状态同步

- 与 VitePress 原生语言切换器完全兼容
- 无论通过何种方式切换语言（原生切换器、URL 直接访问、自定义按钮），状态都会自动同步
- 语言偏好自动保存到 localStorage 和 cookie

#### 智能路径处理

- 切换语言时保持当前页面位置
- 自动处理自定义路径映射
- 支持根路径和子路径的正确导航

#### TypeScript 支持

完整的类型定义：

```ts
interface UseI18nRouterReturn {
  currentLocale: ComputedRef<string | null>
  availableLocales: ComputedRef<string[]>
  switchLocale: (locale: string) => void
}

function useI18nRouter(): UseI18nRouterReturn
```

### 最佳实践

1. **在布局组件中使用**
   
   将语言切换器放在 Layout 组件中，确保在所有页面都可用：

   ```vue
   <!-- .vitepress/theme/Layout.vue -->
   <script setup>
   import DefaultTheme from 'vitepress/theme'
   import { useI18nRouter } from 'vitepress-auto-i18n-router/client'
   
   const { switchLocale, currentLocale } = useI18nRouter()
   </script>
   
   <template>
     <DefaultTheme.Layout>
       <template #nav-bar-content-after>
         <!-- 自定义语言切换器 -->
         <LanguageSwitcher 
           :current="currentLocale"
           @switch="switchLocale"
         />
       </template>
     </DefaultTheme.Layout>
   </template>
   ```

2. **响应式样式**
   
   利用 `currentLocale` 的响应性来动态更新样式：

   ```vue
   <script setup>
   import { useI18nRouter } from 'vitepress-auto-i18n-router/client'
   import { computed } from 'vue'
   
   const { currentLocale } = useI18nRouter()
   
   const isRTL = computed(() => {
     return ['ar', 'he', 'fa'].includes(currentLocale.value)
   })
   </script>
   
   <template>
     <div :class="{ rtl: isRTL }">
       <!-- 内容 -->
     </div>
   </template>
   ```

3. **配合其他功能**
   
   可以在切换语言时执行额外操作：

   ```vue
   <script setup>
   import { useI18nRouter } from 'vitepress-auto-i18n-router/client'
   
   const { switchLocale } = useI18nRouter()
   
   async function handleLanguageSwitch(locale) {
     // 执行一些额外操作
     await saveUserPreference(locale)
     
     // 切换语言
     switchLocale(locale)
     
     // 显示提示
     showNotification(`已切换到 ${locale}`)
   }
   </script>
   ```

### 注意事项

1. **仅在客户端可用**
   - Composables 需要在浏览器环境中运行
   - 在 SSR 期间，`currentLocale` 可能为 `null`

2. **VitePress 环境依赖**
   - 需要在 VitePress 环境中使用
   - 依赖 VitePress 的 `useRouter` 和 `useData`

3. **配置同步**
   - 确保 VitePress 配置中的 `locales` 与插件配置一致
   - 路径映射需要在两处都正确配置