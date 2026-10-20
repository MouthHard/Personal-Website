import { ref, computed, reactive } from 'vue';
import { useTravelGuideStore } from '@/stores/travelGuide';
import { useCheckin } from '../FoodDetailModal/useCheckin';
import { useFoodPrefs } from '@/composables/travelGuide/useFoodPrefs';
import { useFoodSouvenirPrefs } from '@/composables/travelGuide/useFoodSouvenirPrefs';
import { useFoodRoutePrefs } from '@/composables/travelGuide/useFoodRoutePrefs';
import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
import type { Food, FoodSouvenir, FoodGuideRoute, ScenerySpot, ExperienceItem } from '@/typesOfPages/travelGuide';

const storeDataReady = ref(0);
let storeDataLoading = false;

const MY_PROFILE_KEY = 'travel-guide-my-profile';
const SEARCH_HISTORY_KEY = 'scenery-search-history';

interface MyProfile {
  nickname: string;
  avatar: string;
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

const myProfile = ref<MyProfile>({ nickname: '旅行者', avatar: '' });
const searchHistory = ref<string[]>([]);
let initialized = false;

function loadAllPrefs(): void {
  if (initialized) return;
  initialized = true;
  myProfile.value = readJson<MyProfile>(MY_PROFILE_KEY, { nickname: '旅行者', avatar: '' });
  searchHistory.value = readJson<string[]>(SEARCH_HISTORY_KEY, []);
}

function persistProfile(): void {
  writeJson(MY_PROFILE_KEY, myProfile.value);
}
function persistSearchHistory(): void {
  writeJson(SEARCH_HISTORY_KEY, searchHistory.value);
}

export function useMyData() {
  loadAllPrefs();
  const store = useTravelGuideStore();

  const ensureStoreDataLoaded = async (): Promise<void> => {
    if (storeDataLoading) return;
    storeDataLoading = true;
    try {
      await store.ensureLoaded();
      const provinces = store.getAllProvinces();
      await Promise.all(
        provinces.map((p) =>
          Promise.all([
            store.getFood(p.id),
            store.getScenery(p.id),
          ]),
        ),
      );
    } finally {
      storeDataLoading = false;
      storeDataReady.value++;
    }
  };


  const { eatenIds: foodEatenIds, wantIds: foodWantIds, removeCheckin } = useCheckin();
  const { thumbsUpIds: foodThumbsUpIds, toggleThumbsUp: toggleFoodThumbsUp } = useFoodPrefs();

  const { wantIds: foodSouvenirWantIds, boughtIds: foodSouvenirBoughtIds, toggleWant: toggleSouvenirWant, toggleBought: toggleSouvenirBought } = useFoodSouvenirPrefs();
  const { favoritedIds: foodRouteFavIds, completedIds: foodRouteDoneIds, toggleFavorited: toggleRouteFav, toggleCompleted: toggleRouteDone } = useFoodRoutePrefs();
  const {
    sceneryPrefs,
    sceneryChecked,
    removeSpotFavorite: _removeSpotFavorite,
    removeSpotWant: _removeSpotWant,
    removeSpotBeen: _removeSpotBeen,
    removeSpotLike: _removeSpotLike,
    removeSpotChecked: _removeSpotChecked,

    removeExperienceFavorite: _removeExperienceFavorite,
    removeExperienceWant: _removeExperienceWant,
    removeExperienceBeen: _removeExperienceBeen,
  } = useSceneryPrefs();
  const spotFavoriteIds = computed(() => sceneryPrefs.value.spotFavorites);
  const spotWantIds = computed(() => sceneryPrefs.value.spotWant);
  const spotBeenIds = computed(() => sceneryPrefs.value.spotBeen);
  const spotLikeIds = computed(() => sceneryPrefs.value.spotLikes);
 
  const experienceFavoriteIds = computed(() => sceneryPrefs.value.experienceFavorites);
  const experienceWantIds = computed(() => sceneryPrefs.value.experienceWant);
  const experienceBeenIds = computed(() => sceneryPrefs.value.experienceBeen);
  const sceneryCheckedIds = computed(() => sceneryChecked.value);

  const collectAllFoods = (): Food[] => {
    void storeDataReady.value;
    const result: Food[] = [];
    const map = store.foodMap;
    const provinces = store.getAllProvinces();
    for (const key of Object.keys(map)) {
      const provinceFood = map[key];
      const provinceName = provinces.find((p) => p.id === key)?.name || '';
      const items = provinceFood?.items || [];
      for (const it of items) {
        result.push({
          ...it,
          province: provinceName || it.province,
        });
      }
    }
    return result;
  };

  const collectAllSpots = (): ScenerySpot[] => {
    void storeDataReady.value;
    const result: ScenerySpot[] = [];
    const map = store.sceneryMap;
    for (const key of Object.keys(map)) {
      const sc = map[key];
      const spots = sc?.spots || [];
      for (const sp of spots) result.push(sp);
    }
    return result;
  };

  const collectAllExperiences = (): ExperienceItem[] => {
    void storeDataReady.value;
    const result: ExperienceItem[] = [];
    const map = store.sceneryMap;
    for (const key of Object.keys(map)) {
      const sc = map[key];
      if (sc?.craftWorkshops) result.push(...sc.craftWorkshops.map((it: any) => ({ ...it, experienceCategory: 'craft', provinceId: key })));
      if (sc?.performances) result.push(...sc.performances.map((it: any) => ({ ...it, experienceCategory: 'performance', provinceId: key })));
      if (sc?.outdoorAdventure) result.push(...sc.outdoorAdventure.map((it: any) => ({ ...it, experienceCategory: 'outdoor', provinceId: key })));
      if (sc?.wellnessRetreat) result.push(...sc.wellnessRetreat.map((it: any) => ({ ...it, experienceCategory: 'wellness', provinceId: key })));
      if (sc?.festivals) {
        result.push(
          ...sc.festivals.map((it: any) => ({
            ...it,
            category: 'festival',
            experienceCategory: 'festival',
            provinceId: key,
          })),
        );
      }
    }
    return result;
  };


  const collectAllFoodSouvenirs = (): FoodSouvenir[] => {
    void storeDataReady.value;
    const result: FoodSouvenir[] = [];
    const map = store.foodMap;
    const provinces = store.getAllProvinces();
    for (const key of Object.keys(map)) {
      const provinceFood = map[key];
      const provinceName = provinces.find((p) => p.id === key)?.name || '';
      const souvenirs = provinceFood?.souvenirs || [];
      for (const sv of souvenirs) result.push({ ...sv, province: provinceName });
    }
    return result;
  };

  const collectAllFoodRoutes = (): FoodGuideRoute[] => {
    void storeDataReady.value;
    const result: FoodGuideRoute[] = [];
    const map = store.foodMap;
    for (const key of Object.keys(map)) {
      const routes = map[key]?.guide?.routes || [];
      for (const r of routes) result.push(r);
    }
    return result;
  };

  const allFoods = computed<Food[]>(() => collectAllFoods());
  const allSpots = computed<ScenerySpot[]>(() => collectAllSpots());
  const allExperiences = computed<ExperienceItem[]>(() => collectAllExperiences());

  const allFoodSouvenirs = computed<FoodSouvenir[]>(() => collectAllFoodSouvenirs());
  const allFoodRoutes = computed<FoodGuideRoute[]>(() => collectAllFoodRoutes());


  const foodEaten = computed<Food[]>(() =>
    allFoods.value.filter((f) => foodEatenIds.value.includes(f.id)),
  );
  const foodWant = computed<Food[]>(() =>
    allFoods.value.filter((f) => foodWantIds.value.includes(f.id)),
  );
  const foodThumbsUp = computed<Food[]>(() =>
    allFoods.value.filter((f) => foodThumbsUpIds.value.includes(f.id)),
  );


  const foodSouvenirWant = computed<FoodSouvenir[]>(() =>
    allFoodSouvenirs.value.filter((s) => foodSouvenirWantIds.value.includes(s.id)),
  );
  const foodSouvenirBought = computed<FoodSouvenir[]>(() =>
    allFoodSouvenirs.value.filter((s) => foodSouvenirBoughtIds.value.includes(s.id)),
  );

  const foodRouteFav = computed<FoodGuideRoute[]>(() =>
    allFoodRoutes.value.filter((r) => foodRouteFavIds.value.includes(r.id)),
  );
  const foodRouteDone = computed<FoodGuideRoute[]>(() =>
    allFoodRoutes.value.filter((r) => foodRouteDoneIds.value.includes(r.id)),
  );

  const spotFavorites = computed<ScenerySpot[]>(() =>
    allSpots.value.filter((s) => spotFavoriteIds.value.includes(s.id)),
  );
  const spotWant = computed<ScenerySpot[]>(() =>
    allSpots.value.filter((s) => spotWantIds.value.includes(s.id)),
  );
  const spotBeen = computed<ScenerySpot[]>(() =>
    allSpots.value.filter((s) => spotBeenIds.value.includes(s.id)),
  );
  const spotLikes = computed<ScenerySpot[]>(() =>
    allSpots.value.filter((s) => spotLikeIds.value.includes(s.id)),
  );
  const spotChecked = computed<ScenerySpot[]>(() =>
    allSpots.value.filter((s) => sceneryCheckedIds.value.includes(s.id)),
  );
  const routeDone = computed<ExperienceItem[]>(() =>
    allExperiences.value.filter((e) => experienceBeenIds.value.includes(`${(e as any).provinceId}:${(e as any).experienceCategory}:${e.id}`)),
  );
  const experienceFavorites = computed<ExperienceItem[]>(() =>
    allExperiences.value.filter((e) => experienceFavoriteIds.value.includes(`${(e as any).provinceId}:${(e as any).experienceCategory}:${e.id}`)),
  );

  const experienceWant = computed<ExperienceItem[]>(() =>
    allExperiences.value.filter((e) => experienceWantIds.value.includes(`${(e as any).provinceId}:${(e as any).experienceCategory}:${e.id}`)),
  );

  const experienceBeen = computed<ExperienceItem[]>(() =>
    allExperiences.value.filter((e) => experienceBeenIds.value.includes(`${(e as any).provinceId}:${(e as any).experienceCategory}:${e.id}`)),
  );

  type ExpCategory = 'craft' | 'performance' | 'outdoor' | 'festival' | 'wellness';
  const EXP_CATEGORIES: ExpCategory[] = ['craft', 'performance', 'outdoor', 'festival', 'wellness'];

  const experiencesByCategory = computed(() => {
    const result: Record<string, { favorites: ExperienceItem[]; want: ExperienceItem[]; been: ExperienceItem[] }> = {};
    for (const cat of EXP_CATEGORIES) {
      const items = allExperiences.value.filter((e: any) => e.experienceCategory === cat);
      result[cat] = {
        favorites: items.filter((e: any) => experienceFavoriteIds.value.includes(`${e.provinceId}:${e.experienceCategory}:${e.id}`)),
        want: items.filter((e: any) => experienceWantIds.value.includes(`${e.provinceId}:${e.experienceCategory}:${e.id}`)),
        been: items.filter((e: any) => experienceBeenIds.value.includes(`${e.provinceId}:${e.experienceCategory}:${e.id}`)),
      };
    }
    return result;
  });


  const stats = reactive({

    foodEatenCount: computed(() => foodEaten.value.length),
    foodWantCount: computed(() => foodWant.value.length),
    foodThumbsUpCount: computed(() => foodThumbsUp.value.length),

    foodSouvenirWantCount: computed(() => foodSouvenirWant.value.length),
    foodSouvenirBoughtCount: computed(() => foodSouvenirBought.value.length),
    foodRouteFavCount: computed(() => foodRouteFav.value.length),
    foodRouteDoneCount: computed(() => foodRouteDone.value.length),
    spotFavoriteCount: computed(() => spotFavorites.value.length),
    spotWantCount: computed(() => spotWant.value.length),
    spotBeenCount: computed(() => spotBeen.value.length),
    spotLikeCount: computed(() => spotLikes.value.length),
    spotCheckedCount: computed(() => spotChecked.value.length),
    routeDoneCount: computed(() => routeDone.value.length),
    experienceFavoriteCount: computed(() => experienceFavorites.value.length),
    experienceWantCount: computed(() => experienceWant.value.length),
    experienceBeenCount: computed(() => experienceBeen.value.length),

    searchHistoryCount: computed(() => searchHistory.value.length),
    totalFavorite: computed(
      () =>

        spotFavorites.value.length +
        experienceFavorites.value.length,
    ),
    totalChecked: computed(
      () =>
        foodEaten.value.length +
        spotChecked.value.length +
        spotBeen.value.length +
        experienceBeen.value.length,
    ),
    totalWant: computed(
      () =>
        foodWant.value.length +
        foodSouvenirWant.value.length +
        spotWant.value.length +
        experienceWant.value.length,
    ),
  });


  const removeFoodEaten = (id: string): void => removeCheckin(id);
  const removeFoodWant = (id: string): void => removeCheckin(id);
  const removeFoodThumbsUp = (id: string): void => {
    const food = allFoods.value.find((f) => f.id === id);
    if (food) toggleFoodThumbsUp(food);
  };

  const removeFoodSouvenirWant = (id: string): void => toggleSouvenirWant(id);
  const removeFoodSouvenirBought = (id: string): void => toggleSouvenirBought(id);
  const removeFoodRouteFav = (id: string): void => toggleRouteFav(id);
  const removeFoodRouteDone = (id: string): void => toggleRouteDone(id);
  const removeSpotFavorite = (id: string): void => _removeSpotFavorite(id);
  const removeSpotWant = (id: string): void => _removeSpotWant(id);
  const removeSpotBeen = (id: string): void => _removeSpotBeen(id);
  const removeSpotLike = (id: string): void => _removeSpotLike(id);
  const removeSpotChecked = (id: string): void => _removeSpotChecked(id);
  const removeRouteDone = (id: string, provinceId: string, category: string): void => {

    _removeExperienceBeen(id, provinceId, category);
  };
  const removeExperienceFavorite = (id: string, provinceId: string, category: string): void => _removeExperienceFavorite(id, provinceId, category);
  const removeExperienceWant = (id: string, provinceId: string, category: string): void => _removeExperienceWant(id, provinceId, category);
  const removeExperienceBeen = (id: string, provinceId: string, category: string): void => _removeExperienceBeen(id, provinceId, category);

  const removeSearchHistory = (keyword: string): void => {
    searchHistory.value = searchHistory.value.filter((x) => x !== keyword);
    persistSearchHistory();
  };
  const clearSearchHistory = (): void => {
    searchHistory.value = [];
    persistSearchHistory();
  };

  const setNickname = (name: string): void => {
    myProfile.value.nickname = name;
    persistProfile();
  };
  const setAvatar = (avatar: string): void => {
    myProfile.value.avatar = avatar;
    persistProfile();
  };

  return {
    myProfile,

    ensureStoreDataLoaded,

    foodEaten,
    foodWant,
    foodThumbsUp,

    foodSouvenirWant,
    foodSouvenirBought,
    foodRouteFav,
    foodRouteDone,
    spotFavorites,
    spotWant,
    spotBeen,
    spotLikes,
    spotChecked,
    routeDone,
    experienceFavorites,
    experienceWant,
    experienceBeen,
    experiencesByCategory,

    searchHistory,
    stats,

    removeFoodEaten,
    removeFoodWant,
    removeFoodThumbsUp,

    removeFoodSouvenirWant,
    removeFoodSouvenirBought,
    removeFoodRouteFav,
    removeFoodRouteDone,
    removeSpotFavorite,
    removeSpotWant,
    removeSpotBeen,
    removeSpotLike,
    removeSpotChecked,
    removeRouteDone,
    removeExperienceFavorite,
    removeExperienceWant,
    removeExperienceBeen,

    removeSearchHistory,
    clearSearchHistory,
    setNickname,
    setAvatar,
  };
}
