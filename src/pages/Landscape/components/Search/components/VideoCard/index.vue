<template>
  <div class="video-card">
    <span class="case-corners" aria-hidden="true">
      <i class="tl"></i>
      <i class="tr"></i>
      <i class="bl"></i>
      <i class="br"></i>
    </span>

    <div class="camera-shell">
      <div class="card-top">
        <span class="reel-chip">
          <span class="reel" aria-hidden="true">
            <span class="reel-rotor">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </span>
            <i class="reel-hub"></i>
            <i class="reel-lamp"></i>
          </span>
          <span class="reel-label">视频</span>
        </span>

        <h3 class="title-slate" :title="item.title">
          <span class="slate-title">{{ item.title }}</span>
        </h3>

        <span
          v-if="item.date"
          class="date-ticket"
          :class="{
            'sort-highlighted': !isDateDimmed && sortMode !== 'relevance',
            'sort-dimmed': isDateDimmed,
          }"
        >
          <i class="ticket-hole" aria-hidden="true"></i>
          <span class="ticket-body">
            <span class="ticket-label">DATE</span>
            <span class="ticket-date">{{ item.date }}</span>
          </span>
        </span>
      </div>

      <div class="film-gate">
        <LandscapeImage
          :src="item.thumbnail"
          :alt="item.title"
          loading="lazy"
        />
        <span class="gate-vignette" aria-hidden="true"></span>
        <span class="gate-sheen" aria-hidden="true"></span>
        <span class="gate-perfs" aria-hidden="true"></span>
        <span class="gate-studs" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>

        <span class="rec-mark" aria-hidden="true">
          <i class="rec-dot"></i>
          REC
        </span>

        <span v-if="techSpec" class="spec-chip">{{ techSpec }}</span>

        <div class="play-overlay">
          <span class="shutter-button">
            <PlayIcon :stroke-width="0" />
          </span>
        </div>

        <span v-if="item.duration" class="duration-counter">
          <i class="duration-dot" aria-hidden="true"></i>
          {{ item.duration }}
        </span>
      </div>

      <div class="card-body">
        <div class="body-info">
          <p v-if="note" class="slate-note">{{ note }}</p>

          <div v-if="displayTags.length > 0" class="card-tags">
            <span v-for="tag in displayTags" :key="tag" class="film-tag">
              {{ tag }}
            </span>
          </div>

          <span v-if="item.location" class="location-plate">
            <span class="loc-icon">
              <LocationIcon :stroke-width="2.2" />
            </span>
            <span class="loc-text">{{ item.location }}</span>
          </span>
        </div>

        <button
          type="button"
          class="detail-btn"
          aria-label="查看详情"
          @click.stop="handleViewDetail"
        >
          <span class="clapper-arm" aria-hidden="true">
            <i class="arm-hinge"></i>
          </span>
          <span class="clapper-screen" aria-hidden="true"></span>
          <span class="clapper-text">查看详情</span>
          <span class="clapper-go" aria-hidden="true">
            <ArrowRightIcon :stroke-width="2.6" />
          </span>
        </button>

        <div
          class="tape-counter"
          :class="{
            'sort-highlighted': !isViewsDimmed && sortMode !== 'relevance',
            'sort-dimmed': isViewsDimmed,
          }"
        >
          <span class="counter-label">VIEWS</span>
          <span class="counter-top">
            <EyeIcon :stroke-width="2.2" />
            <span class="counter-digits">
              {{ formatCount(getCounts().views) }}
            </span>
          </span>
        </div>
      </div>

      <div class="card-footer">
        <div class="action-group">
          <button
            type="button"
            class="action-btn like"
            :class="{
              active: isLiked,
              'sort-highlighted': !isLikeDimmed && sortMode !== 'relevance',
              'sort-dimmed': isLikeDimmed,
            }"
            aria-label="点赞"
            @click="handleLike"
          >
            <span class="key-face">
              <ThumbUpIcon :stroke-width="2" :filled="isLiked" />
              <span class="count">{{ formatCount(getCounts().likes) }}</span>
            </span>
          </button>
          <button
            type="button"
            class="action-btn love"
            :class="{
              active: isLoved,
              'sort-highlighted': !isLoveDimmed && sortMode !== 'relevance',
              'sort-dimmed': isLoveDimmed,
            }"
            aria-label="喜欢"
            @click="handleLove"
          >
            <span class="key-face">
              <HeartIcon :stroke-width="2" :filled="isLoved" />
              <span class="count">{{ formatCount(getCounts().loves) }}</span>
            </span>
          </button>
          <button
            type="button"
            class="action-btn bookmark"
            :class="{
              active: isBookmarked,
              'sort-highlighted': !isBookmarkDimmed && sortMode !== 'relevance',
              'sort-dimmed': isBookmarkDimmed,
            }"
            aria-label="加入收藏"
            @click="handleBookmark"
          >
            <span class="key-face">
              <BookmarkIcon :stroke-width="2" :filled="isBookmarked" />
              <span class="count">
                {{ formatCount(getCounts().favorites) }}
              </span>
            </span>
          </button>
          <button
            type="button"
            class="action-btn share"
            :class="{
              'sort-highlighted': !isShareDimmed && sortMode !== 'relevance',
              'sort-dimmed': isShareDimmed,
            }"
            aria-label="分享"
            @click="handleShare"
          >
            <span class="key-face">
              <ShareIcon :stroke-width="2" />
              <span class="count">{{ formatCount(getCounts().shares) }}</span>
            </span>
          </button>
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-meta">
          <span class="progress-label">PLAYED</span>
          <span class="progress-text">已观看 {{ progressPercent }}%</span>
        </div>
        <div class="progress-bar">
          <span class="progress-fill" :style="{ width: progressPercent + '%' }">
            <i class="progress-head" aria-hidden="true"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { SearchResultItem } from '@/utils/landscape';
  import { useSearchCardInteractions } from '../../composables/useSearchCardInteractions';
  import { useSortDimming } from '../../composables/useSortDimming';
  import PlayIcon from '@/pages/Landscape/icons/common/PlayIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import ArrowRightIcon from '@/pages/Landscape/icons/common/ArrowRightIcon.vue';
  import LandscapeImage from '@/pages/Landscape/components/common/LandscapeImage/index.vue';

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

  /** 详情检索词：直接使用卡片标题 */
  const detailKeyword = computed(() => (props.item.title || '').trim());

  const handleViewDetail = () => {
    void router.push({
      path: '/landscape/category',
      query: detailKeyword.value ? { keyword: detailKeyword.value } : {},
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

  const progressPercent = computed(() => Math.floor(Math.random() * 100));

  /** 标签去重后最多展示三个，避免重复信息占位 */
  const displayTags = computed(() =>
    Array.from(new Set(props.item.tags || [])).slice(0, 3),
  );

  /** 描述与标题相同时不再重复展示 */
  const note = computed(() => {
    const description = (props.item.description || '').trim();
    return description && description !== (props.item.title || '').trim()
      ? description
      : '';
  });

  /** 取景框右上角的画质铭牌：4K · 24FPS */
  const techSpec = computed(() => {
    const parts: string[] = [];
    if (props.item.resolution) parts.push(props.item.resolution.toUpperCase());
    if (props.item.fps) parts.push(`${props.item.fps}FPS`);
    return parts.join(' · ');
  });

  const {
    isDateDimmed,
    isLikeDimmed,
    isLoveDimmed,
    isViewsDimmed,
    isBookmarkDimmed,
    isShareDimmed,
  } = useSortDimming(() => props.sortMode);
</script>

<style scoped lang="scss" src="./index.scss" />
