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
