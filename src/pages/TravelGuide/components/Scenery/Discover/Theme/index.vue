<template>
  <div class="discover-theme">
    <section class="theme-album" v-if="currentGroup">
      <span class="brass-corner brass-corner--tl"></span>
      <span class="brass-corner brass-corner--tr"></span>
      <span class="brass-corner brass-corner--bl"></span>
      <span class="brass-corner brass-corner--br"></span>

      <div class="album-layout">
        <ThemeBookmark
          :theme-groups="themeGroups"
          :active-group="activeGroup"
          :group-icon="groupIcon"
          @select-group="activeGroup = $event"
        />

        <ThemeGrid
          :current-group="currentGroup"
          :current-theme-key="currentThemeKey"
          @select-theme="selectTheme"
        />

        <ThemeDisplay
          :current-theme="currentTheme"
          :is-spot-like="isSpotLike"
          :is-spot-want="isSpotWant"
          :is-spot-been="isSpotBeen"
          @navigate-to-spot="emit('navigate-to-spot', $event)"
          @toggle-like="handleToggleLike"
          @toggle-want="handleToggleWant"
          @toggle-been="handleToggleBeen"
          @share="handleShare"
        />
      </div>
    </section>

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
  import type { SceneryData } from '@/typesOfPages/travelGuide';
  import { computed, ref, watch, markRaw, type Component } from 'vue';

  import GalaxyIcon from '@/pages/TravelGuide/icons/pages/scenery/GalaxyIcon.vue';
  import CalendarIcon from '@/pages/TravelGuide/icons/common/CalendarIcon.vue';
  import EnergyIcon from '@/pages/TravelGuide/icons/pages/scenery/EnergyIcon.vue';
  import MountainIcon from '@/pages/TravelGuide/icons/pages/scenery/MountainIcon.vue';
  import HomeIcon from '@/pages/TravelGuide/icons/common/HomeIcon.vue';
  import ZenIcon from '@/pages/TravelGuide/icons/pages/scenery/ZenIcon.vue';
  import MuseumIcon from '@/pages/TravelGuide/icons/pages/scenery/MuseumIcon.vue';
  import PaletteIcon from '@/pages/TravelGuide/icons/pages/scenery/PaletteIcon.vue';
  import LeafAutumnIcon from '@/pages/TravelGuide/icons/common/LeafAutumnIcon.vue';
  import SnowflakeIcon from '@/pages/TravelGuide/icons/common/SnowflakeIcon.vue';
  import DropletIcon from '@/pages/TravelGuide/icons/pages/scenery/DropletIcon.vue';
  import SunIcon from '@/pages/TravelGuide/icons/common/SunIcon.vue';
  import RouteIcon from '@/pages/TravelGuide/icons/common/RouteIcon.vue';
  import GourdIcon from '@/pages/TravelGuide/icons/pages/scenery/GourdIcon.vue';
  import FlowerIcon from '@/pages/TravelGuide/icons/pages/scenery/FlowerIcon.vue';
  import DiamondIcon from '@/pages/TravelGuide/icons/pages/scenery/DiamondIcon.vue';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';
  import ThemeBookmark from './ThemeBookmark/index.vue';
  import ThemeGrid from './ThemeGrid/index.vue';
  import ThemeDisplay from './ThemeDisplay/index.vue';

  const props = defineProps<{
    sceneryData: SceneryData | null;
    loading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'navigate-to-spot', spotName: string): void;
  }>();

  const { show: showToast } = useTravelToast();
  const { isSpotLike, toggleSpotLike, isSpotWant, toggleSpotWant, isSpotBeen, toggleSpotBeen } = useSceneryPrefs();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  interface ThemeSpot {
    id: string;
    name: string;
    location: string;
    rating: number;
    ticketPrice: string;
    visitDuration: string;
    transport: string;
    description: string;
    highlight: string;
    image: string;
  }

  interface Theme {
    key: string;
    name: string;
    icon: Component;
    coverSpotName: string;
    coverImage: string;
    avgRating: number;
    bestSeason: string;
    recommendedDays: string;
    budget: { currency: string; min: number; max: number };
    intensity: string;
    audience: string;
    highlights: string[];
    tips: string[];
    spots: ThemeSpot[];
  }

  const iconMap: Record<string, Component> = {
    mountain: markRaw(MountainIcon),
    energy: markRaw(EnergyIcon),
    droplet: markRaw(DropletIcon),
    sun: markRaw(SunIcon),
    home: markRaw(HomeIcon),
    museum: markRaw(MuseumIcon),
    zen: markRaw(ZenIcon),
    diamond: markRaw(DiamondIcon),
    palette: markRaw(PaletteIcon),
    route: markRaw(RouteIcon),
    gourd: markRaw(GourdIcon),
    flower: markRaw(FlowerIcon),
    'leaf-autumn': markRaw(LeafAutumnIcon),
    snowflake: markRaw(SnowflakeIcon),
    calendar: markRaw(CalendarIcon),
  };

  const groupIconMap: Record<string, Component> = {
    nature: markRaw(MountainIcon),
    culture: markRaw(MuseumIcon),
    outdoor: markRaw(RouteIcon),
    season: markRaw(CalendarIcon),
  };

  const activeMap = ref<Record<string, string | null>>({});
  const activeGroup = ref('nature');

  const groupIcon = (key: string): Component => groupIconMap[key] || markRaw(GalaxyIcon);

  const selectTheme = (key: string) => {
    activeMap.value[activeGroup.value] = key;
  };

  const spotMap = computed<Record<string, ThemeSpot>>(() => {
    const m: Record<string, ThemeSpot> = {};
    if (props.sceneryData?.spots) {
      props.sceneryData.spots.forEach((s) => {
        m[s.id] = {
          id: s.id,
          name: s.name,
          location: s.location || '',
          rating: s.rating ?? 4.5,
          ticketPrice: s.ticketPrice || '',
          visitDuration: s.visitDuration || '',
          transport: (s.transportInfo && s.transportInfo[0]) ? `${s.transportInfo[0].mode}：${s.transportInfo[0].detail}` : '',
          description: s.description || '',
          highlight: s.highlight || s.description || '',
          image: s.image || '',
        };
      });
    }
    return m;
  });

  const themeGroups = computed(() => {
    const rawThemes = props.sceneryData?.themes || [];
    return rawThemes.map((g) => ({
      key: g.key,
      title: g.title,
      items: g.items.map((t) => {
        const coverSpot = spotMap.value[t.coverSpotId];
        const coverImage = coverSpot?.image || '';
        const spots: ThemeSpot[] = t.spotIds
          .map((id) => spotMap.value[id])
          .filter((s): s is ThemeSpot => !!s);
        return {
          key: t.key,
          name: t.name,
          icon: iconMap[t.icon] || markRaw(GalaxyIcon),
          coverSpotName: coverSpot?.name || '',
          coverImage,
          avgRating: t.avgRating,
          bestSeason: t.bestSeason,
          recommendedDays: t.recommendedDays,
          budget: t.budget,
          intensity: t.intensity,
          audience: t.audience,
          highlights: t.highlights,
          tips: t.tips,
          spots,
        } as Theme;
      }),
    }));
  });

  watch(themeGroups, (groups) => {
    groups.forEach((g) => {
      if (g.items.length && !activeMap.value[g.key]) activeMap.value[g.key] = g.items[0].key;
    });
    if (groups.length && !groups.find((g) => g.key === activeGroup.value)) {
      activeGroup.value = groups[0].key;
    }
  }, { immediate: true });

  const currentGroup = computed(() => {
    return themeGroups.value.find((g) => g.key === activeGroup.value) || themeGroups.value[0];
  });

  const currentThemeKey = computed(() => activeMap.value[activeGroup.value]);

  const currentTheme = computed<Theme | null>(() => {
    const k = currentThemeKey.value;
    if (!k) return null;
    return currentGroup.value.items.find((t) => t.key === k) || null;
  });

  const handleToggleLike = (id: string) => {
    const wasLike = isSpotLike(id);
    toggleSpotLike(id);
    const spot = currentTheme.value?.spots.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasLike ? `已取消点赞 ${name}` : `已点赞 ${name}` });
  };

  const handleToggleWant = (id: string) => {
    const wasWant = isSpotWant(id);
    toggleSpotWant(id);
    const spot = currentTheme.value?.spots.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasWant ? `已移出想去清单 ${name}` : `已加入想去清单 ${name}` });
  };

  const handleToggleBeen = (id: string) => {
    const wasBeen = isSpotBeen(id);
    toggleSpotBeen(id);
    const spot = currentTheme.value?.spots.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasBeen ? `已取消 ${name} 去过标记` : `已标记 ${name} 为去过` });
  };

  const handleShare = (spot: ThemeSpot) => {
    openShare(
      spot.name,
      `${spot.name}｜${spot.location}｜评分 ${spot.rating ?? 4.5}｜门票 ${spot.ticketPrice || '免费'}`,
    );
  };
</script>

<style scoped src="./index.scss" lang="scss" />
