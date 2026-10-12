import { ref, computed } from 'vue';
import type { Food } from '@/typesOfPages/travelGuide';

const STORAGE_KEY = 'travel-guide-food-prefs';
const LEGACY_FAVORITES_KEY = 'travel-guide-food-favorites';

interface FoodPrefs {
  favorites: string[];
  thumbsUp: string[];
}

const prefs = ref<FoodPrefs>({ favorites: [], thumbsUp: [] });
let initialized = false;

const loadPrefs = () => {
  if (initialized) return;
  initialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as FoodPrefs;
      prefs.value = {
        favorites: Array.isArray(data.favorites) ? data.favorites : [],
        thumbsUp: Array.isArray(data.thumbsUp) ? data.thumbsUp : [],
      };
    } else {
      const legacy = localStorage.getItem(LEGACY_FAVORITES_KEY);
      if (legacy) {
        const legacyIds = JSON.parse(legacy) as string[];
        if (Array.isArray(legacyIds)) {
          prefs.value.favorites = legacyIds;
        }
      }
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

  const favoriteSet = computed(() => new Set(prefs.value.favorites));
  const thumbsUpSet = computed(() => new Set(prefs.value.thumbsUp));

  const favoriteIds = computed(() => [...prefs.value.favorites]);
  const thumbsUpIds = computed(() => [...prefs.value.thumbsUp]);
  const favoriteCount = computed(() => prefs.value.favorites.length);
  const thumbsUpCount = computed(() => prefs.value.thumbsUp.length);

  const isFavorite = (food: Food): boolean => favoriteSet.value.has(food.id);
  const isThumbsUp = (food: Food): boolean => thumbsUpSet.value.has(food.id);

  const toggleFavorite = (food: Food): void => {
    if (favoriteSet.value.has(food.id)) {
      prefs.value.favorites = prefs.value.favorites.filter((x) => x !== food.id);
    } else {
      prefs.value.favorites = [...prefs.value.favorites, food.id];
    }
    savePrefs();
  };

  const toggleThumbsUp = (food: Food): void => {
    if (thumbsUpSet.value.has(food.id)) {
      prefs.value.thumbsUp = prefs.value.thumbsUp.filter((x) => x !== food.id);
    } else {
      prefs.value.thumbsUp = [...prefs.value.thumbsUp, food.id];
    }
    savePrefs();
  };

  return {
    favoriteIds,
    thumbsUpIds,
    favoriteCount,
    thumbsUpCount,
    isFavorite,
    isThumbsUp,
    toggleFavorite,
    toggleThumbsUp,
  };
}