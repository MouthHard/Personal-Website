<template>
  <div class="scenery-spots">
    <SearchBox
      ref="searchBoxRef"
      :selected-type="selectedType"
      :sort-by="sortBy"
      :all-spots="allSpots"
      :external-query="props.spotsSearchQuery"
      @update:selected-type="selectedType = $event"
      @update:sort-by="sortBy = $event"
      @debounced-query="debouncedQuery = $event"
    />

    <div v-if="debouncedQuery && filteredSpots.length > 0" class="result-count-bar">
      找到 <span class="result-count-num">{{ filteredSpots.length }}</span> 个与
      <span class="result-count-keyword">"{{ debouncedQuery }}"</span> 相关的景点
    </div>

    <SpotsList
      :spots="filteredSpots"
      :highlight-keyword="debouncedQuery"
      @open-detail="openSpotDetail"
      @toggle-favorite="toggleFavorite"
      @toggle-like="toggleLike"
      @toggle-want="toggleWant"
      @toggle-been="toggleBeen"
      @navigate="handleNavigate"
      @share="handleShare"
      @reset="clearAll"
    />

    <ScenerySpotModal
      :visible="modalVisible"
      :spot="selectedSpot"
      @close="closeSpotModal"
      @toggle-favorite="toggleFavorite"
      @toggle-like="toggleLike"
      @toggle-want="toggleWant"
      @toggle-been="toggleBeen"
      @share="handleShare"
      @navigate="handleNavigate"
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
  import { computed, ref, watch } from 'vue';
  import type { SceneryData, ScenerySpot } from '@/typesOfPages/travelGuide';
  import { useTravelGuideStore } from '@/stores/travelGuide';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import SearchBox from './SearchBox/index.vue';
  import SpotsList from './SpotsList/index.vue';
  import ScenerySpotModal from '../../ScenerySpotModal/index.vue';
  import TravelShareModal from '../../TravelShareModal/index.vue';
  import { useTravelShare } from '../../TravelShareModal/useTravelShare';

  const travelStore = useTravelGuideStore();
  const props = defineProps<{
    provinceId: string;
    spotsSearchQuery?: string;
  }>();

  const debouncedQuery = ref('');
  const selectedType = ref('');
  const sortBy = ref('default');
  const sceneryData = ref<SceneryData | null>(null);
  const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null);

  const allSpots = computed<ScenerySpot[]>(() => sceneryData.value?.spots || []);

  const filteredSpots = computed(() => {
    let spots = allSpots.value;

    if (debouncedQuery.value) {
      const query = debouncedQuery.value.toLowerCase();
      spots = spots.filter((spot) => {
        if (spot.name.toLowerCase().includes(query)) return true;
        if (spot.description.toLowerCase().includes(query)) return true;
        if (spot.location.toLowerCase().includes(query)) return true;
        if (spot.highlight?.toLowerCase().includes(query)) return true;
        if (spot.level?.toLowerCase().includes(query)) return true;
        if (spot.landscapeType?.toLowerCase().includes(query)) return true;
        if (spot.cultureType?.toLowerCase().includes(query)) return true;
        if ((spot.tags || []).some((t) => t.toLowerCase().includes(query))) return true;
        if ((spot.landformTags || []).some((t) => t.toLowerCase().includes(query))) return true;
        if ((spot.audienceTags || []).some((t) => t.toLowerCase().includes(query))) return true;
        if ((spot.bestSeason || []).some((t) => t.toLowerCase().includes(query))) return true;
        return false;
      });
    }

    if (selectedType.value) {
      spots = spots.filter((spot) => spot.type === selectedType.value);
    }

    const sorted = [...spots];
    if (sortBy.value === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy.value === 'hot') {
      sorted.sort((a, b) => (b.popularity || b.tags?.length || 0) - (a.popularity || a.tags?.length || 0));
    }
    return sorted;
  });

  const clearAll = () => {
    searchBoxRef.value?.clear();
    selectedType.value = '';
    sortBy.value = 'default';
  };

  const {
    toggleSpotFavorite: toggleSpotFavoriteRaw,
    toggleSpotWant: toggleSpotWantRaw,
    toggleSpotBeen: toggleSpotBeenRaw,
    toggleSpotLike: toggleSpotLikeRaw,
    isSpotFavorite,
    isSpotWant,
    isSpotBeen,
    isSpotLike,
  } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();

  const toggleFavorite = (spotId: string): void => {
    const wasFav = isSpotFavorite(spotId);
    toggleSpotFavoriteRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'info', message: wasFav ? `已取消收藏 ${name}` : `已收藏 ${name}` });
  };
  const toggleLike = (spotId: string): void => {
    const wasLiked = isSpotLike(spotId);
    toggleSpotLikeRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'like', message: wasLiked ? `已取消点赞 ${name}` : `已点赞 ${name}` });
  };
  const toggleWant = (spotId: string): void => {
    const wasWant = isSpotWant(spotId);
    toggleSpotWantRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'want', message: wasWant ? `已移除想去 ${name}` : `已加入想去 ${name}` });
  };
  const toggleBeen = (spotId: string): void => {
    const wasBeen = isSpotBeen(spotId);
    toggleSpotBeenRaw(spotId);
    const spot = allSpots.value.find((s) => s.id === spotId);
    const name = spot?.name ?? spotId;
    showToast({ type: 'eaten', message: wasBeen ? `已移除去过 ${name}` : `已标记去过 ${name}` });
  };

  const handleNavigate = (spotId: string) => {
    const spot = allSpots.value.find((s) => s.id === spotId);
    if (spot) {
      const query = encodeURIComponent(`${spot.name} ${spot.location}`);
      window.open(`https://www.amap.com/search?query=${query}`, '_blank', 'noopener,noreferrer');
    }
  };

  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const handleShare = (spotId: string) => {
    const spot = allSpots.value.find((s) => s.id === spotId);
    if (spot) {
      openShare(
        spot.name,
        `${spot.name}｜${spot.location}｜评分 ${spot.rating ?? 4.5}｜门票 ${spot.ticketPrice}`,
      );
      showToast({ type: 'share', message: `正在分享 ${spot.name}` });
    }
  };

  const modalVisible = ref(false);
  const selectedSpot = ref<ScenerySpot | null>(null);

  const openSpotDetail = (spotId: string) => {
    const spot = allSpots.value.find((s) => s.id === spotId);
    if (spot) {
      selectedSpot.value = spot;
      modalVisible.value = true;
    }
  };

  const closeSpotModal = () => {
    modalVisible.value = false;
    selectedSpot.value = null;
  };

  const loadProvinceData = async () => {
    try {
      const data = await travelStore.getScenery(props.provinceId);
      sceneryData.value = data;
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

<style scoped lang="scss" src="./index.scss"></style>
