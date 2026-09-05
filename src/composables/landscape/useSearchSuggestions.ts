import { ref, computed, type ComputedRef, type Ref } from 'vue';
import { useLandscapeDataStore } from '@/stores/landscape/data';

export function useSearchSuggestions() {
  const dataStore = useLandscapeDataStore();
  const suggestions: Ref<string[]> = ref([]);

  const allKeywords = computed(() => {
    const keywords = new Set<string>();

    const images = dataStore.getAllImages();
    for (const img of images) {
      if (img.title) keywords.add(img.title);
      if (img.location) keywords.add(img.location);
      if (img.author) keywords.add(img.author);
      if (img.tags) for (const t of img.tags) keywords.add(t);
    }

    const videos = dataStore.getAllVideos();
    for (const v of videos) {
      if (v.title) keywords.add(v.title);
      if (v.location) keywords.add(v.location);
      if (v.author) keywords.add(v.author);
      if (v.tags) for (const t of v.tags) keywords.add(t);
    }

    const guides = dataStore.getAllGuides();
    for (const g of guides) {
      if (g.title) keywords.add(g.title);
      if (g.location) keywords.add(g.location);
      if (g.author) keywords.add(g.author);
      if (g.tags) for (const t of g.tags) keywords.add(t);
      if (g.highlights) for (const h of g.highlights) keywords.add(h);
    }

    const photographers = dataStore.getAllPhotographers();
    for (const p of photographers) {
      if (p.name) keywords.add(p.name);
      if (p.location) keywords.add(p.location);
      if (p.tags) for (const t of p.tags) keywords.add(t);
    }

    return [...keywords].sort();
  });

  const updateSuggestions = (keyword: string) => {
    if (!keyword || keyword.length < 1) {
      suggestions.value = [];
      return;
    }

    const lower = keyword.toLowerCase();
    const matched = allKeywords.value.filter(k =>
      k.toLowerCase().includes(lower) && k !== keyword
    ).slice(0, 6);

    suggestions.value = matched;
  };

  return {
    suggestions,
    updateSuggestions,
  };
}