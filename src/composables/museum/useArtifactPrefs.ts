import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useMuseumMessage } from '@/composables/museum/useMessage';

const STORAGE_KEY = 'museum-artifact-prefs';

interface ArtifactBucket {
  favorites: number[];
  thumbsUp: number[];
}

type AllPrefs = Record<number, ArtifactBucket>;

const allPrefs = ref<AllPrefs>({});
let initialized = false;
const msg = useMuseumMessage();

const loadPrefs = () => {
  if (initialized) return;
  initialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.favorites) || Array.isArray(data.thumbsUp)) return;
      if (typeof data === 'object' && data !== null) {
        allPrefs.value = data;
      }
    }
  } catch {
    // ignore
  }
};

const savePrefs = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPrefs.value));
  } catch {
    // ignore
  }
};

const ensureBucket = (mid: number): ArtifactBucket => {
  if (!allPrefs.value[mid]) {
    allPrefs.value[mid] = { favorites: [], thumbsUp: [] };
  }
  return allPrefs.value[mid];
};

export function useArtifactPrefs(museumId: MaybeRefOrGetter<number>) {
  loadPrefs();

  const currentId = computed(() => toValue(museumId));
  const currentBucket = computed<ArtifactBucket>(
    () => allPrefs.value[currentId.value] || { favorites: [], thumbsUp: [] },
  );

  const isFavored = (id: number) => currentBucket.value.favorites.includes(id);
  const isThumbsUp = (id: number) => currentBucket.value.thumbsUp.includes(id);

  const toggleFavor = (id: number, title?: string) => {
    const bucket = ensureBucket(currentId.value);
    if (bucket.favorites.includes(id)) {
      bucket.favorites = bucket.favorites.filter((x) => x !== id);
      if (title) msg.favorite.cancel(title);
    } else {
      bucket.favorites = [...bucket.favorites, id];
      if (title) msg.favorite.success(title);
    }
    savePrefs();
  };

  const toggleThumbsUp = (id: number, title?: string) => {
    const bucket = ensureBucket(currentId.value);
    if (bucket.thumbsUp.includes(id)) {
      bucket.thumbsUp = bucket.thumbsUp.filter((x) => x !== id);
      if (title) msg.like.cancel();
    } else {
      bucket.thumbsUp = [...bucket.thumbsUp, id];
      if (title) msg.like.success(title);
    }
    savePrefs();
  };

  return {
    isFavored,
    isThumbsUp,
    toggleFavor,
    toggleThumbsUp,
    favoredIds: computed(() => currentBucket.value.favorites),
    thumbsUpIds: computed(() => currentBucket.value.thumbsUp),
  };
}

