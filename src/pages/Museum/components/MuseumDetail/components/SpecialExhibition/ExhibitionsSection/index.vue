<template>
  <div class="exhibitions-section">
    <div class="section-header">
      <h4 class="section-title">
        <span class="title-icon"><TargetIcon /></span>
        专题展览
        <span v-if="displayExhibitions.length" class="title-count">{{ displayExhibitions.length }}</span>
      </h4>
      <button class="more-link">更多展览</button>
    </div>

    <div v-if="displayExhibitions.length === 0" class="empty-state">
      <div class="empty-icon">
        <EmptyBoxIcon />
      </div>
      <h3 class="empty-title">暂无专题展览</h3>
      <p class="empty-description">该专馆暂未举办专题展览</p>
    </div>

    <div v-else class="immersive-exhibition">
      <!-- 左按钮-中间图层-右按钮 一行排布 -->
      <div class="hero-row">
        <!-- 左切换按钮（CSS chevron 形状，非箭头图标） -->
        <button
          class="nav-btn nav-prev"
          :disabled="displayExhibitions.length <= 1"
          @click="prev"
          title="上一个"
        >
          <span class="chevron chevron-left"></span>
        </button>

        <!-- 沉浸式大图 Hero 舞台 -->
        <div class="hero-stage">
          <transition name="hero-slide" mode="out-in">
            <div class="hero-slide" :key="currentIdx">
              <div class="hero-image-wrap">
                <img loading="lazy" :src="current.image" :alt="current.title" />
                <div class="hero-overlay"></div>
                <div class="hero-glow"></div>
              </div>

              <div class="hero-content">
                <div class="hero-top">
                  <span class="status-badge" :class="current.status">
                    <span class="status-dot"></span>
                    {{ current.statusText }}
                  </span>
                  <div class="hero-tags">
                    <span
                      v-for="(tag, tIndex) in current.tags?.slice(0, 3)"
                      :key="tIndex"
                      class="hero-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <h3 class="hero-title">{{ current.title }}</h3>

                <div class="hero-meta">
                  <span class="meta-item">
                    <span class="meta-icon"><CalendarIcon /></span>
                    {{ current.date }}
                  </span>
                </div>

                <p class="hero-desc">{{ current.description }}</p>

                <div class="hero-actions">
                  <button class="reserve-btn">
                    <span class="btn-icon"><TicketIcon /></span>
                    <span>立即预约</span>
                    <span class="btn-shine"></span>
                  </button>
                  <button
                    class="action-btn"
                    :class="{ active: isFavoritedActive(current) }"
                    title="收藏"
                    @click.stop="toggleFavoriteCurrent(current)"
                  >
                    <StarFilledIcon v-if="isFavoritedActive(current)" />
                    <StarIcon v-else />
                  </button>
                  <button
                    class="action-btn"
                    :class="{ active: isFollowedActive(current) }"
                    title="关注"
                    @click.stop="toggleFollowCurrent(current)"
                  >
                    <BellFilledIcon v-if="isFollowedActive(current)" />
                    <BellIcon v-else />
                  </button>
                  <button class="action-btn" title="分享" @click.stop="handleShare(current)">
                    <ShareIcon />
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- 右切换按钮 -->
        <button
          class="nav-btn nav-next"
          :disabled="displayExhibitions.length <= 1"
          @click="next"
          title="下一个"
        >
          <span class="chevron chevron-right"></span>
        </button>
      </div>

      <!-- 时间轴导航 -->
      <div class="timeline-nav">
        <div class="timeline-track">
          <div class="timeline-line"></div>
          <div
            class="timeline-progress"
            :style="{ width: progressWidth }"
          ></div>
        </div>
        <div class="timeline-nodes">
          <button
            v-for="(exh, idx) in displayExhibitions"
            :key="idx"
            class="timeline-node"
            :class="{ active: idx === currentIdx }"
            @click="selectIdx(idx)"
          >
            <span class="node-ring"></span>

            <span class="node-label">{{ exh.title }}</span>
          </button>
        </div>
      </div>
    </div>
    <ShareModal
      v-model:visible="shareVisible"
      :title="shareTitle"
      :description="shareDescription"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { Exhibition, ExhibitionHall } from '@/typesOfPages/museum';
  import {
    EmptyBoxIcon,
    TargetIcon,
    StarIcon,
    StarFilledIcon,
    BellIcon,
    BellFilledIcon,
    ShareIcon,
    CalendarIcon,
    TicketIcon,
  } from '@/pages/Museum/icons/common';
  import { useMuseumDataStore } from '@/stores/museum';
  import { useExhibitionPrefs } from '@/composables/museum/useExhibitionPrefs';
  import { ShareModal } from '@/pages/Museum/components/common';

  interface Props {
    // 内嵌专馆展览字段不完整（无 id/museumId 等），不符合 Exhibition 接口，保留 any
    exhibitions: any[];
    museumId: number;
    hallName?: string;
  }

  const props = defineProps<Props>();
  const store = useMuseumDataStore();

  // 从 exhibitions.json 取该馆真实展览（与 ExhibitionList 同源）
  const museumExhibitions = computed(() => {
    return store.getExhibitionsByMuseumId(props.museumId);
  });

  // 适配 exhibitions.json 字段到组件所需格式（补默认 status/statusText/tags）
  const adaptExhibition = (exh: Exhibition): Exhibition => ({
    ...exh,
    status: exh.status || 'ongoing',
    statusText: exh.statusText || '正在展出',
    tags: exh.tags || (exh.category ? [exh.category] : []),
  });

  // ===== 按专馆分配展览 =====
  // 展览 title/description 关键词 → 专馆 name 关键词映射
  const EXH_THEME_RULES: Array<{ exhKw: string[]; hallKw: string[] }> = [
    { exhKw: ['青铜'], hallKw: ['青铜'] },
    { exhKw: ['陶瓷', '瓷器'], hallKw: ['陶瓷', '瓷器'] },
    { exhKw: ['书画', '绘画', '书法'], hallKw: ['书画', '书法'] },
    { exhKw: ['玉器', '玉'], hallKw: ['玉器'] },
    { exhKw: ['钟表'], hallKw: ['钟表'] },
    { exhKw: ['金银'], hallKw: ['金银'] },
    { exhKw: ['壁画'], hallKw: ['壁画'] },
    { exhKw: ['兵马俑', '俑'], hallKw: ['兵马俑', '坑'] },
    { exhKw: ['民俗'], hallKw: ['民俗'] },
    { exhKw: ['丝路'], hallKw: ['丝路'] },
    { exhKw: ['马王堆'], hallKw: ['马王堆'] },
  ];
  const NO_EXHIBITION_KEYWORDS = ['体验', '临时', '互动'];
  const COMPREHENSIVE_KEYWORDS = ['历史陈列', '基本陈列', '陈列', '民俗'];

  // 主题匹配：展览 title/description 含对应关键词 → 分配到对应专馆
  const matchByTheme = (hallName: string, allExhibitions: Exhibition[]): Exhibition[] => {
    for (const rule of EXH_THEME_RULES) {
      if (rule.hallKw.some((kw) => hallName.includes(kw))) {
        return allExhibitions.filter(
          (e) => rule.exhKw.some((kw) => (e.title || '').includes(kw) || (e.description || '').includes(kw)),
        );
      }
    }
    return [];
  };

  // 按专馆筛选展览：主题匹配优先，未匹配的按索引分配确保不同专馆分到不同展览
  const getExhibitionsForHall = (hallName: string, allExhibitions: Exhibition[], allHallNames: string[]): Exhibition[] => {
    if (!hallName || allExhibitions.length === 0) return allExhibitions;
    if (NO_EXHIBITION_KEYWORDS.some((kw) => hallName.includes(kw))) return [];
    // 综合馆显示全部
    if (COMPREHENSIVE_KEYWORDS.some((kw) => hallName.includes(kw))) return allExhibitions;

    // 1. 主题匹配优先
    const matched = matchByTheme(hallName, allExhibitions);
    if (matched.length > 0) return matched;

    // 2. 未匹配的主题专馆：按索引分配未被主题匹配占用的展览
    const themeHalls = allHallNames.filter(
      (n) =>
        !COMPREHENSIVE_KEYWORDS.some((kw) => n.includes(kw)) &&
        !NO_EXHIBITION_KEYWORDS.some((kw) => n.includes(kw)),
    );
    if (!themeHalls.includes(hallName)) return allExhibitions;

    // 收集已被主题匹配的展览
    const usedExh = new Set<Exhibition>();
    for (const hn of themeHalls) {
      if (hn === hallName) continue;
      matchByTheme(hn, allExhibitions).forEach((e) => usedExh.add(e));
    }
    const available = allExhibitions.filter((e) => !usedExh.has(e));

    // 未匹配的主题专馆按索引各分一个
    const unmatchedHalls = themeHalls.filter((hn) => matchByTheme(hn, allExhibitions).length === 0);
    const unmatchedIdx = unmatchedHalls.indexOf(hallName);
    if (unmatchedIdx >= 0 && unmatchedIdx < available.length) {
      return [available[unmatchedIdx]];
    }
    return []; // 展览不够，空 UI
  };

  // 该馆所有专馆名称
  const allHallNames = computed(() => {
    return store.getExhibitionHallsByMuseumId(props.museumId).map((h: ExhibitionHall) => h.name);
  });

  // 优先使用 exhibitions.json 真实展览并按专馆筛选；该馆无真实展览时 fallback 到专馆内嵌 exhibitions
  const displayExhibitions = computed(() => {
    if (museumExhibitions.value && museumExhibitions.value.length > 0) {
      const filtered = getExhibitionsForHall(
        props.hallName || '',
        museumExhibitions.value,
        allHallNames.value,
      );
      return filtered.map(adaptExhibition);
    }
    return props.exhibitions || [];
  });

  const currentIdx = ref(0);

  // 切换专馆时重置索引，防止越界
  watch(
    () => props.hallName,
    () => {
      currentIdx.value = 0;
    },
  );

  const current = computed(() => displayExhibitions.value[currentIdx.value] || ({} as Exhibition));

  const progressWidth = computed(() => {
    if (displayExhibitions.value.length <= 1) return '0%';
    return `${(currentIdx.value / (displayExhibitions.value.length - 1)) * 100}%`;
  });

  const selectIdx = (idx: number) => {
    currentIdx.value = idx;
  };

  const prev = () => {
    currentIdx.value =
      (currentIdx.value - 1 + displayExhibitions.value.length) % displayExhibitions.value.length;
  };

  const next = () => {
    currentIdx.value = (currentIdx.value + 1) % displayExhibitions.value.length;
  };

  // ===== 关注/收藏状态：与 ExhibitionList/MuseumInfo 共享 useExhibitionPrefs =====
  const { isFollowed, isFavorited, toggleFollow, toggleFavorite } = useExhibitionPrefs(() => props.museumId);

  const isFavoritedActive = (exh: Exhibition) => {
    return exh.id != null && isFavorited(Number(exh.id));
  };

  const isFollowedActive = (exh: Exhibition) => {
    return exh.id != null && isFollowed(Number(exh.id));
  };

  const toggleFavoriteCurrent = (exh: Exhibition) => {
    if (exh.id != null) toggleFavorite(Number(exh.id), exh.title);
  };

  const toggleFollowCurrent = (exh: Exhibition) => {
    if (exh.id != null) toggleFollow(Number(exh.id), exh.title);
  };

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShare = (exh: Exhibition) => {
    shareTitle.value = exh.title;
    shareDescription.value = exh.description;
    shareVisible.value = true;
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
