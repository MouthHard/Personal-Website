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
    'src/App.vue',
    'src/router/**/*.ts',
    'tests/**/*.spec.ts',
    '*.config.{ts,js,cjs,mjs}',
  ],

  project: [
    'src/**/*.{ts,vue,js,scss}',
    'tests/**/*.ts',
    '*.config.{ts,js,cjs,mjs}',
  ],

  // 刻意保留、非 import 消费的路径
  ignore: [
    // 图标资产库：各子应用按设计稿沉淀的原子 SVG 组件，未引用时不会进入构建产物。
    // 对应目录下的 icons/index.ts 会集中 re-export，逐条摘除的收益低于维护成本，
    // 因此整体作为「设计资产」排除在死代码判定外。
    'src/pages/*/icons/**',
    // 叶片组件由 Leaf/index.ts 以模板字符串动态 import（`./Leaf${name}.vue`）按需加载，
    // 静态分析无法追踪，属确定性假阳性。
    'src/pages/**/FallingLeaves/Leaf/**',
    // Music 子应用中尚未接入路由的半成品页面（About / HelpCenter / MessageCenter /
    // Profile / ThemeSettings / Downloaded 等）。保留以备后续接入，接入后应从此处移出。
    'src/pages/Music/components/**',
    // 与上一项同属 Music 半成品：仅被未接入的 Profile 页面消费
    'src/stores/music/data/collectedPlaylists.ts',
  ],

  // 被上层配置间接消费、或构建期可选的依赖
  ignoreDependencies: [
    'stylelint-scss', // stylelint-config-standard-scss 的内部依赖，显式锁定版本
    'vite-plugin-compression', // 生产构建可选插件
    'sharp', // 图片处理构建期可选依赖
    'eslint-plugin-prettier', // eslint 配置保留
  ],

  // .eslintrc.cjs 直接 require 的解析器，实际由 eslint-plugin-vue 传递安装，
  // 未在 package.json 显式声明，这里声明为可忽略的未解析导入。
  ignoreUnresolved: ['vue-eslint-parser'],

  // 只保留高置信度的检查项：
  // - 未用文件 / 未用依赖 / 未解析导入 —— 结论确定，误报极低；
  // - 导出级与类型级检查在 Vue + barrel 重导出 + unplugin 自动导入的工程里假阳性过高
  //   （barrel re-export、模板 `<component :is>`、字符串键映射都无法静态解析），
  //   收益低于噪音与误删风险，暂关闭。若后续重构为按需直接 import，可重新开启。
  rules: {
    exports: 'off',
    types: 'off',
  },

  // 与 vite.config.ts / tsconfig.json 的 @ → src/ 别名保持一致
  paths: {
    '@/*': ['src/*'],
  },

  // Vue 图标 barrel 的命名导出通过 <component :is> 动态消费
  ignoreExportsUsedInFile: true,
};

export default config;
