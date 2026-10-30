<template>
  <div class="category-page">
    <div class="main-layout">
      <CategorySidebar
        :items="items"
        :active-dimension="activeDimension"
        :selected-category="selectedCategory"
        :selected-sub-category="selectedSubCategory"
        :expanded-dimensions="expandedDimensions"
        :expanded-categories="expandedCategories"
        @update:active-dimension="activeDimension = $event"
        @update:selected-category="selectedCategory = $event"
        @update:selected-sub-category="selectedSubCategory = $event"
        @update:expanded-dimensions="expandedDimensions = $event"
        @update:expanded-categories="expandedCategories = $event"
        @reset="resetFilters"
      />

      <div class="result-content">
        <FilterHeader
          :modelValue="searchQuery"
          :title="currentFilterTitle"
          :count="filteredItems.length"
          :activeFilter="activeFilter"
          :mediaType="mediaType"
          :items="items"
          @update:model-value="$emit('update:searchQuery', $event)"
          @update:active-filter="activeFilter = $event"
          @update:media-type="mediaType = $event"
        />
        <ResultGrid
          v-if="filteredItems.length > 0"
          :items="filteredItems"
          @open-detail="selectedDetail = $event"
          @toggle-like="toggleLike"
          @toggle-love="toggleLove"
          @toggle-favorite="toggleFavorite"
        />
        <div v-else class="empty-state">
          <div class="empty-card">
            <div class="empty-scene" aria-hidden="true">
              <div class="scene-stars">
                <span class="scene-star s1"></span>
                <span class="scene-star s2"></span>
                <span class="scene-star s3"></span>
                <span class="scene-star s4"></span>
                <span class="scene-star s5"></span>
              </div>
              <div class="scene-peak">
                <svg viewBox="0 0 120 72" fill="none">
                  <defs>
                    <linearGradient
                      id="emptyPeakBack"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0"
                        stop-color="#6d5bb5"
                        stop-opacity="0.32"
                      />
                      <stop
                        offset="1"
                        stop-color="#181430"
                        stop-opacity="0.85"
                      />
                    </linearGradient>
                    <linearGradient
                      id="emptyPeakMid"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0"
                        stop-color="#8f7dd6"
                        stop-opacity="0.5"
                      />
                      <stop
                        offset="1"
                        stop-color="#241d4a"
                        stop-opacity="0.9"
                      />
                    </linearGradient>
                    <linearGradient
                      id="emptyPeakFront"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0"
                        stop-color="#4c3f86"
                        stop-opacity="0.6"
                      />
                      <stop
                        offset="1"
                        stop-color="#120f28"
                        stop-opacity="0.95"
                      />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="0,66 16,34 34,66"
                    fill="url(#emptyPeakBack)"
                  />
                  <polygon
                    points="26,66 58,10 90,66"
                    fill="url(#emptyPeakMid)"
                  />
                  <polygon
                    points="76,66 96,40 120,66"
                    fill="url(#emptyPeakFront)"
                  />
                  <path
                    d="M58 1.6 L59.3 4.4 L62.1 5.7 L59.3 7 L58 9.8 L56.7 7 L53.9 5.7 L56.7 4.4 Z"
                    fill="#fde68a"
                  />
                </svg>
              </div>
              <div class="scene-fog fog-a"></div>
              <div class="scene-fog fog-b"></div>
              <div class="scene-route"></div>
            </div>
            <div class="empty-content">
              <div class="empty-tag">
                <span class="tag-star"></span>
                <span class="tag-text">UNCHARTED</span>
                <span class="tag-line"></span>
              </div>
              <h3>
                <template v-if="searchQuery">
                  未找到与
                  <span class="empty-keyword">「{{ searchQuery }}」</span>
                  相关的风景
                </template>
                <template v-else>当前分类下暂无观测</template>
              </h3>
              <p>这片星域暂被云雾遮蔽，调整筛选条件或切换分类继续探索</p>
              <div class="empty-actions">
                <button class="reset-btn" @click="resetFilters">
                  <RefreshIcon :stroke-width="2" />
                  <span>重置筛选</span>
                </button>
                <button
                  v-if="searchQuery"
                  class="explore-btn"
                  @click="clearSearch"
                >
                  <CloseIcon :stroke-width="2" />
                  <span>清除搜索</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedSidebar
        :items="featuredItems"
        @open-detail="selectedDetail = $event"
      />
    </div>

    <CategoryDetailModal
      :item="selectedDetail"
      @close="selectedDetail = null"
      @toggle-like="toggleLike"
      @toggle-love="toggleLove"
      @toggle-favorite="toggleFavorite"
      @share="handleShare"
      @download="$emit('download', $event)"
    />
  </div>

  <ShareMenu v-model:visible="showShareMenu" :work="shareWork" />
</template>

<script setup lang="ts">
  defineOptions({ name: 'Category' });
  import { ref, computed, onMounted, watch, toRef } from 'vue';
  import { useRoute } from 'vue-router';
  import { useInteractionStore } from '@/stores/landscape';
  import type { InteractionItem } from '@/typesOfPages/landscape';
  import { showMessage, createSimpleInteractionItem } from '@/utils/landscape';
  import { useCategoryFilter } from '@/composables/landscape/category';
  import type { LandscapeItem } from '@/typesOfPages/landscape';
  import { categoryGroups } from '@/constants/landscape/categories';
  import CategorySidebar from './components/CategorySidebar/index.vue';
  import FilterHeader from './components/FilterHeader/index.vue';
  import ResultGrid from './components/ResultGrid/index.vue';
  import FeaturedSidebar from './components/FeaturedSidebar/index.vue';
  import CategoryDetailModal from './components/CategoryDetailModal/index.vue';
  import ShareMenu from '../common/ShareMenu/index.vue';

  import RefreshIcon from '@/pages/Landscape/icons/components/category/Category/RefreshIcon.vue';
  import CloseIcon from '@/pages/Landscape/icons/common/CloseIcon.vue';

  interface Props {
    items: LandscapeItem[];
    searchQuery: string;
  }

  const props = defineProps<Props>();
  const route = useRoute();
  const interactionStore = useInteractionStore();

  const showShareMenu = ref(false);
  const currentShareItem = ref<LandscapeItem | null>(null);
  const shareWork = computed(() => {
    const item = currentShareItem.value;
    if (!item) return {};
    return {
      type: item.type === 'video' ? ('video' as const) : ('image' as const),
      title: item.title,
      cover: item.thumbnail,
      date: item.date,
      location: item.location,
      duration: item.duration,
    };
  });
  const handleShare = (item: LandscapeItem) => {
    currentShareItem.value = item;
    showShareMenu.value = true;
  };

  const emit = defineEmits<{
    'update:searchQuery': [value: string];
    'open-detail': [item: LandscapeItem];
    'toggle-like': [item: LandscapeItem];
    share: [item: LandscapeItem];
    download: [item: LandscapeItem];
  }>();

  const itemsRef = toRef(props, 'items');

  const {
    activeDimension,
    selectedCategory,
    selectedSubCategory,
    activeFilter,
    mediaType,
    expandedDimensions,
    expandedCategories,
    currentFilterTitle,
    filteredItems,
    featuredItems,
    resetFilters,
  } = useCategoryFilter(itemsRef);

  const selectedDetail = ref<LandscapeItem | null>(null);

  const getItemId = (id: number | string) => String(id);

  const toggleLike = (item: LandscapeItem) => {
    const interactionItem = createSimpleInteractionItem(
      getItemId(item.id),
      item.type,
      item.title,
      {
        image: item.thumbnail,
        location: item.location,
        author: item.author,
        authorId: item.authorId,
        authorAvatar: item.authorAvatar,
      },
    );
    const isLiked = interactionStore.toggleLike(interactionItem);
    if (isLiked) {
      showMessage.like.success(item.title);
    } else {
      showMessage.like.cancel();
    }
  };

  const toggleLove = (item: LandscapeItem) => {
    const interactionItem = createSimpleInteractionItem(
      getItemId(item.id),
      item.type,
      item.title,
      {
        image: item.thumbnail,
        location: item.location,
        author: item.author,
        authorId: item.authorId,
        authorAvatar: item.authorAvatar,
      },
    );
    const isLoved = interactionStore.toggleLove(interactionItem);
    if (isLoved) {
      showMessage.love.success(
        item.title,
        item.type as InteractionItem['type'],
      );
    } else {
      showMessage.love.cancel(item.title, item.type as InteractionItem['type']);
    }
  };

  const toggleFavorite = (item: LandscapeItem) => {
    const interactionItem = createSimpleInteractionItem(
      getItemId(item.id),
      item.type,
      item.title,
      {
        image: item.thumbnail,
        location: item.location,
        author: item.author,
        authorId: item.authorId,
        authorAvatar: item.authorAvatar,
      },
    );
    const isFavorited = interactionStore.toggleFavorite(interactionItem);
    if (isFavorited) {
      showMessage.favorite.success(
        item.title,
        item.type as InteractionItem['type'],
      );
    } else {
      showMessage.favorite.cancel(
        item.title,
        item.type as InteractionItem['type'],
      );
    }
  };

  const handleNavigationParams = () => {
    const { dimension, category, subCategory } = route.query;

    if (dimension && category && subCategory) {
      activeDimension.value = dimension as string;

      if (!expandedDimensions.value.includes(dimension as string)) {
        expandedDimensions.value.push(dimension as string);
      }

      const group = categoryGroups.find((g) => g.key === dimension);
      if (group) {
        const cat = group.categories.find((c) => c.id === category);
        if (cat) {
          selectedCategory.value = cat;

          const categoryKey = `${dimension}-${category}`;
          if (!expandedCategories.value.includes(categoryKey)) {
            expandedCategories.value.push(categoryKey);
          }

          if (cat.children) {
            const subCat = cat.children.find((c) => c.id === subCategory);
            if (subCat) {
              selectedSubCategory.value = subCat;
            }
          }
        }
      }
    }
  };

  const clearSearch = () => {
    emit('update:searchQuery', '');
  };

  onMounted(() => {
    handleNavigationParams();
  });

  watch(
    () => props.items,
    (items) => {
      if (items && items.length > 0) {
        interactionStore.registerBatch(
          items.map((item) => ({
            id: getItemId(item.id),
            counts: {
              likes: item.likes,
              loves: item.loves || 0,
              views: item.views,
              favorites: item.bookmarks,
              shares: item.shares,
            },
          })),
        );
      }
    },
    { immediate: true },
  );
</script>

<style scoped lang="scss" src="./index.scss" />
