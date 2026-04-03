# Storybook 迁移到 dumi 2.x 设计文档

## 概述

将 SC 组件库的文档系统从 Storybook 8.6.0 迁移到 dumi 2.x，实现 Ant Design 风格的组件文档站，支持在线 Demo 渲染，直接进入组件文档（无 landing page）。

## 背景

当前项目使用 Storybook 作为组件开发和文档工具。为了获得更贴近 Ant Design 的文档体验、更好的 monorepo 支持和中文文档生态，决定迁移到 dumi 2.x。

## 技术选型

- **文档工具**: dumi 2.x（Bisheng 的现代替代品，蚂蚁集团维护）
- **构建**: dumi 内置 webpack 5（文档站构建），tsdown（组件库构建，保持不变）
- **框架**: React 19 + Ant Design 6

## 目录结构

```
sc/
├── .dumirc.ts              # dumi 配置文件
├── docs/                   # 全局文档
│   ├── guide/
│   │   └── index.md        # 快速开始
│   └── index.md            # 首页/入口（重定向到组件列表）
├── packages/
│   ├── components/src/
│   │   ├── ProTable/
│   │   │   ├── index.md        # 组件文档
│   │   │   ├── demo/           # Demo 文件
│   │   │   │   ├── basic.tsx   # 基础用法
│   │   │   │   └── loading.tsx # 加载状态
│   │   │   ├── ProTable.tsx
│   │   │   └── ProTable.types.ts
│   │   ├── SearchForm/
│   │   │   ├── index.md
│   │   │   ├── demo/
│   │   │   │   └── basic.tsx
│   │   │   ├── SearchForm.tsx
│   │   │   └── SearchForm.types.ts
│   ├── hooks/src/
│   │   ├── useMount/
│   │   │   └── index.md        # Hook 文档
│   │   ├── usePagination/
│   │   │   └── index.md
│   ├── theme/src/
│   │   └── index.md            # 主题文档
│   ├── utils/src/
│   │   └── index.md            # 工具函数文档
```

## dumi 配置 (.dumirc.ts)

```typescript
import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'SC 组件库',
    nav: [
      { title: '指南', link: '/guide' },
      { title: '组件', link: '/components/pro-table' },
      { title: 'Hooks', link: '/hooks/use-mount' },
      { title: '工具', link: '/utils/format-date' },
    ],
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      { type: 'component', dir: 'packages/components/src' },
      { type: 'hook', dir: 'packages/hooks/src' },
      { type: 'util', dir: 'packages/utils/src' },
    ],
  },
  alias: {
    '@test111190909222/components': '/packages/components/src',
    '@test111190909222/hooks': '/packages/hooks/src',
    '@test111190909222/theme': '/packages/theme/src',
    '@test111190909222/utils': '/packages/utils/src',
  },
});
```

## 组件文档格式

每个组件的 `index.md` 遵循以下模板：

```markdown
---
title: ProTable 高级表格
nav: 组件
group: 数据展示
---

# ProTable 高级表格

带有分页、加载状态和异步数据请求的高级表格组件。

## 代码演示

<code src="./demo/basic.tsx">基础用法</code>
<code src="./demo/loading.tsx">加载状态</code>

## API

### ProTable

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `ColumnsType` | - |
| request | 数据请求函数 | `ProTableRequest` | - |
| pageSize | 每页条数 | `number` | `10` |
```

## Demo 文件格式

每个 Demo 是一个独立的 React 组件文件：

```tsx
// demo/basic.tsx
import React from 'react';
import { ProTable } from '@test111190909222/components';

export default () => {
  // Demo 实现
  return <ProTable columns={columns} request={request} />;
};
```

dumi 自动将 Demo 渲染为可交互的在线组件，并展示源代码。

## 迁移步骤

### 1. 移除 Storybook

- 删除 `.storybook/` 目录
- 删除所有 `.stories.tsx` 文件
- 从 `package.json` 移除 Storybook 相关依赖：
  - `@storybook/react`
  - `@storybook/react-vite`
  - `@storybook/addon-essentials`
  - `@storybook/blocks`
  - `@storybook/manager-api`
  - `@storybook/theming`
  - `storybook`

### 2. 安装 dumi

```bash
pnpm add -Dw dumi
```

### 3. 创建配置和文档

- 创建 `.dumirc.ts`
- 创建 `docs/` 全局文档
- 为每个组件/hook/工具创建 `index.md` 和 `demo/` 文件

### 4. 更新 scripts

```json
{
  "dev": "dumi dev",
  "build:docs": "dumi build",
  "preview:docs": "dumi preview"
}
```

### 5. 更新 .gitignore

添加 `docs-dist/` 和 `.dumi/` 到 `.gitignore`。

## 兼容性注意事项

- dumi 2.x 基于 umi 4，内置 webpack 5，与现有 tsdown 组件构建互不干扰
- React 19 兼容性需确认 dumi 最新版本支持情况，如有问题可通过 `extraBabelPlugins` 适配
- Ant Design 6 在 Demo 中正常使用，dumi 处理依赖解析
- 现有的 vitest 测试、ESLint、Prettier 配置保持不变

## 不在本次范围内

- 国际化（i18n）
- 自定义主题开发
- CI/CD 文档部署
- 组件 API 自动生成（后续可通过 dumi 插件实现）
