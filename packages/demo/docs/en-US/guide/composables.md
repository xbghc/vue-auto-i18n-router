# Composables API

vitepress-auto-i18n-router provides Vue Composables API for elegant language switching.

## useI18nRouter

A composable function for handling language switching in Vue components.

### Basic Usage

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

### API Reference

#### Return Values

- **`currentLocale`** - `ComputedRef<string | null>`
  - Currently active language code
  - Automatically extracted from URL path
  - Reactive, updates automatically with route changes

- **`availableLocales`** - `ComputedRef<string[]>`
  - Array of all available language codes
  - Automatically read from VitePress configuration

- **`switchLocale(locale: string)`** - `Function`
  - Switch to specified language
  - Parameter: target language code (e.g., 'zh-CN', 'en-US')
  - Automatically handles path mapping
  - Maintains current page position

### Advanced Examples

#### Custom Language Selector

```vue
<script setup>
import { useI18nRouter } from 'vitepress-auto-i18n-router/client'

const { switchLocale, currentLocale, availableLocales } = useI18nRouter()

// Language display name mapping
const localeNames = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja': '日本語'
}

// Get language display name
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

#### Working with Path Mapping

When using custom path mapping, the composable handles it automatically:

```ts
// .vitepress/config.ts
export default defineConfig({
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        // Use object format for path mapping
        locales: {
          'zh-CN': 'zh',    // zh-CN maps to /zh/ path
          'en-US': 'en'     // en-US maps to /en/ path
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

// Users only need to pass language code, no need to worry about actual paths
// Plugin will automatically map 'en-US' to '/en/' path
function switchToEnglish() {
  switchLocale('en-US')
}
</script>
```

### Features

#### Automatic State Sync

- Fully compatible with VitePress native language switcher
- State syncs automatically regardless of switching method (native switcher, direct URL access, custom buttons)
- Language preference automatically saved to localStorage and cookies

#### Smart Path Handling

- Maintains current page position when switching languages
- Automatically handles custom path mapping
- Supports correct navigation for both root and sub-paths

#### TypeScript Support

Full type definitions:

```ts
interface UseI18nRouterReturn {
  currentLocale: ComputedRef<string | null>
  availableLocales: ComputedRef<string[]>
  switchLocale: (locale: string) => void
}

function useI18nRouter(): UseI18nRouterReturn
```

### Best Practices

1. **Use in Layout Components**
   
   Place the language switcher in Layout component to ensure it's available on all pages:

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
         <!-- Custom language switcher -->
         <LanguageSwitcher 
           :current="currentLocale"
           @switch="switchLocale"
         />
       </template>
     </DefaultTheme.Layout>
   </template>
   ```

2. **Reactive Styling**
   
   Leverage `currentLocale` reactivity for dynamic styling:

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
       <!-- Content -->
     </div>
   </template>
   ```

3. **Combine with Other Features**
   
   Execute additional operations when switching languages:

   ```vue
   <script setup>
   import { useI18nRouter } from 'vitepress-auto-i18n-router/client'
   
   const { switchLocale } = useI18nRouter()
   
   async function handleLanguageSwitch(locale) {
     // Perform additional operations
     await saveUserPreference(locale)
     
     // Switch language
     switchLocale(locale)
     
     // Show notification
     showNotification(`Switched to ${locale}`)
   }
   </script>
   ```

### Notes

1. **Client-Side Only**
   - Composables need to run in browser environment
   - During SSR, `currentLocale` may be `null`

2. **VitePress Environment Dependency**
   - Must be used within VitePress environment
   - Depends on VitePress's `useRouter` and `useData`

3. **Configuration Sync**
   - Ensure VitePress `locales` config matches plugin configuration
   - Path mapping needs to be correctly configured in both places