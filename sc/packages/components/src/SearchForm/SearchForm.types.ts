import type { FormProps } from 'antd';

export interface SearchFormField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'datePicker' | 'rangePicker';
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
}

export interface SearchFormProps extends Omit<FormProps, 'onFinish'> {
  fields: SearchFormField[];
  onSearch: (values: Record<string, unknown>) => void;
  onReset?: () => void;
  /** Number of visible fields before collapse, default 3 */
  defaultCollapsed?: number;
  loading?: boolean;
}
