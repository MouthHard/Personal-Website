import { computed } from 'vue';
import { formatNumber } from '@/utils/landscape/format';
import { useInteractionStore } from '@/stores/landscape';

/** 四类结果卡片共用的交互事件 */
export type SearchCardEmit = {
  (event: 'like', id: string): void;
  (event: 'love', id: string): void;
  (event: 'bookmark', id: string): void;
  (event: 'share', id: string): void;
};

/**
 * 搜索结果卡片的互动状态与操作。
 * 统一处理点赞 / 喜爱 / 收藏 / 分享的计数与事件派发。
 */
export function useSearchCardInteractions(
  getId: () => string | number,
  emit: SearchCardEmit,
) {
  const interactionStore = useInteractionStore();
  const cardId = computed(() => String(getId()));

  const isLiked = computed(() => interactionStore.isLiked(cardId.value));
  const isLoved = computed(() => interactionStore.isLoved(cardId.value));
  const isBookmarked = computed(() =>
    interactionStore.isFavorited(cardId.value),
  );

  const getCounts = () => interactionStore.getCount(cardId.value);

  const handleLike = () => emit('like', cardId.value);
  const handleLove = () => emit('love', cardId.value);
  const handleBookmark = () => emit('bookmark', cardId.value);
  const handleShare = () => emit('share', cardId.value);

  return {
    cardId,
    isLiked,
    isLoved,
    isBookmarked,
    getCounts,
    formatCount: formatNumber,
    handleLike,
    handleLove,
    handleBookmark,
    handleShare,
  };
}
