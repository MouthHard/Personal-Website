import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue';

export interface UseModalA11yOptions {
  /** 弹窗内容容器，用于焦点陷阱与初始聚焦 */
  container?: Ref<HTMLElement | null>;
  /** ESC 或关闭时触发 */
  onClose?: () => void;
  /** 打开时锁定 body 滚动，默认 true */
  lockScroll?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * 弹窗可访问性：ESC 关闭、打开时锁定滚动、关闭时归还焦点、Tab 焦点陷阱。
 * 通过传入 visible 的 getter 自动响应开关状态。
 */
export function useModalA11y(
  visible: () => boolean,
  options: UseModalA11yOptions = {},
) {
  const { container, onClose, lockScroll = true } = options;

  let prevOverflow = '';
  let isLocked = false;
  let lastActive: HTMLElement | null = null;

  const lock = () => {
    if (!lockScroll || isLocked) return;
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    isLocked = true;
  };

  const unlock = () => {
    if (!isLocked) return;
    document.body.style.overflow = prevOverflow;
    isLocked = false;
  };

  const getFocusable = (): HTMLElement[] => {
    const el = container?.value;
    if (!el) return [];
    return Array.from(
      el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((node) => node.offsetParent !== null);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose?.();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = getFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = !!container?.value?.contains(active);

    if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && (active === first || !inside)) {
      event.preventDefault();
      last.focus();
    }
  };

  const handleOpen = () => {
    lastActive = document.activeElement as HTMLElement | null;
    lock();
    document.addEventListener('keydown', handleKeydown);
    nextTick(() => {
      const el = container?.value;
      if (!el) return;
      const focusable = getFocusable();
      (focusable[0] ?? el).focus?.();
    });
  };

  const handleClose = () => {
    document.removeEventListener('keydown', handleKeydown);
    unlock();
    if (lastActive?.isConnected) lastActive.focus();
    lastActive = null;
  };

  watch(visible, (open) => (open ? handleOpen() : handleClose()), {
    immediate: true,
  });

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
    unlock();
  });
}
