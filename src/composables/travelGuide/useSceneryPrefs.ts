import { ref, computed } from 'vue';

const SCENERY_PREFS_KEY = 'travel-guide-scenery-prefs';
const SCENERY_CHECKED_KEY = 'scenery-ranking-checkin';


interface SceneryPrefs {
  spotFavorites: string[];
  spotWant: string[];
  experienceFavorites: string[];
  experienceWant: string[];
  experienceBeen: string[];
  spotBeen: string[];
  spotLikes: string[];
  routeDone: string[];
}


function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// 归一化：兼容 localStorage 中旧版本数据缺失字段或字段被篡改为非数组的情况
const asStringArr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

function normalizePrefs(raw: Partial<SceneryPrefs> | null | undefined): SceneryPrefs {
  const d = raw ?? {};
  return {
    spotFavorites: asStringArr(d.spotFavorites),
    spotWant: asStringArr(d.spotWant),
    experienceFavorites: asStringArr(d.experienceFavorites),
    experienceWant: asStringArr(d.experienceWant),
    experienceBeen: asStringArr(d.experienceBeen),
    spotBeen: asStringArr(d.spotBeen),
    spotLikes: asStringArr(d.spotLikes),
    routeDone: asStringArr(d.routeDone),
  };
}

const sceneryPrefs = ref<SceneryPrefs>(
  normalizePrefs(readJson<Partial<SceneryPrefs>>(SCENERY_PREFS_KEY, {})),
);
const sceneryChecked = ref<string[]>(
  asStringArr(readJson<unknown>(SCENERY_CHECKED_KEY, [])),
);

function persistSceneryPrefs(): void {
  writeJson(SCENERY_PREFS_KEY, sceneryPrefs.value);
}
function persistSceneryChecked(): void {
  writeJson(SCENERY_CHECKED_KEY, sceneryChecked.value);
}

export function useSceneryPrefs() {
  const spotFavoriteSet = computed(() => new Set(sceneryPrefs.value.spotFavorites));
  const spotWantSet = computed(() => new Set(sceneryPrefs.value.spotWant));
  const spotBeenSet = computed(() => new Set(sceneryPrefs.value.spotBeen));
  const spotLikeSet = computed(() => new Set(sceneryPrefs.value.spotLikes));
  const routeDoneSet = computed(() => new Set(sceneryPrefs.value.routeDone));
  const experienceFavoriteSet = computed(() => new Set(sceneryPrefs.value.experienceFavorites));
  const experienceWantSet = computed(() => new Set(sceneryPrefs.value.experienceWant));
  const experienceBeenSet = computed(() => new Set(sceneryPrefs.value.experienceBeen));

  const toggleSpotFavorite = (id: string): void => {
    if (spotFavoriteSet.value.has(id)) sceneryPrefs.value.spotFavorites = sceneryPrefs.value.spotFavorites.filter((x) => x !== id);
    else sceneryPrefs.value.spotFavorites = [...sceneryPrefs.value.spotFavorites, id];
    persistSceneryPrefs();
  };

  const toggleSpotWant = (id: string): void => {
    if (spotWantSet.value.has(id)) sceneryPrefs.value.spotWant = sceneryPrefs.value.spotWant.filter((x) => x !== id);
    else sceneryPrefs.value.spotWant = [...sceneryPrefs.value.spotWant, id];
    persistSceneryPrefs();
  };

  const toggleSpotBeen = (id: string): void => {
    if (spotBeenSet.value.has(id)) sceneryPrefs.value.spotBeen = sceneryPrefs.value.spotBeen.filter((x) => x !== id);
    else sceneryPrefs.value.spotBeen = [...sceneryPrefs.value.spotBeen, id];
    persistSceneryPrefs();
  };

  const toggleSpotLike = (id: string): void => {
    if (spotLikeSet.value.has(id)) sceneryPrefs.value.spotLikes = sceneryPrefs.value.spotLikes.filter((x) => x !== id);
    else sceneryPrefs.value.spotLikes = [...sceneryPrefs.value.spotLikes, id];
    persistSceneryPrefs();
  };

  const toggleRouteDone = (id: string): void => {
    if (routeDoneSet.value.has(id)) sceneryPrefs.value.routeDone = sceneryPrefs.value.routeDone.filter((x) => x !== id);
    else sceneryPrefs.value.routeDone = [...sceneryPrefs.value.routeDone, id];
    persistSceneryPrefs();
  };

  const expKey = (id: string, provinceId: string, category: string): string => `${provinceId}:${category}:${id}`;

  const toggleExperienceFavorite = (id: string, provinceId: string, category: string): void => {
    const key = expKey(id, provinceId, category);
    if (experienceFavoriteSet.value.has(key)) sceneryPrefs.value.experienceFavorites = sceneryPrefs.value.experienceFavorites.filter((x) => x !== key);
    else sceneryPrefs.value.experienceFavorites = [...sceneryPrefs.value.experienceFavorites, key];
    persistSceneryPrefs();
  };

  const toggleExperienceWant = (id: string, provinceId: string, category: string): void => {
    const key = expKey(id, provinceId, category);
    if (experienceWantSet.value.has(key)) sceneryPrefs.value.experienceWant = sceneryPrefs.value.experienceWant.filter((x) => x !== key);
    else sceneryPrefs.value.experienceWant = [...sceneryPrefs.value.experienceWant, key];
    persistSceneryPrefs();
  };

  const toggleExperienceBeen = (id: string, provinceId: string, category: string): void => {
    const key = expKey(id, provinceId, category);
    if (experienceBeenSet.value.has(key)) sceneryPrefs.value.experienceBeen = sceneryPrefs.value.experienceBeen.filter((x) => x !== key);
    else sceneryPrefs.value.experienceBeen = [...sceneryPrefs.value.experienceBeen, key];
    persistSceneryPrefs();
  };

  const isSpotFavorite = (id: string): boolean => spotFavoriteSet.value.has(id);
  const isSpotWant = (id: string): boolean => spotWantSet.value.has(id);
  const isSpotBeen = (id: string): boolean => spotBeenSet.value.has(id);
  const isSpotLike = (id: string): boolean => spotLikeSet.value.has(id);
  const isRouteDone = (id: string): boolean => routeDoneSet.value.has(id);
  const isExperienceFavorite = (id: string, provinceId: string, category: string): boolean => experienceFavoriteSet.value.has(expKey(id, provinceId, category));
  const isExperienceWant = (id: string, provinceId: string, category: string): boolean => experienceWantSet.value.has(expKey(id, provinceId, category));
  const isExperienceBeen = (id: string, provinceId: string, category: string): boolean => experienceBeenSet.value.has(expKey(id, provinceId, category));

  const checkedSet = computed(() => new Set(sceneryChecked.value));
  const toggleChecked = (id: string): boolean => {
    const wasChecked = checkedSet.value.has(id);
    if (wasChecked) sceneryChecked.value = sceneryChecked.value.filter((x) => x !== id);
    else sceneryChecked.value = [...sceneryChecked.value, id];
    persistSceneryChecked();
    return !wasChecked;
  };
  const isChecked = (id: string): boolean => checkedSet.value.has(id);

  const removeSpotFavorite = (id: string): void => {
    sceneryPrefs.value.spotFavorites = sceneryPrefs.value.spotFavorites.filter((x) => x !== id);
    persistSceneryPrefs();
  };
  const removeSpotWant = (id: string): void => {
    sceneryPrefs.value.spotWant = sceneryPrefs.value.spotWant.filter((x) => x !== id);
    persistSceneryPrefs();
  };
  const removeSpotBeen = (id: string): void => {
    sceneryPrefs.value.spotBeen = sceneryPrefs.value.spotBeen.filter((x) => x !== id);
    persistSceneryPrefs();
  };
  const removeSpotLike = (id: string): void => {
    sceneryPrefs.value.spotLikes = sceneryPrefs.value.spotLikes.filter((x) => x !== id);
    persistSceneryPrefs();
  };
  const removeSpotChecked = (id: string): void => {
    sceneryChecked.value = sceneryChecked.value.filter((x) => x !== id);
    persistSceneryChecked();
  };
  const removeRouteDone = (id: string): void => {
    sceneryPrefs.value.routeDone = sceneryPrefs.value.routeDone.filter((x) => x !== id);
    persistSceneryPrefs();
  };
  const removeExperienceFavorite = (id: string, provinceId: string, category: string): void => {
    const key = expKey(id, provinceId, category);
    sceneryPrefs.value.experienceFavorites = sceneryPrefs.value.experienceFavorites.filter((x) => x !== key);
    persistSceneryPrefs();
  };
  const removeExperienceWant = (id: string, provinceId: string, category: string): void => {
    const key = expKey(id, provinceId, category);
    sceneryPrefs.value.experienceWant = sceneryPrefs.value.experienceWant.filter((x) => x !== key);
    persistSceneryPrefs();
  };
  const removeExperienceBeen = (id: string, provinceId: string, category: string): void => {
    const key = expKey(id, provinceId, category);
    sceneryPrefs.value.experienceBeen = sceneryPrefs.value.experienceBeen.filter((x) => x !== key);
    persistSceneryPrefs();
  };

  return {
    sceneryPrefs,
    sceneryChecked,
    toggleSpotFavorite,
    toggleSpotWant,
    toggleSpotBeen,
    toggleSpotLike,
    toggleRouteDone,
    toggleExperienceFavorite,
    toggleExperienceWant,
    toggleExperienceBeen,
    isSpotFavorite,
    isSpotWant,
    isSpotBeen,
    isSpotLike,
    isRouteDone,
    isExperienceFavorite,
    isExperienceWant,
    isExperienceBeen,
    toggleChecked,
    isChecked,
    removeSpotFavorite,
    removeSpotWant,
    removeSpotBeen,
    removeSpotLike,
    removeSpotChecked,
    removeRouteDone,
    removeExperienceFavorite,
    removeExperienceWant,
    removeExperienceBeen,
  };
}