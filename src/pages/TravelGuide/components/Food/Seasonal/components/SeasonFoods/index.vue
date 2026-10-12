<template>
  <div v-if="currentSeason" class="season-foods">
    <article
      v-for="(foodId, idx) in currentSeason.foods"
      :key="foodId"
      class="season-food"
      :style="{ '--card-index': idx }"
      @click="openFoodById(foodId)"
    >
      <span class="food-beam" aria-hidden="true"></span>

      <div class="food-image-wrap">
        <img
          :src="getFoodImage(foodId)"
          :alt="getFoodName(foodId)"
          class="food-image"
          loading="lazy"
        />
        <div class="image-shade"></div>
        <span class="spectrum-bar" aria-hidden="true"></span>
      </div>

      <div class="food-info">
        <span class="food-index"><span>{{ String(idx + 1).padStart(2, '0') }}</span></span>
        <div class="food-main">
          <h4 class="food-name">{{ getFoodName(foodId) }}</h4>
          <div class="food-meta">
            <span v-if="getFoodCategory(foodId)" class="food-category">{{ getFoodCategory(foodId) }}</span>
            <span v-if="getFoodPrice(foodId)" class="food-price">¥{{ getFoodPrice(foodId) }}</span>
          </div>
          <div class="season-actions" @click.stop>
            <button
              class="s-action s-like"
              :class="{ active: isFoodThumbsUp(foodId) }"
              aria-label="点赞"
              @click="toggleFoodThumbsUpWithToast(foodId)"
            >
              <ThumbUpIcon class="s-action-icon" :filled="isFoodThumbsUp(foodId)" />
            </button>
            <button
              class="s-action s-share"
              aria-label="分享"
              @click="openFoodShareFor(foodId)"
            >
              <LinkIcon class="s-action-icon" />
            </button>
            <button
              class="s-action s-want"
              :class="{ active: isWant(foodId) }"
              aria-label="想吃"
              @click="toggleWantWithToast(foodId)"
            >
              <HeartIcon class="s-action-icon" :filled="isWant(foodId)" />
            </button>
            <button
              class="s-action s-eaten"
              :class="{ active: isEaten(foodId) }"
              aria-label="已吃"
              @click="toggleEatenWithToast(foodId)"
            >
              <UtensilsIcon class="s-action-icon" :filled="isEaten(foodId)" />
            </button>
          </div>
        </div>
      </div>
    </article>

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
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import ThumbUpIcon from '../../../../../icons/common/ThumbUpIcon.vue';
  import HeartIcon from '../../../../../icons/common/HeartIcon.vue';
  import LinkIcon from '../../../../../icons/common/LinkIcon.vue';
  import UtensilsIcon from '../../../../../icons/common/UtensilsIcon.vue';

  import FoodDetailModal from '../../../../FoodDetailModal/index.vue';
  import TravelShareModal from '../../../../TravelShareModal/index.vue';
  import { useFoodDetail } from '../../../../FoodDetailModal/useFoodDetail';
  import { useCheckin } from '../../../../FoodDetailModal/useCheckin';
  import { useFoodPrefs } from '@/composables/travelGuide/useFoodPrefs';
  import { useTravelShare } from '../../../../TravelShareModal/useTravelShare';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';

  import type { Food, FoodSeasonal } from '@/typesOfPages/travelGuide';

  const props = defineProps<{
    currentSeason: FoodSeasonal | null;
    allFoods: Food[];
  }>();

  const foodMap = computed(() => {
    const m = new Map<string, Food>();
    for (const f of props.allFoods) m.set(f.id, f);
    return m;
  });

  const getFoodName = (foodId: string) =>
    foodMap.value.get(foodId)?.name || '未知美食';

  const getFoodImage = (foodId: string) =>
    foodMap.value.get(foodId)?.image || '';

  const getFoodPrice = (foodId: string) =>
    foodMap.value.get(foodId)?.price;

  const getFoodCategory = (foodId: string) =>
    foodMap.value.get(foodId)?.category;

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

  const foodOf = (foodId: string): Food | undefined =>
    foodMap.value.get(foodId);

  const isFoodThumbsUp = (foodId: string): boolean => {
    const food = foodOf(foodId);
    return food ? isThumbsUp(food) : false;
  };

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

  const openFoodShareFor = (foodId: string) => {
    const food = foodOf(foodId);
    if (food) {
      openShare(
        food.name,
        `${food.name}｜评分 ${food.rating ?? 0}｜价格 ¥${food.price ?? '-'}`,
      );
      showToast({ type: 'share', message: `正在分享「${food.name}」` });
    }
  };

  const toggleFoodThumbsUpWithToast = (foodId: string): void => {
    const food = foodOf(foodId);
    if (food) {
      const wasLiked = isThumbsUp(food);
      toggleThumbsUp(food);
      showToast({ type: 'like', message: wasLiked ? `已取消「${food.name}」的点赞` : `已为「${food.name}」点赞` });
    }
  };

  const toggleWantWithToast = (foodId: string): void => {
    const food = foodOf(foodId);
    const wasWant = isWant(foodId);
    toggleCheckin(foodId, 'want');
    showToast({ type: 'want', message: wasWant ? `「${food?.name || ''}」已移出想吃清单` : `「${food?.name || ''}」已收入想吃清单` });
  };

  const toggleEatenWithToast = (foodId: string): void => {
    const food = foodOf(foodId);
    const wasEaten = isEaten(foodId);
    toggleCheckin(foodId, 'eaten');
    showToast({ type: 'eaten', message: wasEaten ? `已取消品鉴「${food?.name || ''}」` : `已品鉴「${food?.name || ''}」` });
  };

  const openFoodById = (foodId: string) => {
    const food = foodMap.value.get(foodId);
    if (food) openDetail(food);
  };
</script>

<style scoped lang="scss" src="./index.scss" />