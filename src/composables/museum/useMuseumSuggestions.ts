import { ref, computed, type Ref, type MaybeRefOrGetter, toValue } from 'vue';
import type { Museum } from '@/typesOfPages/museum';

export function useMuseumSuggestions(museums: MaybeRefOrGetter<Museum[]>) {
  const suggestions: Ref<string[]> = ref([]);

  const allKeywords = computed<string[]>(() => {
    const list = toValue(museums);
    const keywords = new Set<string>();

    for (const m of list) {
      if (m.name) keywords.add(m.name);
      if (m.province) keywords.add(m.province);
      if (m.type) keywords.add(m.type);
      if (m.description) {
        const words = m.description.split(/[\s,，。、；;]+/).filter(w => w.length >= 2);
        for (const w of words) keywords.add(w);
      }
      if (m.features) {
        for (const f of m.features) keywords.add(f);
      }
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