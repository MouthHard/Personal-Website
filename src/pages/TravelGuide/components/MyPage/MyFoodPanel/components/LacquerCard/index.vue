<script setup lang="ts">
import type { Food } from '@/typesOfPages/travelGuide';
import { CloseIcon, StarIcon, ThumbUpIcon, ShareIcon, HeartIcon, UtensilsIcon } from '@/pages/TravelGuide/icons/common';
import LacquerCornerIcon from '../../../../../icons/pages/food/LacquerCornerIcon.vue';
import CellNameCornerIcon from '../../../../../icons/pages/food/CellNameCornerIcon.vue';
import LacquerOrnamentIcon from '../../../../../icons/pages/food/LacquerOrnamentIcon.vue';

defineProps<{
  foods: Food[];
  isWant: (id: string) => boolean;
  isEaten: (id: string) => boolean;
  isThumbsUp: (food: Food) => boolean;
  padNo: (n: number) => string;
}>();

const emit = defineEmits<{
  (e: 'open', food: Food): void;
  (e: 'remove', id: string): void;
  (e: 'thumbs-up', food: Food): void;
  (e: 'share', food: Food): void;
  (e: 'want', food: Food): void;
  (e: 'eaten', food: Food): void;
}>();
</script>

<template>
  <ul class="lacquer-grid">
    <li v-for="(food, index) in foods" :key="food.id" class="food-box"
      :class="{ 'is-both': isWant(food.id) && isEaten(food.id) }"
      @click="emit('open', food)">
      <!-- 顶部铭牌条：食字印章 + 关闭按钮（整个容器最顶层横杠） -->
      <div class="box-topbar">
        <LacquerCornerIcon class="topbar-corner topbar-corner-l" />
        <LacquerCornerIcon class="topbar-corner topbar-corner-r" />
        <span class="topbar-seal">食</span>
        <span class="topbar-ornament" aria-hidden="true">
          <svg v-once viewBox="0 0 140 18">
            <path d="M70 1 L78 9 L70 17 L62 9 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M70 4 L75 9 L70 14 L65 9 Z" fill="none" stroke="currentColor" stroke-width="1.2" />
            <circle cx="70" cy="9" r="2.5" fill="currentColor" />
            <circle cx="70" cy="9" r="1" fill="none" stroke="currentColor" stroke-width="0.8" />
            <path d="M62 9 C56 9 52 5 46 9 C40 13 36 9 30 9 C24 9 20 5 14 9 C8 13 4 9 2 9"
              fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
            <path d="M78 9 C84 9 88 5 94 9 C100 13 104 9 110 9 C116 9 120 5 126 9 C132 13 136 9 138 9"
              fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
            <path d="M46 5 L50 9 L46 13 L42 9 Z" fill="none" stroke="currentColor" stroke-width="1.2" />
            <circle cx="46" cy="9" r="1.5" fill="currentColor" />
            <path d="M94 5 L98 9 L94 13 L90 9 Z" fill="none" stroke="currentColor" stroke-width="1.2" />
            <circle cx="94" cy="9" r="1.5" fill="currentColor" />
            <path d="M14 6 L17 9 L14 12 L11 9 Z" fill="none" stroke="currentColor" stroke-width="1" />
            <circle cx="14" cy="9" r="1" fill="currentColor" />
            <path d="M126 6 L129 9 L126 12 L123 9 Z" fill="none" stroke="currentColor" stroke-width="1" />
            <circle cx="126" cy="9" r="1" fill="currentColor" />
            <path d="M2 9 C0 7 0 11 2 9" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
            <circle cx="2" cy="9" r="1.4" fill="currentColor" />
            <path d="M138 9 C140 7 140 11 138 9" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
            <circle cx="138" cy="9" r="1.4" fill="currentColor" />
            <path d="M30 9 Q33 7 36 9" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.7" />
            <path d="M110 9 Q113 7 116 9" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.7" />
            <path d="M56 9 Q59 7 62 9" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" opacity="0.6" />
            <path d="M78 9 Q81 7 84 9" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" opacity="0.6" />
          </svg>
        </span>
        <button class="box-close" title="移除" @click.stop="emit('remove', food.id)">
          <CloseIcon :size="16" />
        </button>
      </div>

      <!-- 盒盖边缘 -->
      <div class="box-lid">
        <span class="lid-gilt-line"></span>
      </div>


      <!-- 分格内容：左图片 + 右信息栏 -->
      <div class="box-cells">
        <!-- 左：图片格 -->
        <div class="cell-image">
          <img :src="food.image" :alt="food.name" loading="lazy" />
          <div class="cell-pit" aria-hidden="true"></div>
          <span class="image-no">第{{ padNo(index) }}号</span>
          <span v-if="food.rating" class="image-rating">
            <StarIcon :size="10" />
            <i>{{ food.rating.toFixed(1) }}</i>
          </span>
        </div>

        <!-- 右：信息栏（菜名/标签/价格） -->
        <div class="cell-side">
          <div class="cell-name">
            <CellNameCornerIcon class="cn-corner cn-corner-tl" />
            <CellNameCornerIcon class="cn-corner cn-corner-tr" />
            <h3 class="dish-title">{{ food.name }}</h3>
            <CellNameCornerIcon class="cn-corner cn-corner-bl" />
            <CellNameCornerIcon class="cn-corner cn-corner-br" />
          </div>
          <div class="cell-tags">
            <span v-if="food.province" class="tag-province">{{ food.province }}</span>
            <span v-if="food.category" class="tag-cat">{{ food.category }}</span>
          </div>
          <div class="cell-price">
            <span v-if="food.price" class="price-gilt"><i>¥</i>{{ food.price }}</span>
            <span v-else class="price-gilt price-empty"><i>—</i></span>
          </div>
        </div>
      </div>

      <!-- 描述格 -->
      <div v-if="food.description" class="cell-desc">
        <p class="dish-memo">{{ food.description }}</p>
      </div>


      <!-- 盒底操作栏：点赞/分享/想吃/已吃 -->
      <div class="box-base">
        <LacquerCornerIcon class="base-corner base-corner-l" />
        <LacquerCornerIcon class="base-corner base-corner-r" />
        <span class="base-ornament base-orn-left" aria-hidden="true">
          <LacquerOrnamentIcon />
        </span>
        <button class="base-action" :class="{ 'is-liked': isThumbsUp(food) }" title="点赞"
          @click.stop="emit('thumbs-up', food)">
          <ThumbUpIcon :size="18" :filled="isThumbsUp(food)" />
        </button>
        <button class="base-action" title="分享" @click.stop="emit('share', food)">
          <ShareIcon :size="18" />
        </button>
        <button class="base-action" :class="{ 'is-favored': isWant(food.id) }" title="想吃"
          @click.stop="emit('want', food)">
          <HeartIcon :size="18" :filled="isWant(food.id)" />
        </button>
        <button class="base-action" :class="{ 'is-eaten': isEaten(food.id) }" title="已吃"
          @click.stop="emit('eaten', food)">
          <UtensilsIcon :size="18" :filled="isEaten(food.id)" />
        </button>
        <span class="base-ornament base-orn-right" aria-hidden="true">
          <LacquerOrnamentIcon flip />
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped src="./index.scss" lang="scss"></style>