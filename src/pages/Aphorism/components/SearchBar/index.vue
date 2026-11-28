<template>
  <div class="search-bar">
    <div class="search-container">
      <div class="search-icon">
        <SearchModeIcon />
      </div>
      <div class="search-input-container">
        <input
          ref="inputRef"
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索诗词、作者、名句..."
          aria-label="搜索诗词、作者、名句"
          @keyup.enter="handleSearchFromUser"
          @focus="handleFocus"
          @blur="handleBlur"
          @click="handleFocus"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="clear-button"
          title="清除搜索"
          @click="clearSearch"
        >
          ×
        </button>
      </div>
      <button type="button" class="search-button" @click="handleSearchFromUser">
        搜索
      </button>
    </div>

    <!-- 空聚焦：搜索历史 + 热门推荐（不占据文档流空间） -->
    <div v-if="isFocused && !searchQuery" class="search-dropdown">
      <!-- 搜索历史区（有历史时显示，上部） -->
      <div v-if="searchHistory.length > 0" class="search-history-section">
        <div class="history-header">
          <span class="section-label">搜索历史</span>
          <div class="history-actions">
            <button
              v-if="searchHistory.length > collapsedLimit && !isHistoryExpanded"
              type="button"
              class="history-action-btn"
              @mousedown.prevent="toggleHistoryExpand"
            >
              更多
            </button>
            <button
              v-if="isHistoryExpanded"
              type="button"
              class="history-action-btn"
              @mousedown.prevent="toggleHistoryExpand"
            >
              收起
            </button>
            <button
              type="button"
              class="history-action-btn"
              @mousedown.prevent="handleClearHistory"
            >
              清空
            </button>
          </div>
        </div>
        <div class="history-tags" :class="{ expanded: isHistoryExpanded }">
          <span
            v-for="item in searchHistory"
            :key="item"
            class="history-tag"
            role="button"
            tabindex="0"
            :aria-label="`按回车搜索历史词：${item}`"
            @mousedown.prevent="selectTag(item)"
            @keydown.enter.prevent="selectTag(item)"
            @keydown.space.prevent="selectTag(item)"
          >
            <span class="history-tag-text">{{ item }}</span>
            <span
              class="history-remove"
              role="button"
              tabindex="0"
              :aria-label="`删除历史词：${item}`"
              title="删除"
              @mousedown.prevent.stop="handleRemoveHistory(item)"
              @keydown.enter.prevent.stop="handleRemoveHistory(item)"
              @keydown.space.prevent.stop="handleRemoveHistory(item)"
            >
              ×
            </span>
          </span>
        </div>
      </div>
      <div v-else class="search-empty-history">
        <span class="seh-seal">史</span>
        <span class="seh-text">暂无搜索历史，先看看下方热门</span>
      </div>

      <!-- 热门推荐区（始终底部，不被挤出） -->
      <div class="hot-searches-section">
        <span class="hot-label">热门搜索：</span>
        <template v-if="hotTags.length > 0">
          <span
            v-for="tag in hotTags"
            :key="tag"
            class="hot-tag"
            role="button"
            tabindex="0"
            :aria-label="`按回车搜索热门词：${tag}`"
            @mousedown.prevent="selectTag(tag)"
            @keydown.enter.prevent="selectTag(tag)"
            @keydown.space.prevent="selectTag(tag)"
          >
            {{ tag }}
          </span>
        </template>
        <div v-else-if="isHotLoading" class="hot-tags-loading">
          <span v-for="n in 4" :key="n" class="htl-chip"></span>
        </div>
        <div v-else class="hot-tags-empty">
          <span class="hte-seal">热</span>
          <span class="hte-text">热门词条暂时缺席，稍后再试</span>
        </div>
      </div>
    </div>

    <!-- 有文字：只显示搜索建议（不占据文档流空间） -->
    <div
      v-if="isFocused && searchQuery && suggestions.length > 0"
      class="search-suggestions"
    >
      <div
        v-for="item in suggestions"
        :key="`${item.type}-${item.text}`"
        class="suggestion-item"
        role="button"
        tabindex="0"
        :aria-label="`按回车搜索：${item.text}`"
        @mousedown.prevent="selectSuggestion(item)"
        @keydown.enter.prevent="selectSuggestion(item)"
        @keydown.space.prevent="selectSuggestion(item)"
      >
        <span class="suggestion-icon">
          <component :is="item.icon === 'poem' ? CompassIcon : PoetIcon" />
        </span>
        <span class="suggestion-text">{{ item.text }}</span>
        <span class="suggestion-count">{{ item.count }}首</span>
      </div>
    </div>
    <div
      v-else-if="isFocused && searchQuery"
      class="search-suggestions is-empty"
    >
      <div class="suggestion-empty">
        <span class="ses-seal">空</span>
        <span class="suggestion-empty-text">
          未匹配到诗词，按回车直接搜索「{{ searchQuery }}」
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import { useAphorismDataStore } from '@/stores/aphorism';
  import { useAphorismInteractionStore } from '@/stores/aphorism/interaction';
  import { usePoemSearchIndex } from '@/composables/aphorism/usePoemSearchIndex';
  import CompassIcon from '../../icons/StudyRoom/CompassIcon.vue';
  import SearchModeIcon from '../../icons/common/SearchModeIcon.vue';
  import PoetIcon from '../../icons/common/PoetIcon.vue';
  import './index.scss';
  import './responsive.scss';

  interface SuggestionItem {
    icon: 'poem' | 'author';
    text: string;
    count: number;
    type: 'poem' | 'author';
    id?: string;
  }

  const props = defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search', query: string): void;
  }>();

  const dataStore = useAphorismDataStore();
  const interactionStore = useAphorismInteractionStore();
  const searchQuery = ref(props.modelValue || '');
  const isFocused = ref(false);
  const isHistoryExpanded = ref(false);
  const collapsedLimit = 6;
  const inputRef = ref<HTMLInputElement>();

  const hotTags = computed<string[]>(() => dataStore.hotTags);
  const allPoems = computed(() => dataStore.poems);
  const searchHistory = computed<string[]>(
    () => interactionStore.searchHistory,
  );
  const isHotLoading = ref(false);

  // 搜索索引复用 categoryFilter 的模块级缓存（与 searchPoems 共用同一份），
  // 避免 SearchBar 与搜索过滤各自构建一次几乎相同的全文索引
  const searchIndex = usePoemSearchIndex(allPoems);

  let blurTimer: number | null = null;

  // 唯一的搜索出口：写搜索历史与触发列表筛选在此原子化完成——任何一次搜索
  // 都必然同时做这两件事，从机制上杜绝「列表筛了但历史没写 / 历史写了但列表没筛」。
  // 关键：这里刻意不做输入防抖实时筛选。防抖会把「静」「静夜」这类输入中间态
  // 当成一次次搜索写进历史、污染记录。输入过程只在下拉 suggestions 里给实时
  // 反馈，主体诗词列表统一留到用户明确提交（回车 / 点按钮 / 点选建议）时才筛选。
  const commitSearch = (query: string) => {
    const value = query.trim();
    if (!value) return;
    interactionStore.addSearchHistory(value);
    emit('search', value);
  };

  const handleSearchFromUser = () => {
    if (!searchQuery.value.trim()) return;
    commitSearch(searchQuery.value);
    // 提交后收起下拉并失焦：避免建议浮层盖住搜索框下方的「当前检索」信息条
    if (blurTimer) {
      clearTimeout(blurTimer);
      blurTimer = null;
    }
    isFocused.value = false;
    isHistoryExpanded.value = false;
    inputRef.value?.blur();
  };

  // 输入时只双向同步 v-model（清空时父组件据此恢复全部列表）。
  // 下拉 suggestions 是独立 computed，仍随输入实时更新，保留即时反馈。
  watch(searchQuery, (newQuery) => {
    emit('update:modelValue', newQuery);
  });

  // 用预构建索引搜索，单次 includes 扫描，提前终止
  const suggestions = computed<SuggestionItem[]>(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q || searchIndex.value.length === 0) return [];

    const matchedPoems: Poem[] = [];
    const authorCountMap = new Map<string, number>();
    const authorOrder: string[] = [];

    for (const item of searchIndex.value) {
      if (item.text.includes(q)) {
        matchedPoems.push(item.poem);
        const a = item.poem.author;
        if (!authorCountMap.has(a)) {
          authorCountMap.set(a, 1);
          authorOrder.push(a);
        } else {
          authorCountMap.set(a, authorCountMap.get(a)! + 1);
        }
        // 收集足够结果后提前终止（3 首诗 + 足够统计前 3 作者）
        if (matchedPoems.length >= 30) break;
      }
    }

    if (matchedPoems.length === 0) return [];

    const items: SuggestionItem[] = [
      ...matchedPoems.slice(0, 3).map((p) => ({
        icon: 'poem' as const,
        text: p.title,
        count: 1,
        type: 'poem' as const,
        id: String(p.id),
      })),
      ...authorOrder.slice(0, 3).map((a) => ({
        icon: 'author' as const,
        text: a,
        count: authorCountMap.get(a) || 0,
        type: 'author' as const,
      })),
    ];

    return items.slice(0, 6);
  });

  const handleFocus = () => {
    if (blurTimer) {
      clearTimeout(blurTimer);
      blurTimer = null;
    }
    isFocused.value = true;
  };

  const handleBlur = () => {
    blurTimer = window.setTimeout(() => {
      isFocused.value = false;
      isHistoryExpanded.value = false;
      blurTimer = null;
    }, 200);
  };

  // ESC 收起下拉（不依赖焦点位置）；输入框保持聚焦，
  // 再次点击输入框由 @click="handleFocus" 重新展开
  const handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !isFocused.value) return;
    if (blurTimer) {
      clearTimeout(blurTimer);
      blurTimer = null;
    }
    isFocused.value = false;
    isHistoryExpanded.value = false;
  };

  watch(
    () => props.modelValue,
    (newVal) => {
      searchQuery.value = newVal;
    },
  );

  const handleSelect = (value: string) => {
    // 赋值会触发上面的 watch 同步 v-model；提交统一走 commitSearch（历史+筛选原子化）
    searchQuery.value = value;
    emit('update:modelValue', value);
    commitSearch(value);
    isFocused.value = false;
    isHistoryExpanded.value = false;
    inputRef.value?.blur();
  };

  const selectTag = (tag: string) => {
    handleSelect(tag);
  };

  const selectSuggestion = (item: SuggestionItem) => {
    handleSelect(item.text);
  };

  const clearSearch = () => {
    searchQuery.value = '';
    emit('update:modelValue', '');
    // 保持聚焦：点 × 后立即可见搜索历史下拉（含刚记录的关键词）
    inputRef.value?.focus();
  };

  const toggleHistoryExpand = () => {
    isHistoryExpanded.value = !isHistoryExpanded.value;
  };

  const handleRemoveHistory = (keyword: string) => {
    interactionStore.removeSearchHistory(keyword);
  };

  const handleClearHistory = () => {
    interactionStore.clearSearchHistory();
    isHistoryExpanded.value = false;
  };

  onMounted(async () => {
    document.addEventListener('keydown', handleDocumentKeydown);

    if (dataStore.hotTags.length === 0) {
      isHotLoading.value = true;
      try {
        await dataStore.loadHotTags();
      } finally {
        isHotLoading.value = false;
      }
    }
  });

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleDocumentKeydown);
    if (blurTimer) {
      clearTimeout(blurTimer);
      blurTimer = null;
    }
  });

  const focusInput = () => {
    inputRef.value?.focus();
  };

  defineExpose({ focusInput });
</script>
