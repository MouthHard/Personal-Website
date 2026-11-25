/**
 * 诗词交互 composable
 * 统一「点赞 / 喜爱 / 收藏」的状态、切换与提示，以及分享逻辑。
 * PoemCard 与 PoemModal 复用同一套实现，消除三处重复代码；
 * 分享失败统一走 share.error()，避免「复制失败仍提示成功」。
 */
import { computed } from 'vue';
import type { Poem } from '@/typesOfPages/aphorism/poem';
import { useAphorismInteractionStore } from '@/stores/aphorism/interaction';
import { usePoemMessage } from '@/pages/Aphorism/components/PoemMessage/usePoemMessage';

export function usePoemInteractions(getPoem: () => Poem) {
  const interactionStore = useAphorismInteractionStore();
  const showMessage = usePoemMessage();

  const isLiked = computed(() => interactionStore.isLiked(getPoem().id));
  const isLoved = computed(() => interactionStore.isLoved(getPoem().id));
  const isFavorite = computed(() => interactionStore.isFavorite(getPoem().id));

  const toggleLike = () => {
    interactionStore.toggleLike(getPoem().id);
    if (isLiked.value) {
      showMessage.like.success(getPoem().title);
    } else {
      showMessage.like.cancel();
    }
  };

  const toggleLove = () => {
    interactionStore.toggleLove(getPoem().id);
    if (isLoved.value) {
      showMessage.love.success(getPoem().title, 'poem');
    } else {
      showMessage.love.cancel(getPoem().title, 'poem');
    }
  };

  const toggleFavorite = () => {
    interactionStore.toggleFavorite(getPoem().id);
    if (isFavorite.value) {
      showMessage.favorite.success(getPoem().title, 'poem');
    } else {
      showMessage.favorite.cancel(getPoem().title, 'poem');
    }
  };

  /** 记录一次浏览：最近浏览（滚动20条）+ 读过足迹（累积），由弹窗在打开时调用 */
  const recordView = () => {
    const id = getPoem().id;
    interactionStore.addRecentView(id);
    interactionStore.addRead(id);
  };

  /** 分享：优先系统分享面板，降级复制剪贴板；失败给出明确提示 */
  const sharePoem = async () => {
    const poem = getPoem();
    const text = `${poem.title} - ${poem.author}\n\n${poem.content.join('\n')}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem.title,
          text,
          url: window.location.href,
        });
      } catch {
        // 用户主动取消系统分享面板属正常行为，无需提示
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showMessage.share.copied();
    } catch {
      showMessage.share.error();
    }
  };

  return {
    isLiked,
    isLoved,
    isFavorite,
    toggleLike,
    toggleLove,
    toggleFavorite,
    recordView,
    sharePoem,
  };
}
