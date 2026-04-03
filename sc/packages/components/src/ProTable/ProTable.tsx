import { useState, useEffect, useCallback } from 'react';
import { Table } from 'antd';
import type { ProTableProps, ProTableRequest, ProTableResponse } from './ProTable.types';

export function ProTable<TData extends Record<string, unknown> = Record<string, unknown>>({
  request,
  defaultPageSize = 20,
  autoRequest = true,
  columns,
  ...rest
}: ProTableProps<TData>) {
  const [dataSource, setDataSource] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (params: ProTableRequest) => {
      if (!request) return;
      setLoading(true);
      try {
        const response: ProTableResponse<TData> = await request(params);
        if (response.success) {
          setDataSource(response.data);
          setTotal(response.total);
        }
      } finally {
        setLoading(false);
      }
    },
    [request],
  );

  useEffect(() => {
    if (autoRequest && request) {
      fetchData({ current, pageSize });
    }
    // Only run on mount and when pagination changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pageSize, autoRequest]);

  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    const nextCurrent = pagination.current ?? 1;
    const nextPageSize = pagination.pageSize ?? pageSize;

    if (nextPageSize !== pageSize) {
      setCurrent(1);
      setPageSize(nextPageSize);
    } else {
      setCurrent(nextCurrent);
    }
  };

  return (
    <Table<TData>
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={{
        current,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
      onChange={(pagination) => handleTableChange(pagination)}
      {...rest}
    />
  );
}
