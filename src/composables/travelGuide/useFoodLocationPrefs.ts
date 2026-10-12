import { ref, computed } from 'vue';

const STORAGE_KEY = 'travel-guide-food-location-prefs';

interface FoodLocationPrefs {
  favorites: string[];
  want: string[];
  been: string[];
}

const prefs = ref<FoodLocationPrefs>({ favorites: [], want: [], been: [] });
let initialized = false;

const loadPrefs = () => {
  if (initialized) return;
  initialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as FoodLocationPrefs;
      prefs.value = {
        favorites: Array.isArray(data.favorites) ? data.favorites : [],
        want: Array.isArray(data.want) ? data.want : [],
        been: Array.isArray(data.been) ? data.been : [],
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

export function useFoodLocationPrefs() {
  loadPrefs();

  const favoriteSet = computed(() => new Set(prefs.value.favorites));
  const wantSet = computed(() => new Set(prefs.value.want));
  const beenSet = computed(() => new Set(prefs.value.been));

  const favoriteIds = computed(() => [...prefs.value.favorites]);
  const wantIds = computed(() => [...prefs.value.want]);
  const beenIds = computed(() => [...prefs.value.been]);

  const isFavorite = (id: string | number): boolean =>
    favoriteSet.value.has(String(id));
  const isWant = (id: string | number): boolean =>
    wantSet.value.has(String(id));
  const isBeen = (id: string | number): boolean =>
    beenSet.value.has(String(id));

  const toggleFavorite = (id: string | number): void => {
    const sid = String(id);
    if (favoriteSet.value.has(sid)) {
      prefs.value.favorites = prefs.value.favorites.filter((x) => x !== sid);
    } else {
      prefs.value.favorites = [...prefs.value.favorites, sid];
    }
    savePrefs();
  };

  const toggleWant = (id: string | number): void => {
    const sid = String(id);
    if (wantSet.value.has(sid)) {
      prefs.value.want = prefs.value.want.filter((x) => x !== sid);
    } else {
      prefs.value.want = [...prefs.value.want, sid];
    }
    savePrefs();
  };

  const toggleBeen = (id: string | number): void => {
    const sid = String(id);
    if (beenSet.value.has(sid)) {
      prefs.value.been = prefs.value.been.filter((x) => x !== sid);
    } else {
      prefs.value.been = [...prefs.value.been, sid];
    }
    savePrefs();
  };

  return {
    favoriteIds,
    wantIds,
    beenIds,
    isFavorite,
    isWant,
    isBeen,
    toggleFavorite,
    toggleWant,
    toggleBeen,
  };
}