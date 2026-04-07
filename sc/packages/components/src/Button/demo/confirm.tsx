import React from 'react';
import { Button } from '@test111190909222/components';

export default () => {
  return (
    <Button
      type="primary"
      danger
      confirmConfig={{
        title: '删除确认',
        content: '确定要删除该记录吗？删除后不可恢复。',
      }}
      onClick={() => alert('已删除')}
    >
      删除
    </Button>
  );
};
