/**
 * 静态数据加载工具
 *
 * 从 public/static-data/ 目录加载 JSON 文件，替代后端 API 调用。
 * 提供缓存、分页、过滤等功能。
 */

const DATA_BASE = `${import.meta.env.BASE_URL}static-data`;

const cache = new Map<string, Promise<any>>();

export function loadJSON<T = any>(filename: string): Promise<T> {
  const cacheKey = filename;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  const promise = fetch(`${DATA_BASE}/${filename}`)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`Failed to load ${filename}: ${resp.status}`);
      }
      return resp.json();
    })
    .catch((err) => {
      cache.delete(cacheKey);
      console.error(`[static-data] ${err.message}`);
      return null;
    });
  cache.set(cacheKey, promise);
  return promise;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function paginate<T>(
  items: T[],
  params: PaginationParams = {},
): PaginatedResponse<T> {
  const page = params.page || 1;
  const limit = params.limit || 200;
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);
  return { items: pageItems, total, page, limit, totalPages };
}

export function filterByKeyword<T extends Record<string, any>>(
  items: T[],
  keyword?: string,
  fields: (keyof T)[] = ['name', 'title'],
): T[] {
  if (!keyword) return items;
  const lower = keyword.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => {
      const val = item[field];
      return val && String(val).toLowerCase().includes(lower);
    }),
  );
}

export function filterByField<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  value?: any,
): T[] {
  if (value === undefined || value === null || value === '') return items;
  return items.filter((item) => item[field] === value);
}

export async function findItemById<T extends { id: number | string }>(
  filename: string,
  id: number | string,
): Promise<T | null> {
  const data = await loadJSON<PaginatedResponse<T>>(filename);
  if (!data) return null;
  const items = data.items || data;
  return items.find((item) => item.id == id) || null;
}

export async function loadDetail<T = any>(
  dir: string,
  id: number | string,
): Promise<T | null> {
  return loadJSON<T>(`${dir}/${id}.json`);
}