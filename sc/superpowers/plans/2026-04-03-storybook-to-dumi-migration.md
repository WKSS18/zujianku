# Storybook 迁移到 dumi 2.x 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 SC 组件库的文档系统从 Storybook 8.6.0 迁移到 dumi 2.x，实现 Ant Design 风格的组件文档站。

**Architecture:** 移除 Storybook 配置和依赖，安装 dumi 2.x，在各组件目录下创建 markdown 文档和 demo 文件。dumi 通过 `atomDirs` 自动发现组件文档，Demo 文件作为独立 React 组件渲染。

**Tech Stack:** dumi 2.x, React 19, Ant Design 6, pnpm monorepo

---

## 文件结构

### 新增文件
- `.dumirc.ts` — dumi 配置文件
- `docs/index.md` — 文档站首页（重定向到组件）
- `docs/guide/index.md` — 快速开始指南
- `packages/components/src/ProTable/index.md` — ProTable 组件文档
- `packages/components/src/ProTable/demo/basic.tsx` — ProTable 基础用法 Demo
- `packages/components/src/ProTable/demo/no-auto-request.tsx` — ProTable 关闭自动请求 Demo
- `packages/components/src/SearchForm/index.md` — SearchForm 组件文档
- `packages/components/src/SearchForm/demo/basic.tsx` — SearchForm 基础用法 Demo
- `packages/hooks/src/useMount/index.md` — useMount 文档
- `packages/hooks/src/usePagination/index.md` — usePagination 文档
- `packages/utils/src/formatDate/index.md` — formatDate 文档
- `packages/theme/src/index.md` — 主题配置文档

### 删除文件
- `.storybook/main.ts`
- `.storybook/preview.tsx`
- `.storybook/manager.ts`
- `.storybook/` 目录
- `packages/components/src/ProTable/ProTable.stories.tsx`
- `packages/components/src/SearchForm/SearchForm.stories.tsx`

### 修改文件
- `package.json` — 移除 Storybook 依赖，添加 dumi，更新 scripts
- `.gitignore` — 添加 `.dumi/` 和 `docs-dist/`

---

### Task 1: 移除 Storybook

**Files:**
- Delete: `.storybook/main.ts`
- Delete: `.storybook/preview.tsx`
- Delete: `.storybook/manager.ts`
- Delete: `packages/components/src/ProTable/ProTable.stories.tsx`
- Delete: `packages/components/src/SearchForm/SearchForm.stories.tsx`
- Modify: `package.json`

- [ ] **Step 1: 删除 .storybook 目录**

```bash
rm -rf .storybook
```

- [ ] **Step 2: 删除 stories 文件**

```bash
rm packages/components/src/ProTable/ProTable.stories.tsx
rm packages/components/src/SearchForm/SearchForm.stories.tsx
```

- [ ] **Step 3: 从 package.json 移除 Storybook 依赖**

在 `package.json` 的 `devDependencies` 中删除以下 5 个依赖：
- `@storybook/addon-essentials`
- `@storybook/react`
- `@storybook/react-vite`
- `@storybook/theming`
- `storybook`

同时将 `scripts.dev` 的值从 `"storybook dev -p 6006"` 改为 `"dumi dev"`（先改值，dumi 安装在下一步）。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove storybook config, dependencies and story files"
```

---

### Task 2: 安装 dumi 并创建配置

**Files:**
- Modify: `package.json`
- Create: `.dumirc.ts`
- Modify: `.gitignore`

- [ ] **Step 1: 安装 dumi**

```bash
pnpm add -Dw dumi
```

- [ ] **Step 2: 添加 docs 相关 scripts 到 package.json**

在 `package.json` 的 `scripts` 中确认 `dev` 已改为 `dumi dev`，并添加：
```json
"build:docs": "dumi build",
"preview:docs": "dumi preview"
```

- [ ] **Step 3: 创建 .dumirc.ts**

创建文件 `.dumirc.ts`，内容：

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
    '@test111190909222/components': require.resolve('./packages/components/src/index.ts'),
    '@test111190909222/hooks': require.resolve('./packages/hooks/src/index.ts'),
    '@test111190909222/theme': require.resolve('./packages/theme/src/index.ts'),
    '@test111190909222/utils': require.resolve('./packages/utils/src/index.ts'),
  },
});
```

- [ ] **Step 4: 更新 .gitignore**

在 `.gitignore` 末尾添加：
```
.dumi/
docs-dist/
```

同时将已有的 `storybook-static/` 行删除。

- [ ] **Step 5: 验证 dumi 启动**

```bash
pnpm dev
```

预期：dumi 开发服务器启动成功（可能显示空文档站，因为还没写文档）。用 Ctrl+C 退出。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add dumi 2.x with configuration"
```

---

### Task 3: 创建全局文档页面

**Files:**
- Create: `docs/index.md`
- Create: `docs/guide/index.md`

- [ ] **Step 1: 创建文档首页 docs/index.md**

```markdown
---
title: SC 组件库
hero:
  title: SC 组件库
  description: 基于 Ant Design 6 的业务组件库
  actions:
    - text: 快速开始
      link: /guide
    - text: 组件
      link: /components/pro-table
---
```

- [ ] **Step 2: 创建快速开始指南 docs/guide/index.md**

```markdown
---
title: 快速开始
nav:
  title: 指南
  order: -1
---

# 快速开始

## 安装

```bash
pnpm add @test111190909222/components @test111190909222/hooks @test111190909222/utils @test111190909222/theme
```

## 使用

```tsx | pure
import { ProTable } from '@test111190909222/components';
import { ScConfigProvider } from '@test111190909222/theme';

function App() {
  return (
    <ScConfigProvider>
      <ProTable columns={columns} request={request} />
    </ScConfigProvider>
  );
}
```

## 包说明

| 包名 | 说明 |
| --- | --- |
| `@test111190909222/components` | 业务组件（ProTable、SearchForm） |
| `@test111190909222/hooks` | 自定义 Hooks（useMount、usePagination） |
| `@test111190909222/utils` | 工具函数（formatDate） |
| `@test111190909222/theme` | 主题配置（ScConfigProvider） |
```

- [ ] **Step 3: 验证全局文档页面**

```bash
pnpm dev
```

预期：文档站首页显示 "SC 组件库" 标题，点击"快速开始"进入指南页面。Ctrl+C 退出。

- [ ] **Step 4: Commit**

```bash
git add docs/index.md docs/guide/index.md
git commit -m "docs: add homepage and getting started guide"
```

---

### Task 4: 创建 ProTable 组件文档和 Demo

**Files:**
- Create: `packages/components/src/ProTable/demo/basic.tsx`
- Create: `packages/components/src/ProTable/demo/no-auto-request.tsx`
- Create: `packages/components/src/ProTable/index.md`

- [ ] **Step 1: 创建 ProTable 基础用法 Demo**

创建 `packages/components/src/ProTable/demo/basic.tsx`：

```tsx
import React from 'react';
import { ProTable } from '@test111190909222/components';
import { ScConfigProvider } from '@test111190909222/theme';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '部门', dataIndex: 'department', key: 'department' },
];

const request = async (params: { current: number; pageSize: number }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = Array.from({ length: params.pageSize }, (_, i) => ({
    key: String((params.current - 1) * params.pageSize + i),
    name: `用户 ${(params.current - 1) * params.pageSize + i + 1}`,
    age: 20 + (i % 30),
    department: ['技术部', '产品部', '设计部'][i % 3],
  }));
  return { data, total: 100, success: true };
};

export default () => (
  <ScConfigProvider>
    <ProTable columns={columns} request={request} />
  </ScConfigProvider>
);
```

- [ ] **Step 2: 创建 ProTable 关闭自动请求 Demo**

创建 `packages/components/src/ProTable/demo/no-auto-request.tsx`：

```tsx
import React from 'react';
import { ProTable } from '@test111190909222/components';
import { ScConfigProvider } from '@test111190909222/theme';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '部门', dataIndex: 'department', key: 'department' },
];

const request = async (params: { current: number; pageSize: number }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = Array.from({ length: params.pageSize }, (_, i) => ({
    key: String((params.current - 1) * params.pageSize + i),
    name: `用户 ${(params.current - 1) * params.pageSize + i + 1}`,
    age: 20 + (i % 30),
    department: ['技术部', '产品部', '设计部'][i % 3],
  }));
  return { data, total: 100, success: true };
};

export default () => (
  <ScConfigProvider>
    <ProTable columns={columns} request={request} autoRequest={false} />
  </ScConfigProvider>
);
```

- [ ] **Step 3: 创建 ProTable 文档**

创建 `packages/components/src/ProTable/index.md`：

```markdown
---
title: ProTable 高级表格
nav: 组件
group: 数据展示
---

# ProTable 高级表格

带有分页、加载状态和异步数据请求的高级表格组件，基于 Ant Design Table 封装。

## 代码演示

<code src="./demo/basic.tsx">基础用法</code>

<code src="./demo/no-auto-request.tsx">关闭自动请求</code>

## API

### ProTable

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | `ColumnsType<TData>` | - |
| request | 异步数据请求函数 | `(params: ProTableRequest) => Promise<ProTableResponse<TData>>` | - |
| defaultPageSize | 默认每页条数 | `number` | `20` |
| autoRequest | 是否在挂载时自动请求 | `boolean` | `true` |

继承 Ant Design [Table](https://ant.design/components/table-cn) 的其他属性（除 `dataSource`、`loading`、`pagination`）。

### ProTableRequest

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| current | 当前页码 | `number` |
| pageSize | 每页条数 | `number` |

### ProTableResponse

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| data | 数据列表 | `TData[]` |
| total | 数据总数 | `number` |
| success | 请求是否成功 | `boolean` |
```

- [ ] **Step 4: 验证 ProTable 文档**

```bash
pnpm dev
```

预期：导航到"组件"页面，能看到 ProTable 文档，Demo 可在线交互。Ctrl+C 退出。

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/ProTable/demo packages/components/src/ProTable/index.md
git commit -m "docs: add ProTable component documentation and demos"
```

---

### Task 5: 创建 SearchForm 组件文档和 Demo

**Files:**
- Create: `packages/components/src/SearchForm/demo/basic.tsx`
- Create: `packages/components/src/SearchForm/index.md`

- [ ] **Step 1: 创建 SearchForm 基础用法 Demo**

创建 `packages/components/src/SearchForm/demo/basic.tsx`：

```tsx
import React from 'react';
import { SearchForm } from '@test111190909222/components';
import { ScConfigProvider } from '@test111190909222/theme';

export default () => (
  <ScConfigProvider>
    <SearchForm
      fields={[
        { name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
        {
          name: 'status',
          label: '状态',
          type: 'select',
          placeholder: '请选择状态',
          options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ],
        },
        { name: 'department', label: '部门', type: 'input', placeholder: '请输入部门' },
      ]}
      onSearch={(values) => {
        console.log('Search:', values);
      }}
    />
  </ScConfigProvider>
);
```

- [ ] **Step 2: 创建 SearchForm 文档**

创建 `packages/components/src/SearchForm/index.md`：

```markdown
---
title: SearchForm 搜索表单
nav: 组件
group: 数据录入
---

# SearchForm 搜索表单

用于数据筛选和搜索的表单组件，支持多种字段类型。

## 代码演示

<code src="./demo/basic.tsx">基础用法</code>

## API

### SearchForm

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fields | 表单字段配置 | `SearchFormField[]` | - |
| onSearch | 搜索回调 | `(values: Record<string, unknown>) => void` | - |
| onReset | 重置回调 | `() => void` | - |
| defaultCollapsed | 默认折叠字段数 | `number` | `3` |
| loading | 搜索按钮加载状态 | `boolean` | - |

继承 Ant Design [Form](https://ant.design/components/form-cn) 的其他属性（除 `onFinish`）。

### SearchFormField

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| name | 字段名 | `string` |
| label | 标签 | `string` |
| type | 字段类型 | `'input' \| 'select' \| 'datePicker' \| 'rangePicker'` |
| placeholder | 占位文本 | `string` |
| options | 选项（type 为 select 时） | `Array<{ label: string; value: string \| number }>` |
```

- [ ] **Step 3: Commit**

```bash
git add packages/components/src/SearchForm/demo packages/components/src/SearchForm/index.md
git commit -m "docs: add SearchForm component documentation and demo"
```

---

### Task 6: 创建 Hooks 文档

**Files:**
- Create: `packages/hooks/src/useMount/index.md`
- Create: `packages/hooks/src/usePagination/index.md`

- [ ] **Step 1: 创建 useMount 文档**

创建 `packages/hooks/src/useMount/index.md`：

```markdown
---
title: useMount
nav: Hooks
group: 生命周期
---

# useMount

组件挂载时执行回调函数，仅执行一次。

## 用法

```tsx | pure
import { useMount } from '@test111190909222/hooks';

function MyComponent() {
  useMount(() => {
    console.log('组件已挂载');
  });

  return <div>Hello</div>;
}
```

## API

```typescript
useMount(fn: () => void): void
```

### 参数

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| fn | 挂载时执行的回调函数 | `() => void` |
```

- [ ] **Step 2: 创建 usePagination 文档**

创建 `packages/hooks/src/usePagination/index.md`：

```markdown
---
title: usePagination
nav: Hooks
group: 状态管理
---

# usePagination

分页状态管理 Hook，维护页码、每页条数和总数。

## 用法

```tsx | pure
import { usePagination } from '@test111190909222/hooks';

function MyComponent() {
  const { current, pageSize, total, onChange, setTotal } = usePagination({
    defaultCurrent: 1,
    defaultPageSize: 20,
  });

  return (
    <Table
      pagination={{ current, pageSize, total, onChange }}
    />
  );
}
```

## API

```typescript
const result = usePagination(options?: UsePaginationOptions): UsePaginationResult
```

### UsePaginationOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultCurrent | 默认当前页 | `number` | `1` |
| defaultPageSize | 默认每页条数 | `number` | `20` |

### UsePaginationResult

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| current | 当前页码 | `number` |
| pageSize | 每页条数 | `number` |
| total | 数据总数 | `number` |
| onChange | 分页变更回调 | `(page: number, pageSize: number) => void` |
| setTotal | 设置总数 | `(total: number) => void` |
```

- [ ] **Step 3: Commit**

```bash
git add packages/hooks/src/useMount/index.md packages/hooks/src/usePagination/index.md
git commit -m "docs: add useMount and usePagination hook documentation"
```

---

### Task 7: 创建 Utils 和 Theme 文档

**Files:**
- Create: `packages/utils/src/formatDate/index.md`
- Create: `packages/theme/src/index.md`

注意：`formatDate.ts` 目前直接在 `packages/utils/src/` 下，不在子目录中。dumi 的 `atomDirs` 按子目录发现文档。需要将 `formatDate` 放到子目录中，或者将文档放在 `docs/` 目录中。

**方案：** 将 formatDate 文档放在 `docs/utils/format-date.md`，将 theme 文档放在 `docs/theme/index.md`，因为这两个包的源码结构不适合 atomDirs 自动发现。

同时需要更新 `.dumirc.ts` 中的 `atomDirs` 移除不适用的配置。

- [ ] **Step 1: 更新 .dumirc.ts**

修改 `.dumirc.ts` 中的 `resolve.atomDirs`，移除 utils（其源码不在子目录中），并确认 `docDirs` 包含 `docs`：

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
      { title: '主题', link: '/theme' },
    ],
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      { type: 'component', dir: 'packages/components/src' },
      { type: 'hook', dir: 'packages/hooks/src' },
    ],
  },
  alias: {
    '@test111190909222/components': require.resolve('./packages/components/src/index.ts'),
    '@test111190909222/hooks': require.resolve('./packages/hooks/src/index.ts'),
    '@test111190909222/theme': require.resolve('./packages/theme/src/index.ts'),
    '@test111190909222/utils': require.resolve('./packages/utils/src/index.ts'),
  },
});
```

- [ ] **Step 2: 创建 formatDate 文档**

创建 `docs/utils/format-date.md`：

```markdown
---
title: formatDate
nav:
  title: 工具
  order: 2
group: 日期
---

# formatDate

日期格式化工具函数，支持 Date 对象、时间戳和日期字符串。

## 用法

```tsx | pure
import { formatDate } from '@test111190909222/utils';

formatDate(new Date());           // '2026-04-03'
formatDate(1712102400000);        // '2024-04-03'
formatDate('2024-04-03');         // '2024-04-03'
formatDate(new Date(), 'MM/DD');  // '04/03'
```

## API

```typescript
formatDate(input: DateInput, format?: string): string
```

### 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| input | 日期输入 | `Date \| number \| string` | - |
| format | 格式化模板 | `string` | `'YYYY-MM-DD'` |

### 返回值

格式化后的日期字符串。输入无效时返回空字符串。

### 支持的格式

| 占位符 | 说明 | 示例 |
| --- | --- | --- |
| `YYYY` | 四位年份 | `2024` |
| `MM` | 两位月份 | `04` |
| `DD` | 两位日期 | `03` |
```

- [ ] **Step 3: 创建主题文档**

创建 `docs/theme/index.md`：

```markdown
---
title: 主题配置
nav:
  title: 主题
  order: 3
---

# 主题配置

SC 组件库基于 Ant Design ConfigProvider 提供主题定制能力，并扩展了业务相关的 ScToken。

## ScConfigProvider

主题提供者组件，包裹应用根节点使用。

```tsx | pure
import { ScConfigProvider } from '@test111190909222/theme';

function App() {
  return (
    <ScConfigProvider
      theme={{ token: { colorPrimary: '#1890ff' } }}
      scToken={{ headerHeight: 64 }}
    >
      <YourApp />
    </ScConfigProvider>
  );
}
```

### API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 子节点 | `ReactNode` | - |
| theme | Ant Design 主题配置 | `ThemeConfig` | - |
| scToken | SC 业务 Token | `Partial<ScToken>` | `defaultScToken` |

## useScToken

获取当前 ScToken 的 Hook。

```tsx | pure
import { useScToken } from '@test111190909222/theme';

function MyComponent() {
  const token = useScToken();
  return <div style={{ height: token.headerHeight }}>Header</div>;
}
```

## ScToken

| Token | 说明 | 默认值 |
| --- | --- | --- |
| headerHeight | 头部高度 | `56` |
| sidebarWidth | 侧边栏宽度 | `240` |
| sidebarCollapsedWidth | 侧边栏折叠宽度 | `64` |
| pageContentPadding | 页面内容内边距 | `24` |
```

- [ ] **Step 4: Commit**

```bash
git add .dumirc.ts docs/utils docs/theme
git commit -m "docs: add formatDate utils and theme documentation"
```

---

### Task 8: 安装依赖并完整验证

- [ ] **Step 1: 安装依赖**

```bash
pnpm install
```

- [ ] **Step 2: 启动 dumi 开发服务器**

```bash
pnpm dev
```

预期：文档站成功启动，检查以下页面：
1. 首页显示 "SC 组件库"
2. 指南 → 快速开始页面正常
3. 组件 → ProTable 文档，Demo 可交互
4. 组件 → SearchForm 文档，Demo 可交互
5. Hooks → useMount 文档正常
6. Hooks → usePagination 文档正常
7. 工具 → formatDate 文档正常
8. 主题 → 主题配置文档正常

Ctrl+C 退出。

- [ ] **Step 3: 验证现有测试不受影响**

```bash
pnpm test
```

预期：所有测试通过，迁移未影响组件代码。

- [ ] **Step 4: 验证组件构建不受影响**

```bash
pnpm build
```

预期：所有包构建成功。

- [ ] **Step 5: Commit（如有修复）**

如果验证过程中发现需要修复的问题，修复后提交：

```bash
git add -A
git commit -m "fix: resolve dumi migration issues"
```

如果一切正常，无需提交。

---

### Task 9: 清理和最终提交

- [ ] **Step 1: 确认无残留 Storybook 引用**

搜索项目中是否还有 storybook 相关引用：

```bash
grep -r "storybook" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.md" .
```

预期：除了 `.gitignore` 中的 `storybook-static/`（如果还在的话）和本计划文档，不应有其他引用。

- [ ] **Step 2: 清理 .gitignore 中的 storybook-static/**

确认 `.gitignore` 中已将 `storybook-static/` 替换为 `.dumi/` 和 `docs-dist/`。

- [ ] **Step 3: 最终 Commit**

```bash
git add -A
git commit -m "chore: complete storybook to dumi 2.x migration"
```
