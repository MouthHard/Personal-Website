import { loadJSON, paginate, filterByKeyword, filterByField, findItemById } from './static-data';
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
import {
  getArtifactImageByCategory,
  getExhibitionImage,
  getCreativeImage,
  getActivityImage,
  getNewsImage,
  getImmersiveImage,
  getHallCoverImage,
  getHallArtifactImage,
  getHallExhibitionImage,
} from '@/utils/museum/poolAllocator';

export interface MuseumListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MuseumQueryParams {
  keyword?: string;
  province?: string;
  type?: string;
  museumId?: number;
  category?: string;
  page?: number;
  limit?: number;
}

function applyFilters<T extends Record<string, any>>(items: T[], params: MuseumQueryParams): T[] {
  let result = items;
  if (params.keyword) result = filterByKeyword(result, params.keyword, ['name', 'title', 'description']);
  if (params.province) result = filterByField(result, 'province', params.province);
  if (params.type) result = filterByField(result, 'type', params.type);
  if (params.museumId) result = filterByField(result, 'museumId', params.museumId);
  if (params.category) result = filterByField(result, 'category', params.category);
  return result;
}

// ─── 图片池分配辅助：按 museumId 分组，组内递增序号 ───

// 根据展览日期字符串派生状态（静态数据无 status 字段，按真实日期推断）
function deriveExhibitionStatus(date?: string): { status: string; statusText: string } {
  const d = date || '';
  if (d.includes('常设')) {
    return { status: '最新', statusText: '正在展出' };
  }
  const m = d.match(/(\d{4})年(\d{1,2})月\s*[-—~]\s*(\d{4})年(\d{1,2})月/);
  if (m) {
    const now = new Date();
    const start = new Date(Number(m[1]), Number(m[2]) - 1);
    const end = new Date(Number(m[3]), Number(m[4]) - 1);
    const soon = new Date(now.getFullYear(), now.getMonth() + 3);
    if (end < now) return { status: '已结束', statusText: '已结束' };
    if (start > now) return { status: '筹备中', statusText: '筹备中' };
    if (end < soon) return { status: '即将结束', statusText: '即将结束' };
    return { status: '最新', statusText: '正在展出' };
  }
  return { status: '最新', statusText: '正在展出' };
}

function withImagePool<T extends { museumId: number }>(
  items: T[],
  fn: (item: T, index: number) => T,
): T[] {
  const counters = new Map<number, number>();
  return items.map((item) => {
    const idx = counters.get(item.museumId) || 0;
    counters.set(item.museumId, idx + 1);
    return fn(item, idx);
  });
}

const applyArtifactPool = (items: Artifact[]) =>
  withImagePool(items, (item, idx) => ({ ...item, image: getArtifactImageByCategory(item.museumId, idx, item.category) }));

const applyExhibitionPool = (items: Exhibition[]) =>
  withImagePool(items, (item, idx) => {
    const derived = deriveExhibitionStatus(item.date);
    return { ...item, image: getExhibitionImage(item.museumId, idx), status: item.status || derived.status, statusText: item.statusText || derived.statusText };
  });

const applyCreativePool = (items: CreativeProduct[]) =>
  withImagePool(items, (item, idx) => ({ ...item, image: getCreativeImage(item.museumId, idx) }));

const applyActivityPool = (items: Activity[]) =>
  withImagePool(items, (item, idx) => ({ ...item, image: getActivityImage(item.museumId, idx) }));

const applyNewsPool = (items: News[]) =>
  withImagePool(items, (item, idx) => ({ ...item, image: getNewsImage(item.museumId, idx) }));

const applyImmersivePool = (items: ImmersiveExperience[]) =>
  withImagePool(items, (item, idx) => ({ ...item, image: getImmersiveImage(item.museumId, idx) }));

function applyHallPool(items: ExhibitionHall[]): ExhibitionHall[] {
  const coverCounters = new Map<number, number>();
  return items.map((item) => {
    const mid = item.museumId;
    const coverIdx = coverCounters.get(mid) || 0;
    coverCounters.set(mid, coverIdx + 1);
    return {
      ...item,
      coverImage: getHallCoverImage(mid, coverIdx),
      artifacts: item.artifacts.map((a, i) => ({
        ...a,
        image: getHallArtifactImage(mid, i),
      })),
      exhibitions: item.exhibitions.map((e, i) => ({
        ...e,
        image: getHallExhibitionImage(mid, i),
      })),
    };
  });
}

export async function fetchMuseums(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Museum>>('museum/museums.json');
  const items = applyFilters(data?.items || [], params);
  return paginate(items, params);
}

export async function fetchMuseumById(id: number) {
  return findItemById<Museum>('museum/museums.json', id);
}

export async function fetchMuseumDetail(museumId: number) {
  const data = await loadJSON<MuseumListResponse<MuseumDetailInfo>>('museum/museum-details.json');
  return data?.items.find((item) => item.museumId === museumId) || null;
}

export async function fetchArtifacts(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Artifact>>('museum/artifacts.json');
  const items = applyArtifactPool(data?.items || []);
  const filtered = applyFilters(items, params);
  return paginate(filtered, params);
}


export async function fetchArtifactDetail(id: number) {
  const data = await loadJSON<MuseumListResponse<ArtifactDetail>>('museum/artifact-details.json');
  return data?.items.find((item) => item.id === id) || null;
}

export async function fetchExhibitions(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Exhibition>>('museum/exhibitions.json');
  const items = applyExhibitionPool(data?.items || []);
  const filtered = applyFilters(items, params);
  return paginate(filtered, params);
}


export async function fetchCreativeActivities(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Activity>>('museum/creative-activities.json');
  const items = applyActivityPool(data?.items || []);
  const filtered = applyFilters(items, params);
  return paginate(filtered, params);
}

export async function fetchNews(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<News>>('museum/museum-news.json');
  const items = applyNewsPool(data?.items || []);
  const filtered = applyFilters(items, params);
  return paginate(filtered, params);
}

export async function fetchImmersive(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<ImmersiveExperience>>('museum/immersive.json');
  const items = applyImmersivePool(data?.items || []);
  const filtered = applyFilters(items, params);
  return paginate(filtered, params);
}

export async function fetchCreativeProducts(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<CreativeProduct>>('museum/creative-products.json');
  const items = applyCreativePool(data?.items || []);
  const filtered = applyFilters(items, params);
  return paginate(filtered, params);
}


export async function fetchExhibitionHalls(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<ExhibitionHall>>('museum/exhibition-halls.json');
  const items = applyHallPool(data?.items || []);
  const filtered = applyFilters(items, params);
  return paginate(filtered, params);
}
