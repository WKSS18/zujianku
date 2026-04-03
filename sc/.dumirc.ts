import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'SC 组件库',
    nav: [
      { title: '指南', link: '/guide' },
      { title: '组件', link: '/components/pro-table' },
      { title: 'Hooks', link: '/hooks/use-mount' },
      { title: '工具', link: '/utils/format-date' },
      { title: '主题', link: '/theme' },
    ],
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      { type: 'component', dir: 'packages/components/src' },
      { type: 'hook', dir: 'packages/hooks/src' },
    ],
  },
  alias: {
    '@test111190909222/components': require.resolve('./packages/components/src/index.ts'),
    '@test111190909222/hooks': require.resolve('./packages/hooks/src/index.ts'),
    '@test111190909222/theme': require.resolve('./packages/theme/src/index.ts'),
    '@test111190909222/utils': require.resolve('./packages/utils/src/index.ts'),
  },
});
