<template>
  <div ref="searchBoxRef" class="artifact-search-box">
    <div class="search-input-wrapper" :class="{ focused: isFocused }">

      <SearchIcon class="search-icon" />
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        placeholder="搜索文物名称、朝代、类型..."
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
        @mousedown.prevent
        @click="handleClear"
      >
        <CloseIcon />
      </button>
      <button class="search-btn" @click="handleSearch" aria-label="搜索">
        <SearchIcon />
      </button>
      <kbd v-if="!searchQuery && !isFocused" class="shortcut-hint">/</kbd>
    </div>

    <transition name="dropdown">
      <div v-if="showDropdown" class="search-dropdown">
        <div
          v-if="searchQuery.length > 0 && suggestions.length > 0"
          class="suggestions-section"
        >
          <div class="section-label">匹配建议</div>
          <button
            v-for="(s, index) in suggestions"
            :key="s"
            class="suggestion-item"
            :class="{ active: activeSuggestionIndex === index }"
            @mousedown.prevent="handleSuggestionClick(s)"
          >
            <SearchIcon class="suggest-icon" />
            <span class="suggest-text" v-html="highlightMatch(s, searchQuery)"></span>
            <kbd class="enter-hint">↵</kbd>
          </button>
        </div>

        <div
          v-if="searchQuery.length > 0 && suggestions.length === 0"
          class="no-result-section"
        >
          <div class="no-result-icon">
            <SearchXIcon />
          </div>
          <p class="no-result-text">未找到匹配的文物</p>
          <p class="no-result-hint">尝试更简短的关键词</p>
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
            <div
              ref="historyTagsRef"
              class="history-tags"
              :class="{ collapsed: !showAllHistory }"
            >
              <button
                v-for="item in history"
                :key="item"
                class="history-tag"
                @mousedown.prevent="handleHistoryClick(item)"
              >
                <span class="history-text" :title="item.length > 4 ? item : ''">{{ truncateText(item, 4) }}</span>
                <span
                  class="history-remove-btn"
                  role="button"
                  tabindex="0"
                  title="删除此记录"
                  @mousedown.prevent.stop="removeHistoryAt(history.indexOf(item))"
                >
                  <CloseIcon />
                </span>
              </button>
            </div>
            <button
              v-if="historyOverflows || showAllHistory"
              class="more-history-btn"
              @mousedown.prevent
              @click="toggleHistory"
            >
              <span class="more-text">{{ showAllHistory ? '收起' : '更多' }}</span>
              <span class="more-arrow" :class="{ expanded: showAllHistory }">›</span>
            </button>
          </div>

          <div
            v-if="searchQuery.length === 0 || (searchQuery.length > 0 && suggestions.length === 0)"
            class="hot-section"
          >
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
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
  import type { Artifact } from '@/typesOfPages/museum';
  import {
    CloseIcon,
    SearchIcon,
    SearchXIcon,
  } from '@/pages/Museum/icons/common';
  import { useArtifactSearchHistory } from '@/composables/museum/useArtifactSearchHistory';
  import { useArtifactSuggestions } from '@/composables/museum/useArtifactSuggestions';
  import { useArtifactHotTags } from '@/composables/museum/useArtifactHotTags';

  interface Props {
    artifacts: Artifact[];
    modelValue?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search', value: string): void;
  }>();

  const searchQuery = ref<string>(props.modelValue);
  const isFocused = ref(false);
  const activeSuggestionIndex = ref(-1);
  const searchBoxRef = ref<HTMLElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);

  const showDropdown = computed(() => isFocused.value);

  const showAllHistory = ref(false);
  const historyTagsRef = ref<HTMLElement | null>(null);
  const historyOverflows = ref(false);

  const checkHistoryOverflow = () => {
    const el = historyTagsRef.value;
    if (el) {
      historyOverflows.value = el.scrollHeight > el.clientHeight + 1;
    }
  };

  const toggleHistory = () => {
    showAllHistory.value = !showAllHistory.value;
    nextTick(() => {
      checkHistoryOverflow();
    });
  };

  const { history, addHistory, clearHistory, removeHistoryAt } = useArtifactSearchHistory();
  const { hotSearchTags } = useArtifactHotTags(() => props.artifacts);
  const { suggestions, updateSuggestions } = useArtifactSuggestions(() => props.artifacts);

  watch(
    () => props.modelValue,
    (newVal) => {
      searchQuery.value = newVal;
    },
  );

  let historyDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  const recordHistoryDebounced = (keyword: string) => {
    if (historyDebounceTimer) {
      clearTimeout(historyDebounceTimer);
    }
    historyDebounceTimer = setTimeout(() => {
      const trimmed = sanitizeKeyword(keyword);
      if (trimmed) {
        addHistory(trimmed);
      }
    }, 800);
  };

  watch(searchQuery, (val) => {
    updateSuggestions(val);
    activeSuggestionIndex.value = -1;
    emit('update:modelValue', val);
    recordHistoryDebounced(val);
  });

  watch(history, () => {
    nextTick(() => {
      checkHistoryOverflow();
    });
  });

  watch(showAllHistory, () => {
    nextTick(() => {
      checkHistoryOverflow();
    });
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
      .substring(0, 50);
  };

  const truncateText = (text: string, max: number): string => {
    return text.length > max ? text.slice(0, max) + '…' : text;
  };

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const sanitized = sanitizeKeyword(target.value);
    if (sanitized !== target.value) {
      searchQuery.value = sanitized;
    }

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
      isFocused.value = false;
      activeSuggestionIndex.value = -1;
      inputRef.value?.blur();
    }
  };

  const handleClear = () => {
    searchQuery.value = '';
    activeSuggestionIndex.value = -1;
    inputRef.value?.focus();
  };

  const handleFocus = () => {
    isFocused.value = true;
  };

  const handleBlur = () => {
    isFocused.value = false;
  };

  const handleSearch = () => {
    const keyword = sanitizeKeyword(searchQuery.value);
    if (historyDebounceTimer) {
      clearTimeout(historyDebounceTimer);
      historyDebounceTimer = null;
    }
    if (keyword && keyword !== searchQuery.value) {
      searchQuery.value = keyword;
    }
    if (keyword) {
      addHistory(keyword);
      emit('search', keyword);
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
      if (isFocused.value) {
        inputRef.value?.blur();
      }
    }
  };

  const handleGlobalKeyDown = (event: KeyboardEvent) => {
    if (event.key === '/' && document.activeElement !== inputRef.value) {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        event.preventDefault();
        inputRef.value?.focus();
      }
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
    document.addEventListener('keydown', handleGlobalKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleGlobalKeyDown);
    if (historyDebounceTimer) {
      clearTimeout(historyDebounceTimer);
      historyDebounceTimer = null;
    }
  });

  defineExpose({
    clear: () => {
      searchQuery.value = '';
      activeSuggestionIndex.value = -1;
    },
    focus: () => {
      inputRef.value?.focus();
    },
  });
</script>

<style lang="scss" scoped src="./index.scss"></style>