import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';
import type { Artifact } from '@/typesOfPages/museum';
import { artifactTypes } from '@/constants/museum/artifactFilters';

const categoryLabelMap = new Map<string, string>(
  artifactTypes.map(t => [t.value, t.label]),
);

interface HotTag {
  text: string;
}

export function useArtifactHotTags(artifacts: MaybeRefOrGetter<Artifact[]>): {
  hotSearchTags: ComputedRef<HotTag[]>;
} {
  const hotSearchTags = computed<HotTag[]>(() => {
    const list = toValue(artifacts);
    const tagCount = new Map<string, number>();

    const collectTag = (tag: string) => {
      if (!tag || tag.length < 1) return;
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    };

    for (const a of list) {
      collectTag(a.period);
      if (a.category) {
        const label = categoryLabelMap.get(a.category);
        if (label) collectTag(label);
      }
    }

    return [...tagCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => ({ text: tag }));
  });

  return { hotSearchTags };
}