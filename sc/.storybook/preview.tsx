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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
