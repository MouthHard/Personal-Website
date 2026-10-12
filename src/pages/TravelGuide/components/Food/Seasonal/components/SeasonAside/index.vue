<template>
  <aside v-if="currentSeason" class="season-aside">
    <div class="aside-icon-wrap">
      <component :is="getSeasonIcon(currentSeason.season)" class="aside-icon" />
    </div>
    <h3 class="aside-title">{{ currentSeason.seasonName }}时令</h3>
    <div class="aside-tags">
      <span class="aside-tag">{{ getSeasonKeyword(currentSeason.season) }}</span>
      <span class="aside-tag">{{ getSeasonTempo(currentSeason.season) }}</span>
    </div>
    <p class="aside-desc">{{ currentSeason.description }}</p>
    <div class="aside-footer">
      <span class="footer-text">推荐 {{ currentSeason.foods.length }} 道</span>
    </div>
  </aside>
</template>

<script lang="ts">
import { type Component } from 'vue';
import CalendarIcon from '../../../../../icons/common/CalendarIcon.vue';
import SunIcon from '../../../../../icons/common/SunIcon.vue';
import LeafIcon from '../../../../../icons/common/LeafIcon.vue';
import SnowflakeIcon from '../../../../../icons/common/SnowflakeIcon.vue';
import LeafAutumnIcon from '../../../../../icons/common/LeafAutumnIcon.vue';

const SEASON_ICONS: Record<string, Component> = {
  spring: LeafIcon,
  summer: SunIcon,
  autumn: LeafAutumnIcon,
  winter: SnowflakeIcon,
};

const SEASON_KEYWORDS: Record<string, string> = {
  spring: '清明新茶',
  summer: '荷塘清凉',
  autumn: '秋收丰稔',
  winter: '腊味暖冬',
};

const SEASON_TEMPO: Record<string, string> = {
  spring: '温润生发',
  summer: '炎热当令',
  autumn: '燥凉交替',
  winter: '寒藏蓄补',
};
</script>

<script setup lang="ts">
  import type { FoodSeasonal } from '@/typesOfPages/travelGuide';

  defineProps<{
    currentSeason: FoodSeasonal | null;
  }>();


  const getSeasonIcon = (season: string): Component => {
    return SEASON_ICONS[season] || CalendarIcon;
  };

  const getSeasonKeyword = (season: string): string => {
    return SEASON_KEYWORDS[season] || '时令';
  };

  const getSeasonTempo = (season: string): string => {
    return SEASON_TEMPO[season] || '当季';
  };
</script>

<style scoped lang="scss" src="./index.scss" />