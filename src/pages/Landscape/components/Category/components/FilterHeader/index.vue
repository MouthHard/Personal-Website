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
        </div>

        <div v-if="searchFocused" class="search-expanded">
          <div v-if="searchHistory.length > 0" class="expanded-section history-section">
            <div class="history-header">
              <h4>搜索历史</h4>
              <div class="history-actions">
                <button
                  v-if="searchHistory.length > collapsedLimit && !isHistoryExpanded"
                  class="history-action-btn"
                  @mousedown.prevent="isHistoryExpanded = true"
                >更多</button>
                <button
                  v-if="isHistoryExpanded"
                  class="history-action-btn"
                  @mousedown.prevent="isHistoryExpanded = false"
                >收起</button>
                <button
                  class="history-action-btn"
                  @mousedown.prevent="handleClearHistory"
                >清空</button>
              </div>
            </div>
            <div class="history-tags" :class="{ expanded: isHistoryExpanded }">
              <span
                v-for="item in searchHistory"
                :key="item"
                class="history-tag"
                @mousedown.prevent="selectHistory(item)"
              >
                <span class="history-tag-text">{{ item }}</span>
                <span
                  class="history-remove"
                  title="删除"
                  @mousedown.prevent.stop="handleRemoveHistory(item)"
                >×</span>
              </span>
            </div>
          </div>

          <div class="expanded-section">
            <h4>热门推荐</h4>
            <div class="recommend-list">
              <button
                v-for="rec in hotRecommendations"
                :key="rec"
                class="recommend-item"
                @mousedown.prevent="selectHistory(rec)"
              >
                <span class="rec-icon">🔥</span>
                <span>{{ rec }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="result-header-section">
      <div class="header-info">
        <h2>{{ title }}</h2>
        <p class="result-count">共 {{ count }} 个结果</p>
      </div>
      <div class="header-controls">
        <div class="controls-stack">
          <div class="media-type-switch">
            <button
              v-for="mt in mediaTypes"
              :key="mt.id"
              :class="['mt-btn', { active: mediaType === mt.id, [mt.id]: true }]"
              @click="$emit('update:mediaType', mt.id)"
            >
              <span class="mt-icon"><component :is="mediaTypeIconMap[mt.id]" /></span>
              <span class="mt-label">{{ mt.label }}</span>
            </button>
          </div>
          <div class="quick-filters">
            <button
              v-for="filter in quickFilters"
              :key="filter.id"
              :class="['filter-chip', { active: activeFilter === filter.id }]"
              @click="$emit('update:activeFilter', filter.id)"
            >
              <span class="chip-icon"><component :is="filterIconMap[filter.id]" /></span>
              <span class="chip-label">{{ filter.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { mediaTypes, quickFilters } from '@/utils/landscape/constants';
import { useLandscapeDataStore } from '@/stores/landscape/data';
import { debounce } from '@/utils/landscape/debounce';
import SearchIcon from '@/pages/Landscape/icon/common/SearchIcon.vue';
import XCircleIcon from '@/pages/Landscape/icon/components/category/FilterHeader/XCircleIcon.vue';
import LayersIcon from '@/pages/Landscape/icon/common/LayersIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';
import VideoIcon from '@/pages/Landscape/icon/common/VideoIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';

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

const debouncedEmit = debounce((val: unknown) => {
  emit('update:modelValue', val as string);
}, 300);

watch(localValue, (val) => {
  debouncedEmit(val);
});

onMounted(() => {

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
  searchFocused.value = false;
};

const clearSearch = () => {
  localValue.value = '';
  emit('update:modelValue', '');
  searchInputRef.value?.focus();
};
</script>

<style scoped lang="scss" src="./index.scss" />
