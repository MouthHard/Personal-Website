<script setup lang="ts">
  import { computed } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import CloseIcon from '@/pages/TravelGuide/icons/common/CloseIcon.vue';
  import BookmarkIcon from '@/pages/TravelGuide/icons/common/BookmarkIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
  import MountainIcon from '@/pages/TravelGuide/icons/pages/scenery/MountainIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import RouteIcon from '@/pages/TravelGuide/icons/common/RouteIcon.vue';
  import TrendUpIcon from '@/pages/TravelGuide/icons/pages/scenery/TrendUpIcon.vue';
  import RefreshIcon from '@/pages/TravelGuide/icons/pages/scenery/RefreshIcon.vue';
  import LayersIcon from '@/pages/TravelGuide/icons/pages/scenery/LayersIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import BusIcon from '@/pages/TravelGuide/icons/pages/scenery/BusIcon.vue';
  import SunIcon from '@/pages/TravelGuide/icons/common/SunIcon.vue';
  import UsersIcon from '@/pages/TravelGuide/icons/pages/scenery/UsersIcon.vue';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import ShoppingBagIcon from '@/pages/TravelGuide/icons/common/ShoppingBagIcon.vue';
  import WarningIcon from '@/pages/TravelGuide/icons/common/WarningIcon.vue';
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

  const pid = computed(() => (props.item as any)?.provinceId || '');
  const CAT = 'outdoor';
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
    openShare(props.item.name, `${props.item.name}｜${props.item.location}｜户外探险`);
    showToast({ type: 'share', message: `正在分享 ${props.item.name}` });
  };

  const distanceOf = (item: any, idx: number) => {
    if (item.distance) return item.distance;
    return (8 + idx * 5 + (idx % 2) * 3).toFixed(1);
  };
  const suitableOf = (item: any) => {
    if (item.suitableFor && item.suitableFor.length) return item.suitableFor.join('·');
    return '户外爱好者';
  };
  const totalAscentOf = (item: any, idx: number) => {
    if (item.totalAscent) return item.totalAscent;
    const base = [1800, 200, 1200, 600, 1500];
    return base[idx % base.length];
  };
  const maxElevationOf = (item: any, idx: number) => {
    if (item.maxElevation) return item.maxElevation;
    const base = [1860, 200, 1500, 800, 2200];
    return base[idx % base.length];
  };
  const routeTypeOf = (item: any) => item.routeType || '折返';
  const surfaceTypeOf = (item: any) => item.surfaceType || '混合';
  const accessInfoOf = (item: any, idx: number) => {
    if (item.accessInfo) return item.accessInfo;
    const defaults = [
      '自驾至景区停车场，换乘景区巴士',
      '自驾至码头，乘竹筏出发',
      '高铁至最近站，转大巴前往',
      '包车前往起点，终点接驳返回',
    ];
    return defaults[idx % defaults.length];
  };
  const bestMonthsOf = (item: any, idx: number) => {
    if (item.bestMonths) return item.bestMonths;
    const defaults = ['4-5月·9-10月', '4-10月', '3-5月·9-11月', '6-8月', '全年'];
    return defaults[idx % defaults.length];
  };
  const trimItem = (v: string) => v.trim();
  const gearArrayOf = (item: any, idx: number) => {
    if (item.gearList && item.gearList.length) return item.gearList.map(trimItem);
    const defaults = [
      '登山杖·护膝·雨衣·保暖衣物',
      '防晒·救生衣·防水袋',
      '登山杖·头灯·能量补给',
      '徒步鞋·背包·充足饮水',
    ];
    return defaults[idx % defaults.length].split('·').map(trimItem);
  };
  const safetyArrayOf = (item: any, idx: number) => {
    if (item.safetyTips && item.safetyTips.length) return item.safetyTips.map(trimItem);
    const defaults = [
      '山顶温差大·雨后路滑·提前预约',
      '穿戴救生衣·听从船工指挥',
      '结伴同行·勿走未开发路线',
      '注意防晒·携带充足饮水',
    ];
    return defaults[idx % defaults.length].split('·').map(trimItem);
  };
</script>

<template>
  <Teleport to="body">
    <Transition name="outdoor-modal">
      <div v-if="visible && item" class="om-mask" @click.self="emit('close')">
        <div class="outdoor-modal" role="dialog" aria-modal="true">
          <span class="om-rivet om-rivet-tl" />
          <span class="om-rivet om-rivet-tr" />
          <span class="om-rivet om-rivet-bl" />
          <span class="om-rivet om-rivet-br" />

          <div class="om-header">
            <svg class="om-hang" viewBox="0 0 80 56" aria-hidden="true">
              <defs>
                <linearGradient id="omRope" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#8a7a5e" />
                  <stop offset="0.5" stop-color="#5a4a38" />
                  <stop offset="1" stop-color="#2a2018" />
                </linearGradient>
                <linearGradient id="omSteel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#e8e8f0" />
                  <stop offset="0.3" stop-color="#b8b8c0" />
                  <stop offset="0.55" stop-color="#8a8a92" />
                  <stop offset="0.8" stop-color="#6a6a72" />
                  <stop offset="1" stop-color="#4a4a52" />
                </linearGradient>
                <radialGradient id="omRivet" cx="0.35" cy="0.35">
                  <stop offset="0" stop-color="#e0c890" />
                  <stop offset="0.6" stop-color="#a07828" />
                  <stop offset="1" stop-color="#4a2e08" />
                </radialGradient>
              </defs>
              <ellipse cx="40" cy="14" rx="22" ry="11" fill="none" stroke="url(#omRope)" stroke-width="5" stroke-linecap="round" />
              <ellipse cx="40" cy="14" rx="22" ry="11" fill="none" stroke="#1a120a" stroke-width="0.8" stroke-dasharray="2.5 2" />
              <path d="M22,14 Q22,8 28,6" fill="none" stroke="rgba(255,235,190,0.3)" stroke-width="1.5" stroke-linecap="round" />
              <path d="M26,28 L26,44 L54,44 L54,28 Q54,22 40,22 Q26,22 26,28 Z" fill="url(#omSteel)" stroke="#2a2a32" stroke-width="1.5" />
              <path d="M29,26 Q29,24 40,24 Q51,24 51,26" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" />
              <path d="M28,44 L52,44" stroke="rgba(0,0,0,0.3)" stroke-width="0.8" />
              <circle cx="30" cy="40" r="2.5" fill="url(#omRivet)" />
              <circle cx="50" cy="40" r="2.5" fill="url(#omRivet)" />
            </svg>
            <div class="om-title-wrap">
              <h2 class="om-title">{{ item.name }}</h2>
              <span class="om-diff" :data-d="item.difficulty">{{ item.difficulty }}</span>
            </div>
            <button class="om-close" aria-label="关闭" @click="emit('close')">
              <CloseIcon width="26" height="26" />
            </button>
          </div>

          <div class="om-body">
            <div class="om-aside">
              <div class="om-polaroid">
                <span class="om-tape om-tape-tl" />
                <span class="om-tape om-tape-br" />
                <img :src="item.image" :alt="item.name" loading="lazy" />
              </div>

              <div class="om-badges">
                <span class="om-badge om-badge-type"><MapIcon width="22" height="22" />{{ item.type || '徒步穿越' }}</span>
                <span v-if="item.rating" class="om-badge om-badge-rate">
                  <StarIcon width="22" height="22" />{{ item.rating }}<span v-if="item.reviewCount" class="om-rate-count">({{ item.reviewCount }})</span>
                </span>
                <span v-if="item.price" class="om-badge om-badge-price">¥{{ item.price }}起</span>
              </div>

              <div class="om-loc"><LocationIcon width="24" height="24" /><span>{{ item.location }}</span></div>

              <div v-if="item.tags && item.tags.length" class="om-tags">
                <span v-for="(t, ti) in item.tags" :key="ti" class="om-tag">{{ t }}</span>
              </div>
            </div>

            <div class="om-detail">
              <div class="om-stamp">
                <p v-if="item.description" class="om-stamp-text">{{ item.description }}</p>
              </div>

              <div class="om-data-grid">
                <span class="om-cell"><MountainIcon width="24" height="24" /><span class="om-cell-label">海拔</span><span class="om-cell-val">{{ maxElevationOf(item, 0) }}m</span></span>
                <span class="om-cell"><ClockIcon width="24" height="24" /><span class="om-cell-label">时长</span><span class="om-cell-val">{{ item.duration }}</span></span>
                <span class="om-cell"><RouteIcon width="24" height="24" /><span class="om-cell-label">距离</span><span class="om-cell-val">{{ distanceOf(item, 0) }}km</span></span>
                <span class="om-cell"><TrendUpIcon width="24" height="24" /><span class="om-cell-label">爬升</span><span class="om-cell-val">{{ totalAscentOf(item, 0) }}m</span></span>
                <span class="om-cell"><RefreshIcon width="24" height="24" /><span class="om-cell-label">路线</span><span class="om-cell-val">{{ routeTypeOf(item) }}</span></span>
                <span class="om-cell"><LayersIcon width="24" height="24" /><span class="om-cell-label">路面</span><span class="om-cell-val">{{ surfaceTypeOf(item) }}</span></span>
              </div>

              <div class="om-season">
                <span class="om-season-cell"><SunIcon width="24" height="24" /><span class="om-season-label">最佳季节</span><span class="om-season-val">{{ bestMonthsOf(item, 0) }}</span></span>
                <span class="om-season-cell"><UsersIcon width="24" height="24" /><span class="om-season-label">适合</span><span class="om-season-val">{{ suitableOf(item) }}</span></span>
              </div>

              <div class="om-access"><BusIcon width="24" height="24" /><span class="om-access-label">到达</span><span>{{ accessInfoOf(item, 0) }}</span></div>

              <div class="om-duo">
                <div class="om-block">
                  <div class="om-block-head"><ShoppingBagIcon width="24" height="24" /><span>装备建议</span></div>
                  <div class="om-pills">
                    <span v-for="(g, gi) in gearArrayOf(item, 0)" :key="gi" class="om-pill">{{ g }}</span>
                  </div>
                </div>

                <div class="om-block">
                  <div class="om-block-head om-block-head-warn"><WarningIcon width="24" height="24" /><span>安全提示</span></div>
                  <div class="om-pills">
                    <span v-for="(t, ti) in safetyArrayOf(item, 0)" :key="ti" class="om-pill om-pill-warn">{{ t }}</span>
                  </div>
                </div>
              </div>

              <div class="om-ext-grid">
                <div v-if="item.weatherTips" class="om-ext"><span class="om-ext-label">天气提示</span><span class="om-ext-val">{{ item.weatherTips }}</span></div>
                <div v-if="item.supplyPoints" class="om-ext"><span class="om-ext-label">补给点</span><span class="om-ext-val">{{ item.supplyPoints }}</span></div>
                <div v-if="item.bestSeason" class="om-ext"><span class="om-ext-label">最佳季节</span><span class="om-ext-val">{{ item.bestSeason }}</span></div>
                <div v-if="item.reservation" class="om-ext"><span class="om-ext-label">预约</span><span class="om-ext-val">{{ item.reservation }}</span></div>
                <div v-if="item.heritageLevel" class="om-ext"><span class="om-ext-label">非遗级别</span><span class="om-ext-val">{{ item.heritageLevel }}</span></div>
                <div v-if="item.instructor" class="om-ext"><span class="om-ext-label">导师</span><span class="om-ext-val">{{ item.instructor }}</span></div>
              </div>

              <div v-if="item.highlights && item.highlights.length" class="om-block">
                <div class="om-block-head"><StarIcon width="24" height="24" /><span>行程亮点</span></div>
                <ul class="om-list"><li v-for="(h, hi) in item.highlights" :key="hi">{{ h }}</li></ul>
              </div>

              <div v-if="item.packageIncludes && item.packageIncludes.length" class="om-block">
                <div class="om-block-head"><ShoppingBagIcon width="24" height="24" /><span>包含项目</span></div>
                <ul class="om-list"><li v-for="(p, pi) in item.packageIncludes" :key="pi">{{ p }}</li></ul>
              </div>

              <div v-if="item.steps && item.steps.length" class="om-block">
                <div class="om-block-head"><RouteIcon width="24" height="24" /><span>行程步骤</span></div>
                <ol class="om-list om-list-ordered"><li v-for="(s, si) in item.steps" :key="si">{{ s }}</li></ol>
              </div>
            </div>
          </div>

          <div class="om-actions">
            <button class="om-action om-action-fav" :class="{ 'is-active': isFav }" @click="onToggleFavorite">
              <BookmarkIcon width="24" height="24" :filled="isFav" /><span>{{ isFav ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="om-action om-action-been" :class="{ 'is-active': isBeen }" @click="onToggleBeen">
              <FlagIcon width="24" height="24" :filled="isBeen" /><span>{{ isBeen ? '已体验' : '体验' }}</span>
            </button>
            <button class="om-action om-action-share" @click="onShare">
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