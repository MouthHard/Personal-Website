import { shallowRef, triggerRef, computed } from 'vue';

export type CheckinStatus = 'eaten' | 'want';

const STORAGE_KEY = 'travel-guide-food-checkin';

const eatenSet = shallowRef<Set<string>>(new Set());
const wantSet = shallowRef<Set<string>>(new Set());
let initialized = false;

const loadCheckin = () => {
  if (initialized) return;
  initialized = true;
  if (typeof localStorage === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { eaten: string[]; want: string[] };
      eatenSet.value = new Set(parsed.eaten || []);
      wantSet.value = new Set(parsed.want || []);
    }
  } catch {
    eatenSet.value = new Set();
    wantSet.value = new Set();
  }
};

let persistTimer: ReturnType<typeof setTimeout> | null = null;

const persist = () => {
  if (typeof localStorage === 'undefined') return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        eaten: [...eatenSet.value],
        want: [...wantSet.value],
      }),
    );
  }, 300);
};

export function useCheckin() {
  loadCheckin();

  const getCheckinStatus = (id: string): CheckinStatus | null => {
    if (eatenSet.value.has(id)) return 'eaten';
    if (wantSet.value.has(id)) return 'want';
    return null;
  };

  const isWant = (id: string): boolean => wantSet.value.has(id);
  const isEaten = (id: string): boolean => eatenSet.value.has(id);


  const toggleCheckin = (id: string, status: CheckinStatus) => {
    if (status === 'eaten') {
      if (eatenSet.value.has(id)) {
        eatenSet.value.delete(id);
      } else {
        eatenSet.value.add(id);
      }
      triggerRef(eatenSet);
    } else {
      if (wantSet.value.has(id)) {
        wantSet.value.delete(id);
      } else {
        wantSet.value.add(id);
      }
      triggerRef(wantSet);
    }
    persist();
  };

  const removeCheckin = (id: string) => {
    const wasEaten = eatenSet.value.has(id);
    const wasWant = wantSet.value.has(id);
    eatenSet.value.delete(id);
    wantSet.value.delete(id);
    if (wasEaten) triggerRef(eatenSet);
    if (wasWant) triggerRef(wantSet);
    persist();
  };

  const eatenIds = computed(() => [...eatenSet.value]);
  const wantIds = computed(() => [...wantSet.value]);

  return {
    getCheckinStatus,
    isWant,
    isEaten,
    toggleCheckin,
    removeCheckin,
    eatenIds,
    wantIds,
  };
}
