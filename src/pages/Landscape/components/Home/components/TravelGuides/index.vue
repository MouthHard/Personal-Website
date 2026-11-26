<template>
  <section v-if="guides.length > 0" class="travel-guides">
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
            <BookIcon />
          </span>
          <div class="header-text">
            <span class="title-label">旅途档案</span>
            <h2 class="section-title">行者手记</h2>
            <p class="section-subtitle">发现世界的每一个角落</p>
          </div>
        </div>

        <span class="plate-chapter" aria-hidden="true">CHAPTER · 04</span>

        <span class="plate-rule" aria-hidden="true"></span>

        <button
          class="more-btn"
          aria-label="查看更多指南攻略"
          @click="handleMore"
        >
          <span class="compass-mark" aria-hidden="true">
            <span class="compass-ring"></span>
            <span class="compass-ticks"></span>
            <span class="compass-face"></span>
            <span class="compass-needle"></span>
            <span class="compass-core"></span>
          </span>
          <span class="more-text">
            <span class="more-label">更多</span>
            <span class="more-sub">攻略</span>
          </span>
          <span class="more-arrow" aria-hidden="true"></span>
        </button>
      </div>
    </div>

    <!-- 翻牌屏：机场出发信息板 -->
    <div v-if="activeGuide" class="flap-board">
      <!-- 玻璃罩：老式登机屏外面那层玻璃，反光、扫描线、四角固定铆钉 -->
      <span class="board-glass" aria-hidden="true"></span>
      <!-- 灯带：左边照片切成竖条逐条翻落，右边切出一块数据栏 -->
      <div class="board-strip">
        <div class="strip-view">
          <div class="strip-track">
            <div
              v-for="i in STRIPS"
              :key="i"
              class="strip"
              :style="{ '--i': i - 1, '--n': STRIPS }"
            >
              <span class="strip-photo">
                <LandscapeImage
                  :src="activeGuide.cover"
                  :alt="activeGuide.title"
                  loading="lazy"
                />
              </span>
              <span
                :key="`flap-${activeGuide.id}-${i}`"
                class="strip-flap"
                aria-hidden="true"
              ></span>
            </div>
          </div>

          <span class="strip-scrim" aria-hidden="true"></span>

          <!-- 取景器：四角框线 + 中心准星，照片像从取景窗里看出去 -->
          <span class="frame-corners" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
          <span class="frame-cross" aria-hidden="true"></span>
        </div>

        <aside class="strip-stats">
          <div class="stats-head">
            <span class="stats-head-text">实时数据</span>
          </div>

          <div class="stats-list">
            <div class="stat is-views">
              <span class="stat-icon">
                <EyeIcon :stroke-width="1.6" :filled="true" />
              </span>
              <span class="stat-body">
                <span class="stat-label">浏览</span>
                <span class="stat-bar" aria-hidden="true">
                  <i :style="{ width: statRatio('views') }"></i>
                </span>
              </span>
              <span class="stat-num">
                {{ fmtCount(getGuideCount(activeGuide.id).views) }}
              </span>
            </div>

            <button
              class="stat is-like"
              :class="{ on: isLiked(activeGuide.id) }"
              type="button"
              :aria-pressed="isLiked(activeGuide.id)"
              :aria-label="`为《${activeGuide.title}》点赞`"
              @click.stop="handleToggleLike(activeGuide)"
            >
              <span class="stat-icon">
                <ThumbUpIcon
                  :stroke-width="1.6"
                  :filled="isLiked(activeGuide.id)"
                />
              </span>
              <span class="stat-body">
                <span class="stat-label">点赞</span>
                <span class="stat-bar" aria-hidden="true">
                  <i :style="{ width: statRatio('likes') }"></i>
                </span>
              </span>
              <span class="stat-num">
                {{ fmtCount(getGuideCount(activeGuide.id).likes) }}
              </span>
            </button>

            <button
              class="stat is-love"
              :class="{ on: isLoved(activeGuide.id) }"
              type="button"
              :aria-pressed="isLoved(activeGuide.id)"
              :aria-label="`喜欢《${activeGuide.title}》`"
              @click.stop="handleToggleLove(activeGuide)"
            >
              <span class="stat-icon">
                <HeartIcon
                  :stroke-width="1.6"
                  :filled="isLoved(activeGuide.id)"
                />
              </span>
              <span class="stat-body">
                <span class="stat-label">喜欢</span>
                <span class="stat-bar" aria-hidden="true">
                  <i :style="{ width: statRatio('loves') }"></i>
                </span>
              </span>
              <span class="stat-num">{{ getDisplayLoves(activeGuide) }}</span>
            </button>

            <button
              class="stat is-fav"
              :class="{ on: isFavorited(activeGuide.id) }"
              type="button"
              :aria-pressed="isFavorited(activeGuide.id)"
              :aria-label="`收藏《${activeGuide.title}》`"
              @click.stop="handleToggleFavorite(activeGuide)"
            >
              <span class="stat-icon">
                <BookmarkIcon
                  :stroke-width="1.6"
                  :filled="isFavorited(activeGuide.id)"
                />
              </span>
              <span class="stat-body">
                <span class="stat-label">收藏</span>
                <span class="stat-bar" aria-hidden="true">
                  <i :style="{ width: statRatio('favorites') }"></i>
                </span>
              </span>
              <span class="stat-num">
                {{ getDisplayCollections(activeGuide) }}
              </span>
            </button>

            <button
              class="stat is-share"
              type="button"
              :aria-label="`分享《${activeGuide.title}》`"
              @click.stop="handleShare(activeGuide)"
            >
              <span class="stat-icon">
                <ShareIcon :stroke-width="1.6" :filled="true" />
              </span>
              <span class="stat-body">
                <span class="stat-label">分享</span>
                <span class="stat-bar" aria-hidden="true">
                  <i :style="{ width: statRatio('shares') }"></i>
                </span>
              </span>
              <span class="stat-num">{{ getDisplayShares(activeGuide) }}</span>
            </button>
          </div>

          <button
            class="read-btn"
            type="button"
            :aria-label="`阅读《${activeGuide.title}》全文`"
            @click="handleCardClick(activeGuide)"
          >
            读这篇
            <span class="read-arrow" aria-hidden="true">
              <ChevronRightIcon :stroke-width="2.4" />
            </span>
          </button>
        </aside>
      </div>

      <!-- 灯带与板身之间的铰链带 -->
      <span class="board-hinge" aria-hidden="true">
        <i></i>
        <i></i>
      </span>

      <div class="board-body">
        <div class="board-main">
          <div class="dest-row">
            <div class="dest-head">
              <span class="dest-label">目的地</span>
              <span class="dest-gate">第 {{ pad(station + 1) }} 站</span>
            </div>
            <div class="dest-body">
              <div
                class="dest-flap"
                role="group"
                :aria-label="`目的地 ${activeGuide.location}`"
              >
                <span
                  v-for="(ch, index) in destChars"
                  :key="`${activeGuide.id}-cell-${index}`"
                  class="flap-cell"
                  :style="{ '--i': index }"
                  aria-hidden="true"
                >
                  <span class="cell-face">{{ ch }}</span>
                  <span class="cell-seam"></span>
                </span>
              </div>
            </div>
          </div>

          <h3 :key="`${activeGuide.id}-title`" class="board-title">
            {{ activeGuide.title }}
          </h3>

          <div
            v-if="visibleRoute.length > 0"
            ref="routeLineRef"
            class="route-line"
          >
            <span class="route-tag">
              <span class="route-plane" aria-hidden="true">✈</span>
              沿途
            </span>
            <template v-for="(point, index) in visibleRoute" :key="point.raw">
              <span
                v-if="index > 0"
                class="route-arrow"
                :style="{ '--tone': toneAt(index) }"
                aria-hidden="true"
              >
                →
              </span>
              <span class="route-stop" :style="{ '--tone': toneAt(index) }">
                {{ point.name }}
              </span>
            </template>
            <span v-if="restRouteCount > 0" class="route-rest">
              +{{ restRouteCount }}
            </span>
          </div>
        </div>

        <aside class="board-side">
          <span class="side-head">
            <span class="side-head-mark" aria-hidden="true"></span>
            行程信息
            <span class="side-head-sub" aria-hidden="true">TRAVEL LOG</span>
          </span>

          <dl class="info-rows">
            <div
              v-for="(field, index) in infoFields"
              :key="field.label"
              class="info-row"
              :style="{ '--tone': field.tone }"
            >
              <span class="row-index" aria-hidden="true">
                {{ pad(index + 1) }}
              </span>
              <dt class="row-label">{{ field.label }}</dt>
              <dd :key="field.value" class="row-value">{{ field.value }}</dd>
            </div>
          </dl>

          <div class="side-stub" aria-hidden="true">
            <span class="stub-barcode"></span>
            <span class="stub-micro">BOARDING PASS · 旅行凭据</span>
          </div>
        </aside>
      </div>

      <!-- 登机口：站点即导航 -->
      <nav class="board-gates" aria-label="选择目的地">
        <div class="gates-head">
          <span class="gates-hint">登机口</span>
          <span class="gate-code">
            第
            <b>{{ pad(page + 1) }} / {{ pad(pageCount) }}</b>
            组
          </span>
        </div>

        <div class="gates-row">
          <button
            class="gate-arrow"
            type="button"
            :disabled="page === 0"
            aria-label="上一组目的地"
            @click="goPage(-1)"
          >
            ‹ 上一组
          </button>

          <ol class="gate-list">
            <li v-for="(guide, index) in pageGuides" :key="guide.id">
              <button
                class="gate"
                type="button"
                :class="{ active: index === station }"
                :style="{ '--tone': toneAt(index) }"
                :aria-current="index === station"
                :aria-label="`第 ${index + 1} 站：${guide.location}${guideSubtitles[guide.id] ? `，${guideSubtitles[guide.id]}` : ''}`"
                @click="goStation(index)"
              >
                <span class="gate-sheen" aria-hidden="true"></span>
                <span class="gate-rail" aria-hidden="true"></span>
                <span class="gate-flap" aria-hidden="true">
                  <span class="gate-no">{{ pad(index + 1) }}</span>
                  <span class="gate-seam"></span>
                </span>
                <span class="gate-copy">
                  <span class="gate-name">
                    {{ guide.location }}
                  </span>
                  <span v-if="guideSubtitles[guide.id]" class="gate-sub">
                    {{ guideSubtitles[guide.id] }}
                  </span>
                </span>
                <span class="gate-barcode" aria-hidden="true"></span>
              </button>
            </li>
          </ol>

          <button
            class="gate-arrow"
            type="button"
            :disabled="page >= pageCount - 1"
            aria-label="下一组目的地"
            @click="goPage(1)"
          >
            下一组 ›
          </button>
        </div>
      </nav>
    </div>
  </section>

  <ShareMenu v-model:visible="showShareMenu" :work="shareWork" />
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { showMessage } from '@/utils/landscape';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import ShareMenu from '../../../common/ShareMenu/index.vue';
  import ChevronRightIcon from '@/pages/Landscape/icons/common/ChevronRightIcon.vue';
  import BookIcon from '@/pages/Landscape/icons/common/BookIcon.vue';

  import {
    useLandscapeDataStore,
    useInteractionStore,
  } from '@/stores/landscape';
  import type { InteractionItem } from '@/typesOfPages/landscape';
  import {
    GUIDE_DEFAULTS,
    DATE_DEFAULTS,
    AUTHOR_DEFAULTS,
  } from '@/constants/landscape/defaults';

  import type { GlobalGuide } from '@/typesOfPages/landscape/data';

  /** 一组四条，正好是屏幕上一排登机口 */
  const PAGE_SIZE = 4;
  /** 灯带切成几条竖片，逐条翻过去 */
  const STRIPS = 8;

  const router = useRouter();
  const interactionStore = useInteractionStore();
  const dataStore = useLandscapeDataStore();

  const page = ref(0);
  const station = ref(0);

  const showShareMenu = ref(false);
  const currentShareGuide = ref<GlobalGuide | null>(null);
  const shareWork = computed(() => {
    const g = currentShareGuide.value;
    if (!g) return {};
    return {
      type: 'guide' as const,
      title: g.title,
      description: g.excerpt,
      cover: g.cover,
      author: g.author,
      date: g.date,
      location: g.location,
      category: g.typeName || g.category,
      rating: g.rating,
      readTime: g.readTime,
    };
  });

  const guides = computed(() => dataStore.getAllGuides());
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(guides.value.length / PAGE_SIZE)),
  );
  const pageGuides = computed(() =>
    guides.value.slice(
      page.value * PAGE_SIZE,
      page.value * PAGE_SIZE + PAGE_SIZE,
    ),
  );
  const activeGuide = computed<GlobalGuide | null>(
    () => pageGuides.value[station.value] ?? pageGuides.value[0] ?? null,
  );

  const pad = (value: number) => String(value).padStart(2, '0');

  /**
   * 底部信息区的点缀色：同一块暗紫底板上，按顺序轮换几种霓虹色，
   * 只染小部件（胶囊、序号块、灯条、翻牌格），底色不动，才不会花。
   */
  const BOARD_TONES = [
    '#6fe3dc',
    '#ffc46e',
    '#ff8fa6',
    '#8fe3a6',
    '#8cc8ff',
  ] as const;
  const toneAt = (index: number) => BOARD_TONES[index % BOARD_TONES.length];

  /**
   * 登机口副标题：每个登机口都显示一行主题数据，像登机牌上的航班信息。
   * 取 tags 前两项；若同一地点内 tags 组合也相同（如两篇微距花市），
   * 改用标题短版区分，避免两个相邻登机口看起来完全一样。
   */
  const guideSubtitles = computed<Record<string, string>>(() => {
    const byLocation = new Map<string, GlobalGuide[]>();
    for (const guide of guides.value) {
      const bucket = byLocation.get(guide.location) ?? [];
      bucket.push(guide);
      byLocation.set(guide.location, bucket);
    }

    const shortTitle = (guide: GlobalGuide) =>
      (guide.title ?? '')
        .replace(/(技巧|指南|大全|进阶|摄影)/g, '')
        .slice(0, 6);

    const result: Record<string, string> = {};
    for (const bucket of byLocation.values()) {
      const pick = (guide: GlobalGuide) => {
        const joined = (guide.tags ?? []).slice(0, 2).join('·');
        if (!joined) return shortTitle(guide);
        // 超过 6 字在窄登机口里会被截断，只留第一个标签保证完整可读
        return joined.length > 6 ? (guide.tags ?? [])[0] : joined;
      };
      const counts = new Map<string, number>();
      for (const guide of bucket) {
        const key = pick(guide);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      for (const guide of bucket) {
        const key = pick(guide);
        result[guide.id] =
          (counts.get(key) ?? 0) > 1 ? shortTitle(guide) || key : key;
      }
    }
    return result;
  });

  /** 数字按中文习惯写：一万以上用「万」，其余直接写阿拉伯数字，避免 2.8k 这种洋缩写 */
  const fmtCount = (value: number) =>
    value >= 10000
      ? `${(value / 10000).toFixed(1).replace(/\.0$/, '')}万`
      : String(Math.round(value));

  /** 目的地拆成单字，一个字一格翻牌 */
  const destChars = computed(() =>
    Array.from((activeGuide.value?.location ?? '').trim()).map((ch) =>
      ch === ' ' ? '\u00a0' : ch,
    ),
  );

  /** 「30天以上」在小格子里会被省略号切掉，去掉尾巴上的虚词 */
  const cleanDuration = computed(() =>
    (activeGuide.value?.duration || '—').replace(/(以上|左右|不等|约)$/g, ''),
  );

  const infoFields = computed(() => {
    const g = activeGuide.value;
    if (!g) return [];
    return [
      {
        label: '类型',
        value: g.typeName || g.category || '风光',
        tone: '#6fe3dc',
      },
      { label: '天数', value: cleanDuration.value, tone: '#ffc46e' },
      {
        label: '季节',
        value: g.season || GUIDE_DEFAULTS.season,
        tone: '#8fe3a6',
      },
      {
        label: '评分',
        value: g.rating ? String(g.rating) : '—',
        tone: '#ff8fa6',
      },
    ];
  });

  interface RoutePoint {
    name: string;
    alt: string;
    note: string;
    raw: string;
  }

  /**
   * routePoints 的写法很杂：「拉萨(3650m) - 适应1天」「黄金圈(2天) - 极光拍摄」
   * 「机位勘察：白天踩点」「踩点了解动物活动规律」。统一拆成
   * 地名 / 括号里的海拔或天数 / 破折号或冒号后的备注。
   */
  const parseRoutePoint = (raw: string): RoutePoint => {
    const parenMatch = /[(（]([^)）]+)[)）]/.exec(raw);
    let rest = raw.replace(/[(（][^)）]*[)）]/g, '').trim();
    let note = '';

    const dashIndex = rest.search(/[-–—]/);
    if (dashIndex > -1) {
      note = rest.slice(dashIndex + 1).trim();
      rest = rest.slice(0, dashIndex).trim();
    }

    const colonIndex = rest.search(/[:：]/);
    if (colonIndex > -1) {
      note = [rest.slice(colonIndex + 1).trim(), note]
        .filter(Boolean)
        .join(' · ');
      rest = rest.slice(0, colonIndex).trim();
    }

    return {
      name: rest || raw,
      alt: parenMatch ? parenMatch[1].trim() : '',
      note,
      raw,
    };
  };

  /** 只留像地名的点：有些数据里 routePoints 写的是「踩点了解动物活动规律」这类说明句，铺在牌子上很丑 */
  const isPlacePoint = (point: RoutePoint) =>
    point.name.length <= 6 && !/[，。、；：！？]/.test(point.name);

  const placePoints = computed(() =>
    (activeGuide.value?.routePoints ?? [])
      .map(parseRoutePoint)
      .filter(isPlacePoint),
  );

  /**
   * 沿途默认全展开，只有真的放不下才折叠成 +N。
   * 折叠数量按实际排版量出来，不同站点地名长短不一也能自适应宽度。
   */
  const routeLineRef = ref<HTMLElement | null>(null);
  const routeLimit = ref(99);
  const visibleRoute = computed<RoutePoint[]>(() =>
    placePoints.value.slice(0, routeLimit.value),
  );
  const restRouteCount = computed(() =>
    Math.max(0, placePoints.value.length - visibleRoute.value.length),
  );

  const fitRoute = async () => {
    const points = placePoints.value;
    const line = routeLineRef.value;
    if (!line || points.length === 0) return;

    // 先全部铺开，量每个站点与箭头的真实宽度
    routeLimit.value = points.length;
    await nextTick();

    const el = routeLineRef.value;
    if (!el || placePoints.value.length !== points.length) return;

    const tag = el.querySelector<HTMLElement>('.route-tag');
    const stops = Array.from(el.querySelectorAll<HTMLElement>('.route-stop'));
    const arrow = el.querySelector<HTMLElement>('.route-arrow');
    if (!tag || stops.length === 0) return;

    const cs = getComputedStyle(el);
    const gap = parseFloat(cs.columnGap) || 0;
    const available =
      el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const tagW = tag.getBoundingClientRect().width;
    const arrowW = arrow ? arrow.getBoundingClientRect().width : 0;
    const widths = stops.map((stop) => stop.getBoundingClientRect().width);
    /** k 个地名的行宽：标签 + k 组「箭头 + 地名」 + (2k − 1) 个间距 */
    const rowWidth = (k: number) =>
      widths
        .slice(0, k)
        .reduce((sum, w) => sum + arrowW + w, tagW + gap * (2 * k - 1));
    // +N 胶囊的估算宽度（真实宽度随后再校一次）
    const restChip = 46;

    let fit = widths.length;
    if (rowWidth(fit) > available) {
      fit = widths.length - 1;
      while (fit > 1 && rowWidth(fit) + gap + restChip > available) fit -= 1;
    }
    routeLimit.value = Math.max(1, fit);
    await nextTick();

    // 用真实的 +N 宽度回校，避免估算偏小撑破导轨
    for (let guard = 0; guard < 4; guard += 1) {
      const box = routeLineRef.value;
      if (!box || box.scrollWidth - box.clientWidth <= 1) break;
      if (routeLimit.value <= 1) break;
      routeLimit.value -= 1;
      await nextTick();
    }
  };

  watch(
    () => activeGuide.value?.id,
    () => nextTick(fitRoute),
    { flush: 'post', immediate: true },
  );

  let routeRaf = 0;
  const handleRouteResize = () => {
    if (routeRaf) return;
    routeRaf = requestAnimationFrame(() => {
      routeRaf = 0;
      fitRoute();
    });
  };

  const goStation = (index: number) => {
    if (index < 0 || index >= pageGuides.value.length) return;
    if (index === station.value) return;
    station.value = index;
  };

  /**
   * 切换站点即换封面，若还没进缓存会闪一下「加载中」占位，
   * 提前把本页与下一页的封面塞进浏览器缓存来避开。
   */
  const preloadedCovers = new Set<string>();
  const preloadCover = (src?: string) => {
    if (!src || preloadedCovers.has(src)) return;
    preloadedCovers.add(src);
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  };
  const preloadPages = (target: number) => {
    guides.value
      .slice(target * PAGE_SIZE, target * PAGE_SIZE + PAGE_SIZE * 2)
      .forEach((guide) => preloadCover(guide.cover));
  };

  /** 换一组：整块牌子重新翻一遍，不保留上一组的位移 */
  const goPage = (delta: number) => {
    const next = page.value + delta;
    if (next < 0 || next >= pageCount.value) return;
    page.value = next;
    station.value = 0;
  };

  watch(page, (value) => preloadPages(value));

  const getGuideId = (id: string | number) => String(id);
  const getGuideCount = (id: string | number) =>
    interactionStore.getCount(getGuideId(id));

  const convertToInteractionItem = (guide: GlobalGuide): InteractionItem => {
    const gId = getGuideId(guide.id);
    const c = interactionStore.getCount(gId);
    return {
      id: gId,
      type: 'guide',
      title: guide.title,
      image: guide.cover,
      location: guide.location || guide.tags?.[0] || '未知目的地',
      category: guide.typeName,
      timestamp: Date.now(),
      likes: c.likes,
      views: c.views,
      favorites: c.favorites,
      shares: c.shares,
      summary: guide.excerpt || GUIDE_DEFAULTS.summary,
      author: guide.author || AUTHOR_DEFAULTS.name,
      authorId: guide.authorId,
      authorAvatar: guide.authorAvatar,
      authorVerified: true,
      difficulty: guide.difficulty || GUIDE_DEFAULTS.difficulty,
      rating: guide.rating || GUIDE_DEFAULTS.rating,
      ratingCount: GUIDE_DEFAULTS.ratingCount,
      readTime: guide.readTime || GUIDE_DEFAULTS.readTime,
      saves: c.favorites,
      comments: guide.comments || GUIDE_DEFAULTS.comments,
      date: guide.date || DATE_DEFAULTS.fallback,
      isEditorPick: guide.id === '1',
      season: guide.season || GUIDE_DEFAULTS.season,
      duration: guide.duration || '7天',
      transport: guide.transport || GUIDE_DEFAULTS.transport,
      budget: guide.budget || GUIDE_DEFAULTS.budget,
      audience: guide.audience || '摄影爱好者、户外探险者',
      highlights: guide.highlights || [
        '极致自然风光',
        '独特地质景观',
        '丰富摄影机会',
        '深度文化体验',
      ],
      accommodation: guide.accommodation || GUIDE_DEFAULTS.accommodation,
      language: guide.language || GUIDE_DEFAULTS.language,
      warnings: guide.warnings || [
        '注意天气变化',
        '准备防寒装备',
        '提前预约住宿',
      ],
      shootTime: guide.shootTime || GUIDE_DEFAULTS.shootTime,
      shootParams: guide.shootParams || [
        { label: '相机', value: '全画幅单反' },
        { label: '镜头', value: '广角16-35mm' },
        { label: '滤镜', value: 'ND减光镜' },
      ],
      gears: guide.gears || [
        { name: '全画幅相机', required: true },
        { name: '广角镜头', required: true },
        { name: '三脚架', required: true },
        { name: '减光镜', required: false },
        { name: '备用电池', required: true },
      ],
      safety: guide.safety || [
        {
          type: 'warning' as const,
          title: '天气预警',
          content: '关注当地天气预报，避免恶劣天气出行',
        },
        {
          type: 'info' as const,
          title: '装备建议',
          content: '携带保暖衣物、防滑鞋、急救包',
        },
      ],
      altitude: guide.altitude || GUIDE_DEFAULTS.altitude,
      temperature: guide.temperature || GUIDE_DEFAULTS.temperature,
      tips: guide.tips || [
        '建议提前至少3个月规划行程',
        '热门景点需要提前预约门票',
        '尊重当地文化和习俗',
        '保护环境，不要留下垃圾',
      ],
    } as any;
  };

  const isFavorited = (id: string) =>
    interactionStore.isFavorited(getGuideId(id));
  const isLoved = (id: string) => interactionStore.isLoved(getGuideId(id));
  const isLiked = (id: string) => interactionStore.isLiked(getGuideId(id));

  const handleToggleLike = (guide: GlobalGuide) => {
    const item = convertToInteractionItem(guide);
    const isAdded = interactionStore.toggleLike(item);
    if (isAdded) {
      showMessage.like.success(guide.title);
    } else {
      showMessage.like.cancel();
    }
  };

  const handleToggleFavorite = (guide: GlobalGuide) => {
    const item = convertToInteractionItem(guide);
    const isAdded = interactionStore.toggleFavorite(item);
    if (isAdded) {
      showMessage.favorite.success(guide.title, 'guide');
    } else {
      showMessage.favorite.cancel(guide.title, 'guide');
    }
  };

  const handleToggleLove = (guide: GlobalGuide) => {
    const item = convertToInteractionItem(guide);
    const isAdded = interactionStore.toggleLove(item);
    if (isAdded) {
      showMessage.love.success(guide.title, 'guide');
    } else {
      showMessage.love.cancel(guide.title, 'guide');
    }
  };

  const handleShare = (guide: GlobalGuide) => {
    currentShareGuide.value = guide;
    showShareMenu.value = true;
  };

  const handleCardClick = (guide: GlobalGuide) => {
    router.push({
      path: '/landscape/guides',
      query: {
        q: guide.title,
      },
    });
  };

  const handleMore = () => {
    router.push('/landscape/guides');
  };

  onMounted(() => {
    interactionStore.registerBatch(
      guides.value.map((g: GlobalGuide) => ({
        id: getGuideId(g.id),
        counts: {
          likes: g.likes || 0,
          views: g.views || 0,
          loves: g.loves || 0,
          favorites: g.bookmarks || 0,
          shares: g.shares || 0,
        },
      })),
    );
    preloadPages(0);
    window.addEventListener('resize', handleRouteResize);
    nextTick(fitRoute);
  });

  onUnmounted(() => {
    if (routeRaf) cancelAnimationFrame(routeRaf);
    window.removeEventListener('resize', handleRouteResize);
    currentShareGuide.value = null;
  });

  const getDisplayLoves = (guide: GlobalGuide) =>
    fmtCount(getGuideCount(guide.id).loves);

  const getDisplayCollections = (guide: GlobalGuide) =>
    fmtCount(getGuideCount(guide.id).favorites);

  const getDisplayShares = (guide: GlobalGuide) =>
    fmtCount(getGuideCount(guide.id).shares);

  /**
   * 数据条长度：浏览往往比收藏高一个数量级，直接按比例会让后三项压成一条线。
   * 先开方压缩，再压进 18%~100% 区间，差距看得出来，也不会有一项瘦成短线。
   */
  const statRatio = (
    key: 'views' | 'likes' | 'loves' | 'favorites' | 'shares',
  ) => {
    const guide = activeGuide.value;
    if (!guide) return '0%';
    const c = getGuideCount(guide.id);
    const values = {
      views: c.views,
      likes: c.likes,
      loves: c.loves,
      favorites: c.favorites,
      shares: c.shares,
    };
    const max = Math.max(...Object.values(values), 1);
    const ratio = Math.sqrt(values[key] / max);
    return `${Math.round((0.18 + 0.82 * ratio) * 100)}%`;
  };
</script>

<style scoped lang="scss" src="./index.scss" />
