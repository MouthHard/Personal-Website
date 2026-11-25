/**
 * 风景页定制消息弹窗（山谷青绿主题 · 替代 ElMessage）
 * 底层的语义消息（like/love/favorite...）仍由 utils/landscape/message.ts 组装，
 * 这里只负责「怎么显示」。
 */
import { createMessageEngine } from '@/components/common/MessageCore';

export const landscapeMessage = createMessageEngine({
  id: 'landscape',
  radius: 10,
  duration: 3000,
  minWidth: 280,
  maxWidth: 440,
  background: 'rgba(16, 32, 28, 0.92)',
  colors: {
    success: '74, 222, 128',
    info: '125, 211, 252',
    error: '248, 113, 113',
    warning: '251, 191, 36',
  },
});
