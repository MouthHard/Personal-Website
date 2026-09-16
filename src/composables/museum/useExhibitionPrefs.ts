import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useMuseumMessage } from '@/composables/museum/useMessage';

const STORAGE_KEY = 'museum-exhibition-prefs';

interface ExhibitionBucket {
  followed: number[];
  favorited: number[];
}

type AllPrefs = Record<number, ExhibitionBucket>;

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
      if (Array.isArray(data.followed) || Array.isArray(data.favorited)) return;
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

const ensureBucket = (mid: number): ExhibitionBucket => {
  if (!allPrefs.value[mid]) {
    allPrefs.value[mid] = { followed: [], favorited: [] };
  }
  return allPrefs.value[mid];
};

export function useExhibitionPrefs(museumId: MaybeRefOrGetter<number>) {
  loadPrefs();

  const currentId = computed(() => toValue(museumId));
  const currentBucket = computed<ExhibitionBucket>(
    () => allPrefs.value[currentId.value] || { followed: [], favorited: [] },
  );

  const isFollowed = (id: number) => currentBucket.value.followed.includes(id);
  const isFavorited = (id: number) => currentBucket.value.favorited.includes(id);

  const toggleFollow = (id: number, title?: string) => {
    const bucket = ensureBucket(currentId.value);
    if (bucket.followed.includes(id)) {
      bucket.followed = bucket.followed.filter((x) => x !== id);
      if (title) msg.follow.cancel(title);
    } else {
      bucket.followed = [...bucket.followed, id];
      if (title) msg.follow.success(title);
    }
    savePrefs();
  };

  const toggleFavorite = (id: number, title?: string) => {
    const bucket = ensureBucket(currentId.value);
    if (bucket.favorited.includes(id)) {
      bucket.favorited = bucket.favorited.filter((x) => x !== id);
      if (title) msg.favorite.cancel(title);
    } else {
      bucket.favorited = [...bucket.favorited, id];
      if (title) msg.favorite.success(title);
    }
    savePrefs();
  };

  return {
    isFollowed,
    isFavorited,
    toggleFollow,
    toggleFavorite,
    followedIds: computed(() => currentBucket.value.followed),
    favoritedIds: computed(() => currentBucket.value.favorited),
  };
}

