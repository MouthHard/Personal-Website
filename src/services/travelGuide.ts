import { loadJSON, paginate, filterByKeyword, filterByField } from './static-data';
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


export async function fetchScenery(provinceId: string) {
  return loadJSON<ProvinceScenery>(`travel-guide/scenery/${provinceId}.json`);
}

export async function fetchFood(provinceId: string) {
  return loadJSON<ProvinceFood>(`travel-guide/food/${provinceId}.json`);
}
