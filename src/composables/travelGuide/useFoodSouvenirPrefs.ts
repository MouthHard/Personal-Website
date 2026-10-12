import { ref, computed } from 'vue';

const STORAGE_KEY = 'travel-guide-food-souvenir-prefs';

interface FoodSouvenirPrefs {
  want: string[];
  bought: string[];
}

const prefs = ref<FoodSouvenirPrefs>({ want: [], bought: [] });
let initialized = false;

const loadPrefs = () => {
  if (initialized) return;
  initialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as FoodSouvenirPrefs;
      prefs.value = {
        want: Array.isArray(data.want) ? data.want : [],
        bought: Array.isArray(data.bought) ? data.bought : [],
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

export function useFoodSouvenirPrefs() {
  loadPrefs();

  const wantSet = computed(() => new Set(prefs.value.want));
  const boughtSet = computed(() => new Set(prefs.value.bought));

  const wantIds = computed(() => [...prefs.value.want]);
  const boughtIds = computed(() => [...prefs.value.bought]);

  const isWant = (id: string): boolean => wantSet.value.has(id);
  const isBought = (id: string): boolean => boughtSet.value.has(id);

  const toggleWant = (id: string): void => {
    if (wantSet.value.has(id)) {
      prefs.value.want = prefs.value.want.filter((x) => x !== id);
    } else {
      prefs.value.want = [...prefs.value.want, id];
    }
    savePrefs();
  };

  const toggleBought = (id: string): void => {
    if (boughtSet.value.has(id)) {
      prefs.value.bought = prefs.value.bought.filter((x) => x !== id);
    } else {
      prefs.value.bought = [...prefs.value.bought, id];
    }
    savePrefs();
  };

  return {
    wantIds,
    boughtIds,
    isWant,
    isBought,
    toggleWant,
    toggleBought,
  };
}