import { loadJSON, paginate, filterByKeyword, filterByField, findItemById } from './static-data';
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

export async function fetchPhotographers(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalPhotographer>>('landscape/photographers.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchPhotographerById(id: string) {
  return findItemById<GlobalPhotographer>('landscape/photographers.json', id);
}

export async function fetchImages(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalImage>>('landscape/landscape-images.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchImageById(id: string) {
  return findItemById<GlobalImage>('landscape/landscape-images.json', id);
}

export async function fetchVideos(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalVideo>>('landscape/landscape-videos.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchVideoById(id: string) {
  return findItemById<GlobalVideo>('landscape/landscape-videos.json', id);
}

export async function fetchGuides(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<GlobalGuide>>('landscape/landscape-guides.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchGuideById(id: string) {
  return findItemById<GlobalGuide>('landscape/landscape-guides.json', id);
}

export async function fetchHotTopics(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<any>>('landscape/hot-topics.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchPopularDestinations(params: LandscapeQueryParams = {}) {
  const data = await loadJSON<LandscapeListResponse<any>>('landscape/popular-destinations.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}
