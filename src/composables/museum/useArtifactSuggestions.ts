import { ref, computed, type Ref, type MaybeRefOrGetter, toValue } from 'vue';
import type { Artifact } from '@/typesOfPages/museum';
import { artifactTypes } from '@/constants/museum/artifactFilters';

const categoryLabelMap = new Map<string, string>(
  artifactTypes.map(t => [t.value, t.label]),
);

export function useArtifactSuggestions(artifacts: MaybeRefOrGetter<Artifact[]>) {
  const suggestions: Ref<string[]> = ref([]);

  const allKeywords = computed<string[]>(() => {
    const list = toValue(artifacts);
    const keywords = new Set<string>();

    for (const a of list) {
      if (a.name) keywords.add(a.name);
      if (a.period) keywords.add(a.period);
      if (a.category) {
        const label = categoryLabelMap.get(a.category);
        if (label) keywords.add(label);
      }
      if (a.description) {
        const words = a.description.split(/[\s,，。、；;]+/).filter(w => w.length >= 2);
        for (const w of words) keywords.add(w);
      }
      if (a.basicInfo?.material) keywords.add(a.basicInfo.material);
      if (a.basicInfo?.collection) keywords.add(a.basicInfo.collection);
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