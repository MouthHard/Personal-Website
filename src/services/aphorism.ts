import {
  loadJSON,
  paginate,
  filterByKeyword,
  filterByField,
} from './static-data';
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

/** Poem 上可用于筛选/排序的字段键（编译期约束，替代 as any） */
type PoemFilterKey =
  | 'id'
  | 'title'
  | 'author'
  | 'dynasty'
  | 'content'
  | 'form'
  | 'tags'
  | 'imageUrl'
  | 'viewCount'
  | 'likeCount'
  | 'isFeatured'
  | 'createdAt'
  | 'updatedAt';

const POEM_FILTER_KEYS: ReadonlySet<string> = new Set<PoemFilterKey>([
  'id',
  'title',
  'author',
  'dynasty',
  'content',
  'form',
  'tags',
  'imageUrl',
  'viewCount',
  'likeCount',
  'isFeatured',
  'createdAt',
  'updatedAt',
]);

/** 把外部传入的字符串收窄为合法的 Poem 字段键；非法键返回 null */
function toPoemFilterKey(key: string): PoemFilterKey | null {
  return POEM_FILTER_KEYS.has(key) ? (key as PoemFilterKey) : null;
}

/** 读取可排序字段的原始值：仅 number / string 参与比较，其余按 0 处理 */
function sortableValue(poem: Poem, key: PoemFilterKey): number | string {
  const value = poem[key];
  return typeof value === 'number' || typeof value === 'string' ? value : 0;
}

function applyFilters(items: Poem[], params: AphorismQueryParams): Poem[] {
  let result = items;
  if (params.keyword)
    result = filterByKeyword(result, params.keyword, [
      'title',
      'content',
      'author',
    ]);
  if (params.dynasty) result = filterByField(result, 'dynasty', params.dynasty);
  if (params.author) result = filterByField(result, 'author', params.author);
  if (params.form) result = filterByField(result, 'form', params.form);
  if (params.tag)
    result = result.filter((item) => item.tags?.includes(params.tag!));
  if (params.isFeatured) result = result.filter((item) => item.isFeatured);
  if (params.categoryId) {
    // categoryId 仅存在于本地 JSON 的扩展字段中，不在 Poem 接口定义内。
    // 用结构类型收窄替代 as any，避免绕过类型系统。
    result = result.filter((item) => {
      const withCategory = item as Poem & { categoryId?: number };
      return withCategory.categoryId === params.categoryId;
    });
  }
  if (params.sortBy) {
    const sortKey = toPoemFilterKey(params.sortBy);
    if (sortKey) {
      const order = params.sortOrder === 'ASC' ? 1 : -1;
      result = [...result].sort((a, b) => {
        const av = sortableValue(a, sortKey);
        const bv = sortableValue(b, sortKey);
        return (av > bv ? 1 : av < bv ? -1 : 0) * order;
      });
    }
  }
  return result;
}

export async function fetchAphorisms(params: AphorismQueryParams = {}) {
  const data = await loadJSON<AphorismListResponse>(
    'aphorism/poems/aphorisms.json',
  );
  const items = applyFilters(data?.items || [], params);
  return paginate(items, params);
}

export async function fetchAphorismCategories() {
  return loadJSON<CategoryGroup[]>(
    'aphorism/categories/aphorism-categories.json',
  );
}

export async function fetchHotTags(limit = 20) {
  const tags = await loadJSON<string[]>('aphorism/tags/aphorism-tags.json');
  return tags?.slice(0, limit) || [];
}
