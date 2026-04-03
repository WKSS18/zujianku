import type { Meta, StoryObj } from '@storybook/react';
import { SearchForm } from './SearchForm';

const meta: Meta<typeof SearchForm> = {
  title: 'Components/SearchForm',
  component: SearchForm,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

export const Basic: Story = {
  args: {
    fields: [
      { name: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
      {
        name: 'status',
        label: '状态',
        type: 'select',
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
      { name: 'department', label: '部门', type: 'input', placeholder: '请输入部门' },
    ],
    onSearch: (values) => {
      console.log('Search:', values);
    },
  },
};
