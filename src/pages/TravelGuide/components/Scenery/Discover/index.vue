<template>
  <div class="scenery-discover">
    <div class="sub-tab-nav">
      <div class="nav-rail"></div>
      <button
        v-for="(tab, index) in subTabs"
        :key="tab.id"
        class="sub-tab-btn"
        :class="{ active: activeSubTab === tab.id }"
        @click="activeSubTab = tab.id"
      >
        <span class="tab-grip tab-grip--left"></span>
        <span class="tab-grip tab-grip--right"></span>

        <span class="sub-tab-icon-housing">
          <component :is="iconMap[tab.id]" width="18" height="18" class="sub-tab-icon" />
        </span>
        <span class="sub-tab-text">{{ tab.name }}</span>

        <span class="sub-tab-beam"></span>
      </button>
      <div class="nav-rail nav-rail--end"></div>
    </div>

    <div class="sub-tab-content">
      <component
        :is="activeComponent"
        :key="activeSubTab"
        :scenery-data="sceneryData"
        :loading="loading"
        class="sub-tab-panel active"
        @navigate-to-spot="onNavigateToSpot"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch, markRaw } from 'vue';
  import { useTravelGuideStore } from '@/stores/travelGuide';
  import type { SceneryData } from '@/typesOfPages/travelGuide';
  import Overview from './Overview/index.vue';
  import Ranking from './Ranking/index.vue';
  import Theme from './Theme/index.vue';
  import ChartIcon from '../../../icons/pages/scenery/ChartIcon.vue';
  import StarIcon from '../../../icons/common/StarIcon.vue';
  import GalaxyIcon from '../../../icons/pages/scenery/GalaxyIcon.vue';

  const travelStore = useTravelGuideStore();

  const props = defineProps<{
    provinceId: string;
  }>();

  const emit = defineEmits<{
    (e: 'navigate-to-spot', spotName: string): void;
  }>();

  const onNavigateToSpot = (spotName: string) => {
    emit('navigate-to-spot', spotName);
  };

  const activeSubTab = ref('overview');
  const sceneryData = ref<SceneryData | null>(null);
  const loading = ref(false);

  const subTabs = [
    { id: 'overview', name: '概览' },
    { id: 'ranking', name: '必打卡' },
    { id: 'theme', name: '主题推荐' },
  ];

  const iconMap: Record<string, any> = {
    overview: markRaw(ChartIcon),
    ranking: markRaw(StarIcon),
    theme: markRaw(GalaxyIcon),
  };

  const activeComponent = computed(() => {
    switch (activeSubTab.value) {
      case 'overview': return Overview;
      case 'ranking': return Ranking;
      case 'theme': return Theme;
      default: return Overview;
    }
  });

  const loadData = async (province: string) => {
    loading.value = true;
    const data = await travelStore.getScenery(province);
    sceneryData.value = data;
    loading.value = false;
  };

  watch(
    () => props.provinceId,
    (newProvince) => {
      loadData(newProvince);
    },
    { immediate: true },
  );

  onMounted(() => {
    loadData(props.provinceId);
  });
</script>

<style scoped src="./index.scss" lang="scss" />
