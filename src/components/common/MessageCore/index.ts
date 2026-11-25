/**
 * 通用消息弹窗引擎（零依赖 · 替代 ElMessage）
 *
 * 设计：纯 TS 动态注入 DOM + 样式，不依赖 Vue / element-plus。
 * 各页面在自己的 components/XXMessage 下用 createMessageEngine(theme) 定制主题后导出同形 API。
 */

export type MessageType = 'success' | 'info' | 'error' | 'warning';

export interface MessageTheme {
  /** 容器 id，各页面唯一，避免多页面样式/实例互相污染 */
  id: string;
  /** 弹窗圆角 */
  radius?: number;
  /** 最小/最大宽度 */
  minWidth?: number;
  maxWidth?: number;
  /** 顶部距 */
  top?: number;
  /** 自动关闭毫秒 */
  duration?: number;
  /** z-index */
  zIndex?: number;
  /** 弹窗底色 */
  background?: string;
  /** 文字字体 */
  fontFamily?: string;
  /** 字号 */
  fontSize?: number;
  /** 四种类型的主题色（rgb 三元组，用于 rgba 拼接） */
  colors?: Record<MessageType, string>;
  /** 四种类型的图标 SVG（可选，默认用内置简约图标） */
  icons?: Partial<Record<MessageType, string>>;
  /** 自定义 class（追加到每个弹窗） */
  className?: string;
}

const DEFAULT_COLORS: Record<MessageType, string> = {
  success: '76, 175, 80',
  info: '66, 165, 245',
  error: '239, 83, 80',
  warning: '255, 183, 77',
};

const DEFAULT_ICONS: Record<MessageType, string> = {
  success: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 L9 17 L4 12"/></svg>`,
  info: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11 L12 16"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  error: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 L6 18"/><path d="M6 6 L18 18"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 L22 20 L2 20 Z"/><path d="M12 9 L12 14"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>`,
};

const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6 L18 18"/><path d="M18 6 L6 18"/></svg>`;

export interface MessageHandle {
  close: () => void;
}

export interface MessageApi {
  success: (message: string) => MessageHandle;
  info: (message: string) => MessageHandle;
  error: (message: string) => MessageHandle;
  warning: (message: string) => MessageHandle;
}

/** 转义 HTML，防止消息文本里的尖括号破坏结构 */
const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[c] ?? c;
  });

const slug = (s: string): string => s.replace(/[^a-zA-Z0-9_-]/g, '');

export const createMessageEngine = (theme: MessageTheme): MessageApi => {
  const id = slug(theme.id) || 'msg';
  const cls = `${id}-msg`;
  const duration = theme.duration ?? 3000;
  const zIndex = theme.zIndex ?? 11000;
  const top = theme.top ?? 28;
  const radius = theme.radius ?? 12;
  const minWidth = theme.minWidth ?? 260;
  const maxWidth = theme.maxWidth ?? 460;
  const background = theme.background ?? 'rgba(20, 22, 30, 0.9)';
  const fontFamily = theme.fontFamily ?? 'inherit';
  const fontSize = theme.fontSize ?? 15;
  const colors = { ...DEFAULT_COLORS, ...(theme.colors || {}) };
  const icons = { ...DEFAULT_ICONS, ...(theme.icons || {}) };
  const extraClass = theme.className
    ? ` ${slug(theme.className.split(' ')[0])}`
    : '';

  let container: HTMLElement | null = null;
  let styleInjected = false;

  const injectStyles = () => {
    if (styleInjected) return;
    styleInjected = true;
    const el = document.createElement('style');
    el.setAttribute(`data-${id}-message`, '');
    const rules: string[] = [
      `#${id}-container{position:fixed;top:${top}px;left:50%;transform:translateX(-50%);z-index:${zIndex};display:flex;flex-direction:column;align-items:center;gap:12px;pointer-events:none;}`,
      `.${cls}{pointer-events:auto;display:flex;align-items:center;min-width:${minWidth}px;max-width:${maxWidth}px;padding:12px 16px;border-radius:${radius}px;background:${background};backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 28px rgba(0,0,0,.35);color:rgba(255,255,255,.92);font-family:${fontFamily};font-size:${fontSize}px;line-height:1.5;animation:${cls}In .32s cubic-bezier(.34,1.4,.64,1) forwards;}`,
      `.${cls}.closing{animation:${cls}Out .26s ease-in forwards;}`,
      `.${cls}-icon{display:flex;align-items:center;justify-content:center;width:30px;height:30px;flex-shrink:0;margin-right:12px;border-radius:50%;}`,
      `.${cls}-text{flex:1;word-break:break-word;}`,
      `.${cls}-close{display:flex;align-items:center;justify-content:center;width:26px;height:26px;flex-shrink:0;margin-left:12px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);cursor:pointer;transition:background .2s,color .2s;}`,
      `.${cls}-close:hover{background:rgba(255,255,255,.18);color:#fff;}`,
      `@keyframes ${cls}In{0%{opacity:0;transform:translateY(-24px) scale(.94)}100%{opacity:1;transform:translateY(0) scale(1)}}`,
      `@keyframes ${cls}Out{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-18px) scale(.96)}}`,
    ];
    (Object.keys(colors) as MessageType[]).forEach((type) => {
      const c = colors[type];
      rules.push(
        `.${cls}.${type}{border-color:rgba(${c},.38);box-shadow:0 0 0 1px rgba(${c},.16),0 8px 28px rgba(0,0,0,.35),0 0 18px rgba(${c},.14);}`,
        `.${cls}.${type} .${cls}-icon{background:rgba(${c},.16);color:rgb(${c});}`,
      );
    });
    el.textContent = rules.join('\n');
    document.head.appendChild(el);
  };

  const getContainer = (): HTMLElement => {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.id = `${id}-container`;
    document.body.appendChild(container);
    return container;
  };

  const show = (type: MessageType, message: string): MessageHandle => {
    injectStyles();
    const box = getContainer();
    const msg = document.createElement('div');
    msg.className = `${cls} ${type}${extraClass}`;
    msg.innerHTML =
      `<span class="${cls}-icon">${icons[type]}</span>` +
      `<span class="${cls}-text">${escapeHtml(message)}</span>` +
      `<button class="${cls}-close" aria-label="关闭">${CLOSE_ICON}</button>`;
    box.appendChild(msg);

    let removed = false;
    const state: { timer?: number } = {};
    const close = () => {
      if (removed) return;
      removed = true;
      if (state.timer) window.clearTimeout(state.timer);
      msg.classList.add('closing');
      window.setTimeout(() => msg.remove(), 260);
    };
    state.timer = window.setTimeout(close, duration);
    msg.addEventListener('mouseenter', close);
    const closeBtn = msg.querySelector('button');
    closeBtn?.addEventListener('click', close);
    return { close };
  };

  return {
    success: (m) => show('success', m),
    info: (m) => show('info', m),
    error: (m) => show('error', m),
    warning: (m) => show('warning', m),
  };
};
