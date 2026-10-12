<template>
  <div class="scenery-spots">
    <div class="filter-layout">
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
        <button v-if="searchQuery" class="search-clear-btn" @click="handleClear" title="清空">
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


      <div class="filter-container">
        <div class="filter-options">
          <div
            v-for="t in typeFilters"
            :key="t.value"
            class="filter-chip"
            :class="{ active: selectedType === t.value }"
            @click="selectedType = t.value"
          >
            <span class="chip-text">{{ t.label }}</span>
            <span class="chip-count">{{ t.count }}</span>
          </div>
        </div>

        <div class="sort-options">
          <span class="sort-label">排序</span>
          <div
            v-for="s in sortOptions"
            :key="s.value"
            class="sort-chip"
            :class="{ active: sortBy === s.value }"
            @click="sortBy = s.value"
          >
            {{ s.label }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="debouncedQuery && filteredSpots.length > 0" class="result-count-bar">
      找到 <span class="result-count-num">{{ filteredSpots.length }}</span> 个与
      <span class="result-count-keyword">"{{ debouncedQuery }}"</span> 相关的景点
    </div>

    <SpotsList
      v-if="filteredSpots.length > 0"
      :spots="filteredSpots"
      :highlight-keyword="debouncedQuery"
      @open-detail="openSpotDetail"
      @toggle-favorite="toggleFavorite"
      @toggle-like="toggleLike"
      @toggle-want="toggleWant"
      @toggle-been="toggleBeen"
      @navigate="handleNavigate"

      @share="handleShare"
    />

    <div v-else class="empty-state">
      <span class="empty-rivet empty-rivet-tl"></span>
      <span class="empty-rivet empty-rivet-tr"></span>
      <span class="empty-rivet empty-rivet-bl"></span>
      <span class="empty-rivet empty-rivet-br"></span>

      <div class="empty-hazard-strip"></div>

      <div class="empty-radar">
        <div class="radar-grid"></div>
        <div class="radar-ring radar-ring-outer"></div>
        <div class="radar-ring radar-ring-mid"></div>
        <div class="radar-ring radar-ring-inner"></div>
        <div class="radar-sweep"></div>
        <div class="radar-cross-h"></div>
        <div class="radar-cross-v"></div>
        <div class="radar-center"></div>
        <div class="radar-tick radar-tick-n"></div>
        <div class="radar-tick radar-tick-e"></div>
        <div class="radar-tick radar-tick-s"></div>
        <div class="radar-tick radar-tick-w"></div>
        <span class="radar-label radar-label-n">N</span>
        <span class="radar-label radar-label-e">E</span>
        <span class="radar-label radar-label-s">S</span>
        <span class="radar-label radar-label-w">W</span>
        <div class="radar-outer-ring"></div>
      </div>

      <div class="empty-status-tag">
        <span class="status-tag-dot"></span>
        <span class="status-tag-text">NO TARGET</span>
        <span class="status-tag-dot"></span>
      </div>

      <div class="empty-status-lights">
        <span class="status-light light-off"></span>
        <span class="status-light light-off"></span>
        <span class="status-light light-warn"></span>
        <span class="status-light light-off"></span>
      </div>

      <div class="empty-text-block">
        <h3 class="empty-title">未找到符合条件的景点</h3>
        <p class="empty-desc">尝试调整筛选条件或搜索关键词</p>
      </div>

      <button class="reset-btn" @click="clearAll">
        <span class="reset-btn-rivet reset-btn-rivet-l"></span>
        <span class="reset-btn-rivet reset-btn-rivet-r"></span>
        <span class="reset-btn-decor reset-btn-decor-l"></span>
        <span class="reset-btn-decor reset-btn-decor-r"></span>
        <span class="reset-btn-text">重置筛选</span>
        <span class="reset-btn-glow"></span>
      </button>

      <div class="empty-gauge">
        <span class="gauge-label">0</span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick gauge-tick-mid"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-label">100</span>
      </div>

      <span class="empty-particle empty-particle-1"></span>
      <span class="empty-particle empty-particle-2"></span>
      <span class="empty-particle empty-particle-3"></span>
      <span class="empty-particle empty-particle-4"></span>
      <span class="empty-particle empty-particle-5"></span>
    </div>

    <ScenerySpotModal
      :visible="modalVisible"
      :spot="selectedSpot"
      @close="closeSpotModal"
      @toggle-favorite="toggleFavorite"
      @toggle-like="toggleLike"
      @toggle-want="toggleWant"
      @toggle-been="toggleBeen"
      @share="handleShare"
      @navigate="handleNavigate"

    />

    <TravelShareModal
      :visible="shareVisible"
      :title="shareTitle"
      :share-text="shareText"
      :share-url="shareUrl"
      @close="closeShare"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch, onUnmounted } from 'vue';
  import type { SceneryData, ScenerySpot } from '@/typesOfPages/travelGuide';
  import { useTravelGuideStore } from '@/stores/travelGuide';
  import { useScenerySearchHistory } from '@/composables/travelGuide/useScenerySearchHistory';
  import { useSceneryHotTags } from '@/composables/travelGuide/useSceneryHotTags';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import SpotsList from './SpotsList/index.vue';
  import ScenerySpotModal from '../../ScenerySpotModal/index.vue';
  import TravelShareModal from '../../TravelShareModal/index.vue';
  import { useTravelShare } from '../../TravelShareModal/useTravelShare';
  import SearchIcon from '../../../icons/common/SearchIcon.vue';
  import CloseIcon from '../../../icons/common/CloseIcon.vue';

  const travelStore = useTravelGuideStore();
  const props = defineProps<{
    provinceId: string;
    spotsSearchQuery?: string;
  }>();

  const searchQuery = ref('');
  const debouncedQuery = ref('');
  const selectedType = ref('');
  const sortBy = ref('default');
  const isSearchFocused = ref(false);
  const activeSuggestionIndex = ref(-1);
  const sceneryData = ref<SceneryData | null>(null);

  const { history, addHistory, clearHistory } = useScenerySearchHistory();

  const allSpots = computed<ScenerySpot[]>(() => sceneryData.value?.spots || []);

  const { hotSearchTags } = useSceneryHotTags(allSpots);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  watch(searchQuery, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val;
      activeSuggestionIndex.value = -1;
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

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (historyTimer) clearTimeout(historyTimer);
  });

  const typeFilters = computed(() => [
    { value: '', label: '全部', count: allSpots.value.length },
    {
      value: 'nature',
      label: '自然',
      count: allSpots.value.filter((s) => s.type === 'nature').length,
    },
    {
      value: 'culture',
      label: '人文',
      count: allSpots.value.filter((s) => s.type === 'culture').length,
    },
  ]);

  const sortOptions = [
    { value: 'default', label: '综合' },
    { value: 'rating', label: '好评' },
    { value: 'hot', label: '热度' },
  ];

  const searchSuggestions = computed<ScenerySpot[]>(() => {
    if (!debouncedQuery.value) return [];
    const q = debouncedQuery.value.toLowerCase();
    return allSpots.value
      .filter(
        (spot) =>
          spot.name.toLowerCase().includes(q) ||
          spot.location.toLowerCase().includes(q) ||
          (spot.tags || []).some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  });

  const filteredSpots = computed(() => {
    let spots = allSpots.value;

    if (debouncedQuery.value) {
      const query = debouncedQuery.value.toLowerCase();
      spots = spots.filter((spot) => {
        if (spot.name.toLowerCase().includes(query)) return true;
        if (spot.description.toLowerCase().includes(query)) return true;
        if (spot.location.toLowerCase().includes(query)) return true;
        if (spot.highlight?.toLowerCase().includes(query)) return true;
        if (spot.level?.toLowerCase().includes(query)) return true;
        if (spot.landscapeType?.toLowerCase().includes(query)) return true;
        if (spot.cultureType?.toLowerCase().includes(query)) return true;
        if ((spot.tags || []).some((t) => t.toLowerCase().includes(query))) return true;
        if ((spot.landformTags || []).some((t) => t.toLowerCase().includes(query))) return true;
        if ((spot.audienceTags || []).some((t) => t.toLowerCase().includes(query))) return true;
        if ((spot.bestSeason || []).some((t) => t.toLowerCase().includes(query))) return true;
        return false;
      });
    }

    if (selectedType.value) {
      spots = spots.filter((spot) => spot.type === selectedType.value);
    }

    const sorted = [...spots];
    if (sortBy.value === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy.value === 'hot') {
      sorted.sort((a, b) => (b.popularity || b.tags?.length || 0) - (a.popularity || a.tags?.length || 0));
    }
    return sorted;
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
    addHistory(name);
  };

  const selectKeyword = (keyword: string) => {
    searchQuery.value = keyword;
    debouncedQuery.value = keyword;
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
  };

  const clearAll = () => {
    searchQuery.value = '';
    debouncedQuery.value = '';
    selectedType.value = '';
    sortBy.value = 'default';
  };


  const {
    toggleSpotFavorite: toggleSpotFavoriteRaw,
    toggleSpotWant: toggleSpotWantRaw,
    toggleSpotBeen: toggleSpotBeenRaw,
    toggleSpotLike: toggleSpotLikeRaw,
    isSpotFavorite,
    isSpotWant,
    isSpotBeen,
    isSpotLike,

  } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();

  const toggleFavorite = (spotId: string): void => {
    const wasFav = isSpotFavorite(spotId);
    toggleSpotFavoriteRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'info', message: wasFav ? `已取消收藏 ${name}` : `已收藏 ${name}` });
  };
  const toggleLike = (spotId: string): void => {
    const wasLiked = isSpotLike(spotId);
    toggleSpotLikeRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'like', message: wasLiked ? `已取消点赞 ${name}` : `已点赞 ${name}` });
  };
  const toggleWant = (spotId: string): void => {
    const wasWant = isSpotWant(spotId);
    toggleSpotWantRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'want', message: wasWant ? `已移除想去 ${name}` : `已加入想去 ${name}` });
  };
  const toggleBeen = (spotId: string): void => {
    const wasBeen = isSpotBeen(spotId);
    toggleSpotBeenRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'eaten', message: wasBeen ? `已移除去过 ${name}` : `已标记去过 ${name}` });
  };

  const handleNavigate = (spotId: string) => {
    const spot = allSpots.value.find((s) => s.id === spotId);
    if (spot) {
      const query = encodeURIComponent(`${spot.name} ${spot.location}`);
      window.open(`https://www.amap.com/search?query=${query}`, '_blank', 'noopener,noreferrer');
    }
  };


  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const handleShare = (spotId: string) => {
    const spot = allSpots.value.find((s) => s.id === spotId);
    if (spot) {
      openShare(
        spot.name,
        `${spot.name}｜${spot.location}｜评分 ${spot.rating ?? 4.5}｜门票 ${spot.ticketPrice}`,
      );
      showToast({ type: 'share', message: `正在分享 ${spot.name}` });
    }
  };

  const modalVisible = ref(false);
  const selectedSpot = ref<ScenerySpot | null>(null);

  const openSpotDetail = (spotId: string) => {
    const spot = allSpots.value.find((s) => s.id === spotId);
    if (spot) {
      selectedSpot.value = spot;
      modalVisible.value = true;
    }
  };

  const closeSpotModal = () => {
    modalVisible.value = false;
    selectedSpot.value = null;
  };

  const loadProvinceData = async () => {
    try {
      const data = await travelStore.getScenery(props.provinceId);
      sceneryData.value = data;
    } catch (error) {
      console.error('Failed to load scenery data:', error);
    }
  };

  watch(
    () => props.provinceId,
    () => {
      loadProvinceData();
    },
    { immediate: true },
  );

  watch(
    () => props.spotsSearchQuery,
    (query) => {
      if (query) {
        searchQuery.value = query;
        debouncedQuery.value = query;
      }
    },
    { immediate: true },
  );
</script>

<style scoped lang="scss" src="./index.scss"></style>