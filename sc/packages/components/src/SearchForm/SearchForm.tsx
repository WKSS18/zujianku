import { useCallback } from 'react';
import { Form, Input, Select, Button, Space, Row, Col } from 'antd';
import type { SearchFormProps, SearchFormField } from './SearchForm.types';

function renderField(field: SearchFormField) {
  switch (field.type) {
    case 'select':
      return (
        <Select
          placeholder={field.placeholder}
          options={field.options}
          allowClear
        />
      );
    case 'input':
    default:
      return <Input placeholder={field.placeholder} allowClear />;
  }
}

export function SearchForm({
  fields,
  onSearch,
  onReset,
  loading,
  ...rest
}: SearchFormProps) {
  const [form] = Form.useForm();

  const handleReset = useCallback(() => {
    form.resetFields();
    onReset?.();
  }, [form, onReset]);

  return (
    <Form form={form} onFinish={onSearch} {...rest}>
      <Row>
        {fields.map((field) => (
          <Col key={field.name}>
            <Form.Item name={field.name} label={field.label}>
              {renderField(field)}
            </Form.Item>
          </Col>
        ))}
        <Col>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置filter</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
