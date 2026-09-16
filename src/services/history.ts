import { loadJSON } from './static-data';

export interface HistoryListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchDynasties(): Promise<HistoryListResponse<any>> {
  return loadJSON<HistoryListResponse<any>>('history/dynasties.json');
}

export async function fetchHistoricalEvents(): Promise<HistoryListResponse<any>> {
  return loadJSON<HistoryListResponse<any>>('history/events.json');
}

export async function fetchHistoricalFigures(): Promise<HistoryListResponse<any>> {
  return loadJSON<HistoryListResponse<any>>('history/figures.json');
}

export async function fetchCulturalHeritage(): Promise<HistoryListResponse<any>> {
  return loadJSON<HistoryListResponse<any>>('history/heritage.json');
}