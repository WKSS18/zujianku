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
