<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="artifact"
        class="artifact-modal"
        @click.self="handleClose"
      >
        <div class="modal-panel">
          <!-- 顶部装饰线与标题匾 -->
          <div class="title-area">
            <span class="title-line left"></span>
            <div class="title-plaque">
              <span class="plaque-inner">{{ artifact.name }}</span>
            </div>
            <span class="title-line right"></span>
            <button
              class="close-btn"
              type="button"
              aria-label="关闭"
              @click="handleClose"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- 标签：年代 / 作者 / 文物等级 -->
            <div v-if="tags.length" class="tag-row">
              <span
                v-for="(tag, index) in tags"
                :key="tag"
                class="tag"
                :class="{ primary: index === 0 }"
              >
                <span class="tag-text">{{ tag }}</span>
              </span>
            </div>

            <!-- 主图框 -->
            <div class="gallery-frame">
              <span class="frame-corner tl"></span>
              <span class="frame-corner tr"></span>
              <span class="frame-corner bl"></span>
              <span class="frame-corner br"></span>
              <div class="gallery-stage" @click="openLightbox">
                <img
                  v-if="images[currentIndex] && !imageFailed"
                  :src="images[currentIndex]"
                  :alt="artifact.name"
                  @error="imageFailed = true"
                />
                <div v-else class="gallery-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="8.5" cy="10" r="1.5" />
                    <path d="m21 16-5-5L5 20" />
                  </svg>
                  <span>{{ artifact.name }}</span>
                </div>
                <button
                  v-if="hasImage"
                  class="zoom-btn"
                  type="button"
                  @click.stop="openLightbox"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.6-3.6M11 8.6v4.8M8.6 11h4.8" />
                  </svg>
                  放大
                </button>
                <template v-if="images.length > 1">
                  <button
                    class="stage-nav prev"
                    type="button"
                    aria-label="上一张"
                    @click.stop="prevImage"
                  >‹</button>
                  <button
                    class="stage-nav next"
                    type="button"
                    aria-label="下一张"
                    @click.stop="nextImage"
                  >›</button>
                </template>
              </div>
            </div>

            <!-- 轮播圆点 -->
            <div v-if="images.length > 1" class="dots">
              <span
                v-for="(_, index) in images"
                :key="index"
                class="dot"
                :class="{ active: index === currentIndex }"
                @click="currentIndex = index"
              ></span>
            </div>

            <!-- 文物概述（模板套话自动隐藏） -->
            <template v-if="overview">
              <div class="section-heading">
                <div class="heading-plaque">
                  <span class="plaque-inner">文物概述</span>
                </div>
              </div>
              <div class="overview-box">
                {{ overview }}
              </div>
            </template>

            <!-- 基础档案 + 鉴赏要点 -->
            <div class="dual-grid" :class="{ single: !rightPanel }">
              <div class="info-panel">
                <div class="panel-plaque">
                  <span class="plaque-inner">基础档案</span>
                </div>
                <ul v-if="archiveRows.length" class="archive-list">
                  <li v-for="row in archiveRows" :key="row.label">
                    <span class="label">{{ row.label }}</span>
                    <span class="value">{{ row.value }}</span>
                  </li>
                </ul>
                <p v-else class="panel-empty">暂无档案信息</p>
              </div>

              <div v-if="rightPanel" class="info-panel">
                <div class="panel-plaque">
                  <span class="plaque-inner">{{ rightPanel.title }}</span>
                </div>
                <ul v-if="rightPanel.bullets" class="highlight-list">
                  <li v-for="item in rightPanel.bullets" :key="item">
                    <i class="diamond"></i>
                    <span>{{ item }}</span>
                  </li>
                </ul>
                <p v-else class="panel-text">{{ rightPanel.text }}</p>
              </div>
            </div>

            <!-- 历史价值 -->
            <template v-if="historicalValueText">
              <div class="section-heading">
                <div class="heading-plaque">
                  <span class="plaque-inner">历史价值</span>
                </div>
              </div>
              <div class="overview-box">{{ historicalValueText }}</div>
            </template>


            <!-- 史料与流传（直接展示） -->
            <template v-if="historyBlocks.length">
              <div class="section-heading">
                <div class="heading-plaque">
                  <span class="plaque-inner">史料与流传</span>
                </div>
              </div>
              <div class="history-body">
                <div
                  v-for="block in historyBlocks"
                  :key="block.title"
                  class="history-block"
                >
                  <h4><i class="diamond"></i>{{ block.title }}</h4>
                  <ul v-if="block.items">
                    <li v-for="entry in block.items" :key="entry">{{ entry }}</li>
                  </ul>
                  <p v-else>{{ block.text }}</p>
                </div>
              </div>
            </template>

            <!-- 相关文物 -->
            <template v-if="relatedArtifacts.length">
              <div class="section-heading">
                <div class="heading-plaque">
                  <span class="plaque-inner">相关文物</span>
                </div>
              </div>
              <div class="related-grid">
                <button
                  v-for="item in relatedArtifacts"
                  :key="item.id"
                  type="button"
                  class="related-card"
                  @click="goRelated(item)"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    loading="lazy"
                  />
                  <span v-else class="related-thumb">{{ item.name.slice(0, 1) }}</span>
                  <span class="related-meta">
                    <em class="related-name">{{ item.name }}</em>
                    <em class="related-period">{{ item.period }}</em>
                  </span>
                </button>
              </div>
            </template>
          </div>

          <!-- 底部操作栏 -->
          <div class="action-bar">
            <div class="action-item">
              <button
                type="button"
                :class="{ active: isThumbsUp(artifact.id) }"
                @click="toggleThumbsUp(artifact.id, artifact.name)"
              >
                <svg viewBox="0 0 24 24" :fill="isThumbsUp(artifact.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 10.5V20H4.5A1.5 1.5 0 0 1 3 18.5v-6.5A1.5 1.5 0 0 1 4.5 10.5H7Zm0 0 4.3-7.2a1.8 1.8 0 0 1 3.3 1.2l-.6 4.5h5.3a2 2 0 0 1 2 2.35l-1.15 6.5A2 2 0 0 1 18.2 20H7" />
                </svg>
                <span>点赞</span>
              </button>
            </div>
            <div class="action-item">
              <button
                type="button"

                :class="{ active: isFavored(artifact.id) }"
                @click="handleToggleFavor"
              >
                <svg viewBox="0 0 24 24" :fill="isFavored(artifact.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6.5 4h11a1 1 0 0 1 1 1v15.5l-6.5-4.2L5.5 20.5V5a1 1 0 0 1 1-1Z" />
                </svg>
                <span>收藏</span>
              </button>
            </div>
            <div class="action-item">
              <button type="button" @click="handleShare">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="6" cy="12" r="2.4" />
                  <circle cx="17.5" cy="5.5" r="2.4" />
                  <circle cx="17.5" cy="18.5" r="2.4" />
                  <path d="m8.2 10.7 7.1-3.9M8.2 13.3l7.1 3.9" />
                </svg>
                <span>分享</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 图片放大灯箱 -->
        <transition name="lightbox-fade">
          <div
            v-if="lightbox && hasImage"
            class="lightbox"
            @click.self="closeLightbox"
          >
            <button
              class="lightbox-close"
              type="button"
              aria-label="关闭大图"
              @click="closeLightbox"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <button
              v-if="images.length > 1"
              class="lightbox-nav prev"
              type="button"
              aria-label="上一张"
              @click.stop="prevImage"
            >‹</button>
            <img
              class="lightbox-image"
              :src="images[currentIndex]"
              :alt="artifact.name"
            />
            <button
              v-if="images.length > 1"
              class="lightbox-nav next"
              type="button"
              aria-label="下一张"
              @click.stop="nextImage"
            >›</button>
            <div v-if="images.length > 1" class="lightbox-caption">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
          </div>
        </transition>

        <!-- 轻提示 -->
        <transition name="toast-fade">
          <div v-if="toast" class="toast">{{ toast }}</div>
        </transition>
      </div>
    </transition>
    <ShareModal
      v-model:visible="shareVisible"
      :title="shareTitle"
      :description="shareDescription"
    />
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onBeforeUnmount } from 'vue';
  import type { ArtifactDetail, Artifact } from '@/typesOfPages/museum';
  import { artifactTypes } from '@/constants/museum/artifactFilters';
  import { useArtifactPrefs } from '@/composables/museum/useArtifactPrefs';
  import { useCurrentMuseumId } from '@/composables/museum/useCurrentMuseumId';
  import { ShareModal } from '@/pages/Museum/components/common';

  const typeLabelMap: Record<string, string> = Object.fromEntries(
    artifactTypes
      .filter((item) => item.value !== 'all')
      .map((item) => [item.value, item.label]),
  );

  interface Props {
    artifact: ArtifactDetail | null;
    /** 当前博物馆的文物列表，用于计算"相关文物" */
    candidates?: Artifact[];
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', artifact: Artifact): void;
  }>();

  // ─── 轮播 / 灯箱状态 ───
  const currentIndex = ref(0);
  const imageFailed = ref(false);
  const lightbox = ref(false);

  // ─── 相关文物弹层 ───
  // showRelated 已移除：相关文物改为弹窗内子模块直接展示

  // ─── 轻提示 ───
  const toast = ref('');
  let toastTimer: ReturnType<typeof setTimeout> | null = null;


  // ─── 点赞 / 收藏（共享 composable，与 ArtifactContainer / ArtifactsSection 共用同一状态） ───
  const { isFavored, isThumbsUp, toggleFavor, toggleThumbsUp } = useArtifactPrefs(useCurrentMuseumId());

  const handleToggleFavor = () => {
    if (!props.artifact) return;
    toggleFavor(props.artifact.id, props.artifact.name);
  };

  // ─── 分享 ───
  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShare = () => {
    if (!props.artifact) return;
    shareTitle.value = `文物详情 · ${props.artifact.name}`;
    shareDescription.value = props.artifact.description || '';
    shareVisible.value = true;
  };

  // ─── 派生展示数据 ───
  // 模板化概述："X是X博物馆的重要馆藏文物，X时期的代表性器物……"
  const isPlaceholderDescription = (text: string) =>
    /的重要馆藏文物，.+代表性器物/.test(text) ||
    /的重要馆藏文物，.+代表性的器物/.test(text);

  const overview = computed(() =>
    props.artifact && !isPlaceholderDescription(props.artifact.description || '')
      ? props.artifact.description
      : '',
  );

  const images = computed<string[]>(() => {
    const artifact = props.artifact;
    if (!artifact) return [];
    if (artifact.images?.length) return artifact.images;
    return artifact.image ? [artifact.image] : [];
  });

  const hasImage = computed(() => images.value.length > 0);

  const tags = computed<string[]>(() => {
    const artifact = props.artifact;
    if (!artifact) return [];
    const result: string[] = [artifact.period || '年代不详'];
    // 第二枚标签优先显示作者；佚名文物回退为文物品类
    const authorOrType = artifact.creator || typeLabelMap[artifact.type || ''];
    if (authorOrType) result.push(authorOrType);
    const level = normalizeLevel(artifact.artifactLevel);
    if (level) result.push(level);
    return result;
  });

  function normalizeLevel(raw?: string): string {
    if (!raw) return '';
    // "复原模型，具有重要科普价值" 不作为等级标签展示
    if (raw.includes('复原') || raw.includes('科普')) return '';
    const first = raw.split(/[，,、；;]/)[0].trim();
    return first.replace(/^国家/, '');
  }

  // 占位套话：批量生成数据中的无信息量文本，不向游客展示
  const PLACEHOLDER_SOURCE = '考古发掘或征集所得';

  const archiveRows = computed(() => {
    const artifact = props.artifact;
    if (!artifact) return [];
    const info = artifact.basicInfo || {};
    const rows = [
      { label: '年代', value: info.periodDetail || artifact.period },
      { label: '材质', value: info.material },
      { label: '尺寸', value: info.dimensions },
      { label: '馆藏', value: info.collection },
      {
        label: '来源',
        value:
          info.excavation && info.excavation !== PLACEHOLDER_SOURCE
            ? info.excavation
            : '',
      },
    ];
    return rows.filter((row) => row.value);
  });

  interface RightPanel {
    title: string;
    bullets?: string[];
    text?: string;
  }

  // 模板化外观描述判定：批量数据常见的"造型精美，工艺精湛，保存完好"类空话
  const isPlaceholderAppearance = (text: string) =>
    text.length < 30 ||
    (text.includes('造型精美') && text.includes('工艺精湛') && text.includes('保存完好'));

  const rightPanel = computed<RightPanel | null>(() => {
    const artifact = props.artifact;
    if (!artifact) return null;
    if (artifact.appreciation?.length) {
      return { title: '鉴赏要点', bullets: artifact.appreciation };
    }
    if (artifact.appearance && !isPlaceholderAppearance(artifact.appearance)) {
      return { title: '文物看点', text: artifact.appearance };
    }
    return null;
  });

  interface HistoryBlock {
    key: string;
    title: string;
    text?: string;
    items?: string[];
  }

  // 模板化历史价值判定：与概述重复或空话
  const isPlaceholderHistoricalValue = (text: string) =>
    text.trim().length < 20 ||
    (/具有重要.{0,4}价值和.{0,4}价值/.test(text) && text.length < 50);

  const historicalValueText = computed(() => {
    const artifact = props.artifact;
    if (!artifact) return '';
    const text = artifact.historicalValue || '';
    return text && !isPlaceholderHistoricalValue(text) ? text : '';
  });

  // 模板化流传故事：短句或"发现和收藏过程体现了文物保护……"类空话
  const isPlaceholderStory = (text: string) =>
    text.trim().length < 40 || text.includes('发现和收藏过程体现了文物保护');

  const historyBlocks = computed<HistoryBlock[]>(() => {
    const artifact = props.artifact;
    if (!artifact) return [];
    const blocks: HistoryBlock[] = [];

    const provenance = artifact.provenance || artifact.relatedStory;
    if (provenance && !isPlaceholderStory(provenance)) {
      blocks.push({ key: 'provenance', title: '流传递藏史', text: provenance });
    }
    return blocks;
  });


  // ─── 相关文物：同类型优先，其次同年代 ───
  const relatedArtifacts = computed<Artifact[]>(() => {
    const artifact = props.artifact;
    if (!artifact || !props.candidates?.length) return [];
    return props.candidates
      .filter((item) => item.id !== artifact.id)
      .map((item) => {
        // 确定性弱排序，避免同一文物每次打开相关列表顺序跳动
        let score = ((item.id * 7) % 10) / 100;
        if (item.category === artifact.type) score += 2;
        if (item.period === artifact.period) score += 1;
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((entry) => entry.item);
  });

  const goRelated = (item: Artifact) => {

    emit('select', item);
  };

  // ─── 轮播切换 / 灯箱 ───
  const prevImage = () => {
    if (!images.value.length) return;
    currentIndex.value =
      (currentIndex.value - 1 + images.value.length) % images.value.length;
  };

  const nextImage = () => {
    if (!images.value.length) return;
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  };

  const openLightbox = () => {
    if (!hasImage.value) return;
    lightbox.value = true;
  };

  const closeLightbox = () => {
    lightbox.value = false;
  };

  // ─── 关闭 / 锁定背景滚动 / Esc ───
  const handleClose = () => {
    emit('close');
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (lightbox.value) {
        closeLightbox();
      } else {
        handleClose();
      }
    }
  };

  watch(
    () => props.artifact?.id,
    () => {
      currentIndex.value = 0;
      imageFailed.value = false;
      lightbox.value = false;
    },
    { immediate: true },
  );

  watch(lightbox, (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // ─── 锁定外层滚动 ───
  // 弹窗打开时隐藏右侧视窗（.museum-content）与 body 的滚动条，
  // 保留弹窗内部 .modal-body 的滚动。
  const scrollLockTargets: HTMLElement[] = [];
  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
    const museumContent = document.querySelector('.museum-content');
    if (museumContent instanceof HTMLElement) {
      museumContent.style.overflow = 'hidden';
      scrollLockTargets.push(museumContent);
    }
    const museumGrid = document.querySelector('.museum-grid');
    if (museumGrid instanceof HTMLElement) {
      museumGrid.style.overflow = 'hidden';
      scrollLockTargets.push(museumGrid);
    }
  };
  const unlockScroll = () => {
    document.body.style.overflow = '';
    scrollLockTargets.forEach((el) => {
      el.style.overflow = '';
    });
    scrollLockTargets.length = 0;
  };

  watch(
    () => props.artifact,
    (artifact) => {
      if (artifact) {
        lockScroll();
        document.addEventListener('keydown', onKeydown);
      } else {
        unlockScroll();
        document.removeEventListener('keydown', onKeydown);
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    unlockScroll();
    document.removeEventListener('keydown', onKeydown);
    if (toastTimer) clearTimeout(toastTimer);
  });
</script>

<style lang="scss" scoped src="./index.scss"></style>
