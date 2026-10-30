<template>
  <section v-if="popularFoods.length > 0" class="must-eat-section">
    <div class="ambient-glow"></div>

    <header class="section-header">
      <div class="header-left">
        <div class="header-icon-wrap">
          <BowlRiceIcon class="header-icon" />
        </div>
        <div class="header-titles">
          <h2 class="header-title">必吃清单</h2>
          <p class="header-subtitle">必尝的 {{ popularFoods.length }} 道美味</p>
        </div>
      </div>
      <div class="header-progress">
        <div class="progress-counter">
          <span class="counter-label">已打卡</span>
          <span class="counter-value">
            <span class="counter-current">{{ eatenInPopular }}</span>
            <span class="counter-sep">/</span>
            <span class="counter-total">{{ popularFoods.length }}</span>
          </span>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ progressPercent }}%</span>
      </div>
    </header>

    <ol class="must-eat-list">
      <li
        v-for="(food, index) in popularFoods"
        :key="food.id"
        class="must-eat-item"
        :class="{
          eaten: isEaten(food.id),
          want: isWant(food.id),

        }"
        :style="{ '--item-index': index }"
        @click="openDetail(food)"
      >
        <div class="item-starfield" aria-hidden="true">
          <QuantumStarfieldIcon class="starfield-svg" />
        </div>

        <div class="item-number">{{ String(index + 1).padStart(2, '0') }}</div>

        <div class="item-image-wrap">
          <img
            :src="food.image"
            :alt="food.name"
            class="item-image"
            loading="lazy"
          />
          <div class="image-shade"></div>
          <div class="item-rating">
            <StarIcon class="rating-star" />
            <span>{{ food.rating ?? 0 }}</span>
          </div>
        </div>

        <div class="item-body">
          <div class="item-info">
            <div class="item-title-row">
              <h3 class="item-name">{{ food.name }}</h3>
              <div class="item-status-tags">
                <span
                  v-if="isEaten(food.id)"
                  class="status-tag status-eaten"
                >
                  <UtensilsIcon class="status-tag-icon" filled />
                  <span class="status-tag-label">已吃</span>
                </span>
                <span
                  v-if="isWant(food.id)"
                  class="status-tag status-want"
                >
                  <HeartIcon class="status-tag-icon" filled />
                  <span class="status-tag-label">想吃</span>
                </span>
              </div>
            </div>
            <p class="item-tagline">{{ food.description || '地道风味，值得一试' }}</p>
            <div class="item-meta">
              <span v-if="food.category" class="meta-category">{{ food.category }}</span>
              <span class="meta-price">
                <span class="price-symbol">¥</span>{{ food.price }}
              </span>
            </div>
          </div>

          <div class="item-actions" @click.stop>
            <button

              class="checkin-btn like-btn"
              :class="{ active: isThumbsUp(food) }"
              aria-label="点赞"
              @click="toggleThumbsUpWithToast(food)"
            >
              <ThumbUpIcon class="checkin-icon" :filled="isThumbsUp(food)" />
              <span class="checkin-label">点赞</span>
            </button>
            <button
              class="checkin-btn share-btn"
              aria-label="分享"
              @click="openFoodShareForWithToast(food)"
            >
              <LinkIcon class="checkin-icon" />
              <span class="checkin-label">分享</span>
            </button>
            <button
              class="checkin-btn"
              :class="{ active: isWant(food.id) }"
              aria-label="想吃"
              @click="toggleCheckinWithToast(food, 'want')"
            >
              <HeartIcon class="checkin-icon" :filled="isWant(food.id)" />
              <span class="checkin-label">想吃</span>
            </button>
            <button
              class="checkin-btn eaten-btn"
              :class="{ active: isEaten(food.id) }"
              aria-label="已吃"
              @click="toggleCheckinWithToast(food, 'eaten')"
            >
              <UtensilsIcon class="checkin-icon" :filled="isEaten(food.id)" />
              <span class="checkin-label">已吃</span>
            </button>
          </div>
        </div>

        <div class="item-shine"></div>
      </li>
    </ol>

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

  <FoodEmptyState v-else type="popular" />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import BowlRiceIcon from '../../../icons/common/BowlRiceIcon.vue';
  import StarIcon from '../../../icons/common/StarIcon.vue';
  import UtensilsIcon from '../../../icons/common/UtensilsIcon.vue';
  import HeartIcon from '../../../icons/common/HeartIcon.vue';
  import ThumbUpIcon from '../../../icons/common/ThumbUpIcon.vue';
  import LinkIcon from '../../../icons/common/LinkIcon.vue';
  import QuantumStarfieldIcon from '../../../icons/pages/food/QuantumStarfieldIcon.vue';
  import FoodDetailModal from '../../FoodDetailModal/index.vue';
  import TravelShareModal from '../../TravelShareModal/index.vue';
  import { useFoodDetail } from '../../FoodDetailModal/useFoodDetail';
  import { useCheckin } from '../../FoodDetailModal/useCheckin';
  import { useFoodPrefs } from '@/composables/travelGuide/useFoodPrefs';
  import { useTravelShare } from '../../TravelShareModal/useTravelShare';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import FoodEmptyState from '../components/FoodEmptyState/index.vue';
  import type { Food } from '@/typesOfPages/travelGuide';

  interface Props {
    popularFoods: Food[];
  }

  const props = withDefaults(defineProps<Props>(), {
    popularFoods: () => [],
  });

  const {
    detailVisible,
    detailFood,

    openDetail,
    closeDetail,
    toggleDetailThumbsUp,
  } = useFoodDetail();

  const { isWant, isEaten, toggleCheckin } = useCheckin();

  const eatenInPopular = computed(() => props.popularFoods.filter((f) => isEaten(f.id)).length);
  const progressPercent = computed(() => props.popularFoods.length ? Math.round(eatenInPopular.value / props.popularFoods.length * 100) : 0);

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
