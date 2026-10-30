<script setup lang="ts">
  import { StatsIcon } from '@/pages/TravelGuide/icons/pages/scenery';
  import { ChartIcon } from '@/pages/TravelGuide/icons/common';

  interface Stat {
    value: string | number;
    label: string;
  }

  defineProps<{
    stats: Stat[];
  }>();
</script>

<template>
  <section class="panel-section stats-section">
    <h3 class="panel-title">
      <span class="panel-icon">
        <StatsIcon />
      </span>
      数据概览
    </h3>
    <div class="stats-grid">
      <template v-if="stats.length > 0">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </template>
      <div v-else class="empty-stats">
        <div class="empty-icon"><ChartIcon /></div>
        <div class="empty-text">暂无数据</div>
      </div>
    </div>
  </section>
</template>

<style scoped src="./index.scss" lang="scss"></style>