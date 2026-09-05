import { loadJSON, paginate, filterByKeyword, filterByField, type PaginatedResponse } from './static-data';
import type {
  GlobalPhotographer,
  GlobalImage,
  GlobalVideo,
  GlobalGuide,
} from '@/typesOfPages/landscape/data';

export interface LandscapeListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LandscapeQueryParams {
  keyword?: string;
  category?: string;
  location?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

function applyFilters<T extends Record<string, any>>(items: T[], params: LandscapeQueryParams): T[] {
  let result = items;
  if (params.keyword) result = filterByKeyword(result, params.keyword, ['title', 'name', 'description']);
  if (params.category) result = filterByField(result, 'category', params.category);
  if (params.location) result = filterByField(result, 'location', params.location);
  if (params.authorId) result = filterByField(result, 'authorId', params.authorId);
  return result;
}

function emptyResponse<T>(params: LandscapeQueryParams): PaginatedResponse<T> {
  return { items: [], total: 0, page: params.page || 1, limit: params.limit || 200, totalPages: 1 };
}

export async function fetchPhotographers(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalPhotographer>>('landscape/photographers.json');
  if (!data) return emptyResponse<GlobalPhotographer>(params);
  const items = applyFilters(data.items || [], params);
  return paginate(items, params);
}


export async function fetchImages(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalImage>>('landscape/landscape-images.json');
  if (!data) return emptyResponse<GlobalImage>(params);
  const items = applyFilters(data.items || [], params);
  return paginate(items, params);
}


export async function fetchVideos(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalVideo>>('landscape/landscape-videos.json');
  if (!data) return emptyResponse<GlobalVideo>(params);
  const items = applyFilters(data.items || [], params);
  return paginate(items, params);
}


export async function fetchGuides(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalGuide>>('landscape/landscape-guides.json');
  if (!data) return emptyResponse<GlobalGuide>(params);
  const items = applyFilters(data.items || [], params);
  return paginate(items, params);
}


export async function fetchHotTopics(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<any>>('landscape/hot-topics.json');
  if (!data) return emptyResponse<any>(params);
  const items = applyFilters(data.items || [], params);
  return paginate(items, params);
}

export async function fetchPopularDestinations(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<any>>('landscape/popular-destinations.json');
  if (!data) return emptyResponse<any>(params);
  const items = applyFilters(data.items || [], params);
  return paginate(items, params);
}
