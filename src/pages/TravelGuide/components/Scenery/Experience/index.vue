<template>
  <div class="scenery-experience">
    <div class="sub-tab-nav">
      <div class="nav-spectrum"></div>
      <button
        v-for="tab in subTabs"
        :key="tab.id"
        class="sub-tab-btn"
        :class="{ active: activeSubTab === tab.id }"
        @click="activeSubTab = tab.id"
      >
        <span class="tab-glitch"></span>
        <span class="sub-tab-icon-housing">
          <component :is="iconMap[tab.id]" width="22" height="22" class="sub-tab-icon" />
        </span>
        <span class="sub-tab-text">{{ tab.name }}</span>

        <span class="sub-tab-wave"></span>
      </button>
      <div class="nav-spectrum nav-spectrum--end"></div>
    </div>

    <div class="sub-tab-content">
      <component
        :is="activeComponent"
        v-bind="activeProps"
        :key="activeSubTab"
        class="sub-tab-panel active"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, markRaw } from 'vue';
  import { useTravelGuideStore } from '@/stores/travelGuide';
  import { useSceneryTabState } from '../useSceneryTabState';
  import CraftWorkshops from './CraftWorkshops/index.vue';
  import Performances from './Performances/index.vue';
  import OutdoorAdventure from './OutdoorAdventure/index.vue';
  import Festivals from './Festivals/index.vue';
  import WellnessRetreat from './WellnessRetreat/index.vue';
  import PaletteIcon from '../../../icons/pages/scenery/PaletteIcon.vue';
  import TheaterMasksIcon from '../../../icons/pages/scenery/TheaterMasksIcon.vue';
  import MapIcon from '../../../icons/common/MapIcon.vue';
  import ConfettiIcon from '../../../icons/pages/scenery/ConfettiIcon.vue';
  import LeafIcon from '../../../icons/common/LeafIcon.vue';

  const travelStore = useTravelGuideStore();

  const props = defineProps<{
    provinceId: string;
  }>();

  const { experienceActiveSubTab: activeSubTab } = useSceneryTabState();
  const craftWorkshops = ref<any[]>([]);
  const performances = ref<any[]>([]);
  const outdoorAdventure = ref<any[]>([]);
  const festivals = ref<any[]>([]);
  const wellnessRetreat = ref<any[]>([]);

  const subTabs = [
    { id: 'craft', name: '手作工坊' },
    { id: 'performance', name: '演艺观赏' },
    { id: 'outdoor', name: '户外探险' },
    { id: 'festival', name: '节庆时令' },
    { id: 'wellness', name: '休闲养生' },
  ];

  const iconMap: Record<string, any> = {
    craft: markRaw(PaletteIcon),
    performance: markRaw(TheaterMasksIcon),
    outdoor: markRaw(MapIcon),
    festival: markRaw(ConfettiIcon),
    wellness: markRaw(LeafIcon),
  };

  const activeComponent = computed<any>(() => {
    switch (activeSubTab.value) {
      case 'craft': return CraftWorkshops;
      case 'performance': return Performances;
      case 'outdoor': return OutdoorAdventure;
      case 'festival': return Festivals;
      case 'wellness': return WellnessRetreat;
      default: return CraftWorkshops;
    }
  });

  const activeProps = computed<Record<string, any>>(() => {
    const pid = props.provinceId;
    switch (activeSubTab.value) {
      case 'craft': return { items: craftWorkshops.value || [], provinceId: pid };
      case 'performance': return { items: performances.value || [], provinceId: pid };
      case 'outdoor': return { items: outdoorAdventure.value || [], provinceId: pid };
      case 'festival': return { festivals: festivals.value || [], provinceId: pid };
      case 'wellness': return { items: wellnessRetreat.value || [], provinceId: pid };
      default: return {};
    }
  });

  const loadProvinceData = async () => {
    try {
      const data = await travelStore.getScenery(props.provinceId);
      if (data) {
        const nextCraft = (data as any).craftWorkshops || [];
        const nextPerf = (data as any).performances || [];
        const nextOutdoor = (data as any).outdoorAdventure || [];
        const nextFest = (data as any).festivals || [];
        const nextWellness = (data as any).wellnessRetreat || [];
        if (craftWorkshops.value !== nextCraft) craftWorkshops.value = nextCraft;
        if (performances.value !== nextPerf) performances.value = nextPerf;
        if (outdoorAdventure.value !== nextOutdoor) outdoorAdventure.value = nextOutdoor;
        if (festivals.value !== nextFest) festivals.value = nextFest;
        if (wellnessRetreat.value !== nextWellness) wellnessRetreat.value = nextWellness;
      }
    } catch (error) {
      console.error('Failed to load scenery data:', error);
    }
  };

  watch(
    () => props.provinceId,
    () => {
      loadProvinceData();
    },
    { immediate: true },
  );
</script>

<style scoped src="./index.scss" lang="scss" />
