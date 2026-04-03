import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProTable } from '../ProTable';

// Mock antd Table to avoid full antd rendering complexity in unit tests
vi.mock('antd', () => ({
  Table: (props: Record<string, unknown>) => (
    <div data-testid="antd-table" data-loading={String(props.loading)}>
      {Array.isArray(props.dataSource) &&
        (props.dataSource as Array<Record<string, unknown>>).map((item, i) => (
          <div key={i} data-testid="table-row">
            {JSON.stringify(item)}
          </div>
        ))}
    </div>
  ),
  Spin: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProTable', () => {
  it('renders without request', () => {
    render(<ProTable columns={[{ title: 'Name', dataIndex: 'name' }]} />);
    expect(screen.getByTestId('antd-table')).toBeInTheDocument();
  });

  it('fetches data on mount when request is provided', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [{ name: 'Alice' }],
      total: 1,
      success: true,
    });

    render(
      <ProTable
        columns={[{ title: 'Name', dataIndex: 'name' }]}
        request={request}
      />,
    );

    await waitFor(() => {
      expect(request).toHaveBeenCalledWith({ current: 1, pageSize: 20 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('table-row')).toBeInTheDocument();
    });
  });

  it('does not fetch on mount when autoRequest is false', () => {
    const request = vi.fn();
    render(
      <ProTable
        columns={[{ title: 'Name', dataIndex: 'name' }]}
        request={request}
        autoRequest={false}
      />,
    );
    expect(request).not.toHaveBeenCalled();
  });

  it('uses custom defaultPageSize', async () => {
    const request = vi.fn().mockResolvedValue({
      data: [],
      total: 0,
      success: true,
    });

    render(
      <ProTable
        columns={[{ title: 'Name', dataIndex: 'name' }]}
        request={request}
        defaultPageSize={10}
      />,
    );

    await waitFor(() => {
      expect(request).toHaveBeenCalledWith({ current: 1, pageSize: 10 });
    });
  });
});
