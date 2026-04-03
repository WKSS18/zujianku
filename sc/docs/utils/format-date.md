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
