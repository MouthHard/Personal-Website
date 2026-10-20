<template>
  <div class="display-page" v-if="currentTheme">
    <div class="postcard-hero">
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
          <span class="is-val">{{ currentTheme.budget.currency }}{{ currentTheme.budget.min }}-{{ currentTheme.budget.max }}</span>
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

    <div class="highlight-tags" v-if="currentTheme.highlights.length">
      <span class="ht-label"><SparklesIcon :size="20" /> 亮点体验</span>
      <div class="ht-list">
        <span v-for="h in currentTheme.highlights" :key="h" class="ht-tag">{{ h }}</span>
      </div>
    </div>

    <div class="spot-postcards">
      <span class="sp-label"><MapIcon :size="20" /> 关联景点<span class="sp-count">{{ currentTheme.spots.length }}处</span></span>
      <div class="sp-list">
        <div v-for="spot in currentTheme.spots" :key="spot.id" class="spot-card" @click="emit('navigate-to-spot', spot.name)">
          <span class="sc-pin"></span>
          <div class="sc-photo">
            <img v-if="spot.image" :src="spot.image" :alt="spot.name" class="sc-img" loading="lazy" />
          </div>
          <div class="sc-body">
            <div class="sc-head">
              <span class="sc-name">{{ spot.name }}</span>
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
            <button class="sc-btn sc-like" :class="{ active: isSpotLike(spot.id) }" aria-label="点赞景点" @click.stop="emit('toggle-like', spot.id)">
              <ThumbUpIcon :filled="isSpotLike(spot.id)" :size="16" />
            </button>
            <button class="sc-btn sc-want" :class="{ active: isSpotWant(spot.id) }" aria-label="想去景点" @click.stop="emit('toggle-want', spot.id)">
              <HeartIcon :filled="isSpotWant(spot.id)" :size="16" />
            </button>
            <button class="sc-btn sc-share" aria-label="分享景点" @click.stop="emit('share', spot)">
              <ShareIcon :size="16" />
            </button>
            <button class="sc-btn sc-been" :class="{ active: isSpotBeen(spot.id) }" aria-label="去过景点" @click.stop="emit('toggle-been', spot.id)">
              <FlagIcon :filled="isSpotBeen(spot.id)" :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="tips-journal" v-if="currentTheme.tips.length">
      <span class="tj-label"><LightbulbIcon :size="20" /> 出行贴士</span>
      <ul class="tj-list">
        <li v-for="t in currentTheme.tips" :key="t">{{ t }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import CalendarIcon from '@/pages/TravelGuide/icons/common/CalendarIcon.vue';
  import ShoppingBagIcon from '@/pages/TravelGuide/icons/common/ShoppingBagIcon.vue';
  import EnergyIcon from '@/pages/TravelGuide/icons/pages/scenery/EnergyIcon.vue';
  import UsersIcon from '@/pages/TravelGuide/icons/pages/scenery/UsersIcon.vue';
  import SparklesIcon from '@/pages/TravelGuide/icons/common/SparklesIcon.vue';
  import MapIcon from '@/pages/TravelGuide/icons/common/MapIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import BusIcon from '@/pages/TravelGuide/icons/pages/scenery/BusIcon.vue';
  import ThumbUpIcon from '@/pages/TravelGuide/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/TravelGuide/icons/common/HeartIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import LightbulbIcon from '@/pages/TravelGuide/icons/common/LightbulbIcon.vue';

  defineProps<{
    currentTheme: any;
    isSpotLike: (id: string) => boolean;
    isSpotWant: (id: string) => boolean;
    isSpotBeen: (id: string) => boolean;
  }>();

  const emit = defineEmits<{
    (e: 'navigate-to-spot', spotName: string): void;
    (e: 'toggle-like', id: string): void;
    (e: 'toggle-want', id: string): void;
    (e: 'toggle-been', id: string): void;
    (e: 'share', spot: any): void;
  }>();
</script>

<style scoped src="./index.scss" lang="scss" />