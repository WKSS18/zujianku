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
