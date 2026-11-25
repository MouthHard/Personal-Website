/**
 * 音乐页定制消息弹窗（声波紫主题 · 替代 ElMessage）
 */
import { createMessageEngine } from '@/components/common/MessageCore';

export const musicMessage = createMessageEngine({
  id: 'music',
  radius: 14,
  duration: 2800,
  minWidth: 240,
  maxWidth: 420,
  background: 'rgba(28, 18, 42, 0.92)',
  colors: {
    success: '192, 132, 252',
    info: '148, 163, 184',
    error: '244, 114, 182',
    warning: '250, 204, 21',
  },
});
