import React, { useState, useCallback } from 'react';
import { Button as AntdButton, Modal } from 'antd';
import { useAuth } from '@test111190909222/hooks';
import type { ButtonProps } from './Button.types';

export function Button({
  confirmConfig,
  authCode,
  authFailMode = 'disabled',
  autoLoading = false,
  onClick,
  loading,
  disabled,
  ...restProps
}: ButtonProps) {
  const [innerLoading, setInnerLoading] = useState(false);
  const hasAuth = useAuth(authCode);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const executeClick = async () => {
        if (!onClick) return;

        if (autoLoading) {
          setInnerLoading(true);
          try {
            await onClick(e);
          } finally {
            setInnerLoading(false);
          }
        } else {
          onClick(e);
        }
      };

      if (confirmConfig) {
        Modal.confirm({
          title: confirmConfig.title ?? '确认',
          content: confirmConfig.content ?? '确认执行此操作？',
          okText: confirmConfig.okText,
          cancelText: confirmConfig.cancelText,
          onOk: () => executeClick(),
        });
      } else {
        executeClick();
      }
    },
    [onClick, autoLoading, confirmConfig],
  );

  // 无权限且模式为隐藏时，不渲染
  if (authCode && !hasAuth && authFailMode === 'hidden') {
    return null;
  }

  const isDisabled =
    disabled || (authCode && !hasAuth && authFailMode === 'disabled');
  const isLoading = loading || innerLoading;

  return (
    <AntdButton
      {...restProps}
      loading={isLoading}
      disabled={isDisabled}
      onClick={handleClick}
    />
  );
}
