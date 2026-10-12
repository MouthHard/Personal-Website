<script setup lang="ts">
import { computed } from 'vue';
import type { Food, FoodGuide } from '@/typesOfPages/travelGuide';
import ClockIcon from '../../../../../icons/common/ClockIcon.vue';
import { useFoodDetail } from '../../../../FoodDetailModal/useFoodDetail';

const props = defineProps<{
  mealPlan: FoodGuide['mealPlan'] | null;
  allFoods: Food[];
}>();

const { openDetail } = useFoodDetail();

const mealPlanItems = computed(() => {
  if (!props.mealPlan) return [];
  const mp = props.mealPlan;
  return [
    { key: 'breakfast', label: '早餐', foods: mp.breakfast || [] },
    { key: 'lunch', label: '午餐', foods: mp.lunch || [] },
    { key: 'dinner', label: '晚餐', foods: mp.dinner || [] },
  ];
});

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

const openFoodById = (foodId: string) => {
  const food = foodMap.value.get(foodId);
  if (food) openDetail(food);
};
</script>

<template>
  <section v-if="mealPlanItems.length > 0" class="guide-block meal-plan-block">
    <h3 class="block-title">
      <ClockIcon class="title-icon" />
      <span>一日三餐推荐</span>
    </h3>
    <div class="meal-plan">
      <div
        v-for="meal in mealPlanItems"
        :key="meal.key"
        class="cassette-card"
      >
        <div class="cassette-reels">
          <div class="reel reel-left"><div class="reel-hub"></div></div>
          <div class="reel-window">
            <span class="reel-label">{{ meal.label }}</span>
          </div>
          <div class="reel reel-right"><div class="reel-hub"></div></div>
        </div>
        <div class="cassette-body">
          <div class="cassette-tape-bg"></div>
          <div class="cassette-tracks">
            <div
              v-for="(foodId, idx) in meal.foods"
              :key="foodId"
              class="track-item"
              @click="openFoodById(foodId)"
            >
              <span class="track-no">{{ idx + 1 }}</span>
              <div class="track-wave"></div>
              <img
                :src="getFoodImage(foodId)"
                :alt="getFoodName(foodId)"
                class="track-image"
                loading="lazy"
              />
              <span class="track-name">{{ getFoodName(foodId) }}</span>
              <span v-if="getFoodPrice(foodId)" class="track-price">¥{{ getFoodPrice(foodId) }}</span>
            </div>
          </div>
        </div>
        <div class="cassette-head">
          <div class="head-rail"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss" src="./index.scss" />