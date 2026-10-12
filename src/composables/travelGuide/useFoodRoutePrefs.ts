import { ref, computed } from 'vue';

const STORAGE_KEY = 'travel-guide-food-route-prefs';

interface FoodRoutePrefs {
  favorited: string[];
  completed: string[];
}

const prefs = ref<FoodRoutePrefs>({ favorited: [], completed: [] });
let initialized = false;

const loadPrefs = () => {
  if (initialized) return;
  initialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as FoodRoutePrefs;
      prefs.value = {
        favorited: Array.isArray(data.favorited) ? data.favorited : [],
        completed: Array.isArray(data.completed) ? data.completed : [],
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

export function useFoodRoutePrefs() {
  loadPrefs();

  const favoritedSet = computed(() => new Set(prefs.value.favorited));
  const completedSet = computed(() => new Set(prefs.value.completed));

  const favoritedIds = computed(() => [...prefs.value.favorited]);
  const completedIds = computed(() => [...prefs.value.completed]);

  const isFavorited = (id: string): boolean => favoritedSet.value.has(id);
  const isCompleted = (id: string): boolean => completedSet.value.has(id);

  const toggleFavorited = (id: string): void => {
    if (favoritedSet.value.has(id)) {
      prefs.value.favorited = prefs.value.favorited.filter((x) => x !== id);
    } else {
      prefs.value.favorited = [...prefs.value.favorited, id];
    }
    savePrefs();
  };

  const toggleCompleted = (id: string): void => {
    if (completedSet.value.has(id)) {
      prefs.value.completed = prefs.value.completed.filter((x) => x !== id);
    } else {
      prefs.value.completed = [...prefs.value.completed, id];
    }
    savePrefs();
  };

  return {
    favoritedIds,
    completedIds,
    isFavorited,
    isCompleted,
    toggleFavorited,
    toggleCompleted,
  };
}