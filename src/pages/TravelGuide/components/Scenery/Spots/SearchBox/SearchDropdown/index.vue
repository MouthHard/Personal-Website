<script setup lang="ts">
  import { computed, ref, watch, onUnmounted } from 'vue';
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';
  import { useScenerySearchHistory } from '@/composables/travelGuide/useScenerySearchHistory';
  import { useSceneryHotTags } from '@/composables/travelGuide/useSceneryHotTags';
  import SearchIcon from '@/pages/TravelGuide/icons/common/SearchIcon.vue';
  import CloseIcon from '@/pages/TravelGuide/icons/common/CloseIcon.vue';

  const props = defineProps<{
    allSpots: ScenerySpot[];
    externalQuery?: string;
  }>();

  const emit = defineEmits<{
    'debounced-query': [value: string];
  }>();

  const searchQuery = ref('');
  const debouncedQuery = ref('');
  const isSearchFocused = ref(false);
  const activeSuggestionIndex = ref(-1);

  const { history, addHistory, clearHistory } = useScenerySearchHistory();
  const { hotSearchTags } = useSceneryHotTags(computed(() => props.allSpots));

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  watch(searchQuery, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val;
      activeSuggestionIndex.value = -1;
      emit('debounced-query', val);
    }, 300);
  });

  let historyTimer: ReturnType<typeof setTimeout> | null = null;
  watch(debouncedQuery, (val) => {
    if (historyTimer) clearTimeout(historyTimer);
    const trimmed = val.trim();
    if (trimmed && !history.value.includes(trimmed)) {
      historyTimer = setTimeout(() => {
        addHistory(trimmed);
      }, 800);
    }
  });

  watch(
    () => props.externalQuery,
    (query) => {
      if (query) {
        searchQuery.value = query;
        debouncedQuery.value = query;
        emit('debounced-query', query);
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (historyTimer) clearTimeout(historyTimer);
  });

  const searchSuggestions = computed<ScenerySpot[]>(() => {
    if (!debouncedQuery.value) return [];
    const q = debouncedQuery.value.toLowerCase();
    return props.allSpots
      .filter(
        (spot) =>
          spot.name.toLowerCase().includes(q) ||
          spot.location.toLowerCase().includes(q) ||
          (spot.tags || []).some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  });

  const highlightText = (text: string, keyword: string): string => {
    if (!keyword) return text;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  };

  const moveSuggestion = (dir: number) => {
    if (!searchSuggestions.value.length) return;
    const len = searchSuggestions.value.length;
    activeSuggestionIndex.value = (activeSuggestionIndex.value + dir + len) % len;
  };

  const selectSuggestion = (name: string) => {
    searchQuery.value = name;
    debouncedQuery.value = name;
    emit('debounced-query', name);
    addHistory(name);
  };

  const selectKeyword = (keyword: string) => {
    searchQuery.value = keyword;
    debouncedQuery.value = keyword;
    emit('debounced-query', keyword);
    addHistory(keyword);
  };

  const handleSearchEnter = () => {
    if (activeSuggestionIndex.value >= 0 && activeSuggestionIndex.value < searchSuggestions.value.length) {
      selectSuggestion(searchSuggestions.value[activeSuggestionIndex.value].name);
      return;
    }
    if (searchQuery.value.trim()) {
      addHistory(searchQuery.value.trim());
    }
  };

  const handleSearchEsc = () => {
    isSearchFocused.value = false;
    activeSuggestionIndex.value = -1;
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      isSearchFocused.value = false;
    }, 150);
  };

  const handleClear = () => {
    searchQuery.value = '';
    debouncedQuery.value = '';
    activeSuggestionIndex.value = -1;
    emit('debounced-query', '');
  };

  defineExpose({ clear: handleClear });
</script>

<template>
  <div class="search-box" @focusin="isSearchFocused = true" @focusout="handleSearchBlur">
    <div class="search-icon-wrapper"><SearchIcon /></div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜索景点、位置、标签或描述..."
      class="search-input"
      @keydown.enter.prevent="handleSearchEnter"
      @keydown.down.prevent="moveSuggestion(1)"
      @keydown.up.prevent="moveSuggestion(-1)"
      @keydown.esc.prevent="handleSearchEsc"
    />
    <button v-if="searchQuery" class="search-clear-btn" title="清空" @click="handleClear">
      <CloseIcon :size="16" :stroke-width="2.5" />
    </button>

    <div
      v-if="isSearchFocused && debouncedQuery && searchSuggestions.length"
      class="search-dropdown"
    >
      <span class="dropdown-rivet dropdown-rivet-tl"></span>
      <span class="dropdown-rivet dropdown-rivet-tr"></span>
      <span class="dropdown-rivet dropdown-rivet-bl"></span>
      <span class="dropdown-rivet dropdown-rivet-br"></span>
      <div class="dropdown-header">
        <span class="dropdown-title">搜索建议</span>
        <span class="suggestion-count">{{ searchSuggestions.length }} 条结果</span>
      </div>
      <div class="suggestion-list">
        <div
          v-for="(s, i) in searchSuggestions"
          :key="s.id"
          class="suggestion-item"
          :class="{ active: i === activeSuggestionIndex }"
          @mousedown.prevent="selectSuggestion(s.name)"
          @mouseenter="activeSuggestionIndex = i"
        >
          <span class="suggestion-name" v-html="highlightText(s.name, debouncedQuery)" />
          <span class="suggestion-meta">{{ s.location }} · {{ s.type === 'nature' ? '自然' : '人文' }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="isSearchFocused" class="search-dropdown">
      <span class="dropdown-rivet dropdown-rivet-tl"></span>
      <span class="dropdown-rivet dropdown-rivet-tr"></span>
      <span class="dropdown-rivet dropdown-rivet-bl"></span>
      <span class="dropdown-rivet dropdown-rivet-br"></span>
      <div v-if="history.length" class="dropdown-section">
        <div class="dropdown-header">
          <span class="dropdown-title">搜索历史</span>
          <button class="clear-history-btn" @click="clearHistory">清空</button>
        </div>
        <div class="dropdown-tags">
          <span
            v-for="h in history"
            :key="h"
            class="history-tag"
            @mousedown.prevent="selectKeyword(h)"
          >
            <span class="history-tag-dot"></span>
            <span class="history-tag-text">{{ h }}</span>
          </span>
        </div>
      </div>
      <div v-if="hotSearchTags.length" class="dropdown-section">
        <div class="dropdown-header">
          <span class="dropdown-title">热门搜索</span>
          <span class="hot-flame-icon"></span>
        </div>
        <div class="dropdown-tags">
          <span
            v-for="(tag, i) in hotSearchTags"
            :key="tag"
            class="hot-tag"
            :class="{ 'hot-top': i < 3, 'hot-first': i === 0 }"
            @mousedown.prevent="selectKeyword(tag)"
          >
            <span class="hot-rank">{{ i + 1 }}</span>
            <span class="hot-tag-text">{{ tag }}</span>
            <span
              class="hot-trend"
              :class="i === 0 ? 'trend-top' : i < 3 ? 'trend-up' : 'trend-flat'"
            ></span>
          </span>
        </div>
      </div>
      <div class="dropdown-footer">
        <span class="footer-key">Enter</span>
        <span class="footer-text">搜索</span>
        <span class="footer-divider"></span>
        <span class="footer-key">Esc</span>
        <span class="footer-text">关闭</span>
        <span class="footer-divider"></span>
        <span class="footer-key">↑↓</span>
        <span class="footer-text">选择</span>
      </div>
    </div>
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>