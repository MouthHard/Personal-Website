import { ref } from 'vue';

export type ToastType =
  | 'like'
  | 'want'
  | 'eaten'
  | 'share'
  | 'souvenir-want'
  | 'souvenir-bought'
  | 'route-fav'
  | 'route-done'
  | 'info'
  | 'remove'
  | 'success'
  | 'warning';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

export interface ToastOptions {
  type?: ToastType;
  message: string;
  duration?: number;
}

const toasts = ref<ToastItem[]>([]);
let nextId = 0;
const timers = new Map<number, ReturnType<typeof setTimeout>>();
const MAX_TOASTS = 5;

function dismiss(id: number): void {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function show(options: ToastOptions): void {
  const type = options.type || 'info';
  const duration = options.duration ?? 1500;
  const id = nextId++;

  toasts.value.push({ id, type, message: options.message });

  if (toasts.value.length > MAX_TOASTS) {
    const oldest = toasts.value[0];
    dismiss(oldest.id);
  }

  if (duration > 0) {
    const timer = setTimeout(() => dismiss(id), duration);
    timers.set(id, timer);
  }
}

function clearAll(): void {
  for (const [id] of timers) {
    clearTimeout(timers.get(id)!);
  }
  timers.clear();
  toasts.value = [];
}

export function useTravelToast() {
  return {
    toasts,
    show,
    dismiss,
    clearAll,
  };
}