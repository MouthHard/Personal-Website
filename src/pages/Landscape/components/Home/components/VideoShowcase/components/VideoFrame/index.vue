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
        <span class="perf-strip perf-left" aria-hidden="true"></span>
        <span class="perf-strip perf-right" aria-hidden="true"></span>

        <div class="bar-plate">
          <div class="lamp-cluster" aria-hidden="true">
            <span class="lamp lamp-rec"></span>
            <span class="lamp lamp-standby"></span>
            <span class="lamp lamp-ready"></span>
          </div>

          <div class="title-block">
            <span :key="currentTitle" class="title-text">
              {{ currentTitle }}
            </span>
          </div>

          <span class="leader-line" aria-hidden="true">
            <span class="leader-spark"></span>
            <span class="leader-head"></span>
          </span>

          <div class="status-reel" aria-hidden="true">
            <span
              class="reel-ring"
              :style="{
                '--reel-progress': `${((activeIndex + 1) / Math.max(totalCount, 1)) * 360}deg`,
              }"
            ></span>
            <span
              class="reel-body"
              :style="{ '--reel-turn': `${activeIndex * 60}deg` }"
            >
              <span class="reel-spokes"></span>
              <span class="reel-hub"></span>
            </span>
          </div>
        </div>
      </div>

      <div ref="trackRef" class="coverflow-track">
        <slot></slot>
      </div>

      <div class="scale-bar">
        <div class="scale-caption" aria-hidden="true">
          <span class="caption-label">分镜</span>
          <span class="caption-hint">点任意一格切换</span>
        </div>

        <div class="scale-rail">
          <span class="rail-plate" aria-hidden="true">
            <span
              class="rail-progress"
              :style="{
                width: `${((activeIndex + 1) / Math.max(totalCount, 1)) * 100}%`,
              }"
            ></span>
          </span>

          <span
            class="rail-playhead"
            aria-hidden="true"
            :style="{
              left: `${((activeIndex + 0.5) / Math.max(totalCount, 1)) * 100}%`,
            }"
          ></span>

          <button
            v-for="(_, index) in totalCount"
            :key="'scale-' + index"
            type="button"
            :class="[
              'scale-tick',
              { active: activeIndex === index, played: index < activeIndex },
            ]"
            :aria-label="`切换到第 ${index + 1} 段`"
            :aria-current="activeIndex === index ? 'true' : undefined"
            @click="$emit('select', index)"
          >
            <span class="tick-frame"></span>
            <span class="tick-label">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </button>
        </div>
      </div>

      <div class="frame-overlay" aria-hidden="true">
        <span class="film-grain"></span>
        <span class="film-leak leak-a"></span>
        <span class="film-leak leak-b"></span>
        <span class="film-vignette"></span>
        <span class="edge-code">SAFETY FILM · 35 MM · 24 FPS</span>
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
          <span class="dial-cell">
            <span :key="'dial-cur-' + activeIndex" class="dial-digit">
              {{ pad(activeIndex + 1) }}
            </span>
          </span>
          <span class="dial-separator">/</span>
          <span class="dial-cell is-total">
            <span class="dial-digit">{{ pad(totalCount) }}</span>
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

  const pad = (value: number) => String(value).padStart(2, '0');

  defineExpose({ trackRef });
</script>

<style scoped lang="scss" src="./index.scss" />
