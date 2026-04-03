import { useState, useCallback } from 'react';

export interface UsePaginationOptions {
  defaultCurrent?: number;
  defaultPageSize?: number;
}

export interface UsePaginationResult {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  setTotal: (total: number) => void;
}

export function usePagination(options?: UsePaginationOptions): UsePaginationResult {
  const { defaultCurrent = 1, defaultPageSize = 20 } = options ?? {};

  const [current, setCurrent] = useState(defaultCurrent);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);

  const onChange = useCallback(
    (page: number, newPageSize: number) => {
      if (newPageSize !== pageSize) {
        setCurrent(1);
        setPageSize(newPageSize);
      } else {
        setCurrent(page);
      }
    },
    [pageSize],
  );

  return { current, pageSize, total, onChange, setTotal };
}
