import type { TableProps } from 'antd';

export interface ProTableRequest {
  current: number;
  pageSize: number;
  [key: string]: unknown;
}

export interface ProTableResponse<TData = Record<string, unknown>> {
  data: TData[];
  total: number;
  success: boolean;
}

export interface ProTableProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<TableProps<TData>, 'dataSource' | 'loading' | 'pagination'> {
  /** Async function to fetch table data */
  request?: (params: ProTableRequest) => Promise<ProTableResponse<TData>>;
  /** Default page size */
  defaultPageSize?: number;
  /** Whether to fetch data on mount */
  autoRequest?: boolean;
}
