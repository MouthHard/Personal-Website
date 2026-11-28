import { computed, ref } from 'vue';

/** 与 ShareMenu 组件 work 属性保持一致的分享数据 */
export interface ShareWork {
  type?: 'image' | 'video' | 'guide';
  title?: string;
  description?: string;
  cover?: string;
  author?: string;
  date?: string;
  location?: string;
  category?: string;
  tags?: string[];
  duration?: string;
  resolution?: string;
  camera?: string;
  rating?: number;
  readTime?: string;
}

/**
 * 首页各分区的分享弹层状态。
 * 各分区只需在点击分享时调用 openShareMenu 传入当前作品。
 */
export function useShareMenu() {
  const visible = ref(false);
  const work = ref<ShareWork | null>(null);

  const shareWork = computed<ShareWork>(() => work.value ?? {});

  const openShareMenu = (next: ShareWork) => {
    work.value = next;
    visible.value = true;
  };

  const closeShareMenu = () => {
    visible.value = false;
  };

  return { visible, shareWork, openShareMenu, closeShareMenu };
}
