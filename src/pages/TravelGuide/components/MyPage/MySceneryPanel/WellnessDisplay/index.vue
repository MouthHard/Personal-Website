<script setup lang="ts">
  import { ref } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import { CloseIcon, LocationIcon } from '@/pages/TravelGuide/icons/common';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import SunIcon from '@/pages/TravelGuide/icons/common/SunIcon.vue';
  import LeafIcon from '@/pages/TravelGuide/icons/common/LeafIcon.vue';
  import HeartIcon from '@/pages/TravelGuide/icons/common/HeartIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
  import WellnessDisplayModal from './WellnessDisplayModal/index.vue';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';

  defineProps<{
    experiences: ExperienceItem[];
  }>();

  const emit = defineEmits<{
    (e: 'remove', id: string, provinceId: string, category: string): void;
  }>();

  const modalVisible = ref(false);
  const modalItem = ref<ExperienceItem | null>(null);
  const openDetail = (exp: ExperienceItem) => {
    modalItem.value = exp;
    modalVisible.value = true;
  };
  const closeDetail = () => {
    modalVisible.value = false;
  };

  const { isExperienceFavorite, isExperienceBeen, toggleExperienceFavorite, toggleExperienceBeen } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const CAT = 'wellness';

  const pidOf = (exp: ExperienceItem) => (exp as any).provinceId || '';
  const isFav = (exp: ExperienceItem) => isExperienceFavorite(exp.id, pidOf(exp), CAT);
  const isBeen = (exp: ExperienceItem) => isExperienceBeen(exp.id, pidOf(exp), CAT);

  const onToggleFavorite = (exp: ExperienceItem) => {
    const was = isFav(exp);
    toggleExperienceFavorite(exp.id, pidOf(exp), CAT);
    showToast({ type: 'info', message: was ? `已取消收藏 ${exp.name}` : `已收藏 ${exp.name}` });
  };
  const onToggleBeen = (exp: ExperienceItem) => {
    const was = isBeen(exp);
    toggleExperienceBeen(exp.id, pidOf(exp), CAT);
    showToast({ type: 'success', message: was ? `已取消体验 ${exp.name}` : `已体验 ${exp.name}` });
  };
  const onShare = (exp: ExperienceItem) => {
    openShare(exp.name, `${exp.name}｜${exp.location}｜休闲养生`);
    showToast({ type: 'share', message: `正在分享 ${exp.name}` });
  };
</script>

<template>
  <ul class="pillow-shelf">
    <li
      v-for="(exp, idx) in experiences"
      :key="exp.id"
      class="pillow-card"
      @click="openDetail(exp)"
    >
      <span class="tassel tl"></span>
      <span class="tassel tr"></span>
      <span class="tassel bl"></span>
      <span class="tassel br"></span>

      <span class="corner-bracket tl"></span>
      <span class="corner-bracket tr"></span>
      <span class="corner-bracket bl"></span>
      <span class="corner-bracket br"></span>

      <span class="frog-knot top"></span>
      <span class="frog-knot bottom"></span>
      <span class="frog-knot left"></span>
      <span class="frog-knot right"></span>

      <span class="quilt-grid"></span>
      <span class="quilt-nodes"></span>
      <span class="seam-stitch"></span>
      <span class="silk-weft"></span>
      <span class="silk-sheen"></span>
      <span class="pillow-bulge"></span>

      <div class="pillow-inner">
        <div class="brocade-title">
          <span class="title-num">{{ String(idx + 1).padStart(2, '0') }}</span>
          <h3 class="title-name">{{ exp.name }}</h3>
          <span class="title-type">{{ exp.type }}</span>
        </div>

        <div class="embroidery-window">
          <img v-if="exp.image" :src="exp.image" class="window-img" alt="" />
          <span v-else class="window-empty">
            <span class="empty-silk"></span>
          </span>
          <span class="window-glow"></span>
          <span class="window-frame-inner"></span>
        </div>

        <div class="inscribed-loc">
          <LocationIcon :size="14" />
          <span class="loc-text">{{ exp.location }}</span>
        </div>

        <div class="inscribed-meta">
          <span v-if="exp.duration" class="meta-cell"><ClockIcon :size="13" />{{ exp.duration }}</span>
          <span v-if="exp.difficulty" class="meta-cell"><LeafIcon :size="13" />{{ exp.difficulty }}</span>
          <span v-if="exp.bestSeason" class="meta-cell"><SunIcon :size="13" />{{ exp.bestSeason }}</span>
        </div>

        <div v-if="(exp as any).efficacyTags && (exp as any).efficacyTags.length" class="silk-tags">
          <span v-for="t in (exp as any).efficacyTags.slice(0, 3)" :key="t" class="silk-tag">{{ t }}</span>
        </div>
        <div v-else-if="exp.tags && exp.tags.length" class="silk-tags">
          <span v-for="t in exp.tags.slice(0, 3)" :key="t" class="silk-tag">{{ t }}</span>
        </div>

        <div class="pillow-foot">
          <span v-if="exp.rating" class="foot-rating">
            <StarIcon :size="15" />
            <span class="rating-val">{{ exp.rating }}</span>
            <span v-if="exp.reviewCount" class="rating-count">({{ exp.reviewCount }})</span>
          </span>
          <span v-if="exp.price" class="foot-price">¥{{ exp.price }}</span>
          <span v-else class="foot-free">免费</span>
          <div class="foot-actions">
            <button class="pa-btn pa-fav" :class="{ 'is-active': isFav(exp) }" title="收藏" @click.stop="onToggleFavorite(exp)">
              <HeartIcon :size="15" :filled="isFav(exp)" />
            </button>
            <button class="pa-btn pa-been" :class="{ 'is-active': isBeen(exp) }" title="体验" @click.stop="onToggleBeen(exp)">
              <FlagIcon :size="15" :filled="isBeen(exp)" />
            </button>
            <button class="pa-btn pa-share" title="分享" @click.stop="onShare(exp)">
              <ShareIcon :size="15" />
            </button>
          </div>
        </div>
      </div>

      <span v-if="exp.heritageLevel" class="heritage-seal">非遗</span>

      <button
        class="pillow-remove"
        title="移除"
        @click.stop="emit('remove', exp.id, (exp as any).provinceId, (exp as any).experienceCategory)"
      >
        <CloseIcon :size="16" />
      </button>
    </li>
  </ul>

  <WellnessDisplayModal :visible="modalVisible" :item="modalItem" @close="closeDetail" />
  <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl" @close="closeShare" />
</template>

<style scoped src="./index.scss" lang="scss"></style>
