import type { Meta, StoryObj } from '@storybook/react';
import { ProTable } from './ProTable';

const meta: Meta<typeof ProTable> = {
  title: 'Components/ProTable',
  component: ProTable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ProTable>;

const mockColumns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '部门', dataIndex: 'department', key: 'department' },
];

const mockRequest = async (params: { current: number; pageSize: number }) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = Array.from({ length: params.pageSize }, (_, i) => ({
    key: String((params.current - 1) * params.pageSize + i),
    name: `用户 ${(params.current - 1) * params.pageSize + i + 1}`,
    age: 20 + (i % 30),
    department: ['技术部', '产品部', '设计部'][i % 3],
  }));
  return { data, total: 100, success: true };
};

export const Basic: Story = {
  args: {
    columns: mockColumns,
    request: mockRequest,
  },
};

export const NoAutoRequest: Story = {
  args: {
    columns: mockColumns,
    request: mockRequest,
    autoRequest: false,
  },
};
