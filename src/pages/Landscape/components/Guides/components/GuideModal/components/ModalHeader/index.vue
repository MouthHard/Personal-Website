<template>
  <div class="modal-header">
    <div class="modal-hero">
      <img loading="lazy" :src="guide.cover" :alt="guide.title" />
      <div class="modal-hero-overlay"></div>
      <div class="modal-hero-content">
        <div class="modal-badges">
          <span v-if="guide.travelMode" :class="['badge', 'mode', `mode-${travelModeClass}`]">{{ guide.travelMode }}</span>
          <span v-if="guide.sceneryTheme" class="badge theme">{{ guide.sceneryTheme }}</span>
          <span :class="['badge', 'diff', guide.difficulty || 'intermediate']">{{ difficultyLabel }}</span>
        </div>
        <h1 class="modal-title">{{ guide.title }}</h1>
      </div>
    </div>

    <div class="modal-meta-wrapper">
      <div class="modal-meta">
        <div class="meta-author">
          <img loading="lazy" :src="guide.authorAvatar" :alt="guide.author" />
          <div class="author-info">
            <span class="author-name">{{ guide.author }}</span>
            <span v-if="guide.category" :class="['author-badge', `mode-${travelModeClass}`]">{{ guide.category }}</span>
          </div>
        </div>
        <div class="meta-details">
          <span class="detail-item">
            <CalendarIcon />
            <span class="detail-text">{{ guide.publishDate }}</span>
          </span>
          <span class="detail-item">
            <ClockIcon />
            <span class="detail-text">{{ guide.duration }}</span>
          </span>
          <span class="detail-item">
            <LocationIcon />
            <span class="detail-text">{{ guide.location }}</span>
          </span>
          <span class="detail-item">
            <LayersIcon />
            <span class="detail-text">{{ seasonLabel }}</span>
          </span>
        </div>
      </div>

      <div class="modal-stats-row">
        <div :class="['stat-block', `mode-${travelModeClass}`]">
          <EyeIcon />
          <div class="stat-info">
            <span class="stat-value">{{ formatNumber(counts.views) }}</span>
            <span class="stat-label">浏览</span>
          </div>
        </div>
        <button
          :class="['stat-block', 'interactive', `mode-${travelModeClass}`, { active: isLiked }]"
          @click="$emit('toggle-like')"
        >
          <ThumbUpIcon />
          <div class="stat-info">
            <span class="stat-value">{{ formatNumber(counts.likes) }}</span>
            <span class="stat-label">点赞</span>
          </div>
        </button>
        <button
          :class="['stat-block', 'interactive', `mode-${travelModeClass}`, { active: isLoved }]"
          @click="$emit('toggle-love')"
        >
          <HeartIcon />
          <div class="stat-info">
            <span class="stat-value">{{ formatNumber(counts.loves) }}</span>
            <span class="stat-label">喜爱</span>
          </div>
        </button>
        <button
          :class="['stat-block', 'interactive', `mode-${travelModeClass}`, { active: isFavorited }]"
          @click="$emit('toggle-favorite')"
        >
          <BookmarkIcon />
          <div class="stat-info">
            <span class="stat-value">{{ formatNumber(counts.favorites) }}</span>
            <span class="stat-label">收藏</span>
          </div>
        </button>
        <button
          :class="['stat-block', 'interactive', `mode-${travelModeClass}`]"
          @click="$emit('share')"
        >
          <ShareIcon />
          <div class="stat-info">
            <span class="stat-value">{{ formatNumber(counts.shares) }}</span>
            <span class="stat-label">分享</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { difficultyMap, travelModeMap, seasonMap } from '@/utils/landscape/constants';
import { formatNumber } from '@/utils/landscape/format';
import CalendarIcon from '@/pages/Landscape/icon/common/CalendarIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';
import LocationIcon from '@/pages/Landscape/icon/common/LocationIcon.vue';
import LayersIcon from '@/pages/Landscape/icon/common/LayersIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';

interface Guide {
  id: string;
  title: string;
  cover: string;
  excerpt: string;
  travelMode?: string;
  sceneryTheme?: string;
  location: string;
  duration: string;
  author: string;
  authorAvatar?: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  season?: string;
  publishDate?: string;
}

interface Counts {
  views: number;
  likes: number;
  loves: number;
  favorites: number;
  shares: number;
}

interface Props {
  guide: Guide;
  counts: Counts;
  isLiked: boolean;
  isLoved: boolean;
  isFavorited: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'toggle-like'): void;
  (e: 'toggle-love'): void;
  (e: 'toggle-favorite'): void;
  (e: 'share'): void;
}>();

const difficultyLabel = computed(() => {
  const difficulty: 'beginner' | 'intermediate' | 'advanced' = props.guide.difficulty || 'intermediate';
  return difficultyMap[difficulty] || difficulty;
});

const travelModeClass = computed(() => {
  const mode = props.guide.travelMode || 'self-drive';
  return travelModeMap[mode]?.class || 'default';
});

const seasonLabel = computed(() => {
  const season = props.guide.season || 'spring';
  return seasonMap[season] || season;
});
</script>

<style scoped lang="scss" src="./index.scss" />
