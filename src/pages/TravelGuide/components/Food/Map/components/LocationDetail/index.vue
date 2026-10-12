<template>
  <div class="shop-detail">
    <div v-if="selectedLocation" class="detail-panel">
      <div class="detail-hero">
        <img
          :src="selectedLocation.image"
          :alt="selectedLocation.name"
          class="detail-hero-image"
        />
        <div class="detail-hero-shade"></div>
        <div class="detail-hero-info">
          <span class="detail-type">{{ selectedLocation.type }}</span>
          <h2 class="detail-name">{{ selectedLocation.name }}</h2>
          <p class="detail-loc">
            <LocationIcon class="loc-icon" />
            {{ selectedLocation.location }}
          </p>
        </div>
        <span v-if="selectedLocation.rating" class="detail-rating">
          <StarIcon class="rating-star" />
          {{ selectedLocation.rating }}
        </span>
      </div>

      <div class="detail-body">
        <section v-if="selectedLocation.reason" class="detail-section">
          <h3 class="detail-section-title">
            <SparklesIcon class="section-icon" />
            <span>推荐理由</span>
          </h3>
          <p class="detail-section-text">{{ selectedLocation.reason }}</p>
        </section>

        <section v-if="selectedLocation.foods.length > 0" class="detail-section">
          <h3 class="detail-section-title">
            <PlateIcon class="section-icon" />
            <span>招牌美食</span>
          </h3>
          <div class="signature-foods">
            <div
              v-for="foodId in selectedLocation.foods"
              :key="foodId"
              class="signature-food"
              @click="openFoodDetail(foodId)"
            >
              <div class="specimen-chamber">
                <img
                  :src="getFoodImage(foodId)"
                  :alt="getFoodName(foodId)"
                  class="food-thumb"
                  loading="lazy"
                />
                <div v-if="getCheckinStatus(foodId) === 'eaten'" class="eaten-mark">
                  <UtensilsIcon :size="12" filled />
                </div>
              </div>
              <div class="food-info">
                <span class="food-name">{{ getFoodName(foodId) }}</span>
                <span v-if="getFoodPrice(foodId)" class="food-price">¥{{ getFoodPrice(foodId) }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <div v-else class="detail-default">
      <LocationIcon class="default-icon" />
      <h3 class="default-title">选择一家餐厅</h3>
      <p class="default-text">从左侧选择餐厅，查看详细信息和招牌美食</p>
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
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import PlateIcon from '../../../../../icons/pages/food/PlateIcon.vue';
  import UtensilsIcon from '../../../../../icons/common/UtensilsIcon.vue';
  import StarIcon from '../../../../../icons/common/StarIcon.vue';
  import SparklesIcon from '../../../../../icons/common/SparklesIcon.vue';
  import LocationIcon from '../../../../../icons/common/LocationIcon.vue';

  import FoodDetailModal from '../../../../FoodDetailModal/index.vue';
  import TravelShareModal from '../../../../TravelShareModal/index.vue';
  import { useFoodDetail } from '../../../../FoodDetailModal/useFoodDetail';
  import { useCheckin } from '../../../../FoodDetailModal/useCheckin';
  import { useTravelShare } from '../../../../TravelShareModal/useTravelShare';

  import type { Food, FoodLocation } from '@/typesOfPages/travelGuide';

  const props = defineProps<{
    selectedLocation: FoodLocation | null;
    allFoods?: Food[];
  }>();

  const foodMap = computed(() => {
    const m = new Map<string, Food>();
    for (const f of props.allFoods || []) m.set(f.id, f);
    return m;
  });

  const getFoodName = (foodId: string) =>
    foodMap.value.get(foodId)?.name || '未知美食';

  const getFoodImage = (foodId: string) =>
    foodMap.value.get(foodId)?.image || '';

  const getFoodPrice = (foodId: string) =>
    foodMap.value.get(foodId)?.price;

  const {
    detailVisible,
    detailFood,
    isThumbsUp,
    openDetail,
    closeDetail,
    toggleDetailThumbsUp,
  } = useFoodDetail();

  const detailThumbsUp = computed(() => detailFood.value ? isThumbsUp(detailFood.value) : false);

  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const { getCheckinStatus } = useCheckin();

  const openFoodShare = () => {
    if (detailFood.value) {
      openShare(
        detailFood.value.name,
        `${detailFood.value.name}｜评分 ${detailFood.value.rating ?? 0}｜价格 ¥${detailFood.value.price ?? '-'}`,
      );
    }
  };

  const openFoodDetail = (foodId: string) => {
    const food = foodMap.value.get(foodId);
    if (food) openDetail(food);
  };
</script>

<style scoped lang="scss" src="./index.scss" />