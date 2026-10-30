<script setup lang="ts">
  import { ref } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import { CloseIcon } from '@/pages/TravelGuide/icons/common';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import BookmarkIcon from '@/pages/TravelGuide/icons/common/BookmarkIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
  import MedalIcon from '@/pages/TravelGuide/icons/common/MedalIcon.vue';
  import PerformanceDisplayModal from './PerformanceDisplayModal/index.vue';
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

  const pidOf = (exp: ExperienceItem) => exp.provinceId || '';
  const isFav = (exp: ExperienceItem) => isExperienceFavorite(exp.id, pidOf(exp), 'performance');
  const isBeen = (exp: ExperienceItem) => isExperienceBeen(exp.id, pidOf(exp), 'performance');
  const onToggleFavorite = (exp: ExperienceItem) => {
    const was = isFav(exp);
    toggleExperienceFavorite(exp.id, pidOf(exp), 'performance');
    showToast({ type: 'info', message: was ? `已取消收藏 ${exp.name}` : `已收藏 ${exp.name}` });
  };
  const onToggleBeen = (exp: ExperienceItem) => {
    const was = isBeen(exp);
    toggleExperienceBeen(exp.id, pidOf(exp), 'performance');
    showToast({ type: 'success', message: was ? `已取消体验 ${exp.name}` : `已体验 ${exp.name}` });
  };
  const onShare = (exp: ExperienceItem) => {
    openShare(exp.name, `${exp.name}｜${exp.location}｜演艺观赏`);
    showToast({ type: 'share', message: `正在分享 ${exp.name}` });
  };

  const heritageLabel: Record<string, string> = {
    national: '国家级非遗',
    provincial: '省级非遗',
    municipal: '市级非遗',
  };
  const heritageOf = (exp: ExperienceItem) => (exp.heritageLevel ? heritageLabel[exp.heritageLevel] || '非遗' : '');
  const pad = (n: number) => String(n).padStart(2, '0');
</script>

<template>
  <ul class="curtain-wall">
    <li v-for="(exp, idx) in experiences" :key="exp.id" class="curtain-set" @click="openDetail(exp)">
      <div class="curtain-rod">
        <span class="rod-cap rod-cap-l"></span>
        <span class="rod-bar"></span>
        <span class="rod-finial rod-finial-l"></span>
        <span class="rod-finial rod-finial-r"></span>
        <span class="rod-cap rod-cap-r"></span>
      </div>

      <div class="curtain-drape">
        <span class="drape-pleats"></span>
        <span class="drape-sheen"></span>
        <span class="drape-rings"></span>

        <div class="drape-title">
          <span class="title-sub">梨园舞台 · 第{{ pad(idx + 1) }}幕</span>
          <h3 class="title-gold">{{ exp.name }}</h3>
          <span v-if="heritageOf(exp)" class="title-heritage">
            <MedalIcon width="14" height="14" />
            <span>{{ heritageOf(exp) }}</span>
          </span>
        </div>

        <div class="stage-aperture">
          <span class="aperture-pleat aperture-pleat-l"></span>
          <span class="aperture-pleat aperture-pleat-r"></span>
          <div class="stage-photo">
            <img :src="exp.image" :alt="exp.name" loading="lazy" />
            <span v-if="exp.rating" class="photo-rating">
              <StarIcon width="13" height="13" />
              <span class="rating-val">{{ exp.rating }}</span>
              <span v-if="exp.reviewCount" class="rating-count">({{ exp.reviewCount }})</span>
            </span>
            <span v-if="exp.price" class="photo-price">¥{{ exp.price }}</span>
          </div>
        </div>

        <div class="drape-info">
          <span class="info-chip">{{ exp.type || '戏曲表演' }}</span>
          <span class="info-sep"></span>
          <span class="info-text"><ClockIcon width="13" height="13" />{{ exp.duration || '待定' }}</span>
          <span class="info-sep"></span>
          <span class="info-text"><LocationIcon width="13" height="13" />{{ exp.location }}</span>
        </div>

        <div v-if="exp.tags && exp.tags.length" class="drape-tags">
          <span
            v-for="(tag, ti) in exp.tags.slice(0, 4)"
            :key="ti"
            class="tag-tassel"
            :class="{ 'tag-heritage': tag.includes('非遗') || tag.includes('传承') }"
          >{{ tag }}</span>
        </div>
      </div>

      <div class="curtain-base">
        <div class="base-top"></div>
        <div class="base-body">
          <div class="base-actions">
            <button class="base-act act-fav" :class="{ 'is-active': isFav(exp) }" :title="isFav(exp) ? '已收藏' : '收藏'" @click.stop="onToggleFavorite(exp)">
              <BookmarkIcon width="15" height="15" :filled="isFav(exp)" />
              <span>{{ isFav(exp) ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="base-act act-been" :class="{ 'is-active': isBeen(exp) }" :title="isBeen(exp) ? '已体验' : '标记体验'" @click.stop="onToggleBeen(exp)">
              <FlagIcon width="15" height="15" :filled="isBeen(exp)" />
              <span>{{ isBeen(exp) ? '已体验' : '体验' }}</span>
            </button>
            <button class="base-act act-share" title="分享" @click.stop="onShare(exp)">
              <ShareIcon width="15" height="15" />
              <span>分享</span>
            </button>
          </div>
          <div class="base-hint">
            <span>启幕详阅</span>
            <span class="hint-arrow">›</span>
          </div>
        </div>
        <div class="base-tassels">
          <span v-for="n in 7" :key="n" class="tassel"></span>
        </div>
      </div>

      <button
        class="curtain-remove"
        title="移除"
        @click.stop="emit('remove', exp.id, exp.provinceId || '', exp.experienceCategory || '')"
      >
        <CloseIcon :size="13" />
      </button>
    </li>
  </ul>

  <PerformanceDisplayModal :visible="modalVisible" :item="modalItem" @close="closeDetail" />

  <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl" @close="closeShare" />
</template>

<style scoped src="./index.scss" lang="scss"></style>
