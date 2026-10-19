<script setup lang="ts">
  import { computed } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import CloseIcon from '@/pages/TravelGuide/icons/common/CloseIcon.vue';
  import BookmarkIcon from '@/pages/TravelGuide/icons/common/BookmarkIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import SparklesIcon from '@/pages/TravelGuide/icons/common/SparklesIcon.vue';
  import CalendarIcon from '@/pages/TravelGuide/icons/common/CalendarIcon.vue';
  import UsersIcon from '@/pages/TravelGuide/icons/pages/scenery/UsersIcon.vue';
  import MedalIcon from '@/pages/TravelGuide/icons/common/MedalIcon.vue';
  import TheaterMasksIcon from '@/pages/TravelGuide/icons/common/TheaterMasksIcon.vue';
  import MapIcon from '@/pages/TravelGuide/icons/common/MapIcon.vue';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';

  const props = defineProps<{
    visible: boolean;
    item: ExperienceItem | null;
  }>();

  const emit = defineEmits<{
    close: [];
  }>();

  const { isExperienceFavorite, isExperienceBeen, toggleExperienceFavorite, toggleExperienceBeen } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const pid = computed(() => props.item?.provinceId || '');
  const CAT = 'performance';
  const isFav = computed(() => (props.item ? isExperienceFavorite(props.item.id, pid.value, CAT) : false));
  const isBeen = computed(() => (props.item ? isExperienceBeen(props.item.id, pid.value, CAT) : false));

  const onToggleFavorite = () => {
    if (!props.item) return;
    const was = isFav.value;
    toggleExperienceFavorite(props.item.id, pid.value, CAT);
    showToast({ type: 'info', message: was ? `已取消收藏 ${props.item.name}` : `已收藏 ${props.item.name}` });
  };
  const onToggleBeen = () => {
    if (!props.item) return;
    const was = isBeen.value;
    toggleExperienceBeen(props.item.id, pid.value, CAT);
    showToast({ type: 'success', message: was ? `已取消体验 ${props.item.name}` : `已体验 ${props.item.name}` });
  };
  const onShare = () => {
    if (!props.item) return;
    openShare(props.item.name, `${props.item.name}｜${props.item.location}｜演艺观赏`);
    showToast({ type: 'share', message: `正在分享 ${props.item.name}` });
  };

  const heritageLabel: Record<string, string> = {
    national: '国家级非遗',
    provincial: '省级非遗',
    municipal: '市级非遗',
  };
  const heritageOf = computed(() => (props.item?.heritageLevel ? heritageLabel[props.item.heritageLevel] || '非遗' : ''));
  const suitableOf = (item: ExperienceItem) => {
    if (item.suitableFor && item.suitableFor.length) return item.suitableFor.join('·');
    return '演艺爱好者';
  };
  const bestSeasonOf = (item: ExperienceItem) => item.bestSeason || '全年';
  const reservationOf = (item: ExperienceItem) => item.reservation || '现场购票';
  const instructorOf = (item: ExperienceItem) => item.instructor || '—';
</script>

<template>
  <Teleport to="body">
    <Transition name="perf-modal">
      <div v-if="visible && item" class="pm-mask" @click.self="emit('close')">
        <div class="perf-modal" role="dialog" aria-modal="true">
          <span class="pm-nail pm-nail-tl" />
          <span class="pm-nail pm-nail-tr" />
          <span class="pm-nail pm-nail-bl" />
          <span class="pm-nail pm-nail-br" />

          <div class="pm-header">
            <svg class="pm-hanger" viewBox="0 0 120 40" aria-hidden="true">
              <defs>
                <linearGradient id="pmRope" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#8a7a5e" />
                  <stop offset="0.5" stop-color="#5a4a38" />
                  <stop offset="1" stop-color="#2a2018" />
                </linearGradient>
                <linearGradient id="pmRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#e8e8f0" />
                  <stop offset="0.4" stop-color="#b0b0b8" />
                  <stop offset="0.7" stop-color="#7a7a82" />
                  <stop offset="1" stop-color="#4a4a52" />
                </linearGradient>
              </defs>
              <path d="M28,34 Q28,8 60,4 Q92,8 92,34" fill="none" stroke="url(#pmRope)" stroke-width="4" stroke-linecap="round" />
              <path d="M28,34 Q28,8 60,4 Q92,8 92,34" fill="none" stroke="#1a120a" stroke-width="0.9" stroke-dasharray="2.2 1.8" />
              <circle cx="28" cy="34" r="6" fill="url(#pmRing)" stroke="#2a2a32" stroke-width="1.3" />
              <circle cx="92" cy="34" r="6" fill="url(#pmRing)" stroke="#2a2a32" stroke-width="1.3" />
              <circle cx="28" cy="34" r="2.2" fill="#1a1a22" />
              <circle cx="92" cy="34" r="2.2" fill="#1a1a22" />
              <ellipse cx="28" cy="32.5" rx="2.4" ry="0.9" fill="rgba(255,255,255,0.6)" />
              <ellipse cx="92" cy="32.5" rx="2.4" ry="0.9" fill="rgba(255,255,255,0.6)" />
            </svg>
            <div class="pm-title-wrap">
              <span class="pm-house"><TheaterMasksIcon width="22" height="22" />梨园戏院·启幕</span>
              <h2 class="pm-title">{{ item.name }}</h2>
              <span v-if="heritageOf" class="pm-heritage"><MedalIcon width="18" height="18" />{{ heritageOf }}</span>
            </div>
            <button class="pm-close" aria-label="关闭" @click="emit('close')">
              <CloseIcon width="26" height="26" />
            </button>
          </div>

          <div class="pm-body">
            <div class="pm-aside">
              <div class="pm-poster">
                <img :src="item.image" :alt="item.name" loading="lazy" />
                <span v-if="item.rating" class="pm-poster-rating">
                  <StarIcon width="20" height="20" />
                  <span class="pm-rate-val">{{ item.rating }}</span>
                  <span v-if="item.reviewCount" class="pm-rate-count">({{ item.reviewCount }})</span>
                </span>
              </div>

              <div class="pm-badges">
                <span class="pm-badge pm-badge-type"><MapIcon width="20" height="20" />{{ item.type || '戏曲表演' }}</span>
                <span v-if="item.price" class="pm-badge pm-badge-price">¥{{ item.price }}</span>
              </div>

              <div class="pm-loc"><LocationIcon width="22" height="22" /><span>{{ item.location }}</span></div>

              <div v-if="item.tags && item.tags.length" class="pm-tags">
                <span v-for="(t, ti) in item.tags" :key="ti" class="pm-tag" :class="{ 'pm-tag-heritage': t.includes('非遗') || t.includes('传承') }">{{ t }}</span>
              </div>
            </div>

            <div class="pm-detail">
              <div class="pm-stamp">
                <p v-if="item.description" class="pm-stamp-text">{{ item.description }}</p>
              </div>

              <div class="pm-data-grid">
                <span class="pm-cell"><ClockIcon width="22" height="22" /><span class="pm-cell-label">时长</span><span class="pm-cell-val">{{ item.duration || '待定' }}</span></span>
                <span class="pm-cell"><TheaterMasksIcon width="22" height="22" /><span class="pm-cell-label">难度</span><span class="pm-cell-val">{{ item.difficulty || '—' }}</span></span>
                <span class="pm-cell"><UsersIcon width="22" height="22" /><span class="pm-cell-label">适宜</span><span class="pm-cell-val">{{ suitableOf(item) }}</span></span>
                <span class="pm-cell"><MedalIcon width="22" height="22" /><span class="pm-cell-label">非遗</span><span class="pm-cell-val">{{ heritageOf || '—' }}</span></span>
                <span class="pm-cell"><CalendarIcon width="22" height="22" /><span class="pm-cell-label">季节</span><span class="pm-cell-val">{{ bestSeasonOf(item) }}</span></span>
                <span class="pm-cell"><SparklesIcon width="22" height="22" /><span class="pm-cell-label">预约</span><span class="pm-cell-val">{{ reservationOf(item) }}</span></span>
              </div>

              <div v-if="item.instructor" class="pm-instructor">
                <UsersIcon width="22" height="22" />
                <span class="pm-instructor-label">领衔主演</span>
                <span class="pm-instructor-val">{{ instructorOf(item) }}</span>
              </div>

              <div v-if="item.highlights && item.highlights.length" class="pm-block pm-block-highlights">
                <div class="pm-block-head"><SparklesIcon width="22" height="22" /><span>剧目看点</span></div>
                <ul class="pm-list">
                  <li v-for="(h, hi) in item.highlights" :key="hi"><span class="pm-list-mark" />{{ h }}</li>
                </ul>
              </div>

              <div v-if="item.suitableFor && item.suitableFor.length" class="pm-block">
                <div class="pm-block-head"><UsersIcon width="22" height="22" /><span>适宜人群</span></div>
                <div class="pm-pills">
                  <span v-for="(s, si) in item.suitableFor" :key="si" class="pm-pill">{{ s }}</span>
                </div>
              </div>

              <div v-if="item.steps && item.steps.length" class="pm-block">
                <div class="pm-block-head"><ClockIcon width="22" height="22" /><span>场次安排</span></div>
                <ol class="pm-list pm-list-ordered">
                  <li v-for="(s, si) in item.steps" :key="si">{{ s }}</li>
                </ol>
              </div>

              <div v-if="item.packageIncludes && item.packageIncludes.length" class="pm-block">
                <div class="pm-block-head"><MedalIcon width="22" height="22" /><span>票务包含</span></div>
                <div class="pm-pills">
                  <span v-for="(p, pi) in item.packageIncludes" :key="pi" class="pm-pill">{{ p }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pm-actions">
            <button class="pm-action pm-action-fav" :class="{ 'is-active': isFav }" @click="onToggleFavorite">
              <BookmarkIcon width="24" height="24" :filled="isFav" /><span>{{ isFav ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="pm-action pm-action-been" :class="{ 'is-active': isBeen }" @click="onToggleBeen">
              <FlagIcon width="24" height="24" :filled="isBeen" /><span>{{ isBeen ? '已体验' : '体验' }}</span>
            </button>
            <button class="pm-action pm-action-share" @click="onShare">
              <ShareIcon width="24" height="24" /><span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl" @close="closeShare" />
  </Teleport>
</template>

<style scoped src="./index.scss" lang="scss"></style>