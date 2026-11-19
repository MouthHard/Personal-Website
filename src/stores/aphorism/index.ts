import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import type { Poem } from '@/typesOfPages/aphorism';
import {
  fetchAphorisms,
  fetchAphorismCategories,
  fetchHotTags,
} from '@/services/aphorism';
import type { AphorismQueryParams, CategoryGroup } from '@/services/aphorism';
import {
  filterPoemsByCategory,
  searchPoems,
} from '@/utils/aphorism/categoryFilter';

export const useAphorismDataStore = defineStore('aphorismData', () => {
  const poems = shallowRef<Poem[]>([]);
  const filteredPoems = shallowRef<Poem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const categories = shallowRef<CategoryGroup[]>([]);
  const hotTags = shallowRef<string[]>([]);

  // 请求竞态保护：每次 load 递增序号，只有最新一次的响应允许写入，
  // 避免连点重试/快速切换时先发出的旧请求后返回覆盖新数据
  let loadRequestId = 0;

  async function loadPoems(params: AphorismQueryParams = {}) {
    const requestId = ++loadRequestId;
    loading.value = true;
    error.value = null;
    try {
      // 不设 limit 取全量：本页过滤/搜索/分页全在前端完成，
      // 硬编码上限会在数据增长后静默截断（paginate 默认 limit=9999）
      const response = await fetchAphorisms({
        page: params.page ?? 1,
        limit: params.limit,
      });
      if (requestId !== loadRequestId) return;
      poems.value = response.items;
      filteredPoems.value = response.items;
    } catch (e) {
      if (requestId !== loadRequestId) return;
      error.value = e instanceof Error ? e.message : '加载失败';
      poems.value = [];
      filteredPoems.value = [];
    } finally {
      if (requestId === loadRequestId) loading.value = false;
    }
  }

  async function loadCategories() {
    try {
      categories.value = await fetchAphorismCategories();
    } catch {
      categories.value = [];
    }
  }

  async function loadHotTags() {
    try {
      hotTags.value = await fetchHotTags();
    } catch {
      hotTags.value = [];
    }
  }

  // 前端纯过滤，避免重复网络请求
  function filterByCategory(categoryId?: number, mainCategoryId?: string) {
    if (!categoryId || !mainCategoryId) {
      filteredPoems.value = poems.value;
      return;
    }
    const subCat = categories.value
      .find((c) => c.id === mainCategoryId)
      ?.children.find((ch) => ch.id === categoryId);
    const subCategoryId = subCat?.name ?? String(categoryId);
    filteredPoems.value = filterPoemsByCategory(poems.value, {
      categoryId: mainCategoryId,
      subCategoryId,
    });
  }

  // 按「组 id + 子类名」直接过滤：URL query 消费专用，
  // 不依赖 categories 的加载时序（filterPoemsByCategory 本身按名称匹配）
  function filterByCategoryName(
    mainCategoryId: string,
    subCategoryName?: string,
  ) {
    if (!mainCategoryId || !subCategoryName || subCategoryName === '全部诗词') {
      filteredPoems.value = poems.value;
      return;
    }
    filteredPoems.value = filterPoemsByCategory(poems.value, {
      categoryId: mainCategoryId,
      subCategoryId: subCategoryName,
    });
  }

  // 按作者精确过滤：诗人入口专用，
  // 避免用全文搜索把「内容里提到该诗人」的作品也混入
  function filterByAuthor(author?: string) {
    if (!author) {
      filteredPoems.value = poems.value;
      return;
    }
    filteredPoems.value = poems.value.filter((p) => p.author === author);
  }

  // 前端纯搜索，避免重复网络请求
  function searchByKeyword(keyword: string) {
    const trimmed = keyword.trim();
    if (!trimmed) {
      filteredPoems.value = poems.value;
      return;
    }
    filteredPoems.value = searchPoems(poems.value, trimmed);
  }

  function resetFilter() {
    filteredPoems.value = poems.value;
  }

  const getAllPoems = (): Poem[] => poems.value;

  return {
    poems,
    filteredPoems,
    loading,
    error,
    categories,
    hotTags,
    loadPoems,
    loadCategories,
    loadHotTags,
    filterByCategory,
    filterByCategoryName,
    filterByAuthor,
    searchByKeyword,
    resetFilter,
    getAllPoems,
  };
});
