import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const useLocalComponents = false

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 本地调试时指向组件库源码 dist，同时固定 React 单实例
      ...(useLocalComponents && {
        '@test111190909222/components': path.resolve('D:/project/sc/packages/components/dist/index.mjs'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      }),
    },
  },
})
