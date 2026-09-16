import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useMuseumMessage } from '@/composables/museum/useMessage';

const STORAGE_KEY = 'museum-activity-prefs';

interface ActivityBucket {
  likes: number[];
  favorites: number[];
}

type AllPrefs = Record<number, ActivityBucket>;

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
      if (Array.isArray(data.likes) || Array.isArray(data.favorites)) return;
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

const ensureBucket = (mid: number): ActivityBucket => {
  if (!allPrefs.value[mid]) {
    allPrefs.value[mid] = { likes: [], favorites: [] };
  }
  return allPrefs.value[mid];
};

export function useActivityPrefs(museumId: MaybeRefOrGetter<number>) {
  loadPrefs();

  const currentId = computed(() => toValue(museumId));
  const currentBucket = computed<ActivityBucket>(
    () => allPrefs.value[currentId.value] || { likes: [], favorites: [] },
  );

  const isLiked = (id: number) => currentBucket.value.likes.includes(id);
  const isFavored = (id: number) => currentBucket.value.favorites.includes(id);

  const toggleLike = (id: number, title?: string) => {
    const bucket = ensureBucket(currentId.value);
    if (bucket.likes.includes(id)) {
      bucket.likes = bucket.likes.filter((x) => x !== id);
      if (title) msg.like.cancel();
    } else {
      bucket.likes = [...bucket.likes, id];
      if (title) msg.like.success(title);
    }
    savePrefs();
  };

  const toggleFavorite = (id: number, title?: string) => {
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

  return {
    isLiked,
    isFavored,
    toggleLike,
    toggleFavorite,
    likedIds: computed(() => currentBucket.value.likes),
    favoredIds: computed(() => currentBucket.value.favorites),
  };
}

