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
          v-for="(tab ) in tabs"
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

    <ScenerySpotModal
      :visible="spotModalVisible"
      :spot="selectedSpot"
      @close="closeSpotModal"
      @toggle-like="toggleSpotLike"
      @toggle-want="toggleSpotWant"
      @toggle-been="toggleSpotBeen"
      @share="handleSpotShare"
      @navigate="handleSpotNavigate"
    />

    <TravelShareModal
      :visible="shareVisible"
      :title="shareTitle"
      :share-text="shareText"
      :share-url="shareUrl"
      @close="closeShare"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, markRaw, watch } from 'vue';
  import type { SceneryData, ScenerySpot } from '@/typesOfPages/travelGuide';
  import DiscoverSubModule from './Discover/index.vue';
  import SpotsSubModule from './Spots/index.vue';
  import ExperienceSubModule from './Experience/index.vue';
  import ScenerySpotModal from '../ScenerySpotModal/index.vue';
  import TravelShareModal from '../TravelShareModal/index.vue';
  import { useTravelGuideStore } from '@/stores/travelGuide';
  import { useSceneryTabState } from './useSceneryTabState';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '../TravelShareModal/useTravelShare';
  import SparklesIcon from '../../icons/common/SparklesIcon.vue';
  import MapIcon from '../../icons/common/MapIcon.vue';
  import TheaterMasksIcon from '../../icons/common/TheaterMasksIcon.vue';
  import './index.scss';

  const travelStore = useTravelGuideStore();

  const props = defineProps<{
    provinceId: string;
  }>();

  const { sceneryActiveTab: activeTab } = useSceneryTabState();
  const spotsSearchQuery = ref('');

  const sceneryData = ref<SceneryData | null>(null);

  const loadSceneryData = async () => {
    try {
      sceneryData.value = await travelStore.getScenery(props.provinceId);
    } catch (error) {
      console.error('Failed to load scenery data:', error);
    }
  };

  watch(() => props.provinceId, () => { loadSceneryData(); }, { immediate: true });

  const spotModalVisible = ref(false);
  const selectedSpot = ref<ScenerySpot | null>(null);

  const handleNavigateToSpot = (spotName: string) => {
    const spot = (sceneryData.value?.spots || []).find(
      (s) => s.name === spotName || s.id === spotName,
    );
    if (spot) {
      selectedSpot.value = spot;
      spotModalVisible.value = true;
    } else {
      spotsSearchQuery.value = spotName;
      activeTab.value = 'spots';
    }
  };

  const closeSpotModal = () => {
    spotModalVisible.value = false;
    selectedSpot.value = null;
  };

  const {
    toggleSpotLike: toggleSpotLikeRaw,
    toggleSpotWant: toggleSpotWantRaw,
    toggleSpotBeen: toggleSpotBeenRaw,
    isSpotLike,
    isSpotWant,
    isSpotBeen,
  } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const toggleSpotLike = (spotId: string) => {
    const wasLiked = isSpotLike(spotId);
    toggleSpotLikeRaw(spotId);
    const spot = (sceneryData.value?.spots || []).find((s) => s.id === spotId);
    showToast({ type: 'like', message: wasLiked ? `已取消点赞 ${spot?.name ?? spotId}` : `已点赞 ${spot?.name ?? spotId}` });
  };
  const toggleSpotWant = (spotId: string) => {
    const wasWant = isSpotWant(spotId);
    toggleSpotWantRaw(spotId);
    const spot = (sceneryData.value?.spots || []).find((s) => s.id === spotId);
    showToast({ type: 'want', message: wasWant ? `已移除想去 ${spot?.name ?? spotId}` : `已加入想去 ${spot?.name ?? spotId}` });
  };
  const toggleSpotBeen = (spotId: string) => {
    const wasBeen = isSpotBeen(spotId);
    toggleSpotBeenRaw(spotId);
    const spot = (sceneryData.value?.spots || []).find((s) => s.id === spotId);
    showToast({ type: 'eaten', message: wasBeen ? `已移除去过 ${spot?.name ?? spotId}` : `已标记去过 ${spot?.name ?? spotId}` });
  };

  const handleSpotShare = (spotId: string) => {
    const spot = (sceneryData.value?.spots || []).find((s) => s.id === spotId);
    if (spot) {
      openShare(spot.name, `${spot.name}｜${spot.location}｜评分 ${spot.rating ?? 4.5}｜门票 ${spot.ticketPrice || '免费'}`);
    }
  };

  const handleSpotNavigate = (spotId: string) => {
    const spot = (sceneryData.value?.spots || []).find((s) => s.id === spotId);
    if (spot) {
      const query = encodeURIComponent(`${spot.name} ${spot.location}`);
      window.open(`https://www.amap.com/search?query=${query}`, '_blank', 'noopener,noreferrer');
    }
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
