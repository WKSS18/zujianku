import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 本地调试时指向组件库源码 dist，同时固定 React 单实例
      // 使用 dev:local 启动即可开启本地组件库调试
      ...(process.env.USE_LOCAL_COMPONENTS === 'true' && {
        '@test111190909222/components': path.resolve('D:/project/zujianku/sc/packages/components/dist/index.mjs'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      }),
    },
  },
})
