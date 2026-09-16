<template>
  <div class="my-footprint">
    <!-- 背景装饰 -->
    <div class="bg-orbs" aria-hidden="true">
      <span class="orb orb-1"></span>
      <span class="orb orb-2"></span>
      <span class="orb orb-3"></span>
      <span class="orb orb-4"></span>
      <span class="orb orb-5"></span>
    </div>

    <!-- 左侧栏：标题 + 纵向 Tab + 本地保存 -->
    <aside class="fp-sidebar">
      <div class="sidebar-glass" aria-hidden="true"></div>

      <div class="sidebar-head">
        <span class="sidebar-emblem">
          <span class="emblem-ring"></span>
          <span class="emblem-core"><SparkleIcon /></span>
        </span>
        <h1 class="sidebar-title">我的足迹</h1>
        <p class="sidebar-sub">收藏 · 关注</p>
      </div>

      <nav class="sidebar-tabs">
        <button
          class="side-tab"
          :class="{ active: activeTab === 'favorites' }"
          @click="activeTab = 'favorites'"
        >
          <span class="stab-gloss"></span>
          <span class="stab-bar"></span>
          <span class="stab-icon"><StarFilledIcon /></span>
          <span class="stab-info">
            <span class="stab-label">我的收藏</span>
            <span class="stab-count">{{ favorites.length }} 件</span>
          </span>
        </button>
        <button
          class="side-tab"
          :class="{ active: activeTab === 'follows' }"
          @click="activeTab = 'follows'"
        >
          <span class="stab-gloss"></span>
          <span class="stab-bar"></span>
          <span class="stab-icon"><BellFilledIcon /></span>
          <span class="stab-info">
            <span class="stab-label">我的关注</span>
            <span class="stab-count">{{ follows.length }} 件</span>
          </span>
        </button>

      </nav>

    </aside>

    <!-- 右侧主区：卡片展示 -->
    <section class="fp-main">
      <transition name="tab-switch" mode="out-in">
        <!-- 全空 -->
        <div v-if="totalCount === 0" key="total-empty" class="main-empty">
          <div class="empty-decoration">
            <span class="deco-icon"><VaseIcon /></span>
            <span class="deco-icon"><ImageIcon /></span>
            <span class="deco-icon"><PaletteIcon /></span>
            <span class="deco-icon"><LeafIcon /></span>
          </div>
          <div class="empty-main">
            <span class="empty-icon"><EmptyBoxIcon /></span>
            <h3 class="empty-title">暂无足迹</h3>
            <p class="empty-desc">去各博物馆页面收藏文物、关注展览</p>
            <p class="empty-desc">你的足迹会出现在这里</p>
          </div>
        </div>

        <!-- tab 空 -->
        <div
          v-else-if="currentItems.length === 0"
          :key="`${activeTab}-empty`"
          class="main-empty tab-empty"
        >
          <span class="tab-empty-icon"><EmptyBoxIcon /></span>
          <h3 class="tab-empty-title">{{ activeTabLabel }}暂无内容</h3>
          <p class="tab-empty-desc">去博物馆页面{{ activeTabHint }}，即可在此查看</p>
        </div>

        <!-- 卡片网格 -->
        <div v-else :key="activeTab" class="card-grid">
          <article
            v-for="item in currentItems"
            :key="`${activeTab}-${item.type}-${item.id}`"
            class="fp-card"
            :class="`fp-card--${item.type}`"
          >
            <!-- 大图区 -->
            <div class="card-figure" @click="openDetail(item)">
              <img v-if="item.image" loading="lazy" :src="item.image" :alt="item.title" />
              <span v-else class="figure-placeholder">
                <component :is="typeIconMap[item.type]" />
              </span>
              <span class="figure-scan" aria-hidden="true"></span>
              <span class="figure-vignette" aria-hidden="true"></span>

              <!-- 左上类型徽章 -->
              <span class="type-badge" :class="item.type">{{ item.typeName }}</span>

              <!-- 右上操作按钮组（浮层） -->
              <div class="figure-actions">
                <button
                  v-for="action in getCardActions(item)"
                  :key="action.key"
                  class="fig-action"
                  :class="[`act-${action.key}`, { active: action.active }]"
                  :title="action.label"
                  :aria-label="action.label"
                  @click.stop="action.handler"
                >
                  <span class="fig-act-gloss"></span>
                  <component :is="action.icon" />
                </button>
              </div>

              <!-- 底部标题叠加 -->
              <div class="figure-caption">
                <h3 class="card-title">{{ item.title }}</h3>
              </div>
            </div>

            <!-- 底部信息条 -->
            <div class="card-strip">
              <span class="strip-museum">
                <span class="museum-icon"><MuseumBuildingIcon /></span>
                {{ item.museumName }}
              </span>
              <button
                class="remove-btn"
                :title="`取消${item.status}`"
                @click="removeItem(item)"
              >
                <CloseIcon />
              </button>
            </div>
          </article>
        </div>
      </transition>
    </section>

    <FootprintDetailModal
      :visible="modalVisible"
      :type="modalItem.type"
      :type-name="modalItem.typeName"
      :title="modalItem.title"
      :image="modalItem.image"
      :museum-name="modalItem.museumName"
      :status="modalItem.status"
      :description="modalDescription"
      :highlights="modalHighlights"
      :tags="modalTags"
      :meta-rows="modalMetaRows"
      :actions="modalActions"
      @close="closeDetail"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, type Component } from 'vue';
  import { useMuseumDataStore } from '@/stores/museum';
  import { useArtifactPrefs } from '@/composables/museum/useArtifactPrefs';
  import { useExhibitionPrefs } from '@/composables/museum/useExhibitionPrefs';
  import { useCreativePrefs } from '@/composables/museum/useCreativePrefs';
  import { useActivityPrefs } from '@/composables/museum/useActivityPrefs';
  import {
    SparkleIcon,
    StarFilledIcon,
    StarIcon,
    LikeFilledIcon,
    LikeIcon,
    BellFilledIcon,
    BellIcon,

    EmptyBoxIcon,
    CloseIcon,

    MuseumBuildingIcon,
    VaseIcon,
    ImageIcon,
    PaletteIcon,
    LeafIcon,

    ShareIcon,
  } from '@/pages/Museum/icons/common';
  import FootprintDetailModal from './components/FootprintDetailModal/index.vue';

  type ItemType = 'artifact' | 'exhibition' | 'creative' | 'activity';
  type ItemStatus = '收藏' | '关注';
  type TabKey = 'favorites' | 'follows';

  interface FootprintItem {
    id: number;
    title: string;
    image: string;
    type: ItemType;
    typeName: string;
    museumName: string;
    status: ItemStatus;
  }

  interface CardAction {
    key: string;
    label: string;
    icon: Component;
    active: boolean;
    handler: () => void;
  }

  interface Props {
    museumId: number;
  }

  const props = defineProps<Props>();

  const typeIconMap: Record<ItemType, Component> = {
    artifact: VaseIcon,
    exhibition: ImageIcon,
    creative: PaletteIcon,
    activity: LeafIcon,
  };

  const store = useMuseumDataStore();

  const {
    favoredIds: artifactFavoredIds,

    isFavored: artifactIsFavored,
    isThumbsUp: artifactIsThumbsUp,
    toggleFavor: artifactToggleFavor,
    toggleThumbsUp: artifactToggleThumbsUp,
  } = useArtifactPrefs(() => props.museumId);

  const {
    followedIds: exhibitionFollowedIds,
    favoritedIds: exhibitionFavoritedIds,
    isFollowed: exhibitionIsFollowed,
    isFavorited: exhibitionIsFavorited,
    toggleFollow: exhibitionToggleFollow,
    toggleFavorite: exhibitionToggleFavorite,
  } = useExhibitionPrefs(() => props.museumId);

  const {
    favoredIds: creativeFavoredIds,
    isLiked: creativeIsLiked,
    isFavored: creativeIsFavored,
    toggleLike: creativeToggleLike,
    toggleFavor: creativeToggleFavor,
  } = useCreativePrefs(() => props.museumId);

  const {
    favoredIds: activityFavoritedIds,
    isLiked: activityIsLiked,
    isFavored: activityIsFavored,
    toggleLike: activityToggleLike,
    toggleFavorite: activityToggleFavorite,
  } = useActivityPrefs(() => props.museumId);


  const museumName = (museumId: number): string => {
    const m = store.museums.find((x) => x.id === museumId);
    return m?.name || '未知博物馆';
  };

  const buildArtifactItem = (id: number, status: ItemStatus): FootprintItem | null => {
    const a = store.artifacts.find((x) => x.id === id);
    if (!a) return null;
    return {
      id: a.id,
      title: a.name,
      image: a.image,
      type: 'artifact',
      typeName: '文物',
      museumName: museumName(a.museumId),
      status,
    };
  };

  const buildExhibitionItem = (id: number, status: ItemStatus): FootprintItem | null => {
    const e = store.exhibitions.find((x) => x.id === id);
    if (!e) return null;
    return {
      id: e.id,
      title: e.title,
      image: e.image,
      type: 'exhibition',
      typeName: '展览',
      museumName: museumName(e.museumId),
      status,
    };
  };

  const buildCreativeItem = (id: number, status: ItemStatus): FootprintItem | null => {
    const c = store.creativeProducts.find((x) => x.id === id);
    if (!c) return null;
    return {
      id: c.id,
      title: c.name,
      image: c.image,
      type: 'creative',
      typeName: '文创',
      museumName: museumName(c.museumId),
      status,
    };
  };

  const buildActivityItem = (id: number, status: ItemStatus): FootprintItem | null => {
    const a = store.creativeActivities.find((x) => x.id === id);
    if (!a) return null;
    return {
      id: a.id,
      title: a.title,
      image: a.image,
      type: 'activity',
      typeName: '活动',
      museumName: museumName(a.museumId),
      status,
    };
  };

  const collectItems = (
    ids: number[],
    builder: (id: number, status: ItemStatus) => FootprintItem | null,
    status: ItemStatus,
  ): FootprintItem[] => {
    return ids
      .map((id) => builder(id, status))
      .filter((x): x is FootprintItem => x !== null);
  };

  const favorites = computed(() => [
    ...collectItems(artifactFavoredIds.value, buildArtifactItem, '收藏'),
    ...collectItems(exhibitionFavoritedIds.value, buildExhibitionItem, '收藏'),
    ...collectItems(creativeFavoredIds.value, buildCreativeItem, '收藏'),
    ...collectItems(activityFavoritedIds.value, buildActivityItem, '收藏'),
  ]);

  const follows = computed(() =>
    collectItems(exhibitionFollowedIds.value, buildExhibitionItem, '关注'),
  );

  const totalCount = computed(
    () => favorites.value.length + follows.value.length,
  );

  const activeTab = ref<TabKey>('favorites');

  const currentItems = computed<FootprintItem[]>(() => {
    if (activeTab.value === 'favorites') return favorites.value;
    return follows.value;
  });

  const activeTabLabel = computed(() => {
    const map: Record<TabKey, string> = {
      favorites: '收藏',
      follows: '关注',
    };
    return map[activeTab.value];
  });

  const activeTabHint = computed(() => {
    const map: Record<TabKey, string> = {
      favorites: '收藏文物或展览',
      follows: '关注展览',
    };
    return map[activeTab.value];
  });

  const removeItem = (item: FootprintItem) => {
    if (item.type === 'artifact') {
      if (item.status === '收藏') artifactToggleFavor(item.id, item.title);
    } else if (item.type === 'exhibition') {
      if (item.status === '收藏') exhibitionToggleFavorite(item.id, item.title);
      else if (item.status === '关注') exhibitionToggleFollow(item.id, item.title);
    } else if (item.type === 'creative') {
      if (item.status === '收藏') creativeToggleFavor(item.id, item.title);
    } else if (item.type === 'activity') {
      if (item.status === '收藏') activityToggleFavorite(item.id, item.title);
    }
  };

  const getCardActions = (item: FootprintItem): CardAction[] => {
    const actions: CardAction[] = [];
    const shareAction: CardAction = {
      key: 'share',
      label: '分享',
      icon: ShareIcon,
      active: false,
      handler: () => openDetail(item),
    };

    if (item.type === 'artifact') {
      actions.push(
        {
          key: 'like',
          label: '点赞',
          icon: artifactIsThumbsUp(item.id) ? LikeFilledIcon : LikeIcon,
          active: artifactIsThumbsUp(item.id),
          handler: () => artifactToggleThumbsUp(item.id, item.title),
        },
        {

          key: 'star',
          label: '收藏',
          icon: artifactIsFavored(item.id) ? StarFilledIcon : StarIcon,
          active: artifactIsFavored(item.id),
          handler: () => artifactToggleFavor(item.id, item.title),
        },
        shareAction,
      );
    } else if (item.type === 'exhibition') {
      actions.push(
        {
          key: 'bell',
          label: '关注',
          icon: exhibitionIsFollowed(item.id) ? BellFilledIcon : BellIcon,
          active: exhibitionIsFollowed(item.id),
          handler: () => exhibitionToggleFollow(item.id, item.title),
        },
        {
          key: 'star',
          label: '收藏',
          icon: exhibitionIsFavorited(item.id) ? StarFilledIcon : StarIcon,
          active: exhibitionIsFavorited(item.id),
          handler: () => exhibitionToggleFavorite(item.id, item.title),
        },
        shareAction,
      );
    } else if (item.type === 'creative') {
      actions.push(
        {
          key: 'like',
          label: '点赞',
          icon: creativeIsLiked(item.id) ? LikeFilledIcon : LikeIcon,
          active: creativeIsLiked(item.id),
          handler: () => creativeToggleLike(item.id, item.title),
        },
        {

          key: 'star',
          label: '收藏',
          icon: creativeIsFavored(item.id) ? StarFilledIcon : StarIcon,
          active: creativeIsFavored(item.id),
          handler: () => creativeToggleFavor(item.id, item.title),
        },
        shareAction,
      );
    } else if (item.type === 'activity') {
      actions.push(
        {
          key: 'like',
          label: '点赞',
          icon: activityIsLiked(item.id) ? LikeFilledIcon : LikeIcon,
          active: activityIsLiked(item.id),
          handler: () => activityToggleLike(item.id, item.title),
        },
        {
          key: 'star',
          label: '收藏',
          icon: activityIsFavored(item.id) ? StarFilledIcon : StarIcon,
          active: activityIsFavored(item.id),
          handler: () => activityToggleFavorite(item.id, item.title),
        },
        shareAction,
      );
    }
    return actions;
  };

  const modalVisible = ref(false);
  const modalItem = ref<FootprintItem>({
    id: 0,
    title: '',
    image: '',
    type: 'artifact',
    typeName: '',
    museumName: '',
    status: '收藏',
  });

  const modalDescription = ref('');
  const modalHighlights = ref<string[]>([]);
  const modalTags = ref<string[]>([]);
  const modalMetaRows = ref<{ label: string; value: string }[]>([]);
  const modalActions = ref<CardAction[]>([]);

  const categoryMap: Record<string, string> = {
    painting: '绘画', ceramic: '瓷器', bronze: '青铜', jade: '玉器',
    calligraphy: '书法', lacquer: '漆器', textile: '织绣', gold: '金器',
    silver: '银器', sculpture: '雕塑', seal: '印章', enamel: '珐琅',
    glass: '玻璃', wood: '木器', stone: '石器', bamboo: '竹器',
    ivory: '牙角', leather: '皮革', coin: '钱币', document: '文献',
    other: '其他', cloisonne: '景泰蓝', silk: '丝绸', paper: '纸质',
    metal: '金属', pottery: '陶器', porcelain: '瓷器',
  };
  const mapCategory = (v: string) => categoryMap[v?.toLowerCase()] || v;

  const openDetail = (item: FootprintItem) => {
    modalItem.value = item;
    modalDescription.value = '';
    modalHighlights.value = [];
    modalTags.value = [];
    modalMetaRows.value = [];
    modalActions.value = [];

    if (item.type === 'artifact') {
      const a = store.artifacts.find((x) => x.id === item.id);
      if (a) {
        modalDescription.value = a.description || '';
        modalTags.value = (a.tags || []).map(mapCategory);
        const meta: { label: string; value: string }[] = [];
        if (a.period) meta.push({ label: '朝代', value: a.period });
        if (a.category) meta.push({ label: '类别', value: mapCategory(a.category) });
        if (a.basicInfo?.material) meta.push({ label: '材质', value: a.basicInfo.material });
        if (a.basicInfo?.dimensions) meta.push({ label: '尺寸', value: a.basicInfo.dimensions });
        if (a.basicInfo?.collection) meta.push({ label: '收藏地', value: a.basicInfo.collection });
        modalMetaRows.value = meta;
      }
    } else if (item.type === 'exhibition') {
      const e = store.exhibitions.find((x) => x.id === item.id);
      if (e) {
        modalDescription.value = e.description || '';
        modalHighlights.value = e.highlights || [];
        modalTags.value = (e.tags || []).map(mapCategory);
        const meta: { label: string; value: string }[] = [];
        if (e.date) meta.push({ label: '展览时间', value: e.date });
        if (e.location) meta.push({ label: '展览地点', value: e.location });
        if (e.category) meta.push({ label: '分类', value: mapCategory(e.category) });
        if (e.curator) meta.push({ label: '策展人', value: e.curator });
        if (e.scale) meta.push({ label: '规模', value: e.scale });
        modalMetaRows.value = meta;
      }
    } else if (item.type === 'creative') {
      const c = store.creativeProducts.find((x) => x.id === item.id);
      if (c) {
        modalDescription.value = c.description || '';
        const meta: { label: string; value: string }[] = [];
        if (c.category) meta.push({ label: '分类', value: mapCategory(c.category) });
        if (c.price) meta.push({ label: '价格', value: `¥${c.price}` });
        modalMetaRows.value = meta;
      }
    } else if (item.type === 'activity') {
      const a = store.creativeActivities.find((x) => x.id === item.id);
      if (a) {
        modalDescription.value = a.description || '';
        const meta: { label: string; value: string }[] = [];
        if (a.date) meta.push({ label: '日期', value: a.date });
        if (a.time) meta.push({ label: '时间', value: a.time });
        if (a.location) meta.push({ label: '地点', value: a.location });
        modalMetaRows.value = meta;
      }
    }

    modalActions.value = getCardActions(item);
    modalVisible.value = true;
  };

  const closeDetail = () => {
    modalVisible.value = false;
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
