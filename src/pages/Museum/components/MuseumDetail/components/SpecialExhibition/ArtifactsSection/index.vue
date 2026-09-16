<template>
  <div class="artifacts-section">
    <div class="section-header">
      <h4 class="section-title">
        <span class="title-icon"><SparkleIcon /></span>
        馆藏精品
        <span v-if="displayArtifacts.length" class="title-count">{{ displayArtifacts.length }}</span>
      </h4>
      <button class="more-link">查看全部</button>
    </div>
    <div v-if="displayArtifacts.length === 0" class="empty-state">
      <div class="empty-icon">
        <VaseIcon />
      </div>
      <h3 class="empty-title">暂无对应馆藏</h3>
      <p class="empty-description">该专馆暂无对应类别的精品文物，请浏览其他专馆</p>
    </div>
    <div v-else class="artifacts-grid">
      <div
        v-for="(artifact, index) in displayArtifacts"
        :key="artifact.id ?? index"
        class="artifact-card"
        @click="handleCardClick(artifact)"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave"
      >
        <!-- 3D卡片装饰层 -->
        <div class="card-shine"></div>

        <div class="artifact-image">
          <img loading="lazy" :src="artifact.image" :alt="artifact.name" />
          <div class="image-overlay"></div>

          <!-- 点赞、收藏、分享按钮 -->
          <div class="quick-actions">
            <button
              class="action-icon"
              :class="{ active: isThumbsUpActive(artifact) }"
              title="点赞"
              @click.stop="toggleThumbsUp(artifact)"
            >
              <span><LikeFilledIcon v-if="isThumbsUpActive(artifact)" /><LikeIcon v-else /></span>
            </button>
            <button
              class="action-icon"

              :class="{ active: isFavoredActive(artifact) }"
              title="收藏"
              @click.stop="toggleFavor(artifact)"
            >
              <span><StarFilledIcon v-if="isFavoredActive(artifact)" /><StarIcon v-else /></span>
            </button>
            <button class="action-icon" title="分享" @click.stop="handleShare(artifact)">
              <span><ShareIcon /></span>
            </button>
          </div>
        </div>
        <div class="artifact-info">
          <div class="info-badge">
            <span class="badge-dot"></span>
            馆藏精品
          </div>
          <h5 class="artifact-name">{{ artifact.name }}</h5>
          <div class="artifact-meta">
            <span class="artifact-period">
              <span class="period-icon"><CalendarIcon /></span>
              {{ artifact.period }}
            </span>
            <span v-if="artifact.basicInfo?.material || artifact.material" class="artifact-material">
              <span class="material-icon"><VaseIcon /></span>
              {{ artifact.basicInfo?.material || artifact.material }}
            </span>
          </div>
          <p class="artifact-desc">{{ artifact.description }}</p>
          <div v-if="artifact.tags && artifact.tags.length" class="artifact-tags">
            <span v-for="tag in artifact.tags.slice(0, 3)" :key="tag" class="artifact-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 文物详情弹窗（与 ArtifactList 共享同一 store 数据源） -->
    <ArtifactDetailModal
      :artifact="selectedArtifact"
      :candidates="museumArtifacts"
      @close="closeArtifactDetail"
      @select="openArtifactDetail"
    />
    <ShareModal
      v-model:visible="shareVisible"
      :title="shareTitle"
      :description="shareDescription"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import type { Artifact, ArtifactDetail, ExhibitionHall } from '@/typesOfPages/museum';
  import {
    VaseIcon,
    SparkleIcon,

    StarIcon,
    StarFilledIcon,
    ShareIcon,
    LikeIcon,
    LikeFilledIcon,
    CalendarIcon,
  } from '@/pages/Museum/icons/common';
  import { useMuseumDataStore } from '@/stores/museum';
  import { useArtifactPrefs } from '@/composables/museum/useArtifactPrefs';
  import { useMuseumMessage } from '@/composables/museum/useMessage';
  import ArtifactDetailModal from '../../ArtifactList/components/ArtifactDetailModal/index.vue';
  import { ShareModal } from '@/pages/Museum/components/common';

  interface Props {
    // 内嵌专馆文物字段不完整（无 id/museumId 等），不符合 Artifact 接口，保留 any
    artifacts: any[];
    museumId: number;
    hallName?: string;
  }

  const props = defineProps<Props>();
  const store = useMuseumDataStore();

  // 专馆名关键词 → 该专馆包含的文物 category 集合
  // 按顺序匹配，命中即返回
  const HALL_CATEGORY_RULES: Array<{ keywords: string[]; categories: string[] }> = [
    { keywords: ['青铜'], categories: ['bronze', 'weapon'] },
    { keywords: ['陶瓷', '瓷器'], categories: ['ceramic'] },
    { keywords: ['书画'], categories: ['painting', 'calligraphy', 'ancient_book'] },
    { keywords: ['书法'], categories: ['painting', 'calligraphy'] },
    { keywords: ['玉器'], categories: ['jade', 'gem'] },
    { keywords: ['钟表'], categories: ['clock'] },
    { keywords: ['金银'], categories: ['gold', 'gold_silver'] },
    { keywords: ['壁画'], categories: ['painting', 'stone'] },
    { keywords: ['兵马俑', '坑'], categories: ['terracotta'] },
    { keywords: ['编钟', '音乐'], categories: ['bronze'] },
    { keywords: ['端砚', '文房'], categories: ['stone', 'seal', 'ancient_book'] },
    { keywords: ['丝路'], categories: ['gold_silver', 'ceramic', 'textile', 'other'] },
  ];
  // 体验/临时类专馆无文物
  const NO_ARTIFACT_KEYWORDS = ['体验', '临时', '互动'];

  // 计算某个主题专馆对应的文物 category 集合
  const getHallCategories = (hallName: string): string[] | null => {
    if (!hallName || NO_ARTIFACT_KEYWORDS.some((kw) => hallName.includes(kw))) return null;
    for (const rule of HALL_CATEGORY_RULES) {
      if (rule.keywords.some((kw) => hallName.includes(kw))) return rule.categories;
    }
    return null; // 综合馆或未匹配
  };

  // 按专馆筛选文物：主题馆只显示对应 category；珍宝/精品馆显示不属于其他主题馆的；综合馆显示全部
  const getArtifactsForHall = (hallName: string, allArtifacts: Artifact[], allHallNames: string[]): Artifact[] => {
    if (!hallName) return allArtifacts;
    if (NO_ARTIFACT_KEYWORDS.some((kw) => hallName.includes(kw))) return [];

    // 珍宝/精品馆：显示不属于该馆其他主题馆的文物
    if (hallName.includes('珍宝') || hallName.includes('精品')) {
      const otherCategories = new Set<string>();
      for (const otherName of allHallNames) {
        if (otherName === hallName) continue;
        const cats = getHallCategories(otherName);
        if (cats) cats.forEach((c) => otherCategories.add(c));
      }
      return allArtifacts.filter((a) => !otherCategories.has(a.category || ''));
    }

    // 主题馆：按 category 筛选
    const cats = getHallCategories(hallName);
    if (cats) return allArtifacts.filter((a) => cats.includes(a.category || ''));

    // 综合馆（历史陈列/民俗/基本陈列等）：显示全部
    return allArtifacts;
  };

  // 从 artifacts.json 取该馆真实文物（与 ArtifactList 同源）
  const museumArtifacts = computed(() => {
    return store.getArtifactsByMuseumId(props.museumId);
  });

  // 该馆所有专馆名称（用于珍宝馆排除计算）
  const allHallNames = computed(() => {
    return store.getExhibitionHallsByMuseumId(props.museumId).map((h: ExhibitionHall) => h.name);
  });

  // 优先使用 artifacts.json 真实文物并按专馆主题筛选；该馆无真实文物时 fallback 到专馆内嵌 artifacts
  const displayArtifacts = computed(() => {
    if (museumArtifacts.value && museumArtifacts.value.length > 0) {
      return getArtifactsForHall(props.hallName || '', museumArtifacts.value, allHallNames.value);
    }
    return props.artifacts || [];
  });

  // ===== 点赞/收藏状态：与 ArtifactList/MuseumInfo/ArtifactDetailModal 共享 useArtifactPrefs =====
  const {
    isFavored: prefIsFavored,
    isThumbsUp: prefIsThumbsUp,
    toggleFavor: prefToggleFavor,
    toggleThumbsUp: prefToggleThumbsUp,
  } = useArtifactPrefs(() => props.museumId);

  const msg = useMuseumMessage();

  // 本地 fallback 状态（仅用于无 id 的内嵌文物，无法接入 localStorage）
  const localThumbsUp = reactive(new Set<string>());
  const localFavored = reactive(new Set<string>());

  const isThumbsUpActive = (artifact: Artifact) => {
    if (artifact.id != null) return prefIsThumbsUp(Number(artifact.id));
    return localThumbsUp.has(artifact.name);
  };
  const isFavoredActive = (artifact: Artifact) => {
    if (artifact.id != null) return prefIsFavored(Number(artifact.id));
    return localFavored.has(artifact.name);
  };

  const toggleThumbsUp = (artifact: Artifact) => {
    if (artifact.id != null) { prefToggleThumbsUp(Number(artifact.id), artifact.name); return; }
    if (localThumbsUp.has(artifact.name)) { localThumbsUp.delete(artifact.name); msg.like.cancel(); }
    else { localThumbsUp.add(artifact.name); msg.like.success(artifact.name); }
  };

  const toggleFavor = (artifact: Artifact) => {
    if (artifact.id != null) { prefToggleFavor(Number(artifact.id), artifact.name); return; }
    if (localFavored.has(artifact.name)) { localFavored.delete(artifact.name); msg.favorite.cancel(artifact.name); }
    else { localFavored.add(artifact.name); msg.favorite.success(artifact.name); }
  };

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShare = (artifact: Artifact) => {
    shareTitle.value = `文物 · ${artifact.name}`;
    shareDescription.value = artifact.description || '';
    shareVisible.value = true;
  };

  const hoveredIndex = ref<number | null>(null);

  const handleMouseEnter = (index: number) => {
    hoveredIndex.value = index;
  };

  const handleMouseLeave = () => {
    hoveredIndex.value = null;
  };

  // ===== 文物详情弹窗（复用 ArtifactList 同一 store 数据源，状态互通） =====
  const selectedArtifact = ref<ArtifactDetail | null>(null);

  const openArtifactDetail = async (artifact: Artifact) => {
    if (artifact.id == null) return;
    const detail = await store.getArtifactDetailById(Number(artifact.id));
    if (detail) {
      selectedArtifact.value = { ...detail, image: detail.image || artifact.image };
    }
  };

  const closeArtifactDetail = () => {
    selectedArtifact.value = null;
  };

  // 点击卡片本身打开弹窗（有 id 的真实文物才可打开）
  const handleCardClick = (artifact: Artifact) => {
    if (artifact.id != null) {
      openArtifactDetail(artifact);
    }
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
