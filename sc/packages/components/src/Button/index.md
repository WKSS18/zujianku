---
title: Button 按钮
nav: 组件
group: 通用
---

# Button 按钮

基于 Ant Design Button 封装，增加二次确认、权限控制、自动 loading 能力。

## 基础用法

<code src="./demo/basic.tsx">基础按钮</code>

## 二次确认

传入 `confirmConfig` 后，点击会先弹出确认弹窗，确认后才执行 `onClick`。

<code src="./demo/confirm.tsx">二次确认</code>

## 自动 Loading

开启 `autoLoading` 后，当 `onClick` 返回 Promise 时自动管理 loading 状态。

<code src="./demo/auto-loading.tsx">自动 Loading</code>

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| confirmConfig | 二次确认配置 | `ConfirmConfig` | - |
| authCode | 权限标识，配合 AuthProvider 使用 | `string` | - |
| authFailMode | 权限校验失败时的表现 | `'hidden' \| 'disabled'` | `'disabled'` |
| autoLoading | 是否自动管理 loading（onClick 返回 Promise 时） | `boolean` | `false` |

其他属性继承自 Ant Design [Button](https://ant.design/components/button-cn)。

### ConfirmConfig

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 确认弹窗标题 | `string` | `'确认'` |
| content | 确认弹窗内容 | `string` | `'确认执行此操作？'` |
| okText | 确认按钮文字 | `string` | - |
| cancelText | 取消按钮文字 | `string` | - |
