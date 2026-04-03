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
