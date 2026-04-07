import React from 'react';
import { Button } from '@test111190909222/components';

const mockSubmit = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 2000));

export default () => {
  return (
    <Button type="primary" autoLoading onClick={mockSubmit}>
      提交（自动 loading 2 秒）
    </Button>
  );
};
