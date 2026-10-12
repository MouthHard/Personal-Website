<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { ScenerySpot, ExperienceItem } from '@/typesOfPages/travelGuide';
  import {
    CloseIcon,
    LocationIcon,
  } from '@/pages/TravelGuide/icons/common';
  import MyEmpty from '../MyEmpty/index.vue';
  import ScenerySpotModal from '../../ScenerySpotModal/index.vue';
  import TravelShareModal from '../../TravelShareModal/index.vue';
  import { useTravelShare } from '../../TravelShareModal/useTravelShare';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';

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

  // 展示模式：6种类型各一种完全不同的展示方式
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

  // 拍立得微旋转（基于 id 稳定）
  const polaroidRotate = (id: string): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
    return ((hash % 700) - 350) / 100; // -3.5° ~ 3.5°
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

  // 日历日期（从 duration 或 name 提取）
  const festivalDay = (exp: ExperienceItem): string => {
    const m = (exp.duration || '').match(/(\d+)/);
    return m ? m[1] : '·';
  };
  const festivalMonth = (exp: ExperienceItem): string => {
    const m = (exp.duration || '').match(/(\d+)\D+(\d+)/);
    if (m) return m[1];
    const m2 = (exp.duration || '').match(/(\d+)/);
    return m2 ? m2[1] : '·';
  };
</script>

<template>
  <div class="my-scenery-panel" :data-mode="displayMode">
    <div class="panel-body">
      <MyEmpty v-if="isEmpty" :title="emptyText.title" :hint="emptyText.hint" />

      <!-- ====================================================== -->
      <!-- 1. 景点 — 拍立得照片墙（白色相纸 + 微旋转散落 + 手写地名） -->
      <!-- ====================================================== -->
      <ul v-else-if="displayMode === 'spot'" class="polaroid-wall">
        <li
          v-for="(spot, i) in currentSpots"
          :key="spot.id"
          class="polaroid"
          :style="{ transform: `rotate(${polaroidRotate(spot.id)}deg)`, zIndex: i }"
          @click="openSpotModal(spot)"
        >
          <div class="polaroid-photo">
            <img :src="spot.image" :alt="spot.name" loading="lazy" />
            <span v-if="spot.level" class="polaroid-level">{{ spot.level }}</span>
          </div>
          <div class="polaroid-caption">
            <span class="caption-name">{{ spot.name }}</span>
            <span class="caption-loc"><LocationIcon :size="10" /> {{ spot.location }}</span>
            <span v-if="spot.rating" class="caption-star">★ {{ spot.rating.toFixed(1) }}</span>
          </div>
          <div v-if="spot.tags && spot.tags.length" class="polaroid-tags">
            <span v-for="t in spot.tags.slice(0, 2)" :key="t" class="ptag">{{ t }}</span>
          </div>
          <button class="polaroid-pin" title="移除" @click.stop="handleRemoveSpot(spot.id)">
            <CloseIcon :size="10" />
          </button>
        </li>
      </ul>

      <!-- ====================================================== -->
      <!-- 2. 户外探险 — 登山日志卡片（牛皮纸 + 穿绳孔 + 海拔信息） -->
      <!-- ====================================================== -->
      <ul v-else-if="displayMode === 'outdoor'" class="trail-log">
        <li v-for="exp in currentExperiences" :key="exp.id" class="log-entry">
          <div class="log-bind-holes">
            <span></span><span></span><span></span>
          </div>
          <div class="log-photo">
            <img :src="exp.image" :alt="exp.name" loading="lazy" />
          </div>
          <div class="log-content">
            <div class="log-header">
              <span class="log-title">{{ exp.name }}</span>
              <span class="log-diff" :data-d="exp.difficulty">{{ exp.difficulty }}</span>
            </div>
            <div class="log-stats">
              <span v-if="(exp as any).maxElevation" class="log-stat stat-alt">
                <span class="stat-label">海拔</span>
                <span class="stat-val">{{ (exp as any).maxElevation }}m</span>
              </span>
              <span v-if="exp.duration" class="log-stat stat-dur">
                <span class="stat-label">时长</span>
                <span class="stat-val">{{ exp.duration }}</span>
              </span>
              <span class="log-stat stat-loc">
                <span class="stat-label">位置</span>
                <span class="stat-val">{{ exp.location }}</span>
              </span>
            </div>
            <p v-if="exp.description" class="log-desc">{{ exp.description }}</p>
          </div>
          <button class="log-remove" title="移除" @click="handleRemoveExp(exp.id, (exp as any).provinceId, (exp as any).experienceCategory)">
            <CloseIcon :size="11" />
          </button>
        </li>
      </ul>

      <!-- ====================================================== -->
      <!-- 3. 工坊体验 — 匠人印章册（宣纸 + 朱印 + 竖排工坊名） -->
      <!-- ====================================================== -->
      <ul v-else-if="displayMode === 'craft'" class="seal-album">
        <li v-for="exp in currentExperiences" :key="exp.id" class="seal-card">
          <div class="seal-paper">
            <div class="seal-img-frame">
              <img :src="exp.image" :alt="exp.name" loading="lazy" />
            </div>
            <div class="seal-info">
              <div class="seal-stamp">
                <span class="stamp-text">{{ exp.name }}</span>
              </div>
              <div class="seal-meta">
                <span v-if="exp.heritageLevel" class="seal-herit">{{ exp.heritageLevel === 'national' ? '国家级非遗' : exp.heritageLevel === 'provincial' ? '省级非遗' : '市级非遗' }}</span>
                <span class="seal-type">{{ exp.type }}</span>
              </div>
              <span class="seal-loc"><LocationIcon :size="10" /> {{ exp.location }}</span>
              <span v-if="exp.duration" class="seal-dur">{{ exp.duration }}</span>
            </div>
            <span v-if="exp.heritageLevel" class="seal-red-stamp">非遗</span>
          </div>
          <button class="seal-remove" title="移除" @click="handleRemoveExp(exp.id, (exp as any).provinceId, (exp as any).experienceCategory)">
            <CloseIcon :size="11" />
          </button>
        </li>
      </ul>

      <!-- ====================================================== -->
      <!-- 4. 演艺节目 — 老式戏票（撕票根 + 锯齿边 + 座位号） -->
      <!-- ====================================================== -->
      <ul v-else-if="displayMode === 'performance'" class="ticket-stub">
        <li v-for="(exp, i) in currentExperiences" :key="exp.id" class="ticket">
          <div class="ticket-left">
            <span class="stub-no">No.{{ String(i + 1).padStart(3, '0') }}</span>
            <span class="stub-type">{{ exp.type }}</span>
            <span v-if="exp.duration" class="stub-time">{{ exp.duration }}</span>
          </div>
          <div class="ticket-tear"></div>
          <div class="ticket-main">
            <div class="ticket-img">
              <img :src="exp.image" :alt="exp.name" loading="lazy" />
            </div>
            <div class="ticket-detail">
              <span class="ticket-name">{{ exp.name }}</span>
              <span class="ticket-loc"><LocationIcon :size="10" /> {{ exp.location }}</span>
              <span v-if="exp.price" class="ticket-price">¥ {{ exp.price }}</span>
              <p v-if="exp.description" class="ticket-desc">{{ exp.description }}</p>
            </div>
          </div>
          <button class="ticket-remove" title="移除" @click="handleRemoveExp(exp.id, (exp as any).provinceId, (exp as any).experienceCategory)">
            <CloseIcon :size="11" />
          </button>
        </li>
      </ul>

      <!-- ====================================================== -->
      <!-- 5. 休闲养生 — 茶笺药方签（宣纸卷轴 + 茶汤色 + 功效标签） -->
      <!-- ====================================================== -->
      <ul v-else-if="displayMode === 'wellness'" class="tea-scroll">
        <li v-for="exp in currentExperiences" :key="exp.id" class="tea-card">
          <div class="tea-roller-top"></div>
          <div class="tea-paper">
            <div class="tea-img-box">
              <img :src="exp.image" :alt="exp.name" loading="lazy" />
            </div>
            <div class="tea-body">
              <span class="tea-name">{{ exp.name }}</span>
              <span class="tea-type">{{ exp.type }}</span>
              <div class="tea-info">
                <span class="tea-loc"><LocationIcon :size="10" /> {{ exp.location }}</span>
                <span v-if="exp.duration" class="tea-dur">{{ exp.duration }}</span>
              </div>
              <div v-if="(exp as any).efficacyTags && (exp as any).efficacyTags.length" class="tea-eff">
                <span v-for="t in (exp as any).efficacyTags.slice(0, 3)" :key="t" class="eff-chip">{{ t }}</span>
              </div>
              <div v-else-if="exp.tags && exp.tags.length" class="tea-eff">
                <span v-for="t in exp.tags.slice(0, 3)" :key="t" class="eff-chip">{{ t }}</span>
              </div>
            </div>
            <span v-if="exp.heritageLevel" class="tea-seal">非遗</span>
          </div>
          <div class="tea-roller-bot"></div>
          <button class="tea-remove" title="移除" @click="handleRemoveExp(exp.id, (exp as any).provinceId, (exp as any).experienceCategory)">
            <CloseIcon :size="11" />
          </button>
        </li>
      </ul>

      <!-- ====================================================== -->
      <!-- 6. 节庆日历 — 日历翻页（日历页 + 大日期 + 翻页折角） -->
      <!-- ====================================================== -->
      <ul v-else-if="displayMode === 'festival'" class="calendar-flip">
        <li v-for="exp in currentExperiences" :key="exp.id" class="cal-page">
          <div class="cal-top">
            <span class="cal-month">{{ festivalMonth(exp) }}月</span>
            <div class="cal-rings">
              <span></span><span></span>
            </div>
          </div>
          <div class="cal-day">{{ festivalDay(exp) }}</div>
          <div class="cal-body">
            <div class="cal-img">
              <img :src="exp.image" :alt="exp.name" loading="lazy" />
            </div>
            <span class="cal-name">{{ exp.name }}</span>
            <span class="cal-loc"><LocationIcon :size="10" /> {{ exp.location }}</span>
            <p v-if="exp.description" class="cal-desc">{{ exp.description }}</p>
          </div>
          <div class="cal-fold"></div>
          <button class="cal-remove" title="移除" @click="handleRemoveExp(exp.id, (exp as any).provinceId, (exp as any).experienceCategory)">
            <CloseIcon :size="11" />
          </button>
        </li>
      </ul>
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
