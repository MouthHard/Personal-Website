import { ref, computed, type Ref } from 'vue';
import { useLandscapeDataStore } from '@/stores/landscape/data';

export function useGuideSearchSuggestions() {
  const dataStore = useLandscapeDataStore();
  const suggestions: Ref<string[]> = ref([]);

  const allKeywords = computed(() => {
    const keywords = new Set<string>();

    const guides = dataStore.getAllGuides();
    for (const g of guides) {
      if (g.title) keywords.add(g.title);
      if (g.location) keywords.add(g.location);
      if (g.author) keywords.add(g.author);
      if (g.category) keywords.add(g.category);
      if (g.tags) for (const t of g.tags) keywords.add(t);
      if (g.highlights) for (const h of g.highlights) keywords.add(h);
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