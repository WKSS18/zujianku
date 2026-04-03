import type { Preview } from '@storybook/react';
import React from 'react';
import { ScConfigProvider } from '../packages/theme/src';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ScConfigProvider>
        <Story />
      </ScConfigProvider>
    ),
  ],
  parameters: {
    options: {
      storySort: {
        order: ['组件'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
