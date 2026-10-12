import { ref, computed } from 'vue';
import type { Food } from '@/typesOfPages/travelGuide';

const STORAGE_KEY = 'travel-guide-food-prefs';

interface FoodPrefs {
  thumbsUp: string[];
}

const prefs = ref<FoodPrefs>({ thumbsUp: [] });
let initialized = false;

const loadPrefs = () => {
  if (initialized) return;
  initialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as FoodPrefs;
      prefs.value = {
        thumbsUp: Array.isArray(data.thumbsUp) ? data.thumbsUp : [],
      };
    }
  } catch {
    // ignore
  }
};

const savePrefs = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs.value));
  } catch {
    // ignore
  }
};

export function useFoodPrefs() {
  loadPrefs();

  const thumbsUpSet = computed(() => new Set(prefs.value.thumbsUp));
  const thumbsUpIds = computed(() => [...prefs.value.thumbsUp]);


  const isThumbsUp = (food: Food): boolean => thumbsUpSet.value.has(food.id);

  const toggleThumbsUp = (food: Food): void => {
    if (thumbsUpSet.value.has(food.id)) {
      prefs.value.thumbsUp = prefs.value.thumbsUp.filter((x) => x !== food.id);
    } else {
      prefs.value.thumbsUp = [...prefs.value.thumbsUp, food.id];
    }
    savePrefs();
  };

  return {
    thumbsUpIds,

    isThumbsUp,
    toggleThumbsUp,
  };
}