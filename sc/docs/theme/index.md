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
