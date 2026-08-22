import { loadJSON, paginate, filterByKeyword, filterByField, findItemById } from './static-data';
import type {
  Dynasty,
  HistoricalEvent,
  HistoricalFigure,
  CulturalHeritageItem,
} from '@/typesOfPages/history';

export interface HistoryListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HistoryQueryParams {
  keyword?: string;
  category?: string;
  era?: string;
  periodTag?: string;
  dynasty?: string;
  page?: number;
  limit?: number;
}

function applyFilters<T extends Record<string, any>>(items: T[], params: HistoryQueryParams): T[] {
  let result = items;
  if (params.keyword) result = filterByKeyword(result, params.keyword, ['name', 'title', 'description']);
  if (params.category) result = filterByField(result, 'category', params.category);
  if (params.era) result = filterByField(result, 'era', params.era);
  if (params.periodTag) result = filterByField(result, 'periodTag', params.periodTag);
  if (params.dynasty) result = filterByField(result, 'dynasty', params.dynasty);
  return result;
}

export async function fetchDynasties(params: HistoryQueryParams = {}) {
  const data = await loadJSON<HistoryListResponse<Dynasty>>('history/dynasties.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchDynastyById(id: string) {
  return findItemById<Dynasty>('history/dynasties.json', id);
}

export async function fetchEvents(params: HistoryQueryParams = {}) {
  const data = await loadJSON<HistoryListResponse<HistoricalEvent>>('history/events.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchEventById(id: string) {
  return findItemById<HistoricalEvent>('history/events.json', id);
}

export async function fetchFigures(params: HistoryQueryParams = {}) {
  const data = await loadJSON<HistoryListResponse<HistoricalFigure>>('history/figures.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchFigureById(id: string) {
  return findItemById<HistoricalFigure>('history/figures.json', id);
}

export async function fetchHeritage(params: HistoryQueryParams = {}) {
  const data = await loadJSON<HistoryListResponse<CulturalHeritageItem>>('history/heritage.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchHeritageById(id: string) {
  return findItemById<CulturalHeritageItem>('history/heritage.json', id);
}
