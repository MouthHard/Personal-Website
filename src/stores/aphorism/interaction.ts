import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Poem } from '@/typesOfPages/aphorism/poem';

const STORAGE_KEYS = {
  liked: 'aphorism_liked',
  loved: 'aphorism_loved',
  favorites: 'aphorism_favorites',
  recentViews: 'aphorism_recent_views',
  searchHistory: 'aphorism_search_history',
  read: 'aphorism_read',
} as const;

const MAX_RECENT_VIEWS = 20;
const MAX_SEARCH_HISTORY = 20;

function loadStringArrayFromStorage(key: string): string[] {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (s: unknown): s is string => typeof s === 'string',
        );
      }
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * 安全写入 localStorage：隐私模式禁用存储、配额超限等场景下 setItem 会抛异常，
 * 统一在此吞掉，避免交互动作（点赞/收藏/清空等）因存储失败而中断。
 */
function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 存储不可用时静默降级：内存中的响应式状态仍然有效，本次会话功能不受影响
  }
}

function saveStringArrayToStorage(key: string, arr: string[]) {
  safeSetItem(key, arr);
}

function loadArrayFromStorage(key: string): number[] {
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // 确保所有 ID 都是有限数字，过滤 NaN / null / 脏数据
      return parsed.map(Number).filter((id: number) => Number.isFinite(id));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveArrayToStorage(key: string, arr: number[]) {
  safeSetItem(key, arr);
}

/**
 * 读取「读过」记录。与 recentViews（滚动 20 条）不同，readIds 是累积型的，
 * 用于诗词足迹，保证读过的诗词不会被后来的浏览挤掉。
 * 兼容升级：仅当 read key 完全不存在时，才把历史 liked/loved/favorites 迁移进来，
 * 避免上线后老用户足迹清零；若 key 已存在（含用户主动清空的空数组）则原样尊重。
 */
/** 合并历史互动 ID，用于 read 记录首次迁移 */
function mergeLegacyIds(legacyIds: number[][]): number[] {
  const merged = new Set<number>();
  legacyIds.forEach((ids) => ids.forEach((id) => merged.add(id)));
  return [...merged];
}

function loadReadIds(legacyIds: number[][]): number[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEYS.read);
  } catch {
    // 存储不可用（隐私模式/被禁用）时退化为内存态：保留历史互动合并结果，避免 store 初始化失败
    return mergeLegacyIds(legacyIds);
  }
  if (raw === null) {
    const result = mergeLegacyIds(legacyIds);
    // 即时落盘标记为「已迁移」，避免每次启动重复迁移；空数组也是合法的已初始化状态
    saveArrayToStorage(STORAGE_KEYS.read, result);
    return result;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [
      ...new Set(
        parsed.map(Number).filter((id: number) => Number.isFinite(id)),
      ),
    ];
  } catch {
    return [];
  }
}

export const useAphorismInteractionStore = defineStore(
  'aphorismInteraction',
  () => {
    // 使用数组保持 Vue 3 ref 响应式，用 computed Set 镜像实现 O(1) 查找
    const likedIds = ref<number[]>(loadArrayFromStorage(STORAGE_KEYS.liked));
    const lovedIds = ref<number[]>(loadArrayFromStorage(STORAGE_KEYS.loved));
    const favoriteIds = ref<number[]>(
      loadArrayFromStorage(STORAGE_KEYS.favorites),
    );
    const recentViewIds = ref<number[]>(
      loadArrayFromStorage(STORAGE_KEYS.recentViews),
    );
    const searchHistory = ref<string[]>(
      loadStringArrayFromStorage(STORAGE_KEYS.searchHistory),
    );
    // 累积型「读过」：仅打开弹窗即计入，不受 recentViews 的 20 条滚动上限影响
    const readIds = ref<number[]>(
      loadReadIds([
        loadArrayFromStorage(STORAGE_KEYS.liked),
        lovedIds.value,
        favoriteIds.value,
      ]),
    );

    // Set 镜像：O(1) 查找
    const likedSet = computed(() => new Set(likedIds.value));
    const lovedSet = computed(() => new Set(lovedIds.value));
    const favoriteSet = computed(() => new Set(favoriteIds.value));
    const readSet = computed(() => new Set(readIds.value));

    // 防抖写 localStorage，避免频繁点击阻塞主线程
    const storageTimers: Record<string, number | null> = {};

    /** 撤销某个 key 尚未落盘的防抖写入（清空类操作必须先调，避免旧值回填） */
    const cancelPendingSave = (key: string) => {
      const timer = storageTimers[key];
      if (timer != null) {
        clearTimeout(timer);
        storageTimers[key] = null;
      }
    };

    const debouncedSave = (key: string, value: unknown) => {
      cancelPendingSave(key);
      storageTimers[key] = window.setTimeout(() => {
        safeSetItem(key, value);
        storageTimers[key] = null;
      }, 300);
    };

    const toggleLike = (poemId: number) => {
      const index = likedIds.value.indexOf(poemId);
      if (index > -1) {
        likedIds.value.splice(index, 1);
      } else {
        likedIds.value.push(poemId);
      }
      debouncedSave(STORAGE_KEYS.liked, likedIds.value);
    };

    const isLiked = (poemId: number) => likedSet.value.has(poemId);

    const toggleLove = (poemId: number) => {
      const index = lovedIds.value.indexOf(poemId);
      if (index > -1) {
        lovedIds.value.splice(index, 1);
      } else {
        lovedIds.value.push(poemId);
      }
      debouncedSave(STORAGE_KEYS.loved, lovedIds.value);
    };

    const isLoved = (poemId: number) => lovedSet.value.has(poemId);

    const toggleFavorite = (poemId: number) => {
      const index = favoriteIds.value.indexOf(poemId);
      if (index > -1) {
        favoriteIds.value.splice(index, 1);
      } else {
        favoriteIds.value.push(poemId);
      }
      debouncedSave(STORAGE_KEYS.favorites, favoriteIds.value);
    };

    const isFavorite = (poemId: number) => favoriteSet.value.has(poemId);

    const addRecentView = (poemId: number) => {
      const index = recentViewIds.value.indexOf(poemId);
      if (index > -1) {
        recentViewIds.value.splice(index, 1);
      }
      recentViewIds.value.unshift(poemId);
      if (recentViewIds.value.length > MAX_RECENT_VIEWS) {
        recentViewIds.value.length = MAX_RECENT_VIEWS;
      }
      debouncedSave(STORAGE_KEYS.recentViews, recentViewIds.value);
    };

    const clearRecentViews = () => {
      cancelPendingSave(STORAGE_KEYS.recentViews);
      recentViewIds.value = [];
      saveArrayToStorage(STORAGE_KEYS.recentViews, []);
    };

    /** 记录「读过」：打开弹窗即计入一次，幂等去重，累积不淘汰 */
    const addRead = (poemId: number) => {
      if (readSet.value.has(poemId)) return;
      readIds.value.push(poemId);
      debouncedSave(STORAGE_KEYS.read, readIds.value);
    };

    /** 清空「读过」足迹（先撤销待写防抖，再同步落盘，避免旧引用回填） */
    const clearRead = () => {
      cancelPendingSave(STORAGE_KEYS.read);
      readIds.value = [];
      saveArrayToStorage(STORAGE_KEYS.read, []);
    };

    const addSearchHistory = (keyword: string) => {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      const index = searchHistory.value.indexOf(trimmed);
      if (index > -1) {
        searchHistory.value.splice(index, 1);
      }
      searchHistory.value.unshift(trimmed);
      if (searchHistory.value.length > MAX_SEARCH_HISTORY) {
        searchHistory.value.length = MAX_SEARCH_HISTORY;
      }
      debouncedSave(STORAGE_KEYS.searchHistory, searchHistory.value);
    };

    const removeSearchHistory = (keyword: string) => {
      const index = searchHistory.value.indexOf(keyword);
      if (index > -1) {
        searchHistory.value.splice(index, 1);
      }
      debouncedSave(STORAGE_KEYS.searchHistory, searchHistory.value);
    };

    const clearSearchHistory = () => {
      cancelPendingSave(STORAGE_KEYS.searchHistory);
      searchHistory.value = [];
      saveStringArrayToStorage(STORAGE_KEYS.searchHistory, []);
    };

    const pickByIds = (allPoems: Poem[], ids: Set<number>) =>
      allPoems.filter((p) => ids.has(p.id));

    const getLovedPoems = (allPoems: Poem[]) =>
      pickByIds(allPoems, lovedSet.value);

    const getFavoritePoems = (allPoems: Poem[]) =>
      pickByIds(allPoems, favoriteSet.value);

    const lovedCount = computed(() => lovedIds.value.length);
    const favoriteCount = computed(() => favoriteIds.value.length);

    /**
     * 合并遍历：基于「读过」集合同时产出「诗人」与「朝代分布」。
     * 口径：打开过诗词弹窗即算读过（见 addRead），与喜爱/收藏解耦。
     */
    const getPoetAndDynastyStats = (allPoems: Poem[]) => {
      const s = readSet.value;
      const poetMap = new Map<
        string,
        { name: string; dynasty: string; count: number }
      >();
      const dynastyMap = new Map<string, number>();

      for (const poem of allPoems) {
        if (s.has(poem.id)) {
          const key = `${poem.author}-${poem.dynasty}`;
          const existing = poetMap.get(key);
          if (existing) {
            existing.count++;
          } else {
            poetMap.set(key, {
              name: poem.author,
              dynasty: poem.dynasty,
              count: 1,
            });
          }
          dynastyMap.set(poem.dynasty, (dynastyMap.get(poem.dynasty) || 0) + 1);
        }
      }

      const poets = [...poetMap.values()].sort((a, b) => b.count - a.count);
      const dynasties = [...dynastyMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

      return { poets, dynasties };
    };

    return {
      likedIds,
      lovedIds,
      favoriteIds,
      recentViewIds,
      readIds,
      searchHistory,
      toggleLike,
      isLiked,
      toggleLove,
      isLoved,
      toggleFavorite,
      isFavorite,
      addRecentView,
      clearRecentViews,
      addRead,
      clearRead,
      addSearchHistory,
      removeSearchHistory,
      clearSearchHistory,
      getLovedPoems,
      getFavoritePoems,
      lovedCount,
      favoriteCount,

      getPoetAndDynastyStats,
    };
  },
);
