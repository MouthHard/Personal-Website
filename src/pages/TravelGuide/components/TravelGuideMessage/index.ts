/**
 * 旅游页定制消息弹窗（旅途橙主题 · 替代 ElMessage）
 */
import { createMessageEngine } from '@/components/common/MessageCore';

export const travelGuideMessage = createMessageEngine({
  id: 'travelguide',
  radius: 12,
  duration: 2800,
  minWidth: 260,
  maxWidth: 450,
  background: 'rgba(30, 24, 16, 0.92)',
  colors: {
    success: '251, 146, 60',
    info: '96, 165, 250',
    error: '244, 63, 94',
    warning: '253, 224, 71',
  },
});
