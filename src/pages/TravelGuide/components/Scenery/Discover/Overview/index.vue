<template>
  <div class="discover-overview">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    <template v-else-if="sceneryData">
      <Gallery :scenery-data="sceneryData" @navigate-to-spot="$emit('navigate-to-spot', $event)" />
      <ControlPanel
        :scenery-data="sceneryData"
        @navigate-to-spot="$emit('navigate-to-spot', $event)"
      />
    </template>
    <div v-else class="error-state">
      <p>加载数据失败，请重试</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Gallery from './Gallery/index.vue';
  import ControlPanel from './ControlPanel/index.vue';
  import type { SceneryData } from '@/typesOfPages/travelGuide';

  defineProps<{
    sceneryData: SceneryData | null;
    loading: boolean;
  }>();

  defineEmits<{
    (e: 'navigate-to-spot', spotName: string): void;
  }>();
</script>

<style scoped src="./index.scss" lang="scss" />