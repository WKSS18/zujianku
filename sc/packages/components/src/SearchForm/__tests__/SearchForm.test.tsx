import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SearchForm } from '../SearchForm';
import type { SearchFormField } from '../SearchForm.types';

// Mock antd components
vi.mock('antd', () => {
  const Form = Object.assign(
    ({ children, onFinish }: { children: React.ReactNode; onFinish?: (v: unknown) => void }) => (
      <form
        data-testid="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          onFinish?.({});
        }}
      >
        {children}
      </form>
    ),
    {
      Item: ({ children, label }: { children: React.ReactNode; label?: string }) => (
        <div data-testid={`form-item-${label}`}>{children}</div>
      ),
      useForm: () => [{ resetFields: vi.fn(), submit: vi.fn() }],
    },
  );

  return {
    Form,
    Input: (props: Record<string, unknown>) => <input data-testid={`input-${props.placeholder}`} />,
    Select: (props: Record<string, unknown>) => (
      <select data-testid={`select-${props.placeholder}`} />
    ),
    Button: ({
      children,
      onClick,
      htmlType,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      htmlType?: string;
    }) => (
      <button type={htmlType === 'submit' ? 'submit' : 'button'} onClick={onClick}>
        {children}
      </button>
    ),
    Space: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Col: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

const mockFields: SearchFormField[] = [
  { name: 'name', label: 'Name', type: 'input', placeholder: 'Enter name' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select status',
    options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 },
    ],
  },
];

describe('SearchForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders form fields', () => {
    const onSearch = vi.fn();
    render(<SearchForm fields={mockFields} onSearch={onSearch} />);
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-item-Name')).toBeInTheDocument();
    expect(screen.getByTestId('form-item-Status')).toBeInTheDocument();
  });

  it('renders search and reset buttons', () => {
    const onSearch = vi.fn();
    render(<SearchForm fields={mockFields} onSearch={onSearch} />);
    expect(screen.getByText('搜索')).toBeInTheDocument();
    expect(screen.getByText('重置filter')).toBeInTheDocument();
  });

  it('calls onSearch on form submit', () => {
    const onSearch = vi.fn();
    render(<SearchForm fields={mockFields} onSearch={onSearch} />);
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(onSearch).toHaveBeenCalled();
  });
});
