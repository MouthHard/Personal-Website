import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';
import type { Museum } from '@/typesOfPages/museum';

interface HotTag {
  text: string;
}

export function useMuseumHotTags(museums: MaybeRefOrGetter<Museum[]>): {
  hotSearchTags: ComputedRef<HotTag[]>;
} {
  const hotSearchTags = computed<HotTag[]>(() => {
    const list = toValue(museums);
    const tagCount = new Map<string, number>();

    const collectTag = (tag: string) => {
      if (!tag || tag.length < 1) return;
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    };

    for (const m of list) {
      collectTag(m.province);
      collectTag(m.type);
    }

    return [...tagCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => ({ text: tag }));
  });

  return { hotSearchTags };
}