<script setup lang="ts">
import { CloseIcon } from '@/pages/TravelGuide/icons/common';

defineProps<{
  stepData: {
    location: string;
    time: string;
    foodId?: string;
    description?: string;
  } | null;
  lineColor: string;
  foodName: (foodId: string) => string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <transition name="station-pop">
    <div
      v-if="stepData"
      class="station-detail-overlay"
      @click.stop="emit('close')"
    >
      <div
        class="pop-card"
        :style="{ '--line-color': lineColor }"
        @click.stop
      >
        <header class="pop-head">
          <span class="pop-node" aria-hidden="true"></span>
          <h4 class="pop-loc">{{ stepData.location }}</h4>
          <button class="pop-close" title="关闭" @click.stop="emit('close')">
            <CloseIcon :size="14" />
          </button>
        </header>
        <div class="pop-body">
          <div class="pop-row">
            <span class="row-label">时辰</span>
            <span class="row-val">{{ stepData.time }}</span>
          </div>
          <div v-if="stepData.foodId && foodName(stepData.foodId)" class="pop-row">
            <span class="row-label">美食</span>
            <span class="row-val row-food">{{ foodName(stepData.foodId) }}</span>
          </div>
          <p v-if="stepData.description" class="pop-desc">
            {{ stepData.description }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped src="./index.scss" lang="scss"></style>