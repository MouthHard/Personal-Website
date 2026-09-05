import { computed, type ComputedRef } from 'vue';
import { useLandscapeDataStore } from '@/stores/landscape/data';

interface HotTag {
  icon: string;
  text: string;
}

let _hotSearchTags: ComputedRef<HotTag[]> | null = null;

export function useHotTags() {
  if (_hotSearchTags) {
    return { hotSearchTags: _hotSearchTags };
  }

  const dataStore = useLandscapeDataStore();

  _hotSearchTags = computed(() => {
    const tagCount = new Map<string, number>();

    const collectTags = (tags: string[]) => {
      for (const t of tags) {
        if (!t || t.length < 2) continue;
        tagCount.set(t, (tagCount.get(t) || 0) + 1);
      }
    };

    const images = dataStore.getAllImages();
    for (const img of images) {
      collectTags(img.tags || []);
    }

    const videos = dataStore.getAllVideos();
    for (const v of videos) {
      collectTags(v.tags || []);
    }

    const guides = dataStore.getAllGuides();
    for (const g of guides) {
      collectTags(g.tags || []);
      if (g.highlights) collectTags(g.highlights);
    }

    const photographers = dataStore.getAllPhotographers();
    for (const p of photographers) {
      collectTags(p.tags || []);
    }

    return [...tagCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => ({ icon: '', text: tag }));
  });

  return { hotSearchTags: _hotSearchTags };
}
