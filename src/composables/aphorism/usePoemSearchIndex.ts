/**
 * 诗词全文搜索索引 composable
 * 复用 categoryFilter 的模块级索引缓存，让「搜索建议」与「搜索过滤」共享同一份索引，
 * 避免同一批数据被重复拼接成两次小写全文串。
 */
import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { Poem } from '@/typesOfPages/aphorism/poem';
import {
  getSearchEntries,
  type SearchEntry,
} from '@/utils/aphorism/categoryFilter';

export function usePoemSearchIndex(poems: MaybeRefOrGetter<Poem[]>) {
  return computed<SearchEntry[]>(() => getSearchEntries(toValue(poems)));
}
