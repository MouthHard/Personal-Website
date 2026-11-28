import { computed } from 'vue';

/**
 * 排序高亮/淡化：只有当前排序维度对应的指标保持高亮，
 * 其余指标在非「综合」排序下淡化，避免视觉噪音。
 */
export function useSortDimming(getSortMode: () => string) {
  const isDimmed = (metric: string) =>
    computed(() => {
      const mode = getSortMode();
      return mode !== 'relevance' && mode !== metric;
    });

  return {
    isDateDimmed: isDimmed('latest'),
    isLikeDimmed: isDimmed('likes'),
    isLoveDimmed: isDimmed('loves'),
    isViewsDimmed: isDimmed('views'),
    isBookmarkDimmed: isDimmed('bookmarks'),
    isShareDimmed: isDimmed('shares'),
  };
}

/** 摄影师卡片使用粉丝 / 作品 / 点赞 / 浏览四个排序维度 */
export function usePhotographerSortDimming(getSortMode: () => string) {
  const isDimmed = (metric: string) =>
    computed(() => {
      const mode = getSortMode();
      return mode !== 'relevance' && mode !== metric;
    });

  return {
    isFollowersDimmed: isDimmed('followers'),
    isWorksDimmed: isDimmed('works'),
    isLikeDimmed: isDimmed('likes'),
    isViewsDimmed: isDimmed('views'),
  };
}
