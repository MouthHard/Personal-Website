<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FoodGuideRoute } from '@/typesOfPages/travelGuide';
import { CloseIcon, HeartIcon, FlagIcon } from '@/pages/TravelGuide/icons/common';
import StationDetailPopover from './components/StationDetailPopover/index.vue';

const props = defineProps<{
  routes: FoodGuideRoute[];
  isFav: (id: string) => boolean;
  isDone: (id: string) => boolean;
  foodName: (foodId: string) => string;
  lineColors: readonly string[];
}>();

const emit = defineEmits<{
  (e: 'remove', id: string): void;
  (e: 'fav', route: FoodGuideRoute): void;
  (e: 'done', route: FoodGuideRoute): void;
}>();

const routeLineColor = (index: number): string =>
  props.lineColors[index % props.lineColors.length];

const selectedStep = ref<{ routeId: string; stepIndex: number } | null>(null);
const selectStep = (routeId: string, stepIndex: number): void => {
  if (selectedStep.value && selectedStep.value.routeId === routeId && selectedStep.value.stepIndex === stepIndex) {
    selectedStep.value = null;
  } else {
    selectedStep.value = { routeId, stepIndex };
  }
};
const closeStep = (): void => {
  selectedStep.value = null;
};
const selectedStepData = computed(() => {
  if (!selectedStep.value) return null;
  const route = props.routes.find((r) => r.id === selectedStep.value!.routeId);
  if (!route) return null;
  return route.steps[selectedStep.value.stepIndex] || null;
});
const selectedStepLineColor = computed(() => {
  if (!selectedStep.value) return props.lineColors[0];
  const idx = props.routes.findIndex((r) => r.id === selectedStep.value!.routeId);
  return idx >= 0 ? routeLineColor(idx) : props.lineColors[0];
});
</script>

<template>
  <div class="metro-board">
    <article
      v-for="(route, index) in routes"
      :key="route.id"
      class="metro-line"
      :class="{ 'is-both': isFav(route.id) && isDone(route.id) }"
      :style="{ '--line-color': routeLineColor(index) }"
    >
      <!-- 左侧线路标识区 -->
      <div class="line-ident">
        <span class="ident-glow" aria-hidden="true"></span>
        <div class="ident-dot" aria-hidden="true"></div>

        <h3 class="ident-name">{{ route.name }}</h3>
        <div class="ident-stats">
          <span class="stat-dur">{{ route.duration }}</span>
          <span class="stat-sep" aria-hidden="true"></span>
          <span class="stat-cnt">{{ route.steps.length }}站</span>
        </div>
        <div class="ident-actions">
          <button
            class="action-btn action-fav"
            :class="{ 'is-on': isFav(route.id) }"
            title="收藏线路"
            @click.stop="emit('fav', route)"
          >
            <HeartIcon :size="16" :filled="isFav(route.id)" />
            <span class="action-label">收藏</span>
          </button>
          <button
            class="action-btn action-done"
            :class="{ 'is-on': isDone(route.id) }"
            title="打卡完成"
            @click.stop="emit('done', route)"
          >
            <FlagIcon :size="16" :filled="isDone(route.id)" />
            <span class="action-label">完成</span>
          </button>
        </div>
        <button class="ident-eject" title="移除" @click.stop="emit('remove', route.id)">
          <CloseIcon :size="16" />
        </button>
      </div>

      <!-- 右侧线路图区 -->
      <div class="line-map">
        <svg v-once class="map-fx" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <pattern id="fx-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.6" fill="currentColor" opacity="0.12"/>
            </pattern>
          </defs>
          <rect width="800" height="200" fill="url(#fx-grid)"/>
          <path class="fx-arc" d="M0,165 Q200,125 400,165 T800,165" fill="none" stroke="currentColor" stroke-width="1"/>
          <path class="fx-arc fx-arc-2" d="M0,35 Q200,75 400,35 T800,35" fill="none" stroke="currentColor" stroke-width="1"/>
          <line class="fx-track" x1="0" y1="62" x2="800" y2="62" stroke="currentColor" stroke-width="1" stroke-dasharray="6 12"/>
          <line class="fx-track fx-track-2" x1="0" y1="100" x2="800" y2="100" stroke="currentColor" stroke-width="1" stroke-dasharray="4 16"/>
          <line class="fx-track fx-track-3" x1="0" y1="138" x2="800" y2="138" stroke="currentColor" stroke-width="1" stroke-dasharray="9 13"/>
          <g class="fx-stations" opacity="0.1" stroke="currentColor" stroke-width="0.8" fill="none">
            <circle cx="100" cy="62" r="3"/><circle cx="250" cy="62" r="3"/><circle cx="500" cy="62" r="3"/><circle cx="650" cy="62" r="3"/>
            <circle cx="175" cy="100" r="3"/><circle cx="625" cy="100" r="3"/>
            <circle cx="80" cy="138" r="3"/><circle cx="320" cy="138" r="3"/><circle cx="560" cy="138" r="3"/><circle cx="720" cy="138" r="3"/>
          </g>
          <circle class="fx-train" cy="62" r="2.5" fill="currentColor"/>
          <circle class="fx-train fx-train-2" cy="100" r="2" fill="currentColor"/>
          <circle class="fx-train fx-train-3" cy="138" r="3" fill="currentColor"/>
          <path class="fx-hud" d="M12,12 L34,12 M12,12 L12,34" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path class="fx-hud" d="M788,12 L766,12 M788,12 L788,34" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path class="fx-hud" d="M12,188 L34,188 M12,188 L12,166" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path class="fx-hud" d="M788,188 L766,188 M788,188 L788,166" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <circle class="fx-pulse" cx="400" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="1"/>
          <circle class="fx-signal" cx="400" cy="100" r="20" fill="none" stroke="currentColor" stroke-width="0.8"/>
          <circle class="fx-signal-2" cx="400" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="0.6"/>
          <g class="fx-ticks" opacity="0.08" stroke="currentColor" stroke-width="0.5">
            <line x1="80" y1="195" x2="80" y2="200"/><line x1="180" y1="195" x2="180" y2="200"/>
            <line x1="280" y1="195" x2="280" y2="200"/><line x1="380" y1="195" x2="380" y2="200"/>
            <line x1="480" y1="195" x2="480" y2="200"/><line x1="580" y1="195" x2="580" y2="200"/>
            <line x1="680" y1="195" x2="680" y2="200"/><line x1="780" y1="195" x2="780" y2="200"/>
          </g>
        </svg>
        <div class="map-scan" aria-hidden="true"></div>
        <div class="map-stations">
          <div
            v-for="(step, si) in route.steps"
            :key="`${step.foodId}-${step.time}-${si}`"
            class="station-node"
            :class="{
              'is-active':
                selectedStep &&
                selectedStep.routeId === route.id &&
                selectedStep.stepIndex === si,
              'is-first': si === 0,
              'is-last': si === route.steps.length - 1,
            }"
            @click.stop="selectStep(route.id, si)"
          >
            <span class="node-time">{{ step.time }}</span>
            <span class="node-dot" aria-hidden="true">
              <span class="dot-core"></span>
            </span>
            <span class="node-no">S{{ String(si + 1).padStart(2, '0') }}</span>
            <span class="node-loc">{{ step.location }}</span>
            <span v-if="foodName(step.foodId)" class="node-food">{{ foodName(step.foodId) }}</span>
          </div>
        </div>
      </div>
    </article>

    <!-- 站点详情浮卡 -->
    <StationDetailPopover
      :step-data="selectedStepData"
      :line-color="selectedStepLineColor"
      :food-name="foodName"
      @close="closeStep"
    />
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>