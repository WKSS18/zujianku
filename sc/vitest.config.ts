import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
    setupFiles: ['./packages/components/vitest.setup.ts'],
  },
});
