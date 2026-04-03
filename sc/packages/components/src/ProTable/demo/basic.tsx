import React from 'react';
import { ProTable } from '@test111190909222/components';
import { ScConfigProvider } from '@test111190909222/theme';

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '部门', dataIndex: 'department', key: 'department' },
];

const request = async (params: { current: number; pageSize: number }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = Array.from({ length: params.pageSize }, (_, i) => ({
    key: String((params.current - 1) * params.pageSize + i),
    name: `用户 ${(params.current - 1) * params.pageSize + i + 1}`,
    age: 20 + (i % 30),
    department: ['技术部', '产品部', '设计部'][i % 3],
  }));
  return { data, total: 100, success: true };
};

export default () => (
  <ScConfigProvider>
    <ProTable columns={columns} request={request} />
  </ScConfigProvider>
);
