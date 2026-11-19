<template>
  <div class="studyroom-page">
    <!-- 固定头部区域 -->
    <div class="sticky-header">
      <header class="page-header">
        <button type="button" class="back-button" @click="goBack">
          <BambooBackIcon />
          <span>返回诗词页面</span>
        </button>

        <div class="header-content">
          <div class="decoration-pattern left">
            <span class="pattern-line"></span>
            <span class="pattern-diamond"></span>
            <span class="pattern-line"></span>
          </div>

          <div class="header-title-area">
            <div class="title-seal">
              <span class="seal-char">我</span>
              <span class="seal-char">的</span>
              <span class="seal-char">书</span>
              <span class="seal-char">房</span>
              <span class="title-brush"></span>
            </div>
            <div class="title-decoration-line"></div>
            <div class="subtitle-paperweight">
              <p class="title-subtitle">珍藏诗意 · 品味人生</p>
            </div>
          </div>

          <div class="decoration-pattern right">
            <span class="pattern-line"></span>
            <span class="pattern-diamond"></span>
            <span class="pattern-line"></span>
          </div>
        </div>
      </header>

      <!-- 悬浮状态徽章模块 -->
      <div class="status-badges-float">
        <div
          v-for="badge in statusBadges"
          :key="badge.key"
          class="status-badge"
          :class="badge.key"
          @click="badge.action?.()"
        >
          <BadgeIcon :d="badge.iconPath" />
          <span class="badge-value">{{ badge.value }}</span>
          <span class="badge-label">{{ badge.label }}</span>
        </div>
      </div>

      <!-- 标签页切换 —— 线装古籍（书脊题签） -->
      <div class="tabs-wrapper">
        <div class="tabs-container">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-item"
            :class="[{ active: activeTab === tab.key }, `tab-${tab.key}`]"
            @click="activeTab = tab.key"
          >
            <span class="book-pages"></span>
            <span class="book-stitch"></span>
            <span class="tab-slip">
              <span class="slip-text">{{ tab.label }}</span>
            </span>
            <span class="tab-mark"><component :is="tab.icon" /></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <main class="page-main">
      <!-- 加载中：书架整理 -->
      <div v-if="loading" class="shelf-loading">
        <div class="loading-shelf">
          <div class="shelf-frame">
            <div v-for="n in 6" :key="n" class="shelf-slot">
              <span class="book-spine" :class="'b' + ((n % 3) + 1)"></span>
            </div>
            <span class="shelf-board"></span>
          </div>
          <p class="shelf-loading-text">正在整理书架…</p>
        </div>
      </div>

      <ErrorState
        v-else-if="loadError"
        :message="loadError"
        @retry="retryLoad"
      />

      <!-- ===== 喜爱 / 收藏：诗词卡片列表 ===== -->
      <template
        v-if="
          !loading &&
          !loadError &&
          (activeTab === 'loved' || activeTab === 'favorites')
        "
      >
        <section class="poems-section">
          <h2 v-if="currentPoems.length > 0" class="section-title">
            {{ currentSectionTitle }}
          </h2>
          <div v-if="currentPoems.length > 0" class="poems-grid">
            <PoemCard
              v-for="poem in visiblePoems"
              :key="poem.id"
              :poem="poem"
              :type="activeTab"
              removable
              @click="handlePoemClick"
              @remove="handleRemove"
            />
            <div
              v-if="visiblePoems.length < currentPoems.length"
              ref="loadMoreRef"
              class="load-more-sentinel"
            >
              <span class="lm-ink"></span>
              <span class="lm-dot"></span>
              <span class="lm-ink"></span>
              <span class="lm-text">继续展卷…</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <EmptyPoemIcon class="empty-icon" />
            <h3>{{ emptyTitle }}</h3>
            <p>{{ emptyDesc }}</p>
            <button type="button" class="go-browse-btn" @click="goBrowse">
              去浏览诗词
            </button>
          </div>
        </section>
      </template>

      <!-- ===== 探索：发现 + 我的足迹 两组 ===== -->
      <template v-if="!loading && !loadError && activeTab === 'explore'">
        <!-- 发现组：主动邂逅新诗 -->
        <div class="module-group">
          <div class="group-label">
            <span class="group-seal">觅</span>
            <span class="group-title">发现</span>
            <span class="group-sub">邂逅未曾谋面的诗</span>
          </div>
          <section class="modules-section">
            <DailyPick :poems="allPoems" @open="handlePoemClick" />
            <FamousLines :poems="allPoems" @open="handlePoemClick" />
          </section>
        </div>

        <!-- 我的足迹组：个人阅读回顾 -->
        <div class="module-group">
          <div class="group-label">
            <span class="group-seal">忆</span>
            <span class="group-title">我的足迹</span>
            <span class="group-sub">与你读过的诗重逢</span>
          </div>
          <section class="modules-section">
            <ReadingLedger
              :poems="allPoems"
              @open="handlePoemClick"
              @search="goSearch"
            />
          </section>
        </div>
      </template>
    </main>

    <!-- 诗词详情弹窗 -->
    <PoemModal
      v-if="selectedPoem"
      :visible="showModal"
      :poem="selectedPoem"
      :background-image="selectedPoemBackground"
      :has-prev="hasPrev"
      :has-next="hasNext"
      @close="showModal = false"
      @tag-click="handleTagClick"
      @navigate="handleNavigate"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import PoemModal from '../PoemModal/index.vue';
  import DailyPick from './components/DailyPick.vue';
  import FamousLines from './components/FamousLines.vue';
  import ReadingLedger from './components/ReadingLedger.vue';
  import { useAphorismDataStore } from '@/stores/aphorism';
  import { useAphorismInteractionStore } from '@/stores/aphorism/interaction';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import { getBackgroundUrl } from '@/composables/aphorism/usePoemBackground';
  import PoemCard from '../PoemCard/index.vue';
  import ErrorState from '../ErrorState/index.vue';
  import BadgeIcon from '../../icons/StudyRoom/BadgeIcon.vue';
  import BambooBackIcon from '../../icons/StudyRoom/BambooBackIcon.vue';
  import EmptyPoemIcon from '../../icons/common/EmptyPoemIcon.vue';
  import './index.scss';

  defineOptions({ name: 'StudyRoomPage' });

  const router = useRouter();
  const dataStore = useAphorismDataStore();
  const interactionStore = useAphorismInteractionStore();

  const allPoems = computed(() => dataStore.getAllPoems());
  const loading = computed(() => dataStore.loading);
  const loadError = computed(() => dataStore.error);
  const selectedPoem = ref<Poem | null>(null);
  const selectedPoemBackground = ref('');
  const showModal = ref(false);
  const activeTab = ref<'loved' | 'favorites' | 'explore'>('loved');

  // ---- 背景图工具（使用共享 composable） ----

  // ---- 三个标签页 ----
  import HeartIcon from '../../icons/common/HeartIcon.vue';
  import BookmarkIcon from '../../icons/PoemModal/BookmarkIcon.vue';
  import CompassIcon from '../../icons/StudyRoom/CompassIcon.vue';

  const tabs = [
    {
      key: 'loved' as const,
      label: '喜爱',
      icon: HeartIcon,
    },
    {
      key: 'favorites' as const,
      label: '收藏',
      icon: BookmarkIcon,
    },
    {
      key: 'explore' as const,
      label: '探索',
      icon: CompassIcon,
    },
  ];

  // ---- 悬浮状态徽章 ----
  const poetDynastyStats = computed(() =>
    interactionStore.getPoetAndDynastyStats(allPoems.value),
  );
  const favoritePoets = computed(() => poetDynastyStats.value.poets);
  const dynastyDistributionRaw = computed(
    () => poetDynastyStats.value.dynasties,
  );
  const dynastyDistribution = computed(() =>
    dynastyDistributionRaw.value.map((d) => ({ name: d.name, value: d.count })),
  );

  const statusBadges = computed(() => [
    {
      key: 'loved',
      label: '喜爱',
      value: interactionStore.lovedCount,
      iconPath:
        'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      action: () => {
        activeTab.value = 'loved';
      },
    },
    {
      key: 'favorites',
      label: '收藏',
      value: interactionStore.favoriteCount,
      iconPath:
        'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z',
      action: () => {
        activeTab.value = 'favorites';
      },
    },
    {
      key: 'poets',
      label: '诗人',
      value: favoritePoets.value.length,
      iconPath:
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
      action: () => {
        activeTab.value = 'explore';
      },
    },
    {
      key: 'dynasties',
      label: '朝代',
      value: dynastyDistribution.value.length,
      iconPath: 'M12 2L2 22h20L12 2zm0 4l6 12H6l6-12z',
      action: () => {
        activeTab.value = 'explore';
      },
    },
  ]);
  const currentPoems = computed(() => {
    if (activeTab.value === 'loved')
      return interactionStore.getLovedPoems(allPoems.value);
    if (activeTab.value === 'favorites')
      return interactionStore.getFavoritePoems(allPoems.value);
    return [];
  });

  const POEM_BATCH_SIZE = 12;
  const poemVisibleCount = ref(POEM_BATCH_SIZE);
  const loadMoreRef = ref<HTMLElement | null>(null);
  let loadMoreObserver: IntersectionObserver | null = null;

  const visiblePoems = computed(() =>
    currentPoems.value.slice(0, poemVisibleCount.value),
  );

  onMounted(() => {
    loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          poemVisibleCount.value < currentPoems.value.length
        ) {
          poemVisibleCount.value = Math.min(
            poemVisibleCount.value + POEM_BATCH_SIZE,
            currentPoems.value.length,
          );
        }
      },
      { rootMargin: '200px' },
    );
  });

  watch(loadMoreRef, (el) => {
    if (!loadMoreObserver) return;
    loadMoreObserver.disconnect();
    if (el) loadMoreObserver.observe(el);
  });

  watch(activeTab, () => {
    poemVisibleCount.value = POEM_BATCH_SIZE;
  });

  onUnmounted(() => {
    loadMoreObserver?.disconnect();
  });

  const currentSectionTitle = computed(() =>
    activeTab.value === 'loved' ? '我喜爱的诗词' : '我收藏的诗词',
  );

  const emptyTitle = computed(() =>
    activeTab.value === 'loved' ? '暂无喜爱的诗词' : '暂无收藏的诗词',
  );
  const emptyDesc = computed(() =>
    activeTab.value === 'loved'
      ? '在诗词详情中点击喜爱按钮，将喜欢的诗词收入书房'
      : '在诗词详情中点击收藏按钮，将诗词加入书签',
  );

  // ---- 方法 ----
  onMounted(() => {
    if (allPoems.value.length === 0) {
      dataStore.loadPoems();
    }
  });

  const retryLoad = () => {
    dataStore.loadPoems();
  };

  const goBack = () => router.push('/aphorism');
  const goBrowse = () => router.push('/aphorism');
  const goSearch = (keyword: string) => {
    router.push({ path: '/aphorism', query: { search: keyword } });
  };

  const handlePoemClick = (poem: Poem, backgroundImage: string) => {
    // 最近浏览已下沉到 PoemModal 的 visible 监听，此处不再重复记录
    selectedPoem.value = poem;
    selectedPoemBackground.value = backgroundImage;
    showModal.value = true;
  };

  // 弹窗「上一首/下一首」：按当前标签页决定翻页范围
  // loved / favorites 在收藏列表内翻，explore（发现/足迹）在全库内翻
  const modalNavigateList = computed(() =>
    activeTab.value === 'explore' ? allPoems.value : currentPoems.value,
  );
  const modalPoemIndex = computed(() =>
    selectedPoem.value
      ? modalNavigateList.value.findIndex(
          (p) => p.id === selectedPoem.value!.id,
        )
      : -1,
  );
  const hasPrev = computed(() => modalPoemIndex.value > 0);
  const hasNext = computed(
    () =>
      modalPoemIndex.value >= 0 &&
      modalPoemIndex.value < modalNavigateList.value.length - 1,
  );
  const handleNavigate = (direction: 'prev' | 'next') => {
    const target = modalPoemIndex.value + (direction === 'prev' ? -1 : 1);
    const poem = modalNavigateList.value[target];
    if (!poem) return;
    selectedPoem.value = poem;
    selectedPoemBackground.value = getBackgroundUrl(poem.id);
  };

  const handleRemove = (poemId: number) => {
    if (activeTab.value === 'loved') {
      interactionStore.toggleLove(poemId);
    } else {
      interactionStore.toggleFavorite(poemId);
    }
  };

  const handleTagClick = (tag: string) => {
    showModal.value = false;
    router.push({ path: '/aphorism', query: { search: tag } });
  };
</script>

<style scoped lang="scss">
  @use './index.scss';
</style>
