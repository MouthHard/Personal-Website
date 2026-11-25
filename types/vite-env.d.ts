/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    any
  >;
  export default component;
}

/** vite define 注入的构建时间戳，用于静态数据缓存版本号 */
declare const __BUILD_TIME__: string;

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
