<template>
  <div class="image-card">
    <div class="card-shell">
      <div class="card-top">
        <span class="type-chip">
          <ImageIcon :stroke-width="2" />
          <span>图片</span>
        </span>

        <h3 class="title-plate" :title="item.title">{{ item.title }}</h3>

        <span
          v-if="item.date"
          class="date-plaque"
          :class="{
            'sort-highlighted': !isDateDimmed && sortMode !== 'relevance',
            'sort-dimmed': isDateDimmed,
          }"
        >
          <CalendarIcon :stroke-width="2" />
          <span>{{ item.date }}</span>
        </span>
      </div>

      <div class="card-media">
        <LandscapeImage
          :src="item.thumbnail"
          :alt="item.title"
          loading="lazy"
        />
        <span class="media-sheen" aria-hidden="true"></span>
        <span class="photo-corners" aria-hidden="true">
          <i class="photo-corner tl"></i>
          <i class="photo-corner tr"></i>
          <i class="photo-corner bl"></i>
          <i class="photo-corner br"></i>
        </span>
      </div>

      <div class="card-body">
        <div class="body-info">
          <div v-if="item.location || item.camera" class="card-facts">
            <span v-if="item.location" class="fact">
              <span class="fact-icon">
                <LocationIcon :stroke-width="2.2" />
              </span>
              <span class="fact-text">{{ item.location }}</span>
            </span>
            <span v-if="item.camera" class="fact">
              <span class="fact-icon">
                <CameraIcon :stroke-width="2.2" />
              </span>
              <span class="fact-text">{{ item.camera }}</span>
            </span>
          </div>

          <div v-if="recentTags.length > 0" class="card-tags">
            <span v-for="tag in recentTags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <button
          type="button"
          class="detail-btn"
          aria-label="查看详情"
          @click.stop="handleViewDetail"
        >
          <span class="detail-cavity" aria-hidden="true">
            <span class="cavity-arrow">
              <ArrowRightIcon :stroke-width="2.6" />
            </span>
          </span>
          <span class="detail-face">
            <span class="detail-text">查看详情</span>
            <i class="detail-hinge top" aria-hidden="true"></i>
            <i class="detail-hinge bottom" aria-hidden="true"></i>
            <i class="detail-screw tl" aria-hidden="true"></i>
            <i class="detail-screw tr" aria-hidden="true"></i>
            <i class="detail-screw bl" aria-hidden="true"></i>
            <i class="detail-screw br" aria-hidden="true"></i>
          </span>
        </button>
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
            </span>
            <span class="count">{{ formatCount(getCounts().likes) }}</span>
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
            </span>
            <span class="count">{{ formatCount(getCounts().loves) }}</span>
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
            </span>
            <span class="count">{{ formatCount(getCounts().favorites) }}</span>
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
            </span>
            <span class="count">{{ formatCount(getCounts().shares) }}</span>
          </button>
        </div>

        <div
          class="views-stat"
          :class="{
            'sort-highlighted': !isViewsDimmed && sortMode !== 'relevance',
            'sort-dimmed': isViewsDimmed,
          }"
        >
          <EyeIcon :stroke-width="2.2" />
          <span class="views-count">{{ formatCount(getCounts().views) }}</span>
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
  import LandscapeImage from '@/pages/Landscape/components/common/LandscapeImage/index.vue';
  import ImageIcon from '@/pages/Landscape/icons/common/ImageIcon.vue';
  import CalendarIcon from '@/pages/Landscape/icons/common/CalendarIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import CameraIcon from '@/pages/Landscape/icons/common/CameraIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import ArrowRightIcon from '@/pages/Landscape/icons/common/ArrowRightIcon.vue';

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

  /** 标签去重后最多展示四个，避免重复信息占位 */
  const recentTags = computed(() =>
    Array.from(new Set(props.item.tags || [])).slice(0, 4),
  );

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
