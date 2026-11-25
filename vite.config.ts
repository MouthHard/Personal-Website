/**
 * ============================================================================
 * Vite 构建配置 - vite.config.ts
 * ============================================================================
 *
 * 【这是什么？】
 * Vite 是前端构建工具（类似 Webpack），这个文件是它的配置。
 * 控制开发服务器、代码编译、打包优化等所有构建相关行为。
 *
 * 【关键配置说明】
 *
 * 1. 代码压缩（gzip/brotli）— 生产环境优化
 *    打包时同时生成 .gz 和 .br 压缩文件，Nginx 可以直接返回压缩版
 *    threshold: 10240 → 只压缩大于 10KB 的文件
 *
 * 2. 代码分割（manualChunks）— 生产环境优化
 *    将大的第三方库拆分成独立文件，浏览器可以并行下载和缓存
 *    - echarts → 图表库单独一个包
 *    - vue/vue-router/pinia → Vue 核心单独一个包
 *    （消息弹窗已改为各页面零依赖定制实现，不再引入 element-plus）
 *
 * 3. Terser 压缩 — 生产环境移除 console.log
 *    避免生产环境泄露调试信息
 *
 * ============================================================================
 */

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  /** 加载 .env 环境变量（如 VITE_BASE） */
  const env = loadEnv(mode, process.cwd());
  /** 非开发构建都按生产优化处理（线上部署实际走 --mode gh-pages） */
  const isProduction = mode !== 'development';

  return {
    /** 部署基础路径 */
    base: '/Personal-Website/',

    plugins: [
      vue(),
      /** 项目自有组件自动注册（Landscape/common 下的公共组件） */
      Components({
        dirs: ['src/pages/Landscape/components/common'],
        dts: 'types/components.d.ts',
      }),
      /** 包体积可视化分析（仅本地 production 构建时生成，gh-pages 部署不需要） */
      mode === 'production' &&
        visualizer({
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ],

    resolve: {
      /** 路径别名：@ → src/ 目录，import 时可以写 @/stores/xxx 而不是 ../../stores/xxx */
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      port: 5173,
      open: true,
      host: '0.0.0.0',
    },

    test: {
      environment: 'jsdom',
      globals: true,
      coverage: {
        provider: 'v8',
      },
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      /** 开发环境生成 sourcemap 方便调试，生产环境不生成（减小体积） */
      sourcemap: mode === 'development',
      minify: 'terser',
      terserOptions: {
        compress: {
          /** 生产环境移除 console.log/info，保留 console.warn/error */
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log', 'console.info'] : [],
        },
      },
      rollupOptions: {
        output: {
          /**
           * 代码分割策略 — 将大型第三方库拆成独立文件
           * 好处：
           * 1. 浏览器并行下载，加载更快
           * 2. 库代码很少变动，可以长期缓存（业务代码更新时不用重新下载库）
           *
           * 分包结果：
           * - echarts.[hash].js → ECharts 图表库
           * - vue-vendor.[hash].js → Vue + Vue Router + Pinia
           * - [name].[hash].js → 业务代码
           *
           * 注意：不再对 element-plus 单独分包——项目已移除该依赖，
           * 消息弹窗改为各页面自带的零依赖定制实现。
           */
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('echarts')) {
                return 'echarts';
              }
              if (
                id.includes('vue') ||
                id.includes('vue-router') ||
                id.includes('pinia')
              ) {
                return 'vue-vendor';
              }
            }
          },
          /**
           * 合并体积过小的 chunk。
           * 高延迟网络下（国内访问 GitHub Pages 实测单请求 500–900ms），
           * 几十个 0–5KB 的图标/工具 chunk 会被逐个排队，纯 RTT 就能吃掉十几秒。
           * 合并后请求数大幅减少，代价是少量模块可能被复制进多个 chunk。
           */
          experimentalMinChunkSize: 20_000,
          /** 文件命名规则：带 hash 值，内容变化时 hash 变化，浏览器会重新下载 */
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.name || '';
            if (fileName.startsWith('App/')) {
              return `assets/App/${fileName.replace('App/', '')}`;
            }
            return `assets/[ext]/[name]-[hash].[ext]`;
          },
        },
      },
    },
  };
});
