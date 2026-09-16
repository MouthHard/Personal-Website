/**
 * 博物馆数据 Store
 * 模式对齐 useAphorismDataStore：页面通过 Store 消费 API，不直接读静态 data
 */
import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import {
  fetchMuseums,
  fetchMuseumDetail,
  fetchArtifacts,
  fetchArtifactDetail,
  fetchExhibitions,
  fetchNews,
  fetchImmersive,
  fetchCreativeProducts,
  fetchCreativeActivities,
  fetchExhibitionHalls,
} from '@/services/museum';
import type {
  Museum,
  MuseumDetailInfo,
  Artifact,
  ArtifactDetail,
  Exhibition,
  Activity,
  News,
  ImmersiveExperience,
  CreativeProduct,

  ExhibitionHall,
} from '@/typesOfPages/museum';

export const useMuseumDataStore = defineStore('museumData', () => {
  const museums = ref<Museum[]>([]);
  const artifacts = ref<Artifact[]>([]);
  const artifactDetailMap = ref<Record<number, ArtifactDetail>>({});
  const exhibitions = ref<Exhibition[]>([]);

  const news = ref<News[]>([]);
  const immersive = ref<ImmersiveExperience[]>([]);
  const creativeProducts = ref<CreativeProduct[]>([]);
  const creativeActivities = ref<Activity[]>([]);

  const exhibitionHalls = ref<ExhibitionHall[]>([]);
  const museumDetails = ref<Record<number, MuseumDetailInfo>>({});

  const loading = ref(false);
  const error = ref<string | null>(null);
  const loaded = ref(false);
  let loadPromise: Promise<void> | null = null;

  const indexByMuseumId = <T extends { museumId: number }>(arr: Ref<T[]>) =>
    computed(() => {
      const m = new Map<number, T[]>();
      for (const item of arr.value) {
        if (!m.has(item.museumId)) m.set(item.museumId, []);
        m.get(item.museumId)!.push(item);
      }
      return m;
    });

  const artifactsByMuseumId = indexByMuseumId(artifacts);
  const exhibitionsByMuseumId = indexByMuseumId(exhibitions);
  const newsByMuseumId = indexByMuseumId(news);
  const immersiveByMuseumId = indexByMuseumId(immersive);
  const creativeProductsByMuseumId = indexByMuseumId(creativeProducts);
  const creativeActivitiesByMuseumId = indexByMuseumId(creativeActivities);
  const exhibitionHallsByMuseumId = indexByMuseumId(exhibitionHalls);


  async function loadAll() {
    if (loaded.value) return;
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      loading.value = true;
      error.value = null;
      try {
        const [
          museumRes,
          artifactRes,
          exhibitionRes,
          newsRes,
          immersiveRes,
           creativeRes,
           creativeActivityRes,
           hallRes,
         ] = await Promise.all([
           fetchMuseums(),
           fetchArtifacts(),
           fetchExhibitions(),
           fetchNews(),
           fetchImmersive(),
           fetchCreativeProducts(),
           fetchCreativeActivities(),
           fetchExhibitionHalls(),
         ]);
         museums.value = museumRes.items;
         artifacts.value = artifactRes.items;
         exhibitions.value = exhibitionRes.items;
         news.value = newsRes.items;
         immersive.value = immersiveRes.items;
         creativeProducts.value = creativeRes.items;
         creativeActivities.value = creativeActivityRes.items;

        exhibitionHalls.value = hallRes.items;
        loaded.value = true;
      } catch (e) {
        error.value = e instanceof Error ? e.message : '加载失败';
        museums.value = [];
        artifacts.value = [];
        exhibitions.value = [];

        news.value = [];
        immersive.value = [];
        creativeProducts.value = [];
        creativeActivities.value = [];

        exhibitionHalls.value = [];
      } finally {
        loading.value = false;
        loadPromise = null;
      }
    })();
    return loadPromise;
  }

  async function ensureLoaded() {
    if (!loaded.value) {
      await loadAll();
    }
  }

  async function getMuseum(id: number): Promise<Museum | null> {
    await ensureLoaded();
    return museums.value.find((m) => m.id === id) || null;
  }

  async function getMuseumDetailsById(
    museumId: number,
  ): Promise<MuseumDetailInfo | null> {
    if (museumDetails.value[museumId]) {
      return museumDetails.value[museumId];
    }
    try {
      const detail = await fetchMuseumDetail(museumId);
      if (detail) museumDetails.value[museumId] = detail;
      return detail;
    } catch {
      return null;
    }
  }

  function getArtifactsByMuseumId(museumId: number): Artifact[] {
    return artifactsByMuseumId.value.get(museumId) ?? [];
  }

  async function getArtifactDetailById(
    id: number,
  ): Promise<ArtifactDetail | null> {
    const cached = artifactDetailMap.value[id];
    if (cached) return cached;
    try {
      const detail = await fetchArtifactDetail(id);
      if (detail) artifactDetailMap.value = { ...artifactDetailMap.value, [id]: detail };
      return detail;
    } catch {
      return null;
    }
  }

  function getExhibitionsByMuseumId(museumId: number): Exhibition[] {
    return exhibitionsByMuseumId.value.get(museumId) ?? [];
  }


  function getNewsByMuseumId(museumId: number): News[] {
    return newsByMuseumId.value.get(museumId) ?? [];
  }

  function getImmersiveByMuseumId(museumId: number): ImmersiveExperience[] {
    return immersiveByMuseumId.value.get(museumId) ?? [];
  }

  function getCreativeProductsByMuseumId(museumId: number): CreativeProduct[] {
    return creativeProductsByMuseumId.value.get(museumId) ?? [];
  }

  function getCreativeActivitiesByMuseumId(museumId: number): Activity[] {
    return creativeActivitiesByMuseumId.value.get(museumId) ?? [];
  }


  function getExhibitionHallsByMuseumId(museumId: number): ExhibitionHall[] {
    return exhibitionHallsByMuseumId.value.get(museumId) ?? [];
  }

  return {
    museums,
    artifacts,
    artifactDetailMap,
    exhibitions,
    news,
    immersive,
    creativeProducts,
    creativeActivities,
    exhibitionHalls,
    museumDetails,
    loading,
    error,
    loaded,
    loadAll,
    ensureLoaded,
    getMuseum,
    getMuseumDetailsById,
    getArtifactsByMuseumId,
    getArtifactDetailById,
    getExhibitionsByMuseumId,
    getNewsByMuseumId,
    getImmersiveByMuseumId,
    getCreativeProductsByMuseumId,
    getCreativeActivitiesByMuseumId,
    getExhibitionHallsByMuseumId,
  };
});

// 地图静态配置仍从原路径导出，便于 MapSection 使用
export {
  provinceElevation,
  provinceNameMap,
  provinceColors,
  getElevationTier,
} from './data/map';
