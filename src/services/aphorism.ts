import { loadJSON, paginate, filterByKeyword, filterByField, findItemById } from './static-data';
import type { Poem } from '@/typesOfPages/aphorism/poem';

export interface AphorismListResponse {
  items: Poem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AphorismQueryParams {
  keyword?: string;
  dynasty?: string;
  author?: string;
  form?: string;
  categoryId?: number;
  tag?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CategoryChild {
  id: number;
  name: string;
  icon: string;
  count: number;
  sortOrder: number;
}

export interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  children: CategoryChild[];
}

function applyFilters(items: Poem[], params: AphorismQueryParams): Poem[] {
  let result = items;
  if (params.keyword) result = filterByKeyword(result, params.keyword, ['title', 'content', 'author']);
  if (params.dynasty) result = filterByField(result, 'dynasty', params.dynasty);
  if (params.author) result = filterByField(result, 'author', params.author);
  if (params.form) result = filterByField(result, 'form', params.form);
  if (params.tag) result = result.filter((item) => item.tags?.includes(params.tag!));
  if (params.isFeatured) result = result.filter((item) => item.isFeatured);
  if (params.categoryId) result = result.filter((item) => (item as any).categoryId === params.categoryId);
  if (params.sortBy) {
    const order = params.sortOrder === 'ASC' ? 1 : -1;
    result = [...result].sort((a, b) => {

      const av = (a as any)[params.sortBy!] ?? 0;
      const bv = (b as any)[params.sortBy!] ?? 0;
      return (av > bv ? 1 : av < bv ? -1 : 0) * order;
    });
  }
  return result;
}

export async function fetchAphorisms(params: AphorismQueryParams = {}) {
  const data = await loadJSON<AphorismListResponse>('aphorism/aphorisms.json');
  const items = applyFilters(data?.items || [], params);
  return paginate(items, params);
}

export async function fetchAphorismById(id: number) {
  return findItemById<Poem>('aphorism/aphorisms.json', id);
}

export async function fetchAphorismCategories() {
  return loadJSON<CategoryGroup[]>('aphorism/aphorism-categories.json');
}

export async function fetchHotTags(limit = 20) {
  const tags = await loadJSON<string[]>('aphorism/aphorism-tags.json');
  return tags?.slice(0, limit) || [];
}
