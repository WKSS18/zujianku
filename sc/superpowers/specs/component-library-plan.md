# 业务组件库搭建方案 - 设计文档

## 背景与目标

企业内部有 5-15 个 React 前端项目，10-30 名前端开发人员。各项目中存在大量重复的业务组件（表单、表格、布局等），需要建设统一的业务组件库以实现：

1. **复用沉淀** — 将各项目中重复的业务组件抽象、沉淀为可复用的标准组件
2. **体验一致** — 统一交互规范和视觉风格，降低用户认知负担
3. **提效降本** — 减少重复开发，加速业务交付

## 技术选型

| 维度     | 选型                                        | 理由                                                      |
| -------- | ------------------------------------------- | --------------------------------------------------------- |
| 框架     | React + TypeScript                          | 内部项目统一技术栈                                        |
| 基础 UI  | Ant Design 6 + Ant Design X (@ant-design/x) | 已有项目在用，二次封装；Ant Design X 提供 AI/智能交互组件 |
| 包管理   | pnpm workspaces                             | Monorepo 管理，幽灵依赖防护                               |
| 构建     | tsup (esbuild)                              | 快速，配置简单，ESM+CJS 双输出                            |
| 版本管理 | Changesets                                  | 多包版本管理 + changelog 自动生成                         |
| 测试     | Vitest + @testing-library/react             | 快速，与 Vite 生态一致                                    |
| 文档     | Storybook 8 (Vite builder)                  | 组件演示与文档一体化                                      |
| 代码质量 | ESLint + Prettier + Husky + lint-staged     | 提交前自动校验                                            |
| 发布     | npm 私有仓库                                | 企业内部分发                                              |

## 项目结构

```
sc/
├── packages/
│   ├── components/              # @sc/components - 业务组件
│   │   ├── src/
│   │   │   ├── ProForm/
│   │   │   ├── ProTable/
│   │   │   ├── SearchForm/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsup.config.ts
│   │   └── tsconfig.json
│   ├── hooks/                   # @sc/hooks - 公共 hooks
│   │   ├── src/
│   │   │   ├── useRequest/
│   │   │   ├── useAuth/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsup.config.ts
│   ├── utils/                   # @sc/utils - 工具函数
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsup.config.ts
│   └── theme/                   # @sc/theme - 主题定制
│       ├── src/
│       │   ├── ScConfigProvider.tsx
│       │   ├── token.ts
│       │   ├── useScToken.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsup.config.ts
├── docs/
│   └── .storybook/              # Storybook 配置
│       ├── main.ts
│       └── preview.tsx
├── package.json                 # 根 package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json           # 共享 TS 配置
├── .eslintrc.js
├── .prettierrc
├── .husky/
│   └── pre-commit
└── .changeset/
    └── config.json
```

## 包划分与依赖关系

### 包职责

| 包名           | 职责                                        | 依赖                                                     |
| -------------- | ------------------------------------------- | -------------------------------------------------------- |
| @sc/components | 核心业务组件                                | antd(peer), react(peer), @sc/hooks, @sc/utils, @sc/theme |
| @sc/hooks      | 跨组件复用的 React hooks                    | react(peer), @sc/utils                                   |
| @sc/utils      | 纯函数工具，无 React 依赖                   | 无                                                       |
| @sc/theme      | Ant Design Token 定制 + ConfigProvider 封装 | antd(peer), @ant-design/x(peer), react(peer)             |

### 依赖关系图

```
@sc/components
  ├── @sc/hooks
  │   └── @sc/utils
  ├── @sc/utils
  └── @sc/theme

peerDependencies (由消费方提供):
  - react >= 18
  - react-dom >= 18
  - antd >= 6
  - @ant-design/x >= 2
```

## 组件内部结构

每个组件遵循统一目录规范：

```
ProTable/
├── index.ts              # 导出入口
├── ProTable.tsx           # 主组件实现
├── ProTable.types.ts      # 类型定义
├── useProTable.ts         # 组件专用 hook（如有）
├── ProTable.stories.tsx   # Storybook 文档
└── __tests__/
    └── ProTable.test.tsx  # 单元测试
```

## 组件 API 设计原则

1. **透传 Ant Design Props** — 每个封装组件通过 `...rest` 透传底层 antd 组件的全部 props，业务层只增不减
2. **约定大于配置** — 提供合理的默认值（如 ProTable 默认分页 pageSize=20），减少消费方配置
3. **TypeScript First** — 所有组件导出完整类型定义，支持 IDE 自动补全
4. **组合优于继承** — 通过 children / render props 模式实现扩展点

### 组件分类

| 类型      | 说明                                  | 示例                                   |
| --------- | ------------------------------------- | -------------------------------------- |
| 增强型    | 对 antd 组件添加业务默认行为          | ProTable（预置分页/筛选/请求）         |
| 组合型    | 多个 antd 组件组合为业务场景          | SearchForm（Form+Input+Select+Button） |
| 布局型    | 统一页面布局结构                      | PageContainer、DetailPage              |
| AI 交互型 | 基于 @ant-design/x 封装的智能交互组件 | ChatPanel、AISearch、PromptEditor      |

## 主题机制

基于 Ant Design 6 的 Design Token 体系，扩展企业自定义 Token：

```tsx
// @sc/theme 提供
import { ScConfigProvider } from '@sc/theme';

<ScConfigProvider
  theme={{
    token: { colorPrimary: '#1677ff' },
    scToken: { headerHeight: 56, sidebarWidth: 240 },
  }}
>
  <App />
</ScConfigProvider>;
```

- `token` — 标准 Ant Design Token，直接透传给 antd ConfigProvider
- `scToken` — 企业自定义 Token，通过 React Context 传递
- 组件内部通过 `useScToken()` hook 消费主题变量

## 构建配置

每个包的 `tsup.config.ts` 统一模式：

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  treeshake: true,
  external: ['react', 'react-dom', 'antd', '@ant-design/x'],
  clean: true,
});
```

输出：

- `dist/index.mjs` — ESM 格式
- `dist/index.js` — CJS 格式
- `dist/index.d.ts` — 类型声明

## 版本管理与发布

使用 Changesets 管理多包版本：

1. 开发者提交 PR 时运行 `pnpm changeset`，描述变更内容和影响范围
2. CI 合并到 main 后自动运行 `pnpm changeset version` 升级版本
3. 自动生成 CHANGELOG.md
4. 运行 `pnpm changeset publish` 发布到 npm 私有仓库

版本策略：各包独立版本号（independent mode），按实际变更独立升版。

## CI/CD 流程

```
PR 阶段:
  ├── pnpm install
  ├── pnpm lint (ESLint + TypeScript type-check)
  ├── pnpm test (Vitest)
  ├── pnpm build (tsup)
  └── Storybook 预览部署 (可选)

合并 main:
  ├── changesets version
  ├── changesets publish → npm 私有仓库
  └── Storybook 正式部署 (可选)
```

## 消费方使用示例

```bash
# 安装
pnpm add @sc/components @sc/theme

# 应用入口
import { ScConfigProvider } from '@sc/theme';
import { ProTable } from '@sc/components';

function App() {
  return (
    <ScConfigProvider>
      <ProTable
        columns={columns}
        request={fetchData}
      />
    </ScConfigProvider>
  );
}
```

## 验证方式

1. **本地开发验证** — `pnpm dev` 启动 Storybook，可视化查看各组件
2. **构建验证** — `pnpm build` 全量构建，确认 ESM/CJS/类型产物正确
3. **测试验证** — `pnpm test` 运行全部单测
4. **类型检查** — `pnpm typecheck` 确认类型无误
5. **发布验证** — `pnpm changeset publish --dry-run` 模拟发布
6. **消费端验证** — 在一个实际项目中安装组件库，确认引入和使用无问题

## 组件调试

pnpm setup
1. pnpm link（推荐）
在组件库目录：


cd d:\project\sc\packages\components
pnpm link --global
在你的业务项目里：


pnpm link --global @test111190909222/components
这样业务项目里引用的就是本地源码，改了组件库后实时生效。

调试完后取消 link：


pnpm unlink --global @test111190909222/components

vite alias 一行搞定，不动 package.json

不用改依赖版本，不用重新 install，不用删 node_modules。直接让 vite 把 import 指向本地源码的 dist：