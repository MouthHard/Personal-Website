/**
 * 错误请求通道。
 *
 * 存在的理由：router.onError / window 事件在组件树之外，ErrorBoundary 在组件树之内，
 * 两边没有共同祖先可以传 props。用一个模块级单例做最小桥接，避免再造一层状态管理。
 */
export type ErrorKind = 'resource' | 'runtime';
export type ErrorMode = 'fullscreen' | 'region';

export interface ErrorPayload {
  /** resource = 加载/网络/超时（可 reload）；runtime = 代码/渲染异常（重渲染） */
  kind: ErrorKind;
  /** 展示在错误页上的稳定标识，见 ERROR_CODES */
  code: string;
  /** 面向用户的一句话 */
  message: string;
  detail?: string;
  stack?: string;
  route?: string;
  time?: string;
  component?: string;
  userAgent?: string;
  /** 局部错误卡的作用域；不填表示全局错误页 */
  scope?: string;
}

export const ERROR_CODES = {
  /** 软失败：等了很久但没拿到内容，不是真正的程序错误 */
  ENTRY_TIMEOUT: 'ERR_ENTRY_TIMEOUT',
  /** 软失败：chunk/资源取不到，发版后旧文件名失效最常见 */
  CHUNK_LOAD: 'ERR_CHUNK_LOAD',
  NETWORK: 'ERR_NETWORK_ERROR',
  COMPONENT: 'ERR_COMPONENT_RENDER',
  GLOBAL: 'ERR_GLOBAL',
  ENTRY_FAILED: 'ERR_ENTRY_FAILED',
} as const;

/** 软失败不算「系统故障」，错误页据此切换文案与视觉调性 */
export const SOFT_CODES: readonly string[] = [
  ERROR_CODES.ENTRY_TIMEOUT,
  ERROR_CODES.CHUNK_LOAD,
];

const listeners = new Set<(payload: ErrorPayload) => void>();

export const subscribeError = (
  fn: (payload: ErrorPayload) => void,
): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const requestError = (payload: ErrorPayload): void => {
  listeners.forEach((fn) => fn(payload));
};

/** chunk / 预加载失败的典型报错文案 */
export const CHUNK_ERROR_RE =
  /dynamically imported module|Importing a module script failed|Loading (CSS )?chunk|ChunkLoadError|Unable to preload/i;

export const isChunkLoadError = (error: unknown): boolean =>
  CHUNK_ERROR_RE.test(error instanceof Error ? error.message : String(error));

export const formatErrorTime = (): string =>
  new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

/**
 * 发版后旧 chunk 404 时自动整页重载一次就能自愈。
 * 但必须限次：资源是真缺失时无条件重载会变成无限刷新。
 * 只用于「自动」重载；用户主动点重试按钮不受此限制。
 */
const RELOAD_KEY = 'page-change:chunk-reload-at';
const RELOAD_WINDOW = 10_000;

export const shouldAutoReload = (): boolean => {
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Number.isFinite(last) && Date.now() - last < RELOAD_WINDOW) {
      return false;
    }
    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    return true;
  } catch {
    // 存储不可用时宁可出错误页，也不冒无限刷新的风险
    return false;
  }
};

/** hash 路由下重载要保留目标路径，否则用户会被扔回首页 */
export const reloadTo = (path?: string): void => {
  if (!path) {
    window.location.reload();
    return;
  }
  const { pathname, search } = window.location;
  window.location.replace(`${pathname}${search}#${path}`);
  window.setTimeout(() => window.location.reload(), 32);
};
