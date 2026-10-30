<template>
  <div class="filter-header">
    <div class="search-section">
      <div class="search-container" :class="{ focused: searchFocused }">
        <div class="search-input">
          <SearchIcon />
          <input
            ref="searchInputRef"
            v-model="localValue"
            type="text"
            placeholder="搜索风景、地点、摄影师..."
            @focus="searchFocused = true"
            @blur="handleBlur"
            @keydown.enter="handleEnter"
          />
          <button
            v-if="modelValue"
            class="clear-btn"
            @mousedown.prevent="clearSearch"
          >
            <XCircleIcon :stroke-width="2" />
          </button>
          <span class="vf-corner tl" aria-hidden="true"></span>
          <span class="vf-corner tr" aria-hidden="true"></span>
          <span class="vf-corner bl" aria-hidden="true"></span>
          <span class="vf-corner br" aria-hidden="true"></span>
        </div>

        <div v-if="searchFocused" class="search-expanded">
          <div
            v-if="suggestions.length > 0"
            class="expanded-section suggestions-section"
          >
            <div class="section-head">
              <span class="head-glyph" aria-hidden="true"></span>
              <h4>搜索建议</h4>
              <span class="head-en">SUGGESTIONS</span>
              <span class="head-line" aria-hidden="true"></span>
            </div>
            <div class="suggestion-list">
              <button
                v-for="s in suggestions"
                :key="s.id"
                class="suggestion-item"
                @mousedown.prevent="selectHistory(s.text)"
              >
                <span class="sug-dot" aria-hidden="true"></span>
                <span class="sug-text">
                  <template v-for="(part, i) in s.parts" :key="i">
                    <span v-if="part.match" class="sug-match">
                      {{ part.text }}
                    </span>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </span>
                <span class="sug-enter" aria-hidden="true">↵</span>
              </button>
            </div>
          </div>

          <div
            v-if="searchHistory.length > 0"
            class="expanded-section history-section"
          >
            <div class="history-header">
              <div class="section-head">
                <span class="head-glyph" aria-hidden="true"></span>
                <h4>搜索历史</h4>
                <span class="head-en">HISTORY</span>
                <span class="head-line" aria-hidden="true"></span>
              </div>
              <div class="history-actions">
                <button
                  v-if="
                    searchHistory.length > collapsedLimit && !isHistoryExpanded
                  "
                  class="history-action-btn"
                  @mousedown.prevent="isHistoryExpanded = true"
                >
                  更多
                </button>
                <button
                  v-if="isHistoryExpanded"
                  class="history-action-btn"
                  @mousedown.prevent="isHistoryExpanded = false"
                >
                  收起
                </button>
                <button
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
                @mousedown.prevent="selectHistory(item)"
              >
                <span class="tag-star" aria-hidden="true"></span>
                <span class="history-tag-text">{{ item }}</span>
                <span
                  class="history-remove"
                  title="删除"
                  @mousedown.prevent.stop="handleRemoveHistory(item)"
                >
                  ×
                </span>
              </span>
            </div>
          </div>

          <div v-if="!modelValue.trim()" class="expanded-section">
            <div class="section-head">
              <span class="head-glyph" aria-hidden="true"></span>
              <h4>热门推荐</h4>
              <span class="head-en">TRENDING</span>
              <span class="head-line" aria-hidden="true"></span>
            </div>
            <div class="recommend-list">
              <button
                v-for="(rec, idx) in hotRecommendations"
                :key="rec"
                class="recommend-item"
                @mousedown.prevent="selectHistory(rec)"
              >
                <span class="hot-rank" :class="{ top: idx === 0 }">
                  {{ idx + 1 }}
                </span>
                <span>{{ rec }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-header-section">
      <div class="header-info">
        <div class="peak-title">
          <span class="peak-badge" aria-hidden="true">
            <svg viewBox="0 0 36 26" fill="none">
              <defs>
                <linearGradient id="peakBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#a78bfa" stop-opacity="0.55" />
                  <stop offset="1" stop-color="#312e81" stop-opacity="0.9" />
                </linearGradient>
                <linearGradient id="peakMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#c4b5fd" stop-opacity="0.8" />
                  <stop offset="1" stop-color="#4c1d95" stop-opacity="0.95" />
                </linearGradient>
                <linearGradient id="peakFront" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#6d28d9" stop-opacity="0.7" />
                  <stop offset="1" stop-color="#1e1b4b" stop-opacity="0.95" />
                </linearGradient>
              </defs>
              <polygon points="2,24 10,8 18,24" fill="url(#peakBg)" />
              <polygon points="12,24 22,3 32,24" fill="url(#peakMid)" />
              <polygon points="24,24 30,12 36,24" fill="url(#peakFront)" />
              <path
                d="M22 0.5 L22.9 2.1 L24.5 3 L22.9 3.9 L22 5.5 L21.1 3.9 L19.5 3 L21.1 2.1 Z"
                fill="#fde68a"
              />
            </svg>
          </span>
          <h2>{{ title }}</h2>
        </div>
        <p class="result-count">
          <span class="alt-dot" aria-hidden="true"></span>
          共 {{ count }} 个观测结果
        </p>
      </div>
      <div class="header-controls">
        <div class="controls-stack">
          <div class="media-type-switch">
            <button
              v-for="mt in mediaTypes"
              :key="mt.id"
              :class="[
                'mt-btn',
                { active: mediaType === mt.id, [mt.id]: true },
              ]"
              @click="$emit('update:mediaType', mt.id)"
            >
              <span class="mt-icon">
                <component :is="mediaTypeIconMap[mt.id]" />
              </span>
              <span class="mt-label">{{ mt.label }}</span>
              <span class="mt-star" aria-hidden="true"></span>
            </button>
          </div>
          <div class="quick-filters">
            <button
              v-for="filter in quickFilters"
              :key="filter.id"
              :class="['filter-chip', { active: activeFilter === filter.id }]"
              @click="$emit('update:activeFilter', filter.id)"
            >
              <span class="chip-icon">
                <component :is="filterIconMap[filter.id]" />
              </span>
              <span class="chip-label">{{ filter.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onUnmounted } from 'vue';
  import { mediaTypes, quickFilters } from '@/constants/landscape';
  import { useLandscapeDataStore } from '@/stores/landscape/data';
  import { debounce } from '@/utils/landscape/debounce';
  import type { LandscapeItem } from '@/typesOfPages/landscape';
  import SearchIcon from '@/pages/Landscape/icons/common/SearchIcon.vue';
  import XCircleIcon from '@/pages/Landscape/icons/components/category/FilterHeader/XCircleIcon.vue';
  import LayersIcon from '@/pages/Landscape/icons/common/LayersIcon.vue';
  import ImageIcon from '@/pages/Landscape/icons/common/ImageIcon.vue';
  import VideoIcon from '@/pages/Landscape/icons/common/VideoIcon.vue';
  import ClockIcon from '@/pages/Landscape/icons/common/ClockIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';

  const mediaTypeIconMap: Record<string, any> = {
    all: LayersIcon,
    image: ImageIcon,
    video: VideoIcon,
  };

  const filterIconMap: Record<string, any> = {
    latest: ClockIcon,
    'most-views': EyeIcon,
    'most-likes': ThumbUpIcon,
    'most-loves': HeartIcon,
    'most-favorites': BookmarkIcon,
    'most-shares': ShareIcon,
  };

  interface Props {
    modelValue: string;
    title: string;
    count: number;
    activeFilter: string;
    mediaType: 'all' | 'image' | 'video';
    items: LandscapeItem[];
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    'update:activeFilter': [value: string];
    'update:mediaType': [value: 'all' | 'image' | 'video'];
  }>();

  const searchFocused = ref(false);
  const searchInputRef = ref<HTMLInputElement | null>(null);
  const localValue = ref(props.modelValue);

  const suggestions = computed(() => {
    const q = (props.modelValue || '').trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<string>();
    const result: {
      id: string;
      text: string;
      parts: { text: string; match: boolean }[];
    }[] = [];
    for (const item of props.items) {
      const title = item.title || '';
      const location = (item as any).location || '';
      const tags: string[] = (item as any).tags || [];
      const hay = [title, location, ...tags].join(' ').toLowerCase();
      if (!hay.includes(q)) continue;
      const key = title;
      if (seen.has(key)) continue;
      seen.add(key);
      const idx = title.toLowerCase().indexOf(q);
      const parts: { text: string; match: boolean }[] = [];
      if (idx >= 0) {
        parts.push({ text: title.slice(0, idx), match: false });
        parts.push({ text: title.slice(idx, idx + q.length), match: true });
        parts.push({ text: title.slice(idx + q.length), match: false });
      } else {
        parts.push({ text: title, match: false });
      }
      result.push({ id: String(item.id), text: title, parts });
      if (result.length >= 6) break;
    }
    return result;
  });

  const STORAGE_KEY = 'landscape_search_history';
  const MAX_HISTORY = 20;
  const collapsedLimit = 6;
  const isHistoryExpanded = ref(false);
  const searchHistory = ref<string[]>([]);

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) searchHistory.value = JSON.parse(raw);
    } catch {
      searchHistory.value = [];
    }
  };

  const saveHistory = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory.value));
    } catch {
      // ignore
    }
  };

  const addSearchHistory = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const index = searchHistory.value.indexOf(trimmed);
    if (index !== -1) searchHistory.value.splice(index, 1);
    searchHistory.value.unshift(trimmed);
    if (searchHistory.value.length > MAX_HISTORY) {
      searchHistory.value.length = MAX_HISTORY;
    }
    saveHistory();
  };

  const handleRemoveHistory = (keyword: string) => {
    const index = searchHistory.value.indexOf(keyword);
    if (index !== -1) {
      searchHistory.value.splice(index, 1);
      saveHistory();
    }
  };

  const handleClearHistory = () => {
    searchHistory.value = [];
    isHistoryExpanded.value = false;
    saveHistory();
  };

  loadHistory();

  const dataStore = useLandscapeDataStore();

  const allTags = computed(() => {
    const tagSet = new Set<string>();
    dataStore.getAllImages().forEach((img) => {
      img.tags?.forEach((t) => tagSet.add(t));
    });
    dataStore.getAllVideos().forEach((vid) => {
      vid.tags?.forEach((t) => tagSet.add(t));
    });
    dataStore.getAllGuides().forEach((guide) => {
      guide.tags?.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  });

  const hotRecommendations = ref<string[]>([]);

  const pickRandomTags = (count: number) => {
    const tags = allTags.value;
    if (tags.length === 0) return;
    const shuffled = [...tags].sort(() => Math.random() - 0.5);
    hotRecommendations.value = shuffled.slice(0, Math.min(count, tags.length));
  };

  watch(
    () => allTags.value.length,
    (len) => {
      if (len > 0 && hotRecommendations.value.length === 0) {
        pickRandomTags(6);
      }
    },
    { immediate: true },
  );

  watch(
    () => props.modelValue,
    (val) => {
      if (val !== localValue.value) {
        localValue.value = val;
      }
    },
  );

  const debouncedEmit = debounce((val: string) => {
    emit('update:modelValue', val);
    if (val.trim()) {
      addSearchHistory(val.trim());
    }
  }, 300);

  watch(localValue, (val) => {
    debouncedEmit(val);
  });

  let blurTimer: ReturnType<typeof setTimeout> | null = null;

  const handleBlur = () => {
    blurTimer = setTimeout(() => {
      searchFocused.value = false;
      blurTimer = null;
    }, 150);
  };

  onUnmounted(() => {
    if (blurTimer) clearTimeout(blurTimer);
  });

  const handleEnter = () => {
    const trimmed = localValue.value.trim();
    if (trimmed) {
      addSearchHistory(trimmed);
      isHistoryExpanded.value = false;
    }
    searchFocused.value = false;
  };

  const selectHistory = (value: string) => {
    localValue.value = value;
    emit('update:modelValue', value);
    addSearchHistory(value);
    isHistoryExpanded.value = false;
  };

  const clearSearch = () => {
    localValue.value = '';
    emit('update:modelValue', '');
    searchInputRef.value?.focus();
  };
</script>

<style scoped lang="scss" src="./index.scss" />
