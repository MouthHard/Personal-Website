import { computed, type ComputedRef } from 'vue';
import type { ScenerySpot } from '@/typesOfPages/travelGuide';

function isChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text) && !/[a-zA-Z]/.test(text);
}

export function useSceneryHotTags(spots: ComputedRef<ScenerySpot[]>) {
  const hotSearchTags = computed(() => {
    const tagCount = new Map<string, number>();

    const collect = (tag: string) => {
      if (!tag || tag.length < 2 || !isChinese(tag)) return;
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    };

    for (const spot of spots.value) {
      for (const tag of spot.tags || []) collect(tag);
      if (spot.landscapeType) collect(spot.landscapeType);
      for (const lt of spot.landscapeCategory || []) collect(lt);
      for (const lt of spot.landformTags || []) collect(lt);
      if (spot.cultureType) collect(spot.cultureType);
    }

    return [...tagCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  });

  return { hotSearchTags };
}