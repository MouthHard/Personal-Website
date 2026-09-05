<template>
  <aside class="featured-sidebar">
    <div class="sidebar-header">
      <div class="header-icon">
        <StarIcon />
      </div>
      <div class="header-text">
        <h3>精选推荐</h3>
        <span class="header-count">{{ items.length }}项</span>
      </div>
    </div>
    <div class="featured-list">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="featured-item"
        :class="item.type"
        :style="{ '--item-index': index }"
      >
        <div class="item-thumb" @click="$emit('open-detail', item)">
          <img :src="item.thumbnail" :alt="item.title" loading="lazy" />
          <div class="type-indicator" :class="item.type">
            <ImageIcon v-if="item.type === 'image'" :stroke-width="2.5" />
            <PlayIcon v-else :stroke-width="2.5" fill="none" />
          </div>
        </div>
        <div class="item-info-overlay" :class="item.type">
          <h4>{{ item.title }}</h4>
          <p>{{ item.location }}</p>
          <div class="item-actions" :class="item.type">
            <span class="act-chip act-views" @click.stop>
              <EyeIcon :stroke-width="2" />
              {{ formatCount(item.views) }}
            </span>
            <button class="act-chip act-like" @click.stop>
              <HeartIcon :stroke-width="2" />
              {{ formatCount(item.likes) }}
            </button>
            <button class="act-chip act-bookmark" @click.stop>
              <BookmarkIcon :stroke-width="2" />
              {{ formatCount(item.bookmarks) }}
            </button>
            <button class="act-chip act-share" @click.stop>
              <ShareIcon :stroke-width="2" />
              {{ formatCount(item.shares) }}
            </button>
            <button class="act-chip act-download" @click.stop>
              <DownloadIcon :stroke-width="2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { LandscapeItem } from '@/typesOfPages/landscape';
import StarIcon from '@/pages/Landscape/icon/common/StarIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';
import PlayIcon from '@/pages/Landscape/icon/common/PlayIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icon/common/DownloadIcon.vue';

interface Props {
  items: LandscapeItem[];
}

defineProps<Props>();

defineEmits<{
  'open-detail': [item: LandscapeItem];
}>();

const formatCount = (count: number) => {
  if (count >= 10000) return (count / 10000).toFixed(1) + 'w';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
  return String(count);
};
</script>

<style scoped lang="scss" src="./index.scss" />
