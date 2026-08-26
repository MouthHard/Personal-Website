import { loadJSON, paginate, filterByKeyword, filterByField, findItemById } from './static-data';
import type {
  Province,
  SceneryData,
  FoodItem,
  FoodLocation,
} from '@/typesOfPages/travelGuide';

export interface TravelGuideListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TravelGuideQueryParams {
  keyword?: string;
  region?: string;
  page?: number;
  limit?: number;
}

export interface ProvinceScenery extends SceneryData {
  customs?: { activities?: unknown[] };
}

export interface ProvinceFood {
  items: FoodItem[];
  locations: FoodLocation[];
}

function applyFilters<T extends Record<string, any>>(items: T[], params: TravelGuideQueryParams): T[] {
  let result = items;
  if (params.keyword) result = filterByKeyword(result, params.keyword, ['name', 'title', 'description']);
  if (params.region) result = filterByField(result, 'region', params.region);
  return result;
}

export async function fetchProvinces(params: TravelGuideQueryParams = {}) {
  const data = await loadJSON<TravelGuideListResponse<Province>>('travel-guide/provinces.json');
  const items = applyFilters(data?.items || [], params);
  return paginate(items, params);
}

export async function fetchProvinceById(id: string) {
  return findItemById<Province>('travel-guide/provinces.json', id);
}

export async function fetchRegions() {
  const data = await loadJSON<TravelGuideListResponse<Province>>('travel-guide/provinces.json');
  if (!data) return [];
  const items = data.items || [];
  const regions = [...new Set(items.map((p) => p.region).filter(Boolean))] as string[];
  return regions;
}

export async function fetchScenery(provinceId: string) {
  return loadJSON<ProvinceScenery>(`travel-guide/scenery/${provinceId}.json`);
}

export async function fetchFood(provinceId: string) {
  return loadJSON<ProvinceFood>(`travel-guide/food/${provinceId}.json`);
}
