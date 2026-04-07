import type { ButtonProps as AntdButtonProps } from 'antd';

export interface ConfirmConfig {
  /** 确认弹窗标题，默认 "确认" */
  title?: string;
  /** 确认弹窗内容，默认 "确认执行此操作？" */
  content?: string;
  /** 确认按钮文字 */
  okText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
}

export interface ButtonProps extends AntdButtonProps {
  /** 二次确认配置，传入后点击会先弹出确认弹窗 */
  confirmConfig?: ConfirmConfig;
  /** 权限标识，配合 AuthProvider 使用 */
  authCode?: string;
  /** 权限校验失败时的表现，默认 'disabled' */
  authFailMode?: 'hidden' | 'disabled';
  /** 是否自动管理 loading 状态（onClick 返回 Promise 时） */
  autoLoading?: boolean;
}
