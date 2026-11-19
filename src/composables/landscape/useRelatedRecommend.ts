import { computed } from 'vue';
import { useLandscapeDataStore } from '@/stores/landscape';

export interface RecommendItem {
  id: string;
  type: 'image' | 'video' | 'guide';
  title: string;
  cover: string;
  location?: string;
  author?: string;
}

export interface RecommendOptions {
  currentId?: string;
  currentType: 'image' | 'video' | 'guide';
  authorId?: string;
  location?: string;
  tags?: string[];
  maxItems?: number;
}

export function useRelatedRecommend(getOptions: () => RecommendOptions) {
  const dataStore = useLandscapeDataStore();

  const items = computed<RecommendItem[]>(() => {
    const opts = getOptions();
    const result: RecommendItem[] = [];
    const seen = new Set<string>();
    const max = opts.maxItems ?? 6;

    const addItem = (item: RecommendItem) => {
      const key = `${item.type}-${item.id}`;
      if (seen.has(key)) return;
      if (item.id === opts.currentId && item.type === opts.currentType) return;
      seen.add(key);
      result.push(item);
    };

    // 1. 同作者其他类型作品（最强信号）
    if (opts.authorId) {
      const works = dataStore.getWorksByAuthor(opts.authorId);
      if (opts.currentType !== 'video') {
        for (const v of works.videos) {
          if (result.length >= max) break;
          addItem({
            id: v.id,
            type: 'video',
            title: v.title,
            cover: v.poster,
            location: v.location,
            author: v.author,
          });
        }
      }
      if (opts.currentType !== 'guide') {
        for (const g of works.guides) {
          if (result.length >= max) break;
          addItem({
            id: g.id,
            type: 'guide',
            title: g.title,
            cover: g.cover,
            location: g.location,
            author: g.author,
          });
        }
      }
      if (opts.currentType !== 'image') {
        for (const img of works.images) {
          if (result.length >= max) break;
          addItem({
            id: img.id,
            type: 'image',
            title: img.title,
            cover: img.thumbnail || img.url,
            location: img.location,
            author: img.author,
          });
        }
      }
    }

    // 2. 同地点其他类型作品（次强信号）
    if (result.length < max && opts.location) {
      const loc = opts.location;
      if (opts.currentType !== 'video') {
        for (const v of dataStore.getAllVideos()) {
          if (result.length >= max) break;
          if (v.location === loc)
            addItem({
              id: v.id,
              type: 'video',
              title: v.title,
              cover: v.poster,
              location: v.location,
              author: v.author,
            });
        }
      }
      if (opts.currentType !== 'guide') {
        for (const g of dataStore.getAllGuides()) {
          if (result.length >= max) break;
          if (g.location === loc)
            addItem({
              id: g.id,
              type: 'guide',
              title: g.title,
              cover: g.cover,
              location: g.location,
              author: g.author,
            });
        }
      }
      if (opts.currentType !== 'image') {
        for (const img of dataStore.getAllImages()) {
          if (result.length >= max) break;
          if (img.location === loc)
            addItem({
              id: img.id,
              type: 'image',
              title: img.title,
              cover: img.thumbnail || img.url,
              location: img.location,
              author: img.author,
            });
        }
      }
    }

    // 3. 相似 tags 跨类型（补充）
    if (result.length < max && opts.tags && opts.tags.length > 0) {
      const tagSet = new Set(opts.tags);
      if (opts.currentType !== 'video') {
        for (const v of dataStore.getAllVideos()) {
          if (result.length >= max) break;
          if (v.tags?.some((t) => tagSet.has(t)))
            addItem({
              id: v.id,
              type: 'video',
              title: v.title,
              cover: v.poster,
              location: v.location,
              author: v.author,
            });
        }
      }
      if (opts.currentType !== 'guide') {
        for (const g of dataStore.getAllGuides()) {
          if (result.length >= max) break;
          if (g.tags.some((t) => tagSet.has(t)))
            addItem({
              id: g.id,
              type: 'guide',
              title: g.title,
              cover: g.cover,
              location: g.location,
              author: g.author,
            });
        }
      }
      if (opts.currentType !== 'image') {
        for (const img of dataStore.getAllImages()) {
          if (result.length >= max) break;
          if (img.tags.some((t) => tagSet.has(t)))
            addItem({
              id: img.id,
              type: 'image',
              title: img.title,
              cover: img.thumbnail || img.url,
              location: img.location,
              author: img.author,
            });
        }
      }
    }

    return result.slice(0, max);
  });

  return { items };
}
