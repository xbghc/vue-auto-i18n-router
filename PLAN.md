# VitePress Auto i18n Router - 实现计划

## 项目概述

开发一个用于 VitePress 静态网站的国际化自动路由库，通过自动扫描文档目录结构生成多语言路由，提供智能的语言检测和切换功能。

## 核心设计原则

1. **固定使用 Prefix 策略**：所有语言都使用 URL 前缀（如 `/zh/`, `/en/`, `/ja/`）
2. **自动语言检测**：内置浏览器语言检测，自动重定向到合适的语言版本
3. **最小化配置**：开箱即用，只需配置语言列表和默认语言
4. **VitePress 原生集成**：作为 Vite 插件无缝集成

## 技术架构

### 配置接口

```typescript
interface I18nRouterConfig {
  // 支持的语言列表
  locales: string[]
  
  // 默认语言
  defaultLocale: string
  
  // 语言名称映射（用于显示）
  localeNames?: Record<string, string>
  
  // 路由重写规则（可选）
  rewrites?: Record<string, string>
  
  // 语言切换器位置
  switcherPosition?: 'nav' | 'sidebar' | 'none'
}
```

### URL 结构

所有语言都使用统一的前缀结构：

```
/zh/                 -> 中文首页
/zh/guide/intro      -> 中文指南
/zh/api/config       -> 中文 API

/en/                 -> 英文首页
/en/guide/intro      -> 英文指南
/en/api/config       -> 英文 API

/ja/                 -> 日文首页
/ja/guide/intro      -> 日文指南
/ja/api/config       -> 日文 API

/  -> 自动重定向到浏览器语言或默认语言
```

### 文档目录结构

```
docs/
├── zh/               # 中文内容
│   ├── index.md      
│   ├── guide/
│   │   ├── intro.md  
│   │   └── setup.md  
│   └── api/
│       └── config.md 
│
├── en/               # 英文内容
│   ├── index.md      
│   ├── guide/
│   │   ├── intro.md  
│   │   └── setup.md  
│   └── api/
│       └── config.md 
│
└── ja/               # 日文内容
    ├── index.md      
    ├── guide/
    │   ├── intro.md  
    │   └── setup.md  
    └── api/
        └── config.md 
```

## 核心功能模块

### 1. 路由解析器 (RouteParser)
- 从 URL 提取语言代码和路径
- 生成带语言前缀的 URL
- 处理路径映射和转换

### 2. 浏览器语言检测器 (BrowserLanguageDetector)
- 检测浏览器语言设置
- 读取和保存用户语言偏好（localStorage）
- 匹配最合适的支持语言

### 3. 自动重定向中间件 (RedirectMiddleware)
- 处理无语言前缀的访问
- 自动重定向到检测到的语言版本
- 处理不支持的语言回退

### 4. 语言切换组件 (LocaleSwitcher)
- 提供用户界面切换语言
- 保持当前页面路径
- 自动注入到导航栏或侧边栏

### 5. VitePress 插件 (Plugin)
- 集成到 Vite 构建流程
- 注入客户端脚本
- 处理路由转换

## 实现步骤

### 第一阶段：基础库结构
1. 创建库项目结构
2. 配置 TypeScript 和构建工具
3. 设置包的基本信息

### 第二阶段：核心功能
1. 实现路由解析器
2. 实现语言检测逻辑
3. 实现路由生成器
4. 创建重定向中间件

### 第三阶段：VitePress 集成
1. 创建 Vite 插件接口
2. 实现路由注入逻辑
3. 生成客户端脚本
4. 处理 SEO 相关功能

### 第四阶段：UI 组件
1. 开发语言切换组件
2. 实现自动注入逻辑
3. 添加样式和交互

### 第五阶段：测试集成
1. 在 demo 项目中集成库
2. 创建多语言示例内容
3. 编写单元测试
4. 编写 E2E 测试

## 项目结构

```
packages/
├── vitepress-auto-i18n-router/    # 核心库
│   ├── src/
│   │   ├── index.ts               # 主入口
│   │   ├── plugin.ts              # Vite 插件
│   │   ├── router.ts              # 路由核心逻辑
│   │   ├── detector.ts            # 语言检测
│   │   ├── middleware.ts          # 中间件
│   │   ├── types.ts               # TypeScript 类型定义
│   │   └── components/
│   │       └── LocaleSwitcher.vue # 语言切换组件
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── demo/                          # 测试演示项目
    ├── docs/                      # VitePress 文档
    │   ├── zh/
    │   ├── en/
    │   └── ja/
    └── .vitepress/
        └── config.ts              # VitePress 配置
```

## 使用示例

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { vitepressAutoI18nRouter } from 'vitepress-auto-i18n-router'

export default defineConfig({
  title: 'My Docs',
  
  vite: {
    plugins: [
      vitepressAutoI18nRouter({
        locales: ['zh', 'en', 'ja'],
        defaultLocale: 'zh',
        localeNames: {
          zh: '简体中文',
          en: 'English',
          ja: '日本語'
        },
        switcherPosition: 'nav'
      })
    ]
  }
})
```

## 自动化功能

1. **自动路由映射**：扫描文档目录，生成多语言路由配置
2. **智能重定向**：根据浏览器语言自动重定向，记住用户选择
3. **语言切换器**：自动注入到指定位置，提供便捷切换
4. **SEO 优化**：自动生成 hreflang 标签和多语言 sitemap
5. **404 处理**：智能处理缺失的翻译页面

## 开发原则

1. **零配置优先**：默认配置即可满足大部分需求
2. **渐进式增强**：可根据需要添加高级配置
3. **性能优先**：路由生成在构建时完成，运行时开销最小
4. **开发体验**：提供清晰的错误提示和调试信息

## 测试策略

1. **单元测试**：测试各个模块的核心逻辑
2. **集成测试**：测试与 VitePress 的集成
3. **E2E 测试**：测试完整的用户流程
4. **性能测试**：确保对构建和运行时性能影响最小

## 交付标准

- [ ] 核心功能完整可用
- [ ] TypeScript 类型定义完整
- [ ] 文档和示例齐全
- [ ] 测试覆盖率 > 80%
- [ ] 支持 VitePress 最新版本
- [ ] npm 包可发布

## 时间规划

- 第一阶段：30分钟 - 基础结构搭建
- 第二阶段：1小时 - 核心功能实现
- 第三阶段：1小时 - VitePress 集成
- 第四阶段：30分钟 - UI 组件开发
- 第五阶段：30分钟 - 测试和优化

总计预估：3.5小时