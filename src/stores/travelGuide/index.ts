/**
 * 旅游指南数据 Store
 * 数据来源：后端 /api/travel-guide/*
 */
import { defineStore } from 'pinia';
import { ref, shallowRef, triggerRef } from 'vue';
import type {
  Province,
  FoodItem,
  FoodLocation,
  FoodGuide,
  FoodSouvenir,
  FoodSeasonal,
} from '@/typesOfPages/travelGuide';
import {
  fetchProvinces,
  fetchScenery,
  fetchFood,
  fetchSceneryConfig,
} from '@/services/travelGuide';
import type {
  ProvinceScenery,
  ProvinceFood,
  SceneryConfig,
} from '@/services/travelGuide';

export const useTravelGuideStore = defineStore('travelGuide', () => {
  const provinces = ref<Province[]>([]);
  const sceneryMap = shallowRef<Record<string, ProvinceScenery>>({});
  const foodMap = shallowRef<Record<string, ProvinceFood>>({});
  const foodNameMap = shallowRef<Record<string, string>>({});
  const sceneryConfig = ref<SceneryConfig | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);
  const loaded = ref(false);

  async function loadAll() {
    if (loaded.value || loading.value) return;
    loading.value = true;
    error.value = null;
    try {
      const [provinceRes, config] = await Promise.all([
        fetchProvinces({ limit: 100 }),
        fetchSceneryConfig(),
      ]);
      provinces.value = provinceRes.items;
      sceneryConfig.value = config;
      loaded.value = true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败';
      provinces.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function ensureLoaded() {
    if (!loaded.value) {
      await loadAll();
    }
  }

  // 进行中的请求缓存：同一省份被多个组件同时请求时只发一次网络请求
  const sceneryRequests = new Map<string, Promise<ProvinceScenery>>();
  const foodRequests = new Map<string, Promise<ProvinceFood>>();

  async function ensureScenery(provinceId: string) {
    if (sceneryMap.value[provinceId]) return sceneryMap.value[provinceId];
    const existing = sceneryRequests.get(provinceId);
    if (existing) return existing;
    const request = fetchScenery(provinceId)
      .then((data) => {
        sceneryMap.value[provinceId] = data;
        triggerRef(sceneryMap);
        return data;
      })
      .finally(() => {
        sceneryRequests.delete(provinceId);
      });
    sceneryRequests.set(provinceId, request);
    return request;
  }

  async function ensureFood(provinceId: string) {
    if (foodMap.value[provinceId]) return foodMap.value[provinceId];
    const existing = foodRequests.get(provinceId);
    if (existing) return existing;
    const request = fetchFood(provinceId)
      .then((data) => {
        foodMap.value[provinceId] = data;
        triggerRef(foodMap);
        for (const item of data.items) {
          foodNameMap.value[item.id] = item.name;
        }
        triggerRef(foodNameMap);
        return data;
      })
      .finally(() => {
        foodRequests.delete(provinceId);
      });
    foodRequests.set(provinceId, request);
    return request;
  }

  const getAllProvinces = (): Province[] => provinces.value;

  const getProvinceById = (id: string): Province | undefined =>
    provinces.value.find((p) => p.id === id);

  const getProvincesByRegion = (region: string): Province[] => {
    if (!region || region === '全部') return provinces.value;
    return provinces.value.filter((p) => p.region === region);
  };

  const getRegions = (): string[] => {
    const regions = new Set(provinces.value.map((p) => p.region));
    return ['全部', ...Array.from(regions)];
  };

  // 风光数据
  const getScenery = async (
    provinceId: string,
  ): Promise<ProvinceScenery | null> => {
    if (!loaded.value) await ensureLoaded();
    try {
      return await ensureScenery(provinceId);
    } catch (e) {
      console.error(`加载省份 ${provinceId} 风光数据失败:`, e);
      return null;
    }
  };

  // 美食数据
  const getFood = async (
    provinceId: string,
  ): Promise<ProvinceFood | null> => {
    if (!loaded.value) await ensureLoaded();
    try {
      return await ensureFood(provinceId);
    } catch (e) {
      console.error(`加载省份 ${provinceId} 美食数据失败:`, e);
      return null;
    }
  };

  const getFoodItems = async (
    provinceId: string,
  ): Promise<FoodItem[]> => {
    const data = await getFood(provinceId);
    return data?.items || [];
  };

  const getFoodLocations = async (
    provinceId: string,
  ): Promise<FoodLocation[]> => {
    const data = await getFood(provinceId);
    return data?.locations || [];
  };

  const getFoodGuide = async (
    provinceId: string,
  ): Promise<FoodGuide | null> => {
    const data = await getFood(provinceId);
    return data?.guide || null;
  };

  const getFoodSouvenirs = async (
    provinceId: string,
  ): Promise<FoodSouvenir[]> => {
    const data = await getFood(provinceId);
    return data?.souvenirs || [];
  };

  const getFoodSeasonal = async (
    provinceId: string,
  ): Promise<FoodSeasonal[]> => {
    const data = await getFood(provinceId);
    return data?.seasonal || [];
  };

  return {
    provinces,
    sceneryMap,
    foodMap,
    foodNameMap,
    sceneryConfig,
    loading,
    error,
    loaded,
    loadAll,
    ensureLoaded,
    getAllProvinces,
    getProvinceById,
    getProvincesByRegion,
    getRegions,
    getScenery,
    getFood,
    getFoodItems,
    getFoodLocations,
    getFoodGuide,
    getFoodSouvenirs,
    getFoodSeasonal,
  };
});
