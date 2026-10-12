<script lang="ts">
const RIVET_POSITIONS = Array.from({ length: 8 }, (_, i) => ({
  cx: 50 + 42 * Math.cos(i * Math.PI / 4),
  cy: 50 + 42 * Math.sin(i * Math.PI / 4),
}));
</script>

<script setup lang="ts">
import type { FoodSouvenir } from '@/typesOfPages/travelGuide';
import { CloseIcon, HeartIcon, ShoppingCartIcon } from '@/pages/TravelGuide/icons/common';

defineProps<{
  souvenirs: FoodSouvenir[];
  isWant: (id: string) => boolean;
  isBought: (id: string) => boolean;
}>();

const emit = defineEmits<{
  (e: 'remove', id: string): void;
  (e: 'want', sv: FoodSouvenir): void;
  (e: 'bought', sv: FoodSouvenir): void;
}>();
</script>

<template>
  <ul class="capsule-grid">
    <li v-for="sv in souvenirs" :key="sv.id" class="capsule-pod"
      :class="{ 'is-both': isWant(sv.id) && isBought(sv.id) }">
      <div class="capsule-shell">
        <!-- 顶部状态条：LED灯（左）+ 关闭按钮（右） -->
        <header class="caps-header">
          <span class="caps-leds">
            <i class="caps-led"></i>
            <i class="caps-led caps-led-amber"></i>
            <i class="caps-led caps-led-green"></i>
          </span>
          <span class="caps-stripe" aria-hidden="true"></span>
          <button class="caps-close" title="移除" @click.stop="emit('remove', sv.id)">
            <CloseIcon :size="16" />
          </button>
        </header>

        <!-- 主体：圆形舷窗 + 数据面板 -->
        <div class="caps-body">
          <!-- 圆形舷窗观察口 -->
          <div class="caps-port">
            <div class="port-ring">
              <svg class="port-rivets" viewBox="0 0 100 100" aria-hidden="true">
                <circle v-for="(pos, i) in RIVET_POSITIONS" :key="i" :cx="pos.cx"
                  :cy="pos.cy" r="2.4" />
              </svg>
              <div class="port-glass">
                <img :src="sv.image" :alt="sv.name" loading="lazy" />
                <div class="port-scan" aria-hidden="true"></div>
                <div class="port-glare" aria-hidden="true"></div>
              </div>
            </div>
          </div>

          <!-- 数据面板 -->
          <div class="caps-data">
            <h3 class="data-name">{{ sv.name }}</h3>
            <div class="data-tags">
              <span v-if="sv.province" class="tag-orbit">{{ sv.province }}</span>
              <span class="tag-cell">{{ sv.priceRange }}</span>
            </div>
            <p class="data-memo">{{ sv.description }}</p>
            <div class="data-buy">
              <span class="buy-label">购于</span>
              <span class="buy-at">{{ sv.buyAt }}</span>
            </div>
          </div>
        </div>

        <!-- 底部操作栏：想买 / 已买（互斥） -->
        <footer class="caps-foot">
          <button class="caps-action action-want" :class="{ 'is-want': isWant(sv.id) }" title="想买" @click.stop="emit('want', sv)">
            <HeartIcon :size="16" :filled="isWant(sv.id)" />
            <span class="action-label">想买</span>
          </button>
          <button class="caps-action action-bought" :class="{ 'is-bought': isBought(sv.id) }" title="已买" @click.stop="emit('bought', sv)">
            <ShoppingCartIcon :size="16" :filled="isBought(sv.id)" />
            <span class="action-label">已买</span>
          </button>
        </footer>

        <!-- 角铆钉 -->
        <span class="caps-rivet rivet-tl" aria-hidden="true"></span>
        <span class="caps-rivet rivet-tr" aria-hidden="true"></span>
        <span class="caps-rivet rivet-bl" aria-hidden="true"></span>
        <span class="caps-rivet rivet-br" aria-hidden="true"></span>
      </div>
    </li>
  </ul>
</template>

<style scoped src="./index.scss" lang="scss"></style>