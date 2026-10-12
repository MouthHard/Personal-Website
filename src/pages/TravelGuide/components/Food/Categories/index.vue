<template>
  <section class="gallery-section">

    <div class="ambient-glow"></div>

    <div class="section-header">
      <div class="header-left">
        <div class="header-icon-wrap">
          <UtensilsIcon class="header-icon" />
        </div>
        <div class="header-titles">
          <h3 class="header-title">美食图鉴</h3>
        </div>
      </div>

      <div class="category-tabs">
        <button
          v-for="category in foodCategories"
          :key="category.id"
          class="category-tab"
          :class="{ active: selectedCategory?.id === category.id }"
          @click="toggleCategory(category)"
        >
          <span class="tab-sweep" :class="{ sweeping: selectedCategory?.id === category.id }"></span>
          <span>{{ category.name }}</span>
          <span class="tab-count">{{ category.count }}</span>
        </button>
      </div>
    </div>

    <div v-if="filteredFoods.length > 0" class="gallery-masonry">
      <div
        v-for="(food, index) in filteredFoods"
        :key="food.id"
        class="gallery-item"
        :style="{ '--item-index': index }"
      >
        <div class="gallery-image-wrap" @click="openDetail(food)">
          <img
            :src="food.image"
            :alt="food.name"
            class="gallery-image"
            loading="lazy"
            @error="handleImageError"
          />

          <div class="image-overlay">
            <div class="overlay-top">
              <div class="overlay-tags-left">
                <span v-if="food.category" class="overlay-category">{{ food.category }}</span>
                <span v-if="food.price && Number(food.price) < 50" class="overlay-popular">特价</span>
              </div>
              <div v-if="food.rating" class="overlay-rating">
                <StarIcon class="rating-star" />
                <span>{{ food.rating }}</span>
                <span v-if="food.reviewCount" class="rating-count">({{ food.reviewCount }})</span>
              </div>
            </div>

            <div class="overlay-bottom">
              <h4 class="overlay-name">{{ food.name }}</h4>
              <div class="overlay-footer">
                <span v-if="food.price" class="overlay-price">
                  <span class="price-symbol">¥</span>{{ food.price }}
                </span>
              </div>
            </div>
          </div>

          <div class="image-zoom-hint">
            <SearchIcon class="zoom-icon" />
          </div>

          <div class="card-actions" @click.stop>
            <button
              class="card-action action-like"
              :class="{ active: isThumbsUp(food) }"
              :aria-label="isThumbsUp(food) ? '取消点赞' : '点赞'"
              @click="toggleThumbsUpWithToast(food)"
            >
              <ThumbUpIcon class="card-action-icon" :filled="isThumbsUp(food)" />
            </button>
            <button
              class="card-action action-share"
              aria-label="分享"
              @click="openFoodShareForWithToast(food)"
            >
              <LinkIcon class="card-action-icon" />
            </button>
            <button
              class="card-action action-want"
              :class="{ active: isWant(food.id) }"
              aria-label="想吃"
              @click="toggleCheckinWithToast(food, 'want')"
            >
              <HeartIcon class="card-action-icon" :filled="isWant(food.id)" />
            </button>
            <button
              class="card-action action-eaten"
              :class="{ active: isEaten(food.id) }"
              aria-label="已吃"
              @click="toggleCheckinWithToast(food, 'eaten')"
            >
              <UtensilsIcon class="card-action-icon" :filled="isEaten(food.id)" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="gallery-empty">
      <SparklesIcon class="empty-icon" />
      <p class="empty-text">NO DATA</p>
    </div>

    <FoodDetailModal
      :visible="detailVisible"
      :food="detailFood"
      :is-thumbs-up="detailThumbsUp"
      @close="closeDetail"
      @toggle-thumbs-up="toggleDetailThumbsUp"
      @share="openFoodShare"
    />

    <TravelShareModal
      :visible="shareVisible"
      :title="shareTitle"
      :share-text="shareText"
      :share-url="shareUrl"
      @close="closeShare"
    />

  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Food, FoodCategory } from '@/typesOfPages/travelGuide';
import {
  UtensilsIcon,
  StarIcon,
  SearchIcon,
  HeartIcon,
  ThumbUpIcon,
  LinkIcon,
  SparklesIcon,
} from '@/pages/TravelGuide/icons/common';
import FoodDetailModal from '../../FoodDetailModal/index.vue';
import TravelShareModal from '../../TravelShareModal/index.vue';
import { useFoodDetail } from '../../FoodDetailModal/useFoodDetail';
import { useCheckin } from '../../FoodDetailModal/useCheckin';
import { useFoodPrefs } from '@/composables/travelGuide/useFoodPrefs';
import { useTravelShare } from '../../TravelShareModal/useTravelShare';
import { useTravelToast } from '@/composables/travelGuide/useTravelToast';

interface Props {
  allFoods: Food[];
}

const props = defineProps<Props>();

const selectedCategory = ref<FoodCategory | null>(null);

const CATEGORY_ICONS: Record<string, string> = {
  面点主食: '🍜',
  菜品菜肴: '🍲',
  小吃零食: '🥟',
  汤羹饮品: '🥣',
  甜品糕点: '🍰',
  烧烤火锅: '🔥',
};

const CATEGORY_MAP: Record<string, string> = {
  主食: '面点主食',
  菜肴: '菜品菜肴',
  小吃: '小吃零食',
  甜品: '甜品糕点',
  饮品: '汤羹饮品',
  奶制品: '甜品糕点',
  水果: '小吃零食',
  熟食: '菜品菜肴',
  蔬菜: '菜品菜肴',
  中药材: '汤羹饮品',
};

const normalizeCategory = (cat: string): string => CATEGORY_MAP[cat] || cat;

const foodCategories = computed<FoodCategory[]>(() => {
  const allCount = props.allFoods.length;
  const tabs: FoodCategory[] = [
    { id: 0, name: '全部', icon: '🍽️', count: allCount },
  ];
  Object.entries(CATEGORY_ICONS).forEach(([name, icon], index) => {
    tabs.push({
      id: index + 1,
      name,
      icon,
      count: props.allFoods.filter((food) => normalizeCategory(food.category || '') === name).length,
    });
  });
  return tabs;
});

const filteredFoods = computed<Food[]>(() => {
  if (!selectedCategory.value) return [];
  if (selectedCategory.value.name === '全部') return props.allFoods;
  return props.allFoods.filter(
    (food) => normalizeCategory(food.category || '') === selectedCategory.value?.name,
  );
});

const toggleCategory = (category: FoodCategory): void => {
  if (selectedCategory.value?.id !== category.id) {
    selectedCategory.value = category;
  }
};

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
};

watch(
  foodCategories,
  (newCategories) => {
    if (newCategories.length > 0 && !selectedCategory.value) {
      selectedCategory.value = newCategories[0];
    }
  },
  { immediate: true },
);

const {
  detailVisible,
  detailFood,
  openDetail,
  closeDetail,
  toggleDetailThumbsUp,
} = useFoodDetail();

const { isWant, isEaten, toggleCheckin } = useCheckin();

const { isThumbsUp, toggleThumbsUp } = useFoodPrefs();
const detailThumbsUp = computed(() => detailFood.value ? isThumbsUp(detailFood.value) : false);

const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

const { show: showToast } = useTravelToast();

const openFoodShare = () => {
  if (detailFood.value) {
    openShare(
      detailFood.value.name,
      `${detailFood.value.name}｜评分 ${detailFood.value.rating ?? 0}｜价格 ¥${detailFood.value.price ?? '-'}`,
    );
  }
};

const openFoodShareFor = (food: Food) => {
  openShare(
    food.name,
    `${food.name}｜评分 ${food.rating ?? 0}｜价格 ¥${food.price ?? '-'}`,
  );
};

const toggleThumbsUpWithToast = (food: Food) => {
  const wasLiked = isThumbsUp(food);
  toggleThumbsUp(food);
  showToast({ type: 'like', message: wasLiked ? `已取消「${food.name}」的点赞` : `已为「${food.name}」点赞` });
};

const toggleCheckinWithToast = (food: Food, status: 'want' | 'eaten') => {
  const wasStatus = status === 'want' ? isWant(food.id) : isEaten(food.id);
  toggleCheckin(food.id, status);
  if (status === 'want') {
    showToast({ type: 'want', message: wasStatus ? `「${food.name}」已移出想吃清单` : `「${food.name}」已收入想吃清单` });
  } else {
    showToast({ type: 'eaten', message: wasStatus ? `已取消品鉴「${food.name}」` : `已品鉴「${food.name}」` });
  }
};

const openFoodShareForWithToast = (food: Food) => {
  openFoodShareFor(food);
  showToast({ type: 'share', message: `正在分享「${food.name}」` });
};
</script>

<style scoped lang="scss" src="./index.scss" />
