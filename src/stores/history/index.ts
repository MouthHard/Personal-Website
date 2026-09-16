import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import {
  fetchDynasties,
  fetchHistoricalEvents,
  fetchHistoricalFigures,
  fetchCulturalHeritage,
} from '@/services/history';

export const useHistoryStore = defineStore('historyData', () => {
  const dynasties = shallowRef<any[]>([]);
  const historicalEvents = shallowRef<any[]>([]);
  const historicalFigures = shallowRef<any[]>([]);
  const culturalHeritage = shallowRef<any[]>([]);

  const loading = ref(false);
  const error = ref<string | null>(null);
  const loaded = ref(false);

  async function loadAll() {
    if (loaded.value || loading.value) return;
    loading.value = true;
    error.value = null;
    try {
      const [dynRes, evtRes, figRes, herRes] = await Promise.all([
        fetchDynasties(),
        fetchHistoricalEvents(),
        fetchHistoricalFigures(),
        fetchCulturalHeritage(),
      ]);
      dynasties.value = dynRes?.items || [];
      historicalEvents.value = evtRes?.items || [];
      historicalFigures.value = figRes?.items || [];
      culturalHeritage.value = herRes?.items || [];
      loaded.value = true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败';
      dynasties.value = [];
      historicalEvents.value = [];
      historicalFigures.value = [];
      culturalHeritage.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function ensureLoaded() {
    if (!loaded.value) {
      await loadAll();
    }
  }

  return {
    dynasties,
    historicalEvents,
    historicalFigures,
    culturalHeritage,
    loading,
    error,
    loaded,
    loadAll,
    ensureLoaded,
  };
});