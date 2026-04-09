import { describe, it, expect } from 'vitest';
import { renderHook, act } from '../../test-utils';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.current).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.total).toBe(0);
  });

  it('accepts custom initial values', () => {
    const { result } = renderHook(() =>
      usePagination({ defaultCurrent: 2, defaultPageSize: 10 }),
    );
    expect(result.current.current).toBe(2);
    expect(result.current.pageSize).toBe(10);
  });

  it('changes page via onChange', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.onChange(3, 20);
    });
    expect(result.current.current).toBe(3);
  });

  it('resets to page 1 when pageSize changes', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.onChange(3, 20);
    });
    expect(result.current.current).toBe(3);
    act(() => {
      result.current.onChange(3, 10);
    });
    expect(result.current.current).toBe(1);
  });

  it('updates total via setTotal', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setTotal(100);
    });
    expect(result.current.total).toBe(100);
  });
});
