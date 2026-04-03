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
