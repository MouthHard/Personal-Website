<template>
  <div class="discover-theme">
    <section class="theme-album" v-if="currentGroup">
      <!-- 黄铜护角 -->
      <span class="brass-corner brass-corner--tl"></span>
      <span class="brass-corner brass-corner--tr"></span>
      <span class="brass-corner brass-corner--bl"></span>
      <span class="brass-corner brass-corner--br"></span>

      <div class="album-layout">
        <!-- 左：皮革书签索引 -->
        <aside class="bookmark-index">
          <div class="bookmark-caption">
            <span class="bc-glyph"><LayersIcon :size="28" /></span>
            <span class="bc-text">分类</span>
          </div>
          <button
            v-for="g in themeGroups"
            :key="g.key"
            class="bookmark-tab"
            :class="{ active: activeGroup === g.key, 'bm-play': g.key === 'play' }"
            @click="activeGroup = g.key"
          >
            <span class="bm-fold"></span>
            <span class="bm-stamp"></span>
            <span class="bm-icon"><component :is="groupIcon(g.key)" :size="20" /></span>
            <span class="bm-info">
              <span class="bm-text">{{ g.title }}</span>
              <span class="bm-count">{{ g.items.length }}</span>
            </span>
          </button>
        </aside>

        <!-- 中：明信片收藏格 -->
        <div class="postcard-grid">
          <div class="grid-caption">
            <span class="gc-bar"></span>
            <span class="gc-text">{{ currentGroup.title }}</span>
            <span class="gc-count">{{ currentGroup.items.length }}张</span>
          </div>
          <div class="grid-slots">
            <button
              v-for="(theme, ti) in currentGroup.items"
              :key="theme.key"
              class="postcard-slot"
              :class="{ active: currentThemeKey === theme.key, tilt: ti % 2 === 1 }"
              @click="selectTheme(theme.key)"
            >
              <span class="ps-corner ps-corner--tl"></span>

              <span class="ps-corner ps-corner--bl"></span>
              <span class="ps-corner ps-corner--br"></span>
              <span class="ps-active-ring"></span>
              <span class="ps-postmark">
                <span class="pm-ring"></span>
                <span class="pm-num">{{ theme.avgRating.toFixed(1) }}</span>
              </span>
              <span class="ps-stamp"><component :is="theme.icon" :size="24" /></span>
              <span class="ps-caption">{{ theme.name }}</span>
              <span class="ps-tags">
                <span class="ps-tag ps-tag--spots">{{ theme.spots.length }}处</span>
                <span class="ps-tag ps-tag--season">{{ theme.bestSeason }}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- 右：放大展示页 -->
        <div class="display-page" v-if="currentTheme">
          <div class="postcard-hero">
          <!-- 大明信片 -->
          <div class="page-postcard">
            <img
              v-if="currentTheme.coverImage"
              :src="currentTheme.coverImage"
              :alt="currentTheme.name"
              class="pc-img"
            />
            <div class="pc-vignette"></div>
            <span class="pc-corner pc-corner--tl"></span>
            <span class="pc-corner pc-corner--tr"></span>
            <span class="pc-corner pc-corner--bl"></span>
            <span class="pc-corner pc-corner--br"></span>
            <div class="pc-postmark">
              <span class="ppm-ring"></span>
              <div class="ppm-date">
                <template v-if="currentTheme.bestSeason.includes(' / ')">
                  <span class="ppm-season" v-for="s in currentTheme.bestSeason.split(' / ')" :key="s">{{ s }}</span>
                </template>
                <span v-else class="ppm-season">{{ currentTheme.bestSeason }}</span>
              </div>
            </div>
            <div class="pc-stamp">
              <component :is="currentTheme.icon" :size="30" />
            </div>
            <div class="pc-titlebox">
              <span class="pc-name">{{ currentTheme.name }}</span>
              <span class="pc-rating"><StarIcon :size="17" /> {{ currentTheme.avgRating.toFixed(1) }}</span>
            </div>
          </div>

          <!-- 邮戳信息章 -->
          <div class="info-stamps">
            <div class="info-stamp is-days">
              <span class="is-grommet"></span>
              <span class="is-ico"><CalendarIcon :size="18" /></span>
              <span class="is-label">推荐</span>
              <span class="is-val">{{ currentTheme.recommendedDays }}</span>
            </div>
            <div class="info-stamp is-budget">
              <span class="is-grommet"></span>
              <span class="is-ico"><ShoppingBagIcon :size="18" /></span>
              <span class="is-label">预算</span>
              <span class="is-val">{{ currentTheme.budget }}</span>
            </div>
            <div class="info-stamp is-intensity">
              <span class="is-grommet"></span>
              <span class="is-ico"><EnergyIcon :size="18" /></span>
              <span class="is-label">体力</span>
              <span class="is-val">{{ currentTheme.intensity }}</span>
            </div>
            <div class="info-stamp is-audience">
              <span class="is-grommet"></span>
              <span class="is-ico"><UsersIcon :size="18" /></span>
              <span class="is-label">适合</span>
              <span class="is-val">{{ currentTheme.audience }}</span>
            </div>
          </div>
          </div>

          <!-- 亮点行李牌 -->
          <div class="highlight-tags" v-if="currentTheme.highlights.length">
            <span class="ht-label"><SparklesIcon :size="20" /> 亮点体验</span>
            <div class="ht-list">
              <span
                v-for="h in currentTheme.highlights"
                :key="h"
                class="ht-tag"
              >{{ h }}</span>
            </div>
          </div>

          <!-- 景点明信片集 -->
          <div class="spot-postcards">
            <span class="sp-label"><MapIcon :size="20" /> 关联景点<span class="sp-count">{{ currentTheme.spots.length }}处</span></span>
            <div class="sp-list">
              <div
                v-for="spot in currentTheme.spots"
                :key="spot.id"
                class="spot-card"
              >
                <span class="sc-pin"></span>

                <div class="sc-photo">
                  <img
                    v-if="spot.image"
                    :src="spot.image"
                    :alt="spot.name"
                    class="sc-img"
                    loading="lazy"
                  />
                </div>
                <div class="sc-body">
                  <div class="sc-head">
                    <span class="sc-name" @click="$emit('navigate-to-spot', spot.name)">{{ spot.name }}</span>
                    <span class="sc-rate" v-if="spot.rating"><StarIcon :size="16" /> {{ spot.rating }}</span>
                  </div>
                  <div class="sc-info">
                    <span class="sc-loc"><LocationIcon :size="14" /> {{ spot.location }}</span>
                    <span class="sc-dur" v-if="spot.visitDuration"><ClockIcon :size="14" /> {{ spot.visitDuration }}</span>
                  </div>
                  <p class="sc-desc">{{ spot.highlight || spot.description }}</p>
                  <div class="sc-foot">
                    <span class="sc-price" v-if="spot.ticketPrice">{{ spot.ticketPrice }}</span>
                    <span class="sc-trans" v-if="spot.transport"><BusIcon :size="14" /> {{ spot.transport }}</span>
                  </div>
                </div>
                <div class="sc-actions">
                  <button class="sc-btn sc-like" :class="{ active: isSpotLike(spot.id) }" aria-label="点赞景点" @click="handleToggleLike(spot.id)">
                    <ThumbUpIcon :filled="isSpotLike(spot.id)" :size="16" />
                  </button>
                  <button class="sc-btn sc-want" :class="{ active: isSpotWant(spot.id) }" aria-label="想去景点" @click="handleToggleWant(spot.id)">
                    <HeartIcon :filled="isSpotWant(spot.id)" :size="16" />
                  </button>
                  <button class="sc-btn sc-share" aria-label="分享景点" @click="handleShare(spot)">
                    <ShareIcon :size="16" />
                  </button>
                  <button class="sc-btn sc-been" :class="{ active: isSpotBeen(spot.id) }" aria-label="去过景点" @click="handleToggleBeen(spot.id)">
                    <FlagIcon :filled="isSpotBeen(spot.id)" :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 手写贴士 -->
          <div class="tips-journal" v-if="currentTheme.tips.length">
            <span class="tj-label"><LightbulbIcon :size="20" /> 出行贴士</span>
            <ul class="tj-list">
              <li v-for="t in currentTheme.tips" :key="t">{{ t }}</li>
            </ul>
          </div>
          
        </div>
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
  import LayersIcon from '@/pages/TravelGuide/icons/pages/scenery/LayersIcon.vue';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import CalendarIcon from '@/pages/TravelGuide/icons/common/CalendarIcon.vue';
  import ShoppingBagIcon from '@/pages/TravelGuide/icons/common/ShoppingBagIcon.vue';
  import EnergyIcon from '@/pages/TravelGuide/icons/pages/scenery/EnergyIcon.vue';
  import UsersIcon from '@/pages/TravelGuide/icons/pages/scenery/UsersIcon.vue';
  import SparklesIcon from '@/pages/TravelGuide/icons/common/SparklesIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import BusIcon from '@/pages/TravelGuide/icons/pages/scenery/BusIcon.vue';
  import MapIcon from '@/pages/TravelGuide/icons/common/MapIcon.vue';
  import LightbulbIcon from '@/pages/TravelGuide/icons/common/LightbulbIcon.vue';
  import MountainIcon from '@/pages/TravelGuide/icons/pages/scenery/MountainIcon.vue';
  import DiamondIcon from '@/pages/TravelGuide/icons/pages/scenery/DiamondIcon.vue';
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
  import { ThumbUpIcon, HeartIcon, ShareIcon, FlagIcon } from '@/pages/TravelGuide/icons/common';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';

  const props = defineProps<{
    sceneryData: SceneryData | null;
    loading: boolean;
  }>();

  defineEmits<{
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
    budget: string;
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
          transport: (s.transportInfo && s.transportInfo[0]) || '',
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
