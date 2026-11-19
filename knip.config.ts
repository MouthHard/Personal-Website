import type { KnipConfig } from 'knip';

/**
 * Knip 配置 —— 死代码 / 未用依赖检测
 *
 * 设计原则（参考大厂前端工程实践）：
 * 1. 显式声明入口与源码边界，避免 knip 靠猜测导致误报；
 * 2. docs/records 为刻意保留的设计版本归档，不纳入死代码判定；
 * 3. public/static-data 为运行时 fetch 的静态数据（非 import 引入），需排除；
 * 4. 部分依赖被脚手架配置间接消费（stylelint-config-standard-scss → stylelint-scss、
 *    vite 插件等），声明为 ignoreDependencies 避免噪音。
 */
const config: KnipConfig = {
  entry: [
    'index.html',
    'src/main.ts',
    'src/App.vue',
    'src/router/**/*.ts',
    'tests/**/*.spec.ts',
    'vite.config.ts',
    '*.config.{ts,js,cjs,mjs}',
    '.eslintrc.cjs',
  ],

  project: [
    'src/**/*.{ts,vue,js,scss}',
    'tests/**/*.ts',
    'public/static-data/**/*.{ts,js}',
    'vite.config.ts',
    '*.config.{ts,js,cjs,mjs}',
    '.eslintrc.cjs',
  ],

  // 刻意保留、非 import 消费的路径
  ignore: [
    'docs/**',
    'dist/**',
    'node_modules/**',
    'types/**/*.d.ts',
    'public/**/*.json',
    'public/**/*.svg',
    'src/**/*.d.ts',
  ],

  // 被上层配置间接消费、或构建期可选的依赖
  ignoreDependencies: [
    'stylelint-scss', // stylelint-config-standard-scss 的内部依赖，显式锁定版本
    'vite-plugin-compression', // 生产构建可选插件
    'sharp', // 图片处理构建期可选依赖
    'eslint-plugin-prettier', // eslint 配置保留
  ],

  ignoreBinaries: ['knip', 'playwright', 'vue-tsc'],

  // 与 vite.config.ts / tsconfig.json 的 @ → src/ 别名保持一致
  paths: {
    '@/*': ['src/*'],
  },

  // Vue 图标 barrel 的命名导出通过 <component :is> 动态消费
  ignoreExportsUsedInFile: true,
};

export default config;
