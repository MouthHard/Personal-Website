/**
 * 博物馆页定制消息弹窗（文物鎏金主题 · 替代 ElMessage）
 * 沿用旧 museum-message 的深色 3D 气质，改为零依赖实现。
 */
import { createMessageEngine } from '@/components/common/MessageCore';

export const museumMessage = createMessageEngine({
  id: 'museum',
  radius: 8,
  duration: 2800,
  zIndex: 12000,
  minWidth: 280,
  maxWidth: 460,
  background: 'rgba(28, 22, 16, 0.93)',
  fontFamily: '"STKaiti", "KaiTi", serif',
  fontSize: 16,
  colors: {
    success: '212, 175, 55',
    info: '186, 218, 85',
    error: '239, 68, 68',
    warning: '245, 158, 11',
  },
});
