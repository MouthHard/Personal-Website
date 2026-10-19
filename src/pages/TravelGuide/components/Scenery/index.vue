<template>
  <div class="scenery-module">
    <nav class="tab-navigation" aria-label="风光导航">
      <div class="nav-hud-top">
        <span class="hud-emblem">
          <span class="emblem-plate"></span>
          <span class="emblem-rivet emblem-rivet--l"></span>
          <span class="emblem-rivet emblem-rivet--r"></span>
        </span>
        <span class="hud-status">
          <span class="status-dot"></span>
          <span class="status-bar"></span>
        </span>
      </div>

      <ul class="tab-list">
        <li
          v-for="(tab, index) in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          <span class="item-corner item-corner--tl"></span>
          <span class="item-corner item-corner--tr"></span>
          <span class="item-corner item-corner--bl"></span>
          <span class="item-corner item-corner--br"></span>

          <span class="item-rivet item-rivet--tl"></span>
          <span class="item-rivet item-rivet--tr"></span>
          <span class="item-rivet item-rivet--bl"></span>
          <span class="item-rivet item-rivet--br"></span>

          <span class="item-indicator"></span>

          <span class="item-icon-housing">
            <span class="housing-ring"></span>
            <span class="housing-glow"></span>
            <component :is="iconMap[tab.id]" width="24" height="24" class="item-icon" />
          </span>

          <span class="item-body">
            <span class="item-text">{{ tab.name }}</span>

          </span>

          <span class="item-scan-line"></span>
          <span class="item-energy-stream"></span>
        </li>
      </ul>

      <div class="nav-hud-bottom">
        <span class="hud-tick" v-for="t in 12" :key="t"></span>
      </div>
    </nav>

    <div class="tab-content">
      <component
        :is="
          activeTab === 'discover'
            ? DiscoverSubModule
            : activeTab === 'spots'
              ? SpotsSubModule
              : ExperienceSubModule
        "
        :key="provinceId + '-' + activeTab"
        :province-id="provinceId"
        :spots-search-query="activeTab === 'spots' ? spotsSearchQuery : undefined"
        class="tab-panel active"
        @navigate-to-spot="handleNavigateToSpot"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, markRaw } from 'vue';
  import DiscoverSubModule from './Discover/index.vue';
  import SpotsSubModule from './Spots/index.vue';
  import ExperienceSubModule from './Experience/index.vue';
  import { useTravelGuideStore } from '@/stores/travelGuide';
  import { useSceneryTabState } from './useSceneryTabState';
  import SparklesIcon from '../../icons/common/SparklesIcon.vue';
  import MapIcon from '../../icons/common/MapIcon.vue';
  import TheaterMasksIcon from '../../icons/common/TheaterMasksIcon.vue';
  import './index.scss';

  const travelStore = useTravelGuideStore();

  defineProps<{
    provinceId: string;
  }>();

  const { sceneryActiveTab: activeTab } = useSceneryTabState();
  const spotsSearchQuery = ref('');

  const handleNavigateToSpot = (spotName: string) => {
    spotsSearchQuery.value = spotName;
    activeTab.value = 'spots';
  };

  const tabs = computed(() => travelStore.sceneryConfig?.sceneryTabs || []);

  const iconMap: Record<string, any> = {
    discover: markRaw(SparklesIcon),
    spots: markRaw(MapIcon),
    experience: markRaw(TheaterMasksIcon),

  };

  const switchTab = (tabId: string) => {
    activeTab.value = tabId;
  };
</script>
