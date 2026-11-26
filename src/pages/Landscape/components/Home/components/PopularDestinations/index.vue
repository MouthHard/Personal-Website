<template>
  <section v-if="destinations.length > 0" class="popular-destinations">
    <div class="section-header">
      <div class="header-plate">
        <span class="plate-glow" aria-hidden="true"></span>
        <span class="plate-sheen-clip" aria-hidden="true">
          <span class="plate-sheen"></span>
        </span>
        <span class="plate-corner tl" aria-hidden="true"></span>
        <span class="plate-corner tr" aria-hidden="true"></span>
        <span class="plate-corner bl" aria-hidden="true"></span>
        <span class="plate-corner br" aria-hidden="true"></span>

        <div class="header-left">
          <span class="title-badge" aria-hidden="true">
            <CompassIcon />
          </span>
          <div class="header-text">
            <span class="title-label">DESTINATIONS</span>
            <h2 class="section-title">梦境之地</h2>
            <p class="section-subtitle">探索世界最令人向往的旅行目的地</p>
          </div>
        </div>

        <span class="plate-chapter" aria-hidden="true">CHAPTER · 03</span>

        <button
          class="more-btn"
          :class="{ refreshing }"
          aria-label="刷新目的地"
          @click="handleMore"
        >
          <span class="ticket-stub" aria-hidden="true">
            <span class="stamp-teeth"></span>
            <span class="stamp-face"></span>
            <span class="stamp-glyph"></span>
          </span>
          <span class="ticket-tear" aria-hidden="true"></span>
          <span class="more-text">
            <span class="more-label">刷新</span>
            <span class="more-sub">下一站</span>
          </span>
          <span class="ticket-route" aria-hidden="true">
            <span class="route-line"></span>
            <span class="route-plane"></span>
          </span>
        </button>
      </div>
    </div>

    <div ref="rollRootRef" class="scroll-gallery" :class="{ refreshing }">
      <div class="roll" :class="{ 'is-refreshing': refreshing }">
        <span class="roll-shutter shutter-l" aria-hidden="true"></span>
        <span class="roll-shutter shutter-r" aria-hidden="true"></span>

        <article
          v-for="(dest, index) in destinations"
          :key="dest.id"
          class="panel"
          tabindex="0"
          :class="{ open: openIndex === index }"
          :style="{ '--i': index }"
          :aria-label="`展开 ${dest.name}`"
          @mouseenter="onPanelEnter(index)"
          @mouseleave="onPanelLeave"
          @focusin="openIndex = index"
        >
          <div class="panel-media">
            <LandscapeImage
              :src="dest.images?.spring"
              :alt="dest.name"
              loading="lazy"
            />
            <span class="media-shade" aria-hidden="true"></span>
            <span class="media-veil" aria-hidden="true"></span>
            <span class="media-tone" aria-hidden="true"></span>
          </div>

          <div class="panel-stub" aria-hidden="true">
            <span class="stub-no">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span class="stub-name">{{ dest.name }}</span>
            <span class="stub-score">★ {{ dest.score }}</span>
          </div>

          <div class="panel-info">
            <!-- 行李吊牌：穿孔铆环 + 帆布牌面 + 压印文字 -->
            <span class="info-kicker">
              <span class="kicker-eye" aria-hidden="true"></span>
              <LocationIcon :stroke-width="2" />
              <span class="kicker-text">
                {{ dest.country }} · {{ dest.bestTime }}
              </span>
            </span>
            <h3 class="info-name">{{ dest.name }}</h3>
            <p class="info-tips">{{ dest.tips }}</p>
            <div class="info-stats">
              <span class="stat-item stat-views">
                <EyeIcon :stroke-width="2" filled />
                {{ fmt(displayCount(dest.id, 'views')) }}
              </span>
              <span class="stat-item stat-likes">
                <ThumbUpIcon :stroke-width="2" filled />
                {{ fmt(displayCount(dest.id, 'likes')) }}
              </span>
              <span class="stat-item stat-loves">
                <HeartIcon :stroke-width="2" filled />
                {{ fmt(displayCount(dest.id, 'loves')) }}
              </span>
              <span class="stat-item stat-favorites">
                <BookmarkIcon :stroke-width="2" filled />
                {{ fmt(displayCount(dest.id, 'favorites')) }}
              </span>
              <span class="stat-item stat-shares">
                <ShareIcon :stroke-width="2" filled />
                {{ fmt(displayCount(dest.id, 'shares')) }}
              </span>
            </div>
            <!-- 相机机顶快门：左侧说明，右侧圆钮，按下有行程 -->
            <button class="info-explore" @click.stop="handleExplore(dest)">
              <span class="explore-copy">
                <span class="explore-label">探索此地</span>
                <span class="explore-sub" aria-hidden="true">
                  <span class="mark"></span>
                  <span class="mark"></span>
                  <span class="mark mark-center"></span>
                  <span class="mark"></span>
                  <span class="mark"></span>
                </span>
              </span>
              <span class="shutter" aria-hidden="true">
                <span class="shutter-knurl"></span>
                <span class="shutter-cap"></span>
              </span>
            </button>
          </div>
        </article>
      </div>

      <div class="roll-footer">
        <span class="roll-caption">SCROLL OF JOURNEYS · 展开的旅途</span>
        <div class="roll-dots">
          <button
            v-for="(dest, index) in destinations"
            :key="`dot-${dest.id}`"
            class="roll-dot"
            :class="{ active: openIndex === index }"
            :aria-label="`展开 ${dest.name}`"
            @click="openIndex = index"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';

  import CompassIcon from '@/pages/Landscape/icons/common/CompassIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import {
    useInteractionStore,
    useLandscapeDataStore,
  } from '@/stores/landscape';
  import type { Destination } from '@/typesOfPages/landscape/home';
  import { formatNumber as fmt, parseCount } from '@/utils/landscape/format';

  const router = useRouter();
  const interactionStore = useInteractionStore();
  const dataStore = useLandscapeDataStore();
  const openIndex = ref(0);
  const refreshing = ref(false);
  const rollRootRef = ref<HTMLElement | null>(null);
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  let swapTimer: ReturnType<typeof setTimeout> | null = null;
  let autoTimer: number | null = null;
  let rollObserver: IntersectionObserver | null = null;
  let rollVisible = false;
  let panelHovered = false;

  const allDestinations = computed(() => dataStore.getAllPopularDestinations());
  const pageIndex = ref(0);

  const destinations = computed<Destination[]>(() => {
    const all = allDestinations.value as Destination[];
    if (all.length <= 4) return all;
    const start = pageIndex.value * 4;
    return all.slice(start, start + 4);
  });

  /** 展开指定画幅：hover / 键盘聚焦 / 底部指示条都走这里 */
  const openPanel = (index: number) => {
    if (index < 0 || index >= destinations.value.length) return;
    openIndex.value = index;
  };

  const onPanelEnter = (index: number) => {
    panelHovered = true;
    openPanel(index);
  };

  const onPanelLeave = () => {
    panelHovered = false;
  };

  /** 自动巡游：进入视口才走，hover 或刷新时让路 */
  const advancePanel = () => {
    const total = destinations.value.length;
    if (total <= 1) return;
    openIndex.value = (openIndex.value + 1) % total;
  };

  function pickRandomDestinations() {
    const all = allDestinations.value;
    if (all.length <= 4) {
      pageIndex.value = 0;
      return;
    }
    const totalPages = Math.ceil(all.length / 4);
    pageIndex.value = (pageIndex.value + 1) % totalPages;
  }

  const getDestId = (id: string | number) => `pd-${id}`;
  const getDestCount = (id: string | number) =>
    interactionStore.getCount(getDestId(id));

  /* ===== 统计数字滚动 =====
   换批 / 点赞后数字从旧值滚到新值，避免干巴巴地跳一下。
   rAF + easeOutCubic，同一字段只保留一个动画，reduced-motion 直接落终值。 */
  const COUNT_FIELDS = [
    'views',
    'likes',
    'loves',
    'favorites',
    'shares',
  ] as const;
  type CountField = (typeof COUNT_FIELDS)[number];

  const shownCounts = ref<Record<string, number>>({});
  const countRafs = new Map<string, number>();

  const countKey = (id: string | number, field: CountField) => `${id}:${field}`;
  const displayCount = (id: string | number, field: CountField) =>
    shownCounts.value[countKey(id, field)] ?? 0;

  const playCount = (id: string | number, field: CountField, to: number) => {
    const key = countKey(id, field);
    const from = shownCounts.value[key] ?? 0;
    if (from === to) return;

    const running = countRafs.get(key);
    if (running) cancelAnimationFrame(running);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shownCounts.value[key] = to;
      return;
    }

    const start = performance.now();
    const duration = 820;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      shownCounts.value[key] = Math.round(from + (to - from) * eased);
      if (progress < 1) {
        countRafs.set(key, requestAnimationFrame(step));
      } else {
        shownCounts.value[key] = to;
        countRafs.delete(key);
      }
    };
    countRafs.set(key, requestAnimationFrame(step));
  };

  const handleMore = () => {
    if (refreshing.value) return;
    refreshing.value = true;
    if (refreshTimer) clearTimeout(refreshTimer);
    if (swapTimer) clearTimeout(swapTimer);

    // 像收起画卷：帘幕先在 0.46s 内合拢，合拢的瞬间才换画，再顺势展开
    swapTimer = setTimeout(() => {
      pickRandomDestinations();
      openIndex.value = 0;
      swapTimer = null;
    }, 460);

    refreshTimer = setTimeout(() => {
      refreshing.value = false;
      refreshTimer = null;
    }, 1250);
  };

  const handleExplore = (dest: Destination) => {
    if (dest.navigation) {
      router.push({
        path: '/landscape/category',
        query: {
          dimension: dest.navigation.dimension,
          category: dest.navigation.category,
          subCategory: dest.navigation.subCategory,
        },
      });
    }
  };

  watch(
    () => destinations.value,
    (newDests) => {
      if (!newDests || newDests.length === 0) return;
      interactionStore.registerBatch(
        newDests.map((dest) => ({
          id: getDestId(dest.id),
          counts: {
            likes: dest.likes || 0,
            views: parseCount(dest.views),
            loves: dest.loves || 0,
            favorites: dest.favorites || 0,
            shares: dest.shares || 0,
          },
        })),
      );
    },
    { immediate: true, deep: true },
  );

  /** 当前这四张卡的全部统计目标值，变一次就滚一次 */
  const countTargets = computed(() => {
    const list: Array<{ id: string | number; field: CountField; to: number }> =
      [];
    destinations.value.forEach((dest) => {
      const counts = getDestCount(dest.id);
      COUNT_FIELDS.forEach((field) => {
        list.push({ id: dest.id, field, to: counts[field] ?? 0 });
      });
    });
    return list;
  });

  watch(
    countTargets,
    (list) => {
      list.forEach(({ id, field, to }) => playCount(id, field, to));
    },
    { immediate: true },
  );

  onMounted(() => {
    // 尊重系统「减少动态效果」偏好，不启动自动巡游
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    autoTimer = window.setInterval(() => {
      if (!rollVisible || panelHovered || refreshing.value) return;
      advancePanel();
    }, 4600);

    if (!rollRootRef.value) return;
    rollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          rollVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.3 },
    );
    rollObserver.observe(rollRootRef.value);
  });

  onUnmounted(() => {
    if (refreshTimer) clearTimeout(refreshTimer);
    if (swapTimer) clearTimeout(swapTimer);
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    countRafs.forEach((raf) => cancelAnimationFrame(raf));
    countRafs.clear();
    rollObserver?.disconnect();
    rollObserver = null;
  });
</script>

<style scoped lang="scss" src="./index.scss" />
