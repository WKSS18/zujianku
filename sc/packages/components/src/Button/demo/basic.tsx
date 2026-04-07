import React from 'react';
import { Button } from '@test111190909222/components';

export default () => {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button type="primary" onClick={() => alert('点击了')}>
        主按钮
      </Button>
      <Button>默认按钮</Button>
      <Button type="dashed">虚线按钮</Button>
    </div>
  );
};
