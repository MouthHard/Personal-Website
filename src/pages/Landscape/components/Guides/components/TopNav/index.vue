<template>
  <nav class="top-nav">
    <div class="nav-container">
      <div class="nav-brand">
        <BrandIcon class="brand-icon" />
        <span class="brand-text">旅途志</span>
      </div>

      <div ref="searchContainer" class="nav-search">
        <div
          class="search-box"
          :class="{ focused: isSearchFocused, 'has-content': !!searchKeyword }"
          @click="searchInput?.focus()"
        >
          <div class="search-glow"></div>

          <div class="search-icon-wrap">
            <SearchIcon class="search-icon" :stroke-width="2.2" />
          </div>

          <input
            ref="searchInput"
            v-model="searchKeyword"
            type="text"
            placeholder="搜索攻略标题、目的地、作者..."
            @input="handleSearch"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown="handleKeyDown"
          />

          <button v-if="searchKeyword" class="clear-btn" title="清空" @mousedown.prevent="clearSearch">
            <CloseIcon :stroke-width="2.5" />
          </button>

          <button class="explore-btn" title="搜索" @mousedown.prevent="submitSearch">
            <span class="explore-btn-bg"></span>
            <CompassIcon class="explore-icon" :stroke-width="2.4" />
            <span class="explore-text">搜索</span>
          </button>
        </div>

        <transition name="dropdown">
          <div v-if="isSearchFocused" class="search-dropdown" @mousedown.prevent>
            <template v-if="searchKeyword">
              <div class="dropdown-section suggestions-section">
                <div class="section-header">
                  <span class="section-title">猜你想搜</span>
                </div>
                <div v-if="suggestions.length > 0" class="suggestion-list">
                  <button
                    v-for="(s, index) in suggestions"
                    :key="s"
                    class="suggestion-item"
                    :class="{ active: activeIndex === index }"
                    @mousedown.prevent="selectSuggestion(s)"
                  >
                    <span class="suggest-icon-wrap">
                      <SearchIcon class="suggest-icon" />
                    </span>
                    <span class="suggest-text" v-html="highlightMatch(s, searchKeyword)"></span>
                  </button>
                </div>
                <div v-else class="no-suggestions">没有找到相关建议</div>
              </div>
            </template>

            <template v-else>
              <div v-if="searchHistory.length > 0" class="dropdown-section">
                <div class="section-header">
                  <span class="section-title">搜索历史</span>
                  <div class="section-actions">
                    <button v-if="hasMoreHistory" class="section-action-btn" @mousedown.prevent="toggleShowAllHistory">
                      {{ showAllHistory ? '收起' : '更多' }}
                    </button>
                    <button class="section-action-btn danger" @mousedown.prevent="clearSearchHistory">清空</button>
                  </div>
                </div>
                <div class="history-tags">
                  <button
                    v-for="(item, index) in visibleHistory"
                    :key="item"
                    class="history-tag"
                    :class="{ active: activeIndex === index }"
                    @mousedown.prevent="selectHistoryItem(item)"
                  >
                    <ClockIcon class="history-icon" />
                    <span class="history-text">{{ item }}</span>
                    <span
                      class="history-remove"
                      role="button"
                      tabindex="0"
                      title="删除此记录"
                      @mousedown.prevent.stop="removeHistoryItem(item)"
                    >
                      <CloseIcon :stroke-width="2.5" />
                    </span>
                  </button>
                </div>
              </div>

              <div class="dropdown-section">
                <div class="section-header">
                  <span class="section-title">热门推荐</span>
                </div>
                <div class="hot-tags-list">
                  <button
                    v-for="(tag, index) in hotTags"
                    :key="tag.id"
                    class="hot-tag"
                    @mousedown.prevent="selectHotTag(tag.name)"
                  >
                    <span class="hot-rank" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
                    <span class="hot-text">{{ tag.name }}</span>
                    <span class="hot-count">{{ tag.count }}</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import DOMPurify from 'dompurify';
import { hotTags } from '@/utils/landscape/constants';
import { debounce } from '@/utils/landscape/debounce';
import { useSearchHistory } from '@/composables/landscape/useSearchHistory';
import { useGuideSearchSuggestions } from '@/composables/landscape/useGuideSearchSuggestions';
import BrandIcon from '@/pages/Landscape/icon/components/guides/TopNav/BrandIcon.vue';
import SearchIcon from '@/pages/Landscape/icon/common/SearchIcon.vue';
import CloseIcon from '@/pages/Landscape/icon/common/CloseIcon.vue';
import CompassIcon from '@/pages/Landscape/icon/common/CompassIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';

const props = defineProps<{
  initialKeyword?: string;
}>();

const searchKeyword = ref('');
const isSearchFocused = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const showAllHistory = ref(false);
const activeIndex = ref(-1);
let blurTimer: ReturnType<typeof setTimeout> | null = null;

const emit = defineEmits<{
  (e: 'update:searchKeyword', value: string): void;
  (e: 'search'): void;
}>();

const { history: searchHistory, addHistory, removeHistory, clearHistory } = useSearchHistory();
const { suggestions, updateSuggestions } = useGuideSearchSuggestions();

const visibleHistory = computed(() => {
  if (showAllHistory.value) {
    return searchHistory.value;
  }
  return searchHistory.value.slice(0, 3);
});

const hasMoreHistory = computed(() => searchHistory.value.length > 3);

const keyItems = computed(() => {
  if (searchKeyword.value) {
    return suggestions.value;
  }
  return visibleHistory.value;
});

watch(searchKeyword, (val) => {
  updateSuggestions(val);
});

const sanitizeKeyword = (keyword: string): string => {
  return keyword
    .replace(/[<>"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[\s\t\n\r]+/g, ' ')
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s\-_.,，。！!？?、]/g, '')
    .trim()
    .substring(0, 100);
};

const handleFocus = () => {
  if (blurTimer) {
    clearTimeout(blurTimer);
    blurTimer = null;
  }
  isSearchFocused.value = true;
  showAllHistory.value = false;
  activeIndex.value = -1;
};

const handleBlur = () => {
  blurTimer = setTimeout(() => {
    isSearchFocused.value = false;
    activeIndex.value = -1;
    blurTimer = null;
  }, 200);
};

onUnmounted(() => {
  if (blurTimer) clearTimeout(blurTimer);
});

const debouncedSearch = debounce((val: unknown) => {
  const value = val as string;
  const sanitized = sanitizeKeyword(value);
  if (sanitized !== value) {
    searchKeyword.value = sanitized;
  }
  emit('update:searchKeyword', sanitized);
  emit('search');
  if (sanitized) {
    addHistory(sanitized);
  }
}, 300);

const handleSearch = () => {
  activeIndex.value = -1;
  debouncedSearch(searchKeyword.value);
};

const submitSearch = () => {
  const value = sanitizeKeyword(searchKeyword.value);
  searchKeyword.value = value;
  emit('update:searchKeyword', value);
  emit('search');
  if (value) {
    addHistory(value);
  }
  isSearchFocused.value = true;
  activeIndex.value = -1;
  searchInput.value?.focus();
};

const clearSearch = () => {
  searchKeyword.value = '';
  updateSuggestions('');
  emit('update:searchKeyword', '');
  emit('search');
  activeIndex.value = -1;
  searchInput.value?.focus();
};

const selectSuggestion = (item: string) => {
  searchKeyword.value = item;
  emit('update:searchKeyword', item);
  emit('search');
  addHistory(item);
  isSearchFocused.value = true;
  activeIndex.value = -1;
  searchInput.value?.focus();
};

const selectHistoryItem = (item: string) => {
  searchKeyword.value = item;
  emit('update:searchKeyword', item);
  emit('search');
  addHistory(item);
  isSearchFocused.value = true;
  activeIndex.value = -1;
  searchInput.value?.focus();
};

const selectHotTag = (tag: string) => {
  selectSuggestion(tag);
};

const removeHistoryItem = (item: string) => {
  removeHistory(item);
};

const clearSearchHistory = () => {
  clearHistory();
  showAllHistory.value = false;
};

const toggleShowAllHistory = () => {
  showAllHistory.value = !showAllHistory.value;
};

const handleKeyDown = (event: KeyboardEvent) => {
  const items = keyItems.value;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, items.length - 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, -1);
  } else if (event.key === 'Enter') {
    if (activeIndex.value >= 0 && items[activeIndex.value]) {
      event.preventDefault();
      const chosen = items[activeIndex.value];
      if (searchKeyword.value) {
        selectSuggestion(chosen);
      } else {
        selectHistoryItem(chosen);
      }
    } else {
      submitSearch();
    }
  } else if (event.key === 'Escape') {
    isSearchFocused.value = false;
    activeIndex.value = -1;
  }
};

const highlightMatch = (text: string, keyword: string): string => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  const html = parts
    .map((part) => (regex.test(part) ? `<mark class="highlight">${part}</mark>` : part))
    .join('');
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['mark'],
  });
};

onMounted(() => {
  if (props.initialKeyword) {
    searchKeyword.value = props.initialKeyword;
    emit('update:searchKeyword', props.initialKeyword);
    emit('search');
  }
});
</script>

<style scoped lang="scss" src="./index.scss" />