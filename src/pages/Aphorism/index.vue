<template>
  <div class="poetry-page">
    <!-- 固定头部区域 -->
    <div class="sticky-header">
      <header class="page-header">
        <div class="header-content">
          <div class="header-decoration left">
            <span class="decoration-line"></span>
            <span class="decoration-dot"></span>
          </div>

          <div class="header-center">
            <h1 class="page-title">
              <span class="title-char" data-char="诗">诗</span>
              <span class="title-divider">·</span>
              <span class="title-char" data-char="词">词</span>
              <span class="title-divider">·</span>
              <span class="title-char" data-char="雅">雅</span>
              <span class="title-divider">·</span>
              <span class="title-char" data-char="韵">韵</span>
            </h1>
            <p class="page-subtitle">传承千年文化，品味诗词之美</p>
          </div>

          <div class="header-decoration right">
            <span class="decoration-line"></span>
            <span class="decoration-dot"></span>
          </div>
        </div>
        <button type="button" class="back-button" @click="goBack">
          <span class="plaque-stud stud-left"></span>
          <span class="plaque-stud stud-right"></span>
          <BackIcon />
          <span class="button-text">返回首页</span>
        </button>
        <div class="header-actions">
          <button
            type="button"
            class="study-room-button"
            @click="goToStudyRoom"
          >
            <span class="scroll-roller roller-left"></span>
            <span class="scroll-face">
              <StudyRoomIcon />
              <span class="button-text">书房</span>
            </span>
            <span class="scroll-roller roller-right"></span>
          </button>
        </div>
      </header>

      <!-- 模式切换 + 内容区域 -->
      <div class="mode-content-wrapper">
        <!-- 左侧竖排模式切换Tab -->
        <aside class="mode-tabs-vertical" role="tablist" aria-label="浏览模式">
          <span class="bamboo-binding binding-top"></span>
          <div
            class="mode-tab-vertical"
            :class="{ active: !isSearchMode }"
            role="tab"
            :aria-selected="!isSearchMode"
            tabindex="0"
            @click="switchMode(false)"
            @keydown.enter="switchMode(false)"
            @keydown.space.prevent="switchMode(false)"
          >
            <span class="bamboo-node node-left"></span>
            <BrowseIcon class="tab-icon" />
            <span class="tab-text">分类浏览</span>
            <span class="tab-seal">阅</span>
          </div>
          <div
            class="mode-tab-vertical"
            :class="{ active: isSearchMode }"
            role="tab"
            :aria-selected="isSearchMode"
            tabindex="0"
            @click="switchMode(true)"
            @keydown.enter="switchMode(true)"
            @keydown.space.prevent="switchMode(true)"
          >
            <span class="bamboo-node node-left"></span>
            <SearchModeIcon class="tab-icon" />
            <span class="tab-text">搜索模式</span>
            <span class="tab-seal">寻</span>
          </div>
          <span class="bamboo-binding binding-bottom"></span>
        </aside>

        <!-- 右侧内容区域 -->
        <div class="content-area">
          <!-- 搜索模式 -->
          <template v-if="isSearchMode">
            <section class="search-section">
              <SearchBar
                ref="searchBarRef"
                v-model="searchQuery"
                @search="handleSearch"
              />
            </section>
            <!-- 当前检索关键词提示：与搜索框合成平行两行，明确告知列表正按哪个词筛选 -->
            <section v-if="appliedKeyword" class="search-results-header">
              <div class="search-results-bar">
                <span class="results-mark">检</span>
                <span class="results-label">当前检索</span>
                <span class="results-keyword" :title="appliedKeyword">
                  「{{ appliedKeyword }}」
                </span>
                <span class="results-divider"></span>
                <span class="results-count">
                  得
                  <b>{{ filteredPoems.length }}</b>
                  首
                </span>
              </div>
            </section>
          </template>

          <!-- 分类浏览模式 -->
          <template v-else>
            <section class="category-section">
              <CategoryNav
                ref="categoryNavRef"
                @category-change="handleCategoryChange"
              />
            </section>
          </template>
        </div>
      </div>
    </div>

    <!-- 可滚动内容区域 -->
    <main ref="mainRef" class="page-main">
      <div v-if="loading" class="loading-state">
        <div class="scroll-loader">
          <span class="rod left"></span>
          <div class="paper">
            <span class="paper-ink"></span>
            <span class="ink-line l1"></span>
            <span class="ink-line l2"></span>
            <span class="ink-line l3"></span>
          </div>
          <span class="rod right"></span>
        </div>
        <p class="loading-text">正在铺展诗卷…</p>
      </div>

      <ErrorState
        v-else-if="loadError"
        :message="loadError"
        @retry="retryLoad"
      />

      <div
        v-else-if="filteredPoems.length === 0 && isSearchMode"
        class="empty-state search-empty"
      >
        <div class="empty-card">
          <span class="card-seal">诗</span>
          <EmptySearchIcon class="empty-icon" />
          <h3>查无此诗</h3>
          <p v-if="searchQuery">未找到与「{{ searchQuery }}」相关的诗词</p>
          <p v-else>换个关键词，或到分类中慢慢寻觅</p>
          <div class="empty-actions">
            <button
              type="button"
              class="empty-action primary"
              @click="resetSearch"
            >
              换个词再寻
            </button>
            <button
              type="button"
              class="empty-action"
              @click="switchMode(false)"
            >
              去分类浏览
            </button>
          </div>
        </div>
      </div>

      <div
        v-else-if="filteredPoems.length === 0"
        class="empty-state category-empty"
      >
        <div class="empty-card">
          <span class="card-seal">卷</span>
          <EmptyCategoryIcon class="empty-icon" />
          <h3>此格尚无诗卷</h3>
          <p>该分类下的诗词仍在收集中，先去别处看看</p>
          <button type="button" class="empty-action" @click="showAllPoems">
            查看全部诗词
          </button>
        </div>
      </div>

      <ErrorBoundary v-else mode="region" scope="aphorism-list">
        <div class="poems-grid">
          <PoemCard
            v-for="poem in displayedPoems"
            :key="poem.id"
            :poem="poem"
            @click="handlePoemClick"
            @tag-click="handleTagClick"
          />
        </div>
      </ErrorBoundary>

      <!-- 分页 -->
      <Pagination
        v-if="totalPages > 1 && !loading"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="filteredPoems.length"
        :page-size="pageSize"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
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
  import { ref, computed, onMounted, onActivated, nextTick, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import SearchBar from './components/SearchBar/index.vue';
  import CategoryNav from './components/CategoryNav/index.vue';
  import PoemCard from './components/PoemCard/index.vue';
  import PoemModal from './components/PoemModal/index.vue';
  import Pagination from './components/Pagination/index.vue';
  import ErrorState from './components/ErrorState/index.vue';
  import { ErrorBoundary } from '@/components/common/ErrorBoundary';
  import BrowseIcon from './icons/common/BrowseIcon.vue';
  import SearchModeIcon from './icons/common/SearchModeIcon.vue';
  import StudyRoomIcon from './icons/common/StudyRoomIcon.vue';
  import BackIcon from './icons/common/BackIcon.vue';
  import EmptySearchIcon from './icons/common/EmptySearchIcon.vue';
  import EmptyCategoryIcon from './icons/common/EmptyCategoryIcon.vue';

  import { useAphorismDataStore } from '@/stores/aphorism';
  import { useAphorismInteractionStore } from '@/stores/aphorism/interaction';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import { DEFAULT_PAGE_SIZE } from '@/utils/aphorism/constants';
  import { getBackgroundUrl } from '@/composables/aphorism/usePoemBackground';

  defineOptions({ name: 'AphorismPage' });

  const router = useRouter();
  const route = useRoute();
  const dataStore = useAphorismDataStore();
  const interactionStore = useAphorismInteractionStore();

  const searchQuery = ref('');
  // 真正生效的筛选关键词：仅在搜索提交时更新，与输入中的 searchQuery 解耦。
  // 输入过程中列表不变、此值也不变，信息条因此始终如实反映"当前按什么词筛选"。
  const appliedKeyword = ref('');
  const currentPage = ref(1);
  const selectedPoem = ref<Poem | null>(null);
  const selectedPoemBackground = ref<string>('');
  const showModal = ref(false);
  const isSearchMode = ref(false);
  const mainRef = ref<HTMLElement>();
  const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null);
  const categoryNavRef = ref<InstanceType<typeof CategoryNav> | null>(null);
  const pageSize = ref(DEFAULT_PAGE_SIZE);

  const loading = computed(() => dataStore.loading);
  const loadError = computed(() => dataStore.error);
  const filteredPoems = computed(() => dataStore.filteredPoems);

  const switchMode = (searchMode: boolean) => {
    isSearchMode.value = searchMode;
    searchQuery.value = '';
    appliedKeyword.value = '';
    // 无论进入搜索还是分类，都先清掉上一次的筛选，避免搜索模式空关键词却显示分类子集
    dataStore.resetFilter();
    if (!searchMode) {
      categoryNavRef.value?.reset();
    }
    currentPage.value = 1;
  };

  const totalPages = computed(() =>
    Math.ceil(filteredPoems.value.length / pageSize.value),
  );
  const displayedPoems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredPoems.value.slice(start, start + pageSize.value);
  });

  const goBack = () => router.push('/');
  const goToStudyRoom = () => router.push('/aphorism/study-room');

  // 结果集发生变化时统一回到列表顶部，与分页切换行为保持一致
  const scrollMainToTop = () => {
    mainRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    searchQuery.value = query;
    appliedKeyword.value = query;
    currentPage.value = 1;
    dataStore.searchByKeyword(query);
    scrollMainToTop();
  };

  // 关键词被清空时（点 × / 手动删空）实时恢复全部诗词列表，信息条同步隐藏
  watch(searchQuery, (val) => {
    if (!val) {
      appliedKeyword.value = '';
      currentPage.value = 1;
      dataStore.resetFilter();
    }
  });

  const handleCategoryChange = (categoryId: string, subCategoryId?: number) => {
    currentPage.value = 1;
    dataStore.filterByCategory(subCategoryId, categoryId);
    scrollMainToTop();
  };

  const showAllPoems = () => {
    currentPage.value = 1;
    if (categoryNavRef.value) {
      categoryNavRef.value.selectAllOfCurrentCategory();
    } else {
      dataStore.resetFilter();
    }
  };

  const resetSearch = () => {
    searchQuery.value = '';
    appliedKeyword.value = '';
    currentPage.value = 1;
    dataStore.resetFilter();
    nextTick(() => searchBarRef.value?.focusInput());
  };

  const retryLoad = () => {
    dataStore.loadPoems();
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    scrollMainToTop();
  };

  const handlePageSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    scrollMainToTop();
  };

  const handlePoemClick = (poem: Poem, backgroundImage: string) => {
    selectedPoem.value = poem;
    selectedPoemBackground.value = backgroundImage;
    showModal.value = true;
  };

  // 弹窗「上一首/下一首」：在用户当前看到的这一页列表内翻页
  const modalPoemIndex = computed(() =>
    selectedPoem.value
      ? displayedPoems.value.findIndex((p) => p.id === selectedPoem.value!.id)
      : -1,
  );
  const hasPrev = computed(() => modalPoemIndex.value > 0);
  const hasNext = computed(
    () =>
      modalPoemIndex.value >= 0 &&
      modalPoemIndex.value < displayedPoems.value.length - 1,
  );
  const handleNavigate = (direction: 'prev' | 'next') => {
    const target = modalPoemIndex.value + (direction === 'prev' ? -1 : 1);
    const poem = displayedPoems.value[target];
    if (!poem) return;
    selectedPoem.value = poem;
    selectedPoemBackground.value = getBackgroundUrl(poem.id);
  };

  const handleTagClick = (tag: string) => {
    isSearchMode.value = true;
    currentPage.value = 1;
    interactionStore.addSearchHistory(tag);
    searchQuery.value = tag;
    appliedKeyword.value = tag;
    dataStore.searchByKeyword(tag);
    scrollMainToTop();
  };

  onMounted(async () => {
    if (dataStore.poems.length === 0) {
      await dataStore.loadPoems();
    }
    if (dataStore.hotTags.length === 0) {
      dataStore.loadHotTags();
    }
    applyQueryFilters();
  });

  // ---- URL query → 搜索/筛选（书房探索等入口跳转的消费端）----
  // KeepAlive 缓存下从书房跳回不走 onMounted，故同时在 onActivated 与 route.query 变化时消费
  const QUERY_CATEGORY_GROUPS = [
    'dynasty',
    'subject',
    'emotion',
    'school',
    'form',
    'usage',
  ] as const;

  // KeepAlive 下首次进入会先后触发 onMounted（数据加载后）与 onActivated，
  // 二者都会调用 applyQueryFilters。用 query 签名去重，避免首屏重复跑一遍 filter。
  let lastAppliedQuerySignature: string | null = null;

  const applyQueryFilters = () => {
    if (dataStore.poems.length === 0) return;
    const q = route.query;
    const signature = JSON.stringify({
      search: q.search,
      author: q.author,
      ...Object.fromEntries(QUERY_CATEGORY_GROUPS.map((k) => [k, q[k]])),
    });
    if (signature === lastAppliedQuerySignature) return;
    lastAppliedQuerySignature = signature;

    const search = typeof q.search === 'string' ? q.search.trim() : '';
    const author = typeof q.author === 'string' ? q.author.trim() : '';
    const group = QUERY_CATEGORY_GROUPS.find(
      (k) => typeof q[k] === 'string' && (q[k] as string).trim() !== '',
    );

    if (search) {
      isSearchMode.value = true;
      searchQuery.value = search;
      appliedKeyword.value = search;
      currentPage.value = 1;
      dataStore.searchByKeyword(search);
      return;
    }
    if (author) {
      isSearchMode.value = true;
      searchQuery.value = author;
      appliedKeyword.value = author;
      currentPage.value = 1;
      dataStore.filterByAuthor(author);
      return;
    }
    if (group) {
      isSearchMode.value = false;
      searchQuery.value = '';
      appliedKeyword.value = '';
      currentPage.value = 1;
      const subName = (route.query[group] as string).trim();
      dataStore.filterByCategoryName(group, subName);
      // 从搜索态切回分类时 CategoryNav 尚未挂载，等渲染完成再同步 tab 选中；
      // 同时再校准一次列表，避免 CategoryNav 挂载时的自动首分类覆盖 URL 指定分类
      nextTick(() => {
        categoryNavRef.value?.selectByNames(group, subName);
        dataStore.filterByCategoryName(group, subName);
      });
    }
  };

  onActivated(() => {
    applyQueryFilters();
  });

  watch(
    () => route.query,
    () => {
      applyQueryFilters();
    },
  );
</script>

<style scoped lang="scss">
  @use './index.scss';
</style>
