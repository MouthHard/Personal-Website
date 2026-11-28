<template>
  <article class="guide-card">
    <!-- 图纸折痕与整饰线 -->
    <span class="paper-crease crease-v" aria-hidden="true"></span>
    <span class="paper-crease crease-h" aria-hidden="true"></span>
    <span class="map-frame" aria-hidden="true"></span>
    <CompassIcon class="map-watermark" :stroke-width="0.7" />

    <div class="guide-body">
      <!-- 左侧：实景图版 -->
      <div class="card-media">
        <figure class="photo-plate">
          <span class="plate-tag">实景图版</span>
          <div class="plate-inner">
            <LandscapeImage
              :src="item.thumbnail"
              :alt="item.title"
              loading="lazy"
            />
            <span class="plate-grid" aria-hidden="true"></span>
            <span class="plate-marks" aria-hidden="true"></span>
            <span class="plate-scale" aria-hidden="true"></span>
            <button
              type="button"
              class="guide-detail-btn"
              aria-label="查看详情"
              @click.stop="handleDetail"
            >
              <span class="compass-knob" aria-hidden="true">
                <CompassIcon :stroke-width="2" />
              </span>
              <span>查看详情</span>
            </button>
          </div>
          <figcaption class="plate-caption">
            <CompassIcon :stroke-width="1.8" />
            <span class="plate-name">{{ item.location || '实地影像' }}</span>
            <span class="plate-caption-en">FIELD NOTES</span>
          </figcaption>
        </figure>
      </div>

      <!-- 右侧：手记内容 -->
      <div class="card-paper">
        <header class="card-header">
          <div class="type-badge">
            <span class="stamp-icon">
              <BookIcon :stroke-width="2" />
            </span>
            <span class="stamp-copy">
              <span class="stamp-en">FIELD GUIDE</span>
              <span class="stamp-cn">攻略手记</span>
            </span>
          </div>

          <div class="header-meta">
            <div
              v-if="item.difficulty"
              class="difficulty-badge"
              :class="item.difficulty"
            >
              <span class="difficulty-dots" aria-hidden="true">
                <i
                  v-for="n in 3"
                  :key="n"
                  :class="{ on: n <= difficultyLevel }"
                ></i>
              </span>
              <span class="difficulty-text">{{ difficultyLabel }}</span>
            </div>

            <span
              class="publish-date"
              :class="{
                'sort-highlighted': !isDateDimmed && sortMode !== 'relevance',
                'sort-dimmed': isDateDimmed,
              }"
            >
              <span class="date-caption">DATE</span>
              <span class="date-value">{{ item.publishDate || '刚刚' }}</span>
            </span>
          </div>
        </header>

        <div class="content-title">
          <span class="note-pin" aria-hidden="true"></span>
          <h3 class="card-title">{{ item.title }}</h3>
          <p v-if="item.description" class="card-description">
            {{ item.description }}
          </p>
        </div>

        <template v-if="item.location || item.bestTime || item.duration">
          <div class="rail-head">
            <span class="rail-title">行程速览</span>
            <span class="rail-en">AT A GLANCE</span>
            <span class="rail-rule" aria-hidden="true"></span>
          </div>

          <div class="legend-rail">
            <div class="rail-stack">
              <div v-if="item.location" class="rail-cell rail-location">
                <span class="rail-icon">
                  <LocationIcon filled :stroke-width="2" />
                </span>
                <span class="rail-copy">
                  <span class="rail-label">地点</span>
                  <span class="rail-value">{{ item.location }}</span>
                </span>
              </div>
              <div v-if="item.duration" class="rail-cell rail-duration">
                <span class="rail-icon">
                  <ClockIcon filled :stroke-width="2" />
                </span>
                <span class="rail-copy">
                  <span class="rail-label">推荐时长</span>
                  <span class="rail-value">{{ item.duration }}</span>
                </span>
              </div>
            </div>
            <div v-if="item.bestTime" class="rail-cell rail-time">
              <span class="rail-icon">
                <CalendarIcon filled :stroke-width="2" />
              </span>
              <span class="rail-copy">
                <span class="rail-label">最佳时间</span>
                <span class="rail-value">{{ item.bestTime }}</span>
              </span>
            </div>
          </div>
        </template>

        <div
          v-if="item.highlights && item.highlights.length > 0"
          class="waypoints"
        >
          <span
            v-for="(highlight, idx) in item.highlights.slice(0, 3)"
            :key="idx"
            class="waypoint"
          >
            <span class="waypoint-num">
              {{ String(idx + 1).padStart(2, '0') }}
            </span>
            <span class="waypoint-text">{{ highlight }}</span>
          </span>
        </div>

        <footer class="card-footer">
          <div class="action-buttons">
            <button
              class="action-btn like"
              :class="{
                active: isLiked,
                'sort-highlighted': !isLikeDimmed && sortMode !== 'relevance',
                'sort-dimmed': isLikeDimmed,
              }"
              @click="handleLike"
            >
              <ThumbUpIcon :stroke-width="2" :filled="isLiked" />
              <span>{{ formatCount(getCounts().likes) }}</span>
            </button>
            <button
              class="action-btn love"
              :class="{
                active: isLoved,
                'sort-highlighted': !isLoveDimmed && sortMode !== 'relevance',
                'sort-dimmed': isLoveDimmed,
              }"
              @click="handleLove"
            >
              <HeartIcon :stroke-width="2" :filled="isLoved" />
              <span>{{ formatCount(getCounts().loves) }}</span>
            </button>
            <button
              class="action-btn bookmark"
              :class="{
                active: isBookmarked,
                'sort-highlighted':
                  !isBookmarkDimmed && sortMode !== 'relevance',
                'sort-dimmed': isBookmarkDimmed,
              }"
              @click="handleBookmark"
            >
              <BookmarkIcon :stroke-width="2" :filled="isBookmarked" />
              <span>{{ formatCount(getCounts().favorites) }}</span>
            </button>
            <button
              class="action-btn share"
              :class="{
                'sort-highlighted': !isShareDimmed && sortMode !== 'relevance',
                'sort-dimmed': isShareDimmed,
              }"
              @click="handleShare"
            >
              <ShareIcon :stroke-width="2" />
              <span>{{ formatCount(getCounts().shares) }}</span>
            </button>
            <div
              class="action-btn views"
              :class="{
                'sort-highlighted': !isViewsDimmed && sortMode !== 'relevance',
                'sort-dimmed': isViewsDimmed,
              }"
            >
              <EyeIcon :stroke-width="2" />
              <span>{{ formatCount(getCounts().views) }}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { SearchResultItem } from '@/utils/landscape';
  import { useSearchCardInteractions } from '../../composables/useSearchCardInteractions';
  import { useSortDimming } from '../../composables/useSortDimming';
  import BookIcon from '@/pages/Landscape/icons/common/BookIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import CalendarIcon from '@/pages/Landscape/icons/common/CalendarIcon.vue';
  import ClockIcon from '@/pages/Landscape/icons/common/ClockIcon.vue';
  import CompassIcon from '@/pages/Landscape/icons/common/CompassIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';

  interface Props {
    item: SearchResultItem;
    sortMode: string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    like: [id: string];
    love: [id: string];
    bookmark: [id: string];
    share: [id: string];
  }>();

  const router = useRouter();

  /** 跳转攻略页并按标题检索 */
  const handleDetail = () => {
    const keyword = (props.item.title || '').trim();
    void router.push({
      path: '/landscape/guides',
      query: keyword ? { q: keyword } : {},
    });
  };

  const {
    isLiked,
    isLoved,
    isBookmarked,
    getCounts,
    formatCount,
    handleLike,
    handleLove,
    handleBookmark,
    handleShare,
  } = useSearchCardInteractions(() => props.item.id, emit);

  const {
    isDateDimmed,
    isLikeDimmed,
    isLoveDimmed,
    isViewsDimmed,
    isBookmarkDimmed,
    isShareDimmed,
  } = useSortDimming(() => props.sortMode);

  const difficultyLabels: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

  const difficultyLabel = computed(() => {
    const diff = props.item.difficulty || 'beginner';
    return difficultyLabels[diff] || diff;
  });

  const difficultyLevel = computed(() => {
    const diff = props.item.difficulty || 'beginner';
    if (diff === 'advanced' || diff === 'hard') return 3;
    if (diff === 'intermediate' || diff === 'medium') return 2;
    return 1;
  });
</script>

<style scoped lang="scss" src="./index.scss" />
