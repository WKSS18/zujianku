import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'SC 组件库',
  }),
  sidebar: {
    showRootTip: false,
  },
});
