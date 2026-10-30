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
    <div v-if="items.length > 0" class="featured-list">
      <div v-for="(item, index) in items" :key="item.id" class="featured-item" :class="item.type"
        :style="{ '--item-index': index }">
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
              {{ formatCount(getCount(item.id).views) }}
            </span>
            <button class="act-chip act-like" @click.stop>
              <HeartIcon :stroke-width="2" />
              {{ formatCount(getCount(item.id).likes) }}
            </button>
            <button class="act-chip act-bookmark" @click.stop>
              <BookmarkIcon :stroke-width="2" />
              {{ formatCount(getCount(item.id).favorites) }}
            </button>
            <button class="act-chip act-share" @click.stop="handleShare(item)">
              <ShareIcon :stroke-width="2" />
              {{ formatCount(getCount(item.id).shares) }}
            </button>
            <button class="act-chip act-download" @click.stop>
              <DownloadIcon :stroke-width="2" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="featured-empty">
      <div class="empty-scene">
        <div class="orbit-track"></div>
        <span class="dust d-1"></span>
        <span class="dust d-2"></span>
        <span class="dust d-3"></span>
        <div class="dormant-star">
          <span class="star-core"></span>
          <span class="pulse-ring r-1"></span>
          <span class="pulse-ring r-2"></span>
        </div>
        <span class="lit-star s-1"></span>
        <span class="lit-star s-2"></span>
      </div>
      <div class="empty-copy">
        <span class="copy-tag">STANDBY</span>
        <p class="copy-title">精选星轨休眠中</p>
        <p class="copy-hint">切换媒体类型或选择其它分类，唤醒新的精选</p>
      </div>
    </div>
  </aside>

  <ShareMenu v-model:visible="showShareMenu" :work="shareWork" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { LandscapeItem } from '@/typesOfPages/landscape';
import { useInteractionStore } from '@/stores/landscape';
import StarIcon from '@/pages/Landscape/icons/common/StarIcon.vue';
import ImageIcon from '@/pages/Landscape/icons/common/ImageIcon.vue';
import PlayIcon from '@/pages/Landscape/icons/common/PlayIcon.vue';
import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';
import ShareMenu from '../../../common/ShareMenu/index.vue';

interface Props {
  items: LandscapeItem[];
}

defineProps<Props>();

defineEmits<{
  'open-detail': [item: LandscapeItem];
}>();

const interactionStore = useInteractionStore();
const getCount = (id: string | number) => interactionStore.getCount(String(id));

const showShareMenu = ref(false);
const currentShareItem = ref<LandscapeItem | null>(null);
const shareWork = computed(() => {
  const item = currentShareItem.value;
  if (!item) return {};
  return {
    type: item.type === 'video' ? ('video' as const) : ('image' as const),
    title: item.title,
    cover: item.thumbnail,
    date: item.date,
    location: item.location,
    duration: item.duration,
  };
});
const handleShare = (item: LandscapeItem) => {
  currentShareItem.value = item;
  showShareMenu.value = true;
};

const formatCount = (count: number) => {
  if (count >= 10000) return (count / 10000).toFixed(1) + 'w';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
  return String(count);
};
</script>

<style scoped lang="scss" src="./index.scss" />
