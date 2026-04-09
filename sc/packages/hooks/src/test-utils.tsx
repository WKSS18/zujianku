/**
 * 测试工具：兼容 React 17/18/19 的 renderHook 实现
 *
 * @testing-library/react@12 (React 17) 没有 renderHook，
 * 此文件提供统一的 renderHook，使 hook 测试在所有 React 版本下运行。
 */
import React from 'react';
import { render, act as actFromTL } from '@testing-library/react';

export { actFromTL as act };

export function renderHook<T>(hook: () => T) {
  const result = { current: null as T };

  function TestComponent() {
    result.current = hook();
    return null;
  }

  const rendered = render(<TestComponent />);

  return {
    result,
    rerender: () => rendered.rerender(<TestComponent />),
    unmount: rendered.unmount,
  };
}
