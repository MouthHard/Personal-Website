<template>
  <section v-if="seasonal.length > 0" class="seasonal-section">
    <div class="ambient-glow"></div>

    <header class="section-header">
      <div class="header-left">
        <div class="header-icon-wrap">
          <CalendarIcon class="header-icon" />
        </div>
        <div class="header-titles">
          <h2 class="header-title">当季时令</h2>
          <p class="header-subtitle">现在吃什么 · 四季美食推荐</p>
        </div>
      </div>

      <nav class="solar-term-belt">
        <button
          v-for="season in seasonal"
          :key="season.season"
          class="term-segment"
          :class="[
            { active: selectedSeason === season.season },
            `term-${season.season}`,
          ]"
          @click="selectedSeason = season.season"
        >
          <component :is="getSeasonIcon(season.season)" class="segment-icon" />
          <span class="segment-name">{{ season.seasonName }}</span>
        </button>
      </nav>
    </header>

    <div class="seasonal-content">
      <Transition name="season-fade" mode="out-in">
        <div
          v-if="currentSeason"
          :key="currentSeason.season"
          class="season-panel"
          :class="`panel-${currentSeason.season}`"
        >
          <SeasonAside :current-season="currentSeason" />
          <SeasonFoods :current-season="currentSeason" :all-foods="allFoods" />
        </div>
      </Transition>
    </div>
  </section>
</template>

<script lang="ts">
import { type Component } from 'vue';
import SunIcon from '../../../icons/common/SunIcon.vue';
import LeafIcon from '../../../icons/common/LeafIcon.vue';
import SnowflakeIcon from '../../../icons/common/SnowflakeIcon.vue';
import LeafAutumnIcon from '../../../icons/common/LeafAutumnIcon.vue';

const SEASON_ICONS: Record<string, Component> = {
  spring: LeafIcon,
  summer: SunIcon,
  autumn: LeafAutumnIcon,
  winter: SnowflakeIcon,
};
</script>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import CalendarIcon from '../../../icons/common/CalendarIcon.vue';

  import SeasonAside from './components/SeasonAside/index.vue';
  import SeasonFoods from './components/SeasonFoods/index.vue';

  import type { Food, FoodSeasonal } from '@/typesOfPages/travelGuide';

  interface Props {
    seasonal: FoodSeasonal[];
    allFoods: Food[];
  }

  const props = defineProps<Props>();

  const selectedSeason = ref(props.seasonal[0]?.season || '');

  const currentSeason = computed(() => {
    return props.seasonal.find((s) => s.season === selectedSeason.value) || null;
  });


  const getSeasonIcon = (season: string): Component => {
    return SEASON_ICONS[season] || CalendarIcon;
  };
</script>

<style scoped lang="scss" src="./index.scss" />
