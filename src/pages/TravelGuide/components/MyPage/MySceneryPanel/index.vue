<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { ScenerySpot, ExperienceItem } from '@/typesOfPages/travelGuide';
  import MyEmpty from '../MyEmpty/index.vue';
  import ScenerySpotModal from '../../ScenerySpotModal/index.vue';
  import TravelShareModal from '../../TravelShareModal/index.vue';
  import { useTravelShare } from '../../TravelShareModal/useTravelShare';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import SpotDisplay from './SpotDisplay/index.vue';
  import OutdoorDisplay from './OutdoorDisplay/index.vue';
  import CraftDisplay from './CraftDisplay/index.vue';
  import PerformanceDisplay from './PerformanceDisplay/index.vue';
  import WellnessDisplay from './WellnessDisplay/index.vue';
  import FestivalDisplay from './FestivalDisplay/index.vue';

  const {
    isSpotLike,
    isSpotWant,
    isSpotBeen,
    toggleSpotLike,
    toggleSpotWant,
    toggleSpotBeen,
  } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  interface ExpByCat {
    [key: string]: { favorites: ExperienceItem[]; want: ExperienceItem[]; been: ExperienceItem[] };
  }

  const props = defineProps<{
    spotWant: ScenerySpot[];
    spotBeen: ScenerySpot[];
    routeDone: ExperienceItem[];
    experienceFavorites: ExperienceItem[];
    experienceWant: ExperienceItem[];
    experienceBeen: ExperienceItem[];
    experiencesByCategory?: ExpByCat;
    activeSub?: string;
  }>();

  const emit = defineEmits<{
    (e: 'remove-spot-want', id: string): void;
    (e: 'remove-spot-been', id: string): void;
    (e: 'remove-route-done', id: string): void;
    (e: 'remove-experience-favorite', id: string, provinceId: string, category: string): void;
    (e: 'remove-experience-want', id: string, provinceId: string, category: string): void;
    (e: 'remove-experience-been', id: string, provinceId: string, category: string): void;
  }>();

  const SPOT_KEYS = ['spotBeen', 'spotWant'];
  const CAT_KEYS = [
    'outdoorFav', 'outdoorWant', 'outdoorBeen',
    'craftFav', 'craftWant', 'craftBeen',
    'performanceFav', 'performanceWant', 'performanceBeen',
    'wellnessFav', 'wellnessWant', 'wellnessBeen',
    'festivalFav', 'festivalWant', 'festivalBeen',
  ];
  const ALL_KEYS = [...SPOT_KEYS, ...CAT_KEYS];

  const activeSubSafe = computed(() => {
    const v = props.activeSub ?? '';
    return ALL_KEYS.includes(v) ? v : 'spotBeen';
  });

  type DisplayMode = 'spot' | 'outdoor' | 'craft' | 'performance' | 'wellness' | 'festival';
  const displayMode = computed<DisplayMode>(() => {
    const key = activeSubSafe.value;
    if (SPOT_KEYS.includes(key)) return 'spot';
    if (key.startsWith('outdoor')) return 'outdoor';
    if (key.startsWith('craft')) return 'craft';
    if (key.startsWith('performance')) return 'performance';
    if (key.startsWith('wellness')) return 'wellness';
    if (key.startsWith('festival')) return 'festival';
    return 'spot';
  });

  const currentSpots = computed<ScenerySpot[]>(() => {
    if (activeSubSafe.value === 'spotBeen') return props.spotBeen;
    if (activeSubSafe.value === 'spotWant') return props.spotWant;
    return [];
  });

  const currentExperiences = computed<ExperienceItem[]>(() => {
    const key = activeSubSafe.value;
    if (!CAT_KEYS.includes(key)) return [];
    const cat = key.replace(/(Fav|Want|Been)$/, '');
    const state = key.endsWith('Fav') ? 'favorites' : key.endsWith('Want') ? 'want' : 'been';
    return props.experiencesByCategory?.[cat]?.[state] ?? [];
  });

  const isEmpty = computed(
    () => currentSpots.value.length === 0 && currentExperiences.value.length === 0,
  );

  const emptyText = computed(() => {
    const key = activeSubSafe.value;
    if (key === 'spotBeen') return { title: '还没有去过的景点', hint: '在景点卡片点击"去过"即可标记足迹' };
    if (key === 'spotWant') return { title: '想去清单是空的', hint: '在景点详情点击"想去"即可加入' };
    const cat = key.replace(/(Fav|Want|Been)$/, '');
    const state = key.endsWith('Fav') ? 'Fav' : key.endsWith('Want') ? 'Want' : 'Been';
    const catLabel: Record<string, string> = {
      outdoor: '户外探险', craft: '工坊体验', performance: '演艺节目',
      wellness: '休闲养生', festival: '节庆日历',
    };
    const label = catLabel[cat] ?? '体验';
    if (state === 'Fav') return { title: `还没有收藏的${label}`, hint: `在${label}卡片点击"收藏"即可加入` };
    if (state === 'Want') return { title: `想去的${label}是空的`, hint: `在${label}卡片点击"想去"即可加入` };
    return { title: `还没有已体验的${label}`, hint: `在${label}卡片点击"已体验"即可记录` };
  });

  const handleRemoveSpot = (id: string): void => {
    if (activeSubSafe.value === 'spotBeen') emit('remove-spot-been', id);
    else emit('remove-spot-want', id);
  };
  const handleRemoveExp = (id: string, provinceId: string, category: string): void => {
    const key = activeSubSafe.value;
    if (key.endsWith('Want')) emit('remove-experience-want', id, provinceId, category);
    else if (key.endsWith('Been')) emit('remove-experience-been', id, provinceId, category);
    else emit('remove-experience-favorite', id, provinceId, category);
  };

  // ===== 景点详情弹窗 =====
  const modalVisible = ref(false);
  const selectedSpot = ref<ScenerySpot | null>(null);

  const openSpotModal = (spot: ScenerySpot): void => {
    selectedSpot.value = spot;
    modalVisible.value = true;
  };
  const closeSpotModal = (): void => {
    modalVisible.value = false;
    selectedSpot.value = null;
  };
  const toggleLike = (spotId: string): void => {
    const wasLiked = isSpotLike(spotId);
    toggleSpotLike(spotId);
    const spot = currentSpots.value.find((s) => s.id === spotId);
    showToast({ type: 'like', message: wasLiked ? `已取消点赞 ${spot?.name ?? ''}` : `已点赞 ${spot?.name ?? ''}` });
  };
  const toggleWant = (spotId: string): void => {
    const wasWant = isSpotWant(spotId);
    toggleSpotWant(spotId);
    const spot = currentSpots.value.find((s) => s.id === spotId);
    showToast({ type: 'want', message: wasWant ? `已移除想去 ${spot?.name ?? ''}` : `已加入想去 ${spot?.name ?? ''}` });
  };
  const toggleBeen = (spotId: string): void => {
    const wasBeen = isSpotBeen(spotId);
    toggleSpotBeen(spotId);
    const spot = currentSpots.value.find((s) => s.id === spotId);
    showToast({ type: 'success', message: wasBeen ? `已移除去过 ${spot?.name ?? ''}` : `已标记去过 ${spot?.name ?? ''}` });
  };
  const handleShare = (spotId: string): void => {
    const spot = currentSpots.value.find((s) => s.id === spotId);
    if (spot) {
      openShare(spot.name, `${spot.name}｜${spot.location}｜评分 ${spot.rating ?? 4.5}`);
      showToast({ type: 'share', message: `正在分享 ${spot.name}` });
    }
  };
  const handleNavigate = (spotId: string): void => {
    const spot = currentSpots.value.find((s) => s.id === spotId);
    if (spot) {
      const query = encodeURIComponent(`${spot.name} ${spot.location}`);
      window.open(`https://www.amap.com/search?query=${query}`, '_blank', 'noopener,noreferrer');
    }
  };
</script>

<template>
  <div class="my-scenery-panel" :data-mode="displayMode">
    <div class="panel-body">
      <MyEmpty v-if="isEmpty" :title="emptyText.title" :hint="emptyText.hint" />

      <SpotDisplay
        v-else-if="displayMode === 'spot'"
        :spots="currentSpots"
        :is-like="isSpotLike"
        :is-want="isSpotWant"
        :is-been="isSpotBeen"
        @open="openSpotModal"
        @remove="handleRemoveSpot"
        @like="toggleLike"
        @want="toggleWant"
        @been="toggleBeen"
        @share="handleShare"
      />
      <OutdoorDisplay
        v-else-if="displayMode === 'outdoor'"
        :experiences="currentExperiences"
        @remove="handleRemoveExp"
      />
      <CraftDisplay
        v-else-if="displayMode === 'craft'"
        :experiences="currentExperiences"
        @remove="handleRemoveExp"
      />
      <PerformanceDisplay
        v-else-if="displayMode === 'performance'"
        :experiences="currentExperiences"
        @remove="handleRemoveExp"
      />
      <WellnessDisplay
        v-else-if="displayMode === 'wellness'"
        :experiences="currentExperiences"
        @remove="handleRemoveExp"
      />
      <FestivalDisplay
        v-else-if="displayMode === 'festival'"
        :experiences="currentExperiences"
        @remove="handleRemoveExp"
      />
    </div>

    <ScenerySpotModal
      :visible="modalVisible"
      :spot="selectedSpot"
      @close="closeSpotModal"
      @toggle-favorite="toggleWant"
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

<style scoped src="./index.scss" lang="scss"></style>
