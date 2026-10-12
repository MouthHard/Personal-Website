<script setup lang="ts">
  import LightbulbIcon from '../../../icons/common/LightbulbIcon.vue';
  import FoodDetailModal from '../../FoodDetailModal/index.vue';
  import TravelShareModal from '../../TravelShareModal/index.vue';
  import { useFoodDetail } from '../../FoodDetailModal/useFoodDetail';
  import { useTravelShare } from '../../TravelShareModal/useTravelShare';
  import type { Food, FoodGuide } from '@/typesOfPages/travelGuide';
  import MealPlan from './components/MealPlan/index.vue';
  import FoodRoutes from './components/FoodRoutes/index.vue';
  import Tips from './components/Tips/index.vue';

  interface Props {
    guide: FoodGuide | null;
    allFoods: Food[];
  }

  const props = defineProps<Props>();

  const {
    detailVisible,
    detailFood,
    isThumbsUp,
    closeDetail,
    toggleDetailThumbsUp,
  } = useFoodDetail();

  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const openFoodShare = () => {
    if (detailFood.value) {
      openShare(
        detailFood.value.name,
        `${detailFood.value.name}｜评分 ${detailFood.value.rating ?? 0}｜价格 ¥${detailFood.value.price ?? '-'}`,
      );
    }
  };
</script>

<template>
  <section v-if="props.guide" class="guide-section">
    <div class="ambient-glow"></div>

    <header class="section-header">
      <div class="header-grid-bg"></div>
      <div class="hud-corner hud-tl"></div>
      <div class="hud-corner hud-tr"></div>
      <div class="hud-corner hud-bl"></div>
      <div class="hud-corner hud-br"></div>
      <div class="header-scanline"></div>

      <div class="header-left">
        <div class="header-icon-cabin">
          <div class="cabin-ring-outer"></div>
          <div class="cabin-ring-mid"></div>
          <div class="cabin-core">
            <LightbulbIcon class="header-icon" />
          </div>
          <div class="cabin-shadow"></div>
        </div>
        <div class="header-titles">
          <div class="title-bar">
            <span class="title-bracket">[</span>
            <h2 class="header-title">美食攻略</h2>
            <span class="title-bracket">]</span>
            <span class="title-chip">GUIDE.v3</span>
          </div>
          <div class="subtitle-stream">
            <span class="stream-led"></span>
            <span class="stream-text">怎么吃最省心 · 一日三餐 · 路线 · 避坑</span>
            <span class="stream-bar"></span>
          </div>
        </div>
      </div>
    </header>

    <div class="guide-content">
      <MealPlan :meal-plan="props.guide.mealPlan" :all-foods="props.allFoods" />
      <FoodRoutes :routes="props.guide.routes || []" :all-foods="props.allFoods" />
      <Tips :tips="props.guide.tips || []" />
    </div>

    <FoodDetailModal
      :visible="detailVisible"
      :food="detailFood"
      :is-thumbs-up="detailFood ? isThumbsUp(detailFood) : false"
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

<style scoped lang="scss" src="./index.scss" />
