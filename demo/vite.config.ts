import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// 在 ESM 环境下手动还原当前配置文件所在目录，便于后续解析本地依赖路径。
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  // 启用 React 官方插件，处理 JSX/TSX 编译以及开发期增强能力。
  plugins: [react()],
  resolve: {
    alias: {
      // 开启本地组件库联调时，将包名映射到本地构建产物。
      // 同时固定 react 和 react-dom 到当前 demo 的依赖，避免出现多份 React 实例。
      // 通常配合 dev:local 启动脚本使用，方便直接验证组件库改动。
      ...(process.env.USE_LOCAL_COMPONENTS === 'true' && {
        '@sh-ai/work-ui': path.resolve('D:/project/npm-sh-work-ui/packages/components/dist/index.mjs'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      }),
    },
  },
})
