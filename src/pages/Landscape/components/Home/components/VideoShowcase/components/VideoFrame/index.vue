<template>
  <div class="frame-outer">
    <div class="frame-bevel"></div>
    <div class="frame-screws">
      <div class="screw tl"></div>
      <div class="screw tr"></div>
      <div class="screw bl"></div>
      <div class="screw br"></div>
    </div>
    <div class="frame-inner">
      <div class="chamfer tl"></div>
      <div class="chamfer tr"></div>
      <div class="chamfer bl"></div>
      <div class="chamfer br"></div>

      <div class="inner-glow top"></div>
      <div class="inner-glow bottom"></div>
      <div class="inner-glow left"></div>
      <div class="inner-glow right"></div>

      <div class="status-bar">
        <div class="status-dot"></div>
        <div class="status-dot"></div>
        <div class="status-dot"></div>
        <span class="status-text">{{ currentTitle }}</span>
        <span class="status-index">
          {{ String(activeIndex + 1).padStart(2, '0') }} /
          {{ String(totalCount).padStart(2, '0') }}
        </span>
        <div
          class="status-gauge"
          :style="{ '--gauge-angle': `${(activeIndex / Math.max(totalCount - 1, 1)) * 180 - 90}deg` }"
        >
          <div class="gauge-needle"></div>
        </div>
        <div
          class="status-knob"
          :style="{ '--knob-angle': `${activeIndex * 45}deg` }"
        >
          <div class="knob-indicator"></div>
        </div>
      </div>

      <div ref="trackRef" class="coverflow-track">
        <slot></slot>
      </div>

      <div class="scale-bar">
        <div
          v-for="(_, index) in totalCount"
          :key="'scale-' + index"
          :class="['scale-tick', { active: activeIndex === index }]"
          @click="$emit('select', index)"
        >
          <div class="tick-line"></div>
          <span class="tick-label">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
        </div>
        <div class="scale-track">
          <div
            class="scale-fill"
            :style="{
              width: `${((activeIndex) / (totalCount - 1)) * 100}%`,
            }"
          ></div>
        </div>
      </div>
    </div>

    <div class="nav-dial">
      <button
        class="dial-btn dial-prev"
        :disabled="activeIndex === 0"
        @click="$emit('prev')"
      >
        <div class="dial-btn-face">
          <ChevronLeftIcon :stroke-width="2.5" />
        </div>
      </button>

      <div class="dial-display">
        <div class="dial-ring">
          <div class="ring-base"></div>
          <div class="ring-inner-bevel"></div>
          <div
            v-for="i in 6"
            :key="'dial-' + i"
            :class="['dial-chamber', { active: activeIndex % 6 === i - 1 }]"
            :style="{ '--chamber-index': i - 1 }"
          >
            <div class="chamber-hole"></div>
            <div class="chamber-rim"></div>
          </div>
          <div class="ring-center-hub"></div>
        </div>
        <div class="dial-center">
          <span class="dial-current">
            {{ String(activeIndex + 1).padStart(2, '0') }}
          </span>
          <span class="dial-separator">/</span>
          <span class="dial-total">
            {{ String(totalCount).padStart(2, '0') }}
          </span>
        </div>
      </div>

      <button
        class="dial-btn dial-next"
        :disabled="activeIndex === totalCount - 1"
        @click="$emit('next')"
      >
        <div class="dial-btn-face">
          <ChevronRightIcon :stroke-width="2.5" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ChevronLeftIcon from '@/pages/Landscape/icons/common/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/pages/Landscape/icons/common/ChevronRightIcon.vue';

defineProps<{
  currentTitle: string;
  activeIndex: number;
  totalCount: number;
}>();

defineEmits<{
  select: [index: number];
  prev: [];
  next: [];
}>();

const trackRef = ref<HTMLElement | null>(null);

defineExpose({ trackRef });
</script>

<style scoped lang="scss" src="./index.scss" />
