<template>
  <div ref="searchBoxRef" class="search-box">
    <div class="search-container" :class="{ focused: isFocused }">
      <div class="search-input-wrapper">
        <div class="icon-container">
          <SearchIcon class="search-icon" :stroke-width="2" />
          <div class="icon-ring"></div>
        </div>

        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索风景、摄影师、攻略..."
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @click="handleInputClick"
          @keydown="handleKeyDown"
          @keyup.enter="handleSearch"
        />

        <button
          v-if="searchKeyword.length > 0"
          class="clear-btn-input"
          title="清除"
          @mousedown.prevent="handleClear"
        >
          <CloseIcon :stroke-width="2.5" />
        </button>

        <span class="ticket-tear" aria-hidden="true"></span>

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
        <!-- 内容纵向排列：建议 / 历史 / 热门 -->
        <div class="dropdown-bottom">
          <!-- 搜索关键字建议（仅在有输入且有建议时显示） -->
          <div
            v-if="searchKeyword.length > 0 && suggestions.length > 0"
            class="suggestions-section"
          >
            <div class="section-head">
              <span class="head-glyph"></span>
              <span class="head-title">搜索建议</span>
              <span class="head-en">SUGGEST</span>
            </div>
            <div class="suggestion-list">
              <button
                v-for="(s, index) in suggestions"
                :key="s"
                class="suggestion-item"
                :class="{ active: activeSuggestionIndex === index }"
                @click.stop="handleSuggestionClick(s)"
              >
                <span class="suggest-no">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <SearchIcon class="suggest-icon" :stroke-width="2" />
                <span class="suggest-text">
                  <template
                    v-for="(part, partIndex) in highlightParts(
                      s,
                      searchKeyword,
                    )"
                    :key="partIndex"
                  >
                    <mark v-if="part.match" class="highlight">
                      {{ part.text }}
                    </mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </span>
                <span class="suggest-enter">
                  <EnterArrowIcon />
                </span>
              </button>
            </div>
          </div>

          <!-- 搜索历史（在搜索页面始终显示，其他页面有历史才显示） -->
          <div
            v-if="
              history.length > 0 && (isSearchPage || searchKeyword.length === 0)
            "
            class="history-section"
          >
            <div class="section-head">
              <span class="head-glyph"></span>
              <span class="head-title">搜索历史</span>
              <span class="head-en">HISTORY</span>
              <button
                class="head-clear"
                @mousedown.prevent
                @click.stop="clearHistory"
              >
                <CloseIcon :stroke-width="3.2" />
                <span>清空</span>
              </button>
            </div>
            <div class="history-tags" :class="{ expanded: showAllHistory }">
              <div
                v-for="(item, index) in displayHistory"
                :key="item"
                class="history-chip"
              >
                <button
                  type="button"
                  class="history-tag"
                  @click.stop="handleHistoryClick(item)"
                >
                  <span class="history-text">{{ item }}</span>
                </button>
                <button
                  type="button"
                  class="history-remove-btn"
                  title="删除此记录"
                  aria-label="删除此记录"
                  @mousedown.prevent
                  @click.stop="removeHistoryAt(index)"
                >
                  <CloseIcon :stroke-width="2.6" />
                </button>
              </div>
              <button
                v-if="history.length > maxHistoryPerRow && !showAllHistory"
                class="more-btn"
                @mousedown.prevent
                @click.stop="showAllHistory = true"
              >
                <span>更多</span>
                <ChevronDownIcon />
              </button>
              <button
                v-if="showAllHistory"
                class="more-btn"
                @mousedown.prevent
                @click.stop="showAllHistory = false"
              >
                <span>收起</span>
                <ChevronUpIcon />
              </button>
            </div>
          </div>

          <!-- 热门探索（仅在无输入时显示，有输入时隐藏） -->
          <div v-if="searchKeyword.length === 0" class="hot-section">
            <div class="section-head hot-head">
              <span class="head-glyph"></span>
              <span class="head-title">热门探索</span>
              <span class="head-en">TRENDING</span>
            </div>

            <div class="hot-tags" :class="{ expanded: showAllHot }">
              <button
                v-for="(tag, index) in displayHotTags"
                :key="tag.text"
                class="hot-tag"
                :style="{ animationDelay: `${index * 0.06}s` }"
                @click="handleTagClick(tag)"
              >
                <span class="hot-rank">{{ index + 1 }}</span>
                <span class="tag-text">{{ tag.text }}</span>
              </button>
              <button
                v-if="hotSearchTags.length > maxHotPerRow && !showAllHot"
                class="more-btn hot-more-btn"
                @mousedown.prevent
                @click.stop="showAllHot = true"
              >
                <span>更多</span>
                <ChevronDownIcon />
              </button>
              <button
                v-if="showAllHot"
                class="more-btn hot-more-btn"
                @mousedown.prevent
                @click.stop="showAllHot = false"
              >
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
  import SearchIcon from '@/pages/Landscape/icons/common/SearchIcon.vue';
  import CompassIcon from '@/pages/Landscape/icons/common/CompassIcon.vue';
  import CloseIcon from '@/pages/Landscape/icons/common/CloseIcon.vue';
  import ChevronDownIcon from '@/pages/Landscape/icons/common/ChevronDownIcon.vue';
  import ChevronUpIcon from '@/pages/Landscape/icons/common/ChevronUpIcon.vue';
  import EnterArrowIcon from '@/pages/Landscape/icons/components/search/SearchBox/EnterArrowIcon.vue';
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

  const { history, addHistory, clearHistory, removeHistoryAt } =
    useSearchHistory();
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

  watch(
    () => route.query.q,
    () => {
      if (!isFocused.value) {
        syncFromRoute();
      }
    },
  );

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
      activeSuggestionIndex.value = Math.min(
        activeSuggestionIndex.value + 1,
        totalItems - 1,
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeSuggestionIndex.value = Math.max(
        activeSuggestionIndex.value - 1,
        -1,
      );
    } else if (event.key === 'Enter') {
      if (activeSuggestionIndex.value >= 0) {
        event.preventDefault();
        if (activeSuggestionIndex.value < suggestionsList.length) {
          handleSuggestionClick(suggestionsList[activeSuggestionIndex.value]);
        } else {
          const historyIndex =
            activeSuggestionIndex.value - suggestionsList.length;
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
    // ESC 关闭下拉：不依赖输入框是否聚焦，焦点在下拉内也能关
    if (event.key === 'Escape' && showDropdown.value) {
      showDropdown.value = false;
      activeSuggestionIndex.value = -1;
      return;
    }

    if (event.metaKey || event.ctrlKey) {
      if (event.key === 'k') {
        event.preventDefault();
        const input = searchBoxRef.value?.querySelector(
          'input',
        ) as HTMLInputElement;
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

  // ESC 关闭后输入框仍保持聚焦，再次点击不会触发 focus 事件，
  // 因此补一个 click 处理，保证点击输入框随时能重新展开下拉
  const handleInputClick = () => {
    if (!showDropdown.value) {
      showDropdown.value = true;
      activeSuggestionIndex.value = -1;
    }
  };

  const handleBlur = () => {
    isFocused.value = false;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.value &&
      !searchBoxRef.value.contains(event.target as Node)
    ) {
      showDropdown.value = false;
      showAllHistory.value = false;
      showAllHot.value = false;
    }
  };

  onMounted(() => {
    syncFromRoute();

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

  const executeSearch = (keyword: string) => {
    cancelDebounce();
    const sanitized = sanitizeKeyword(keyword);
    if (sanitized) {
      searchKeyword.value = sanitized;
      addHistory(sanitized);
      router.push({
        path: '/landscape/search',
        query: { q: sanitized },
      });
    } else {
      router.push({ path: '/landscape/search' });
    }
  };

  const handleSearch = () => {
    executeSearch(searchKeyword.value);
    showDropdown.value = false;
    isFocused.value = false;
  };

  const handleSuggestionClick = (suggestion: string) => {
    searchKeyword.value = suggestion;
    executeSearch(suggestion);
  };

  const handleTagClick = (tag: { text: string }) => {
    searchKeyword.value = tag.text;
    executeSearch(tag.text);
  };

  const handleHistoryClick = (item: string) => {
    searchKeyword.value = item;
    executeSearch(item);
  };

  interface HighlightPart {
    text: string;
    match: boolean;
  }

  const highlightParts = (text: string, keyword: string): HighlightPart[] => {
    const kw = keyword.trim();
    if (!kw) return [{ text, match: false }];
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text
      .split(regex)
      .filter((part) => part !== '')
      .map((part) => ({
        text: part,
        match: part.toLowerCase() === kw.toLowerCase(),
      }));
  };
</script>

<style scoped lang="scss" src="./index.scss" />
