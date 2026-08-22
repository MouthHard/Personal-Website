import { loadJSON, paginate, filterByKeyword, filterByField, findItemById, loadDetail } from './static-data';
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
  AcademicResource,
  ExhibitionHall,
} from '@/typesOfPages/museum';

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

export async function fetchMuseums(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Museum>>('museum/museums.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchMuseumById(id: number) {
  return findItemById<Museum>('museum/museums.json', id);
}

export async function fetchMuseumDetail(museumId: number) {
  return loadDetail<MuseumDetailInfo>('museum/museum-details', museumId);
}

export async function fetchArtifacts(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Artifact>>('museum/artifacts.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchArtifactById(id: number) {
  return findItemById<Artifact>('museum/artifacts.json', id);
}

export async function fetchArtifactDetail(id: number) {
  return loadDetail<ArtifactDetail>('museum/artifact-details', id);
}

export async function fetchExhibitions(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Exhibition>>('museum/exhibitions.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchActivities(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<Activity>>('museum/activities.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchNews(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<News>>('museum/museum-news.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchImmersive(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<ImmersiveExperience>>('museum/immersive.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchCreativeProducts(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<CreativeProduct>>('museum/creative-products.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchAcademicResources(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<AcademicResource>>('museum/academic-resources.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchExhibitionHalls(params: MuseumQueryParams = {}) {
  const data = await loadJSON<MuseumListResponse<ExhibitionHall>>('museum/exhibition-halls.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}
