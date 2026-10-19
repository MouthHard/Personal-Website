<script setup lang="ts">
  import { ref } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import { CloseIcon } from '@/pages/TravelGuide/icons/common';
  import MountainIcon from '@/pages/TravelGuide/icons/pages/scenery/MountainIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import RouteIcon from '@/pages/TravelGuide/icons/common/RouteIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import MapIcon from '@/pages/TravelGuide/icons/common/MapIcon.vue';
  import BookmarkIcon from '@/pages/TravelGuide/icons/common/BookmarkIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
  import OutdoorDisplayModal from './OutdoorDisplayModal/index.vue';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';

  defineProps<{
    experiences: ExperienceItem[];
  }>();

  const emit = defineEmits<{
    (e: 'remove', id: string, provinceId: string, category: string): void;
  }>();

  const { isExperienceFavorite, isExperienceBeen, toggleExperienceFavorite, toggleExperienceBeen } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const modalVisible = ref(false);
  const modalItem = ref<ExperienceItem | null>(null);
  const openDetail = (exp: ExperienceItem) => {
    modalItem.value = exp;
    modalVisible.value = true;
  };
  const closeDetail = () => {
    modalVisible.value = false;
  };

  const pidOf = (exp: any) => exp.provinceId || '';
  const isFav = (exp: any) => isExperienceFavorite(exp.id, pidOf(exp), 'outdoor');
  const isBeen = (exp: any) => isExperienceBeen(exp.id, pidOf(exp), 'outdoor');
  const onToggleFavorite = (exp: any) => {
    const was = isFav(exp);
    toggleExperienceFavorite(exp.id, pidOf(exp), 'outdoor');
    showToast({ type: 'info', message: was ? `已取消收藏 ${exp.name}` : `已收藏 ${exp.name}` });
  };
  const onToggleBeen = (exp: any) => {
    const was = isBeen(exp);
    toggleExperienceBeen(exp.id, pidOf(exp), 'outdoor');
    showToast({ type: 'success', message: was ? `已取消体验 ${exp.name}` : `已体验 ${exp.name}` });
  };
  const onShare = (exp: any) => {
    openShare(exp.name, `${exp.name}｜${exp.location}｜户外探险`);
    showToast({ type: 'share', message: `正在分享 ${exp.name}` });
  };

  const distanceOf = (item: any, idx: number) => {
    if (item.distance) return item.distance;
    return (8 + idx * 5 + (idx % 2) * 3).toFixed(1);
  };
  const maxElevationOf = (item: any, idx: number) => {
    if (item.maxElevation) return item.maxElevation;
    const base = [1860, 200, 1500, 800, 2200];
    return base[idx % base.length];
  };
</script>

<template>
  <ul class="tag-wall">
    <li v-for="(exp, idx) in experiences" :key="exp.id" class="luggage-tag" @click="openDetail(exp)">
      <svg class="hang-asm" viewBox="0 0 80 52" aria-hidden="true">
        <defs>
          <linearGradient id="ropeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#6a5a48" />
            <stop offset="1" stop-color="#3a2e22" />
          </linearGradient>
          <linearGradient id="steelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#d0d0d8" />
            <stop offset="0.45" stop-color="#9a9aa2" />
            <stop offset="1" stop-color="#5a5a62" />
          </linearGradient>
        </defs>
        <ellipse cx="40" cy="16" rx="24" ry="13" fill="none" stroke="url(#ropeGrad)" stroke-width="5" />
        <ellipse cx="40" cy="16" rx="24" ry="13" fill="none" stroke="#1a120a" stroke-width="1" stroke-dasharray="3 2.5" />
        <path d="M26,30 L26,42 L54,42 L54,30 Q54,24 40,24 Q26,24 26,30 Z" fill="url(#steelGrad)" stroke="#3a3a42" stroke-width="1.2" />
        <path d="M29,28 Q29,26 40,26 Q51,26 51,28" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linecap="round" />
        <circle cx="40" cy="36" r="2.4" fill="#2a2a30" />
      </svg>

      <div class="tag-body">
        <span class="rivet rivet-tl" />

        <span class="rivet rivet-bl" />
        <span class="rivet rivet-br" />

        <div class="polaroid">
          <span class="tape tape-tl" />
          <span class="tape tape-br" />
          <img :src="exp.image" :alt="exp.name" loading="lazy" />
        </div>

        <div class="tag-head">
          <h3 class="tag-name">{{ exp.name }}</h3>
          <span class="diff-plate" :data-d="exp.difficulty">{{ exp.difficulty }}</span>
        </div>

        <div class="sub-head">
          <span class="type-plate"><MapIcon width="14" height="14" />{{ exp.type || '徒步穿越' }}</span>
          <span v-if="exp.rating" class="rating-chip">
            <StarIcon width="14" height="14" />
            <span class="rating-val">{{ exp.rating }}</span>
            <span v-if="exp.reviewCount" class="rating-count">({{ exp.reviewCount }})</span>
          </span>
          <span v-if="exp.price" class="price-chip">¥{{ exp.price }}起</span>
        </div>

        <div class="data-grid">
          <span class="data-cell">
            <MountainIcon width="18" height="18" class="cell-icon" />
            <span class="cell-text">
              <span class="cell-label">海拔</span>
              <span class="cell-val">{{ maxElevationOf(exp, idx) }}m</span>
            </span>
          </span>
          <span class="data-cell">
            <ClockIcon width="18" height="18" class="cell-icon" />
            <span class="cell-text">
              <span class="cell-label">时长</span>
              <span class="cell-val">{{ exp.duration }}</span>
            </span>
          </span>
          <span class="data-cell">
            <RouteIcon width="18" height="18" class="cell-icon" />
            <span class="cell-text">
              <span class="cell-label">距离</span>
              <span class="cell-val">{{ distanceOf(exp, idx) }}km</span>
            </span>
          </span>
        </div>

        <div class="loc-row">
          <LocationIcon width="15" height="15" />
          <span class="loc-val">{{ exp.location }}</span>
        </div>

        <div v-if="exp.tags && exp.tags.length" class="tags-row">
          <span v-for="(tag, ti) in exp.tags.slice(0, 3)" :key="ti" class="tag-pill">{{ tag }}</span>
        </div>

        <div class="card-actions">
          <button class="card-act act-fav" :class="{ 'is-active': isFav(exp) }" @click.stop="onToggleFavorite(exp)">
            <BookmarkIcon width="15" height="15" :filled="isFav(exp)" />
            <span>收藏</span>
          </button>
          <button class="card-act act-been" :class="{ 'is-active': isBeen(exp) }" @click.stop="onToggleBeen(exp)">
            <FlagIcon width="15" height="15" :filled="isBeen(exp)" />
            <span>体验</span>
          </button>
          <button class="card-act act-share" @click.stop="onShare(exp)">
            <ShareIcon width="15" height="15" />
            <span>分享</span>
          </button>
        </div>

        <div class="detail-hint">
          <span>查看完整档案</span>
          <span class="hint-arrow">›</span>
        </div>
      </div>

      <button
        class="tag-remove"
        title="移除"
        @click.stop="emit('remove', exp.id, (exp as any).provinceId, (exp as any).experienceCategory)"
      >
        <CloseIcon :size="13" />
      </button>
    </li>
  </ul>

  <OutdoorDisplayModal :visible="modalVisible" :item="modalItem" @close="closeDetail" />

  <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl" @close="closeShare" />
</template>

<style scoped src="./index.scss" lang="scss"></style>
