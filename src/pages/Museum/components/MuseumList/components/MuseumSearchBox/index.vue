<template>
  <div ref="searchBoxRef" class="museum-search-box">
    <div class="search-input-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索博物馆名称、地点..."
        class="search-input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeyDown"
      />
      <button
        v-if="searchQuery"
        class="clear-btn"
        aria-label="清空搜索"
        @click="handleClear"
      >
        <CloseIcon />
      </button>
      <button class="search-btn" @click="handleSearch">
        <SearchIcon />
      </button>
    </div>

    <transition name="dropdown">
      <div v-if="showDropdown" class="search-dropdown">
        <div
          v-if="searchQuery.length > 0 && suggestions.length > 0"
          class="suggestions-section"
        >
          <button
            v-for="(s, index) in suggestions"
            :key="s"
            class="suggestion-item"
            :class="{ active: activeSuggestionIndex === index }"
            @mousedown.prevent="handleSuggestionClick(s)"
          >
            <SearchIcon class="suggest-icon" />
            <span class="suggest-text" v-html="highlightMatch(s, searchQuery)"></span>
          </button>
        </div>

        <div
          v-if="searchQuery.length > 0 && suggestions.length === 0"
          class="no-result-section"
        >
          <div class="no-result-icon">
            <SearchXIcon />
          </div>
          <p class="no-result-text">未找到相关博物馆</p>
        </div>

        <div class="dropdown-bottom">
          <div
            v-if="history.length > 0 && searchQuery.length === 0"
            class="history-section"
          >
            <div class="section-header">
              <h4 class="section-title">搜索历史</h4>
              <button class="clear-history-btn" @mousedown.prevent @click.stop="clearHistory">
                清空
              </button>
            </div>
            <div class="history-tags">
              <button
                v-for="(item, index) in history"
                :key="item"
                class="history-tag"
                @mousedown.prevent="handleHistoryClick(item)"
              >
                <span class="history-text">{{ item }}</span>
                <span
                  class="history-remove-btn"
                  role="button"
                  tabindex="0"
                  title="删除此记录"
                  @mousedown.prevent
                  @click.stop="removeHistoryAt(index)"
                >
                  <CloseIcon />
                </span>
              </button>
            </div>
          </div>

          <div v-if="searchQuery.length === 0 || (searchQuery.length > 0 && suggestions.length === 0)" class="hot-section">
            <div class="section-header">
              <h4 class="section-title">热门探索</h4>
            </div>
            <div class="hot-tags">
              <button
                v-for="tag in hotSearchTags"
                :key="tag.text"
                class="hot-tag"
                @mousedown.prevent="handleTagClick(tag.text)"
              >
                {{ tag.text }}
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
  import type { Museum } from '@/typesOfPages/museum';
  import {
    CloseIcon,
    SearchIcon,
    SearchXIcon,
  } from '@/pages/Museum/icons/common';
  import { useMuseumSearchHistory } from '@/composables/museum/useMuseumSearchHistory';
  import { useMuseumSuggestions } from '@/composables/museum/useMuseumSuggestions';
  import { useMuseumHotTags } from '@/composables/museum/useMuseumHotTags';

  interface Props {
    museums: Museum[];
    selectedProvince: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    filtered: [museums: Museum[]];
  }>();

  const searchQuery = ref('');
  const showDropdown = ref(false);
  const isFocused = ref(false);
  const activeSuggestionIndex = ref(-1);
  const searchBoxRef = ref<HTMLElement | null>(null);

  const { history, addHistory, clearHistory, removeHistoryAt } = useMuseumSearchHistory();
  const { hotSearchTags } = useMuseumHotTags(() => props.museums);
  const { suggestions, updateSuggestions } = useMuseumSuggestions(() => props.museums);

  const filteredMuseums = computed<Museum[]>(() => {
    let result = props.museums;

    if (props.selectedProvince) {
      result = result.filter(
        (museum) => museum.province === props.selectedProvince,
      );
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (museum) =>
          museum.name.toLowerCase().includes(query) ||
          museum.province.toLowerCase().includes(query) ||
          museum.description.toLowerCase().includes(query) ||
          museum.type.toLowerCase().includes(query),
      );
    }

    return result;
  });

  watch(searchQuery, (val) => {
    updateSuggestions(val);
    activeSuggestionIndex.value = -1;
  });

  watch(
    filteredMuseums,
    (val) => {
      emit('filtered', val);
    },
    { immediate: true },
  );

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

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const sanitized = sanitizeKeyword(target.value);
    if (sanitized !== target.value) {
      searchQuery.value = sanitized;
    }
    showDropdown.value = true;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const suggestionsList = suggestions.value;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeSuggestionIndex.value = Math.min(
        activeSuggestionIndex.value + 1,
        suggestionsList.length - 1,
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
        handleSuggestionClick(suggestionsList[activeSuggestionIndex.value]);
      } else {
        handleSearch();
      }
    } else if (event.key === 'Escape') {
      showDropdown.value = false;
      activeSuggestionIndex.value = -1;
    }
  };

  const handleClear = () => {
    searchQuery.value = '';
    activeSuggestionIndex.value = -1;
  };

  const handleFocus = () => {
    showDropdown.value = true;
    isFocused.value = true;
  };

  let blurTimer: ReturnType<typeof setTimeout> | null = null;

  const handleBlur = () => {
    isFocused.value = false;
    blurTimer = setTimeout(() => {
      if (!isFocused.value) {
        showDropdown.value = false;
      }
      blurTimer = null;
    }, 150);
  };

  const handleSearch = () => {
    const keyword = sanitizeKeyword(searchQuery.value);
    if (keyword && keyword !== searchQuery.value) {
      searchQuery.value = keyword;
    }
    if (keyword) {
      addHistory(keyword);
    }
    if (suggestions.value.length === 0) {
      showDropdown.value = true;
    } else {
      showDropdown.value = false;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    searchQuery.value = suggestion;
    handleSearch();
  };

  const handleHistoryClick = (item: string) => {
    searchQuery.value = item;
    handleSearch();
  };

  const handleTagClick = (tag: string) => {
    searchQuery.value = tag;
    handleSearch();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchBoxRef.value && !searchBoxRef.value.contains(event.target as Node)) {
      showDropdown.value = false;
    }
  };

  const escapeHtml = (str: string): string =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const highlightMatch = (text: string, keyword: string): string => {
    if (!keyword) return escapeHtml(text);
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark class="highlight">$1</mark>');
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (blurTimer) clearTimeout(blurTimer);
  });

  defineExpose({
    clear: () => {
      searchQuery.value = '';
      activeSuggestionIndex.value = -1;
    },
  });
</script>

<style lang="scss" scoped src="./index.scss"></style>