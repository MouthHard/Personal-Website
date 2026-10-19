<script setup lang="ts">
  import {
    SeasonsPanelIcon,
    FlowerIcon,
  } from '@/pages/TravelGuide/icons/pages/scenery';

  interface Season {
    name: string;
    description: string;
    activities: string[];
  }

  defineProps<{
    seasons: Season[];
  }>();

  const emit = defineEmits<{
    (e: 'spot-click', spotName: string): void;
  }>();
</script>

<template>
  <section class="panel-section seasons-section">
    <h3 class="panel-title">
      <span class="panel-icon">
        <SeasonsPanelIcon />
      </span>
      季节特色
    </h3>
    <div class="seasons-detail">
      <template v-if="seasons.length > 0">
        <div
          v-for="(season, index) in seasons"
          :key="index"
          class="season-detail-item"
          :data-season="season.name"
          :style="`--index: ${index}`"
        >
          <h4 class="season-name">{{ season.name }}</h4>
          <p class="season-description">{{ season.description }}</p>
          <div class="season-activities">
            <span
              v-for="(activity, actIndex) in season.activities"
              :key="actIndex"
              class="activity-tag"
              :class="`tag-${(actIndex % 4) + 1}`"
              @click="emit('spot-click', activity)"
            >
              {{ activity }}
            </span>
          </div>
        </div>
      </template>
      <div v-else class="empty-seasons">
        <div class="empty-icon"><FlowerIcon /></div>
        <div class="empty-title">暂无季节数据</div>
        <p class="empty-description">该地区暂无最佳季节数</p>
      </div>
    </div>
  </section>
</template>

<style scoped src="./index.scss" lang="scss"></style>