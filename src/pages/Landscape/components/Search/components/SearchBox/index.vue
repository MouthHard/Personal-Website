<template>
  <div ref="searchBoxRef" class="search-box">
    <div class="search-container" :class="{ focused: isFocused }">
      <div class="geometric-bg">
        <div class="hexagon hex-1"></div>
        <div class="hexagon hex-2"></div>
        <div class="line line-1"></div>
        <div class="line line-2"></div>
      </div>

      <div class="search-input-wrapper">
        <div class="icon-container">
          <SearchIcon class="search-icon" :stroke-width="2" />
          <div class="icon-ring"></div>
        </div>

        <input v-model="searchKeyword" type="text" class="search-input" placeholder="搜索风景、摄影师、攻略..."
          @input="handleInput" @focus="handleFocus" @blur="handleBlur" @keydown="handleKeyDown" @keyup.enter="handleSearch" />

        <button v-if="searchKeyword.length > 0" class="clear-btn-input" title="清除" @mousedown.prevent="handleClear">
          <CloseIcon :stroke-width="2.5" />
        </button>

        <button class="explore-btn" @click="handleSearch">
          <div class="btn-bg"></div>
          <CompassIcon class="compass-icon" :stroke-width="2.5" />
          <span class="btn-text">探索</span>
          <div class="btn-particles">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>

    <transition name="dropdown">
      <div v-if="showDropdown" class="search-dropdown">
        <!-- 搜索关键字建议（仅在有输入且有建议时显示，垂直排列） -->
        <div v-if="searchKeyword.length > 0 && suggestions.length > 0" class="suggestions-section">
          <div class="suggestion-list">
            <button v-for="(s, index) in suggestions" :key="s" class="suggestion-item"
              :class="{ active: activeSuggestionIndex === index }"
              @click.stop="handleSuggestionClick(s)">
              <SearchIcon class="suggest-icon" :stroke-width="2" />
              <span class="suggest-text" v-html="highlightMatch(s, searchKeyword)"></span>
            </button>
          </div>
        </div>

        <!-- 底部区域：搜索历史 + 热门搜索（始终居于下拉菜单底部） -->
        <div class="dropdown-bottom">
          <!-- 搜索历史（在搜索页面始终显示，其他页面有历史才显示） -->
          <div v-if="history.length > 0 && (isSearchPage || searchKeyword.length === 0)" class="history-section">
            <div class="section-header">
              <div class="diamond"></div>
              <h4 class="section-title">搜索历史</h4>
              <button class="clear-btn" @mousedown.prevent @click.stop="clearHistory">清空</button>
            </div>
            <div class="history-tags" :class="{ expanded: showAllHistory }">
              <button v-for="(item, index) in displayHistory" :key="item" class="history-tag"
                @click.stop="handleHistoryClick(item)">
                <span class="history-text">{{ item }}</span>
                <span class="history-remove-btn" role="button" tabindex="0" title="删除此记录"
                  @mousedown.prevent @click.stop="removeHistoryAt(index)" @keydown.enter.prevent="removeHistoryAt(index)"
                  @keydown.space.prevent="removeHistoryAt(index)">
                  <CloseIcon />
                </span>
              </button>
              <button v-if="history.length > maxHistoryPerRow && !showAllHistory" class="more-btn"
                @mousedown.prevent @click.stop="showAllHistory = true">
                <span>更多</span>
                <ChevronDownIcon />
              </button>
              <button v-if="showAllHistory" class="more-btn" @mousedown.prevent @click.stop="showAllHistory = false">
                <span>收起</span>
                <ChevronUpIcon />
              </button>
            </div>
          </div>

          <!-- 热门探索（仅在无输入时显示，有输入时隐藏） -->
          <div v-if="searchKeyword.length === 0" class="hot-section">
            <div class="dropdown-header">
              <div class="diamond"></div>
              <h4 class="section-title">热门探索</h4>
              <div class="diamond"></div>
            </div>

            <div class="hot-tags" :class="{ expanded: showAllHot }">
              <button v-for="(tag, index) in displayHotTags" :key="tag.text" class="hot-tag"
                :style="{ animationDelay: `${index * 0.06}s` }" @click="handleTagClick(tag)">
                <div class="tag-glow"></div>
                <span class="tag-text">{{ tag.text }}</span>
              </button>
              <button v-if="hotSearchTags.length > maxHotPerRow && !showAllHot" class="more-btn hot-more-btn"
                @mousedown.prevent @click.stop="showAllHot = true">
                <span>更多</span>
                <ChevronDownIcon />
              </button>
              <button v-if="showAllHot" class="more-btn hot-more-btn"
                @mousedown.prevent @click.stop="showAllHot = false">
                <span>收起</span>
                <ChevronUpIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchIcon from '../../../../icon/common/SearchIcon.vue';
import CompassIcon from '../../../../icon/common/CompassIcon.vue';
import CloseIcon from '@/pages/Landscape/icon/common/CloseIcon.vue';
import ChevronDownIcon from '@/pages/Landscape/icon/common/ChevronDownIcon.vue';
import ChevronUpIcon from '@/pages/Landscape/icon/common/ChevronUpIcon.vue';
import { useSearchHistory } from '@/composables/landscape/useSearchHistory';
import { useHotTags } from '@/composables/landscape/useHotTags';
import { useSearchSuggestions } from '@/composables/landscape/useSearchSuggestions';


const route = useRoute();
const router = useRouter();
const searchKeyword = ref('');
const showDropdown = ref(false);
const isFocused = ref(false);
const showAllHistory = ref(false);
const showAllHot = ref(false);
const maxHistoryPerRow = 6;
const maxHotPerRow = 6;
const activeSuggestionIndex = ref(-1);
const searchBoxRef = ref<HTMLElement | null>(null);

const isSearchPage = computed(() => route.path === '/landscape/search');

const { history, addHistory, clearHistory, removeHistoryAt } = useSearchHistory();
const { hotSearchTags } = useHotTags();
const { suggestions, updateSuggestions } = useSearchSuggestions();

watch(searchKeyword, (val) => {
  updateSuggestions(val);
});

const syncFromRoute = () => {
  if (route.path === '/landscape/search') {
    const q = route.query.q;
    const keyword = Array.isArray(q) ? q[0] || '' : q || '';
    if (keyword !== searchKeyword.value) {
      searchKeyword.value = keyword;
    }
  }
};


watch(() => route.query.q, () => {
  if (!isFocused.value) {
    syncFromRoute();
  }
});

const displayHistory = computed(() => {
  if (showAllHistory.value) return history.value;
  return history.value.slice(0, maxHistoryPerRow);
});

const displayHotTags = computed(() => {
  if (showAllHot.value) return hotSearchTags.value;
  return hotSearchTags.value.slice(0, maxHotPerRow);
});

const sanitizeKeyword = (keyword: string): string => {
  let sanitized = keyword
    .replace(/[<>"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[\s\t\n\r]+/g, ' ')
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s\-_.,，。！!？?、]/g, '')
    .trim()
    .substring(0, 100);

  return sanitized;
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 400;

const cancelDebounce = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
};

const pushSearchQuery = (keyword: string) => {
  const sanitized = sanitizeKeyword(keyword);
  if (sanitized) {
    addHistory(sanitized);
    router.replace({
      path: '/landscape/search',
      query: { q: sanitized },
    });
  } else {
    router.replace({ path: '/landscape/search' });
  }
};

const debouncedSearch = (keyword: string) => {
  cancelDebounce();
  debounceTimer = setTimeout(() => {
    pushSearchQuery(keyword);
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const sanitized = sanitizeKeyword(target.value);

  if (sanitized !== target.value) {
    searchKeyword.value = sanitized;
  }
  activeSuggestionIndex.value = -1;
  debouncedSearch(searchKeyword.value);
};

const handleKeyDown = (event: KeyboardEvent) => {
  const suggestionsList = suggestions.value;
  const historyItems = history.value;
  const totalItems = suggestionsList.length + historyItems.length;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeSuggestionIndex.value = Math.min(activeSuggestionIndex.value + 1, totalItems - 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeSuggestionIndex.value = Math.max(activeSuggestionIndex.value - 1, -1);
  } else if (event.key === 'Enter') {
    if (activeSuggestionIndex.value >= 0) {
      event.preventDefault();
      if (activeSuggestionIndex.value < suggestionsList.length) {
        handleSuggestionClick(suggestionsList[activeSuggestionIndex.value]);
      } else {
        const historyIndex = activeSuggestionIndex.value - suggestionsList.length;
        handleHistoryClick(historyItems[historyIndex]);
      }
    } else {
      handleSearch();
    }
  } else if (event.key === 'Escape') {
    showDropdown.value = false;
    activeSuggestionIndex.value = -1;
  }
};

const handleGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.metaKey || event.ctrlKey) {
    if (event.key === 'k') {
      event.preventDefault();
      const input = searchBoxRef.value?.querySelector('input') as HTMLInputElement;
      input?.focus();
    }
  }
};

const handleClear = () => {
  cancelDebounce();
  searchKeyword.value = '';
  if (route.path === '/landscape/search') {
    router.replace({ path: '/landscape/search' });
  }
};

const handleFocus = () => {
  showDropdown.value = true;
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (searchBoxRef.value && !searchBoxRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
    showAllHistory.value = false;
    showAllHot.value = false;
  }
};

onMounted(() => {
  syncFromRoute();
  // 在搜索页面加载时自动显示下拉菜单
  if (isSearchPage.value) {
    showDropdown.value = true;
    isFocused.value = true;
  }
  // 添加快捷键：Ctrl+K 聚焦搜索
  document.addEventListener('keydown', handleGlobalKeyDown);
  // 点击外部关闭下拉菜单
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  cancelDebounce();
  document.removeEventListener('keydown', handleGlobalKeyDown);
  document.removeEventListener('click', handleClickOutside);
});

const handleSearch = () => {
  cancelDebounce();
  const keyword = sanitizeKeyword(searchKeyword.value);
  showDropdown.value = false;
  isFocused.value = false;

  if (keyword) {
    searchKeyword.value = keyword;
    addHistory(keyword);
    router.push({
      path: '/landscape/search',
      query: { q: keyword },
    });
  } else {
    router.push({ path: '/landscape/search' });
  }
};

const handleSuggestionClick = (suggestion: string) => {
  searchKeyword.value = suggestion;
  handleSearch();
};

const handleTagClick = (tag: { text: string }) => {
  searchKeyword.value = tag.text;
  handleSearch();
};

const handleHistoryClick = (item: string) => {
  searchKeyword.value = item;
  handleSearch();
};

const highlightMatch = (text: string, keyword: string): string => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part) =>
    regex.test(part) ? `<mark class="highlight">${part}</mark>` : part
  ).join('');
};
</script>

<style scoped lang="scss" src="./index.scss" />
