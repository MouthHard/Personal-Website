/**
 * 静态数据加载工具
 *
 * 从 public/static-data/ 目录加载 JSON 文件，替代后端 API 调用。
 * 提供缓存、分页、过滤等功能。
 */

const DATA_BASE = `${import.meta.env.BASE_URL}static-data`;

const cache = new Map<string, Promise<unknown>>();

export function loadJSON<T = unknown>(filename: string): Promise<T> {
  const cacheKey = filename;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)! as Promise<T>;
  }
  const promise: Promise<unknown> = fetch(`${DATA_BASE}/${filename}`)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`Failed to load ${filename}: ${resp.status}`);
      }
      return resp.json();
    })
    .catch((err) => {
      cache.delete(cacheKey);
      console.error(`[static-data] ${err.message}`);
      throw err;
    });
  cache.set(cacheKey, promise);
  return promise as Promise<T>;
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
  const limit = params.limit || 9999;
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);
  return { items: pageItems, total, page, limit, totalPages };
}

export function filterByKeyword<T extends object>(
  items: T[],
  keyword?: string,
  fields: (keyof T)[] = ['name', 'title'] as (keyof T)[],
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

export function filterByField<T extends object>(
  items: T[],
  field: keyof T,
  value?: unknown,
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
  // 有意使用 ==：本地 JSON 的 id 可能是 number 或 string，需宽松匹配（如 42 == '42'）。
  return items.find((item) => item.id == id) || null;
}
