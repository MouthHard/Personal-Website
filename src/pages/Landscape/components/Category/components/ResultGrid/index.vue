<template>
  <div class="result-grid">
    <div v-for="(item, index) in visibleItems" :key="item.id" class="result-item" :class="item.type"
      :style="{ '--item-index': index }">
      <div class="item-image" @click="$emit('open-detail', item)">
        <img :src="item.thumbnail" :alt="item.title" loading="lazy" @load="onImageLoad" />
        <div class="type-badge" :class="item.type">
          <ImageIcon v-if="item.type === 'image'" :stroke-width="2" />
          <PlayIcon v-else :stroke-width="2" fill="none" />
          <span>{{ item.type === 'image' ? '图片' : '视频' }}</span>
        </div>
        <div v-if="item.type === 'video' && item.duration" class="duration-badge">
          <ClockIcon :stroke-width="2" />
          <span>{{ item.duration }}</span>
        </div>
        <div class="image-overlay" :class="item.type">
          <div class="overlay-content">
            <h3>{{ item.title }}<span class="item-date">{{ item.date }}</span></h3>
            <p>{{ item.location }}</p>
            <div class="item-tags">
              <span v-for="tag in item.tags?.slice(0, 3)" :key="tag" class="tag" :class="item.type">
                {{ tag }}
              </span>
            </div>
            <div class="item-actions" :class="item.type">
              <span class="act-chip act-views" @click.stop>
                <EyeIcon :stroke-width="2" />
                {{ formatNumber(getCount(item.id).views) }}
              </span>
              <button class="act-chip act-like" type="button" :class="{ active: isLiked(item.id) }"
                @click.stop="handleToggleLike($event, item)">
                <ThumbUpIcon :stroke-width="2" />
                {{ formatNumber(getCount(item.id).likes) }}
              </button>
              <button class="act-chip act-love" type="button" :class="{ active: isLoved(item.id) }"
                @click.stop="handleToggleLove($event, item)">
                <HeartIcon :stroke-width="2" />
                {{ formatNumber(getCount(item.id).loves) }}
              </button>
              <button class="act-chip act-bookmark" type="button" :class="{ active: isFavorited(item.id) }"
                @click.stop="handleToggleFavorite($event, item)">
                <BookmarkIcon :stroke-width="2" />
                {{ formatNumber(getCount(item.id).favorites) }}
              </button>
              <button class="act-chip act-share" type="button" @click.stop>
                <ShareIcon :stroke-width="2" />
                {{ formatNumber(getCount(item.id).shares) }}
              </button>
              <button class="act-chip act-download" type="button" @click.stop>
                <DownloadIcon :stroke-width="2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visibleItems.length < items.length" ref="loadMoreRef" class="load-more-sentinel"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useInteractionStore } from '@/stores/landscape';
import { formatNumber } from '@/utils/landscape/format';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';
import PlayIcon from '@/pages/Landscape/icon/common/PlayIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icon/common/DownloadIcon.vue';
import type { LandscapeItem } from '@/typesOfPages/landscape';

interface Props {
  items: LandscapeItem[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'open-detail': [item: LandscapeItem];
  'toggle-like': [item: LandscapeItem];
  'toggle-love': [item: LandscapeItem];
  'toggle-favorite': [item: LandscapeItem];
}>();

const interactionStore = useInteractionStore();

const getCount = (id: number | string) => interactionStore.getCount(String(id));
const isLiked = (id: number | string) => interactionStore.isLiked(String(id));
const isLoved = (id: number | string) => interactionStore.isLoved(String(id));
const isFavorited = (id: number | string) => interactionStore.isFavorited(String(id));

const handleToggleLike = (event: MouseEvent, item: LandscapeItem) => {
  event.stopPropagation();
  emit('toggle-like', item);
};

const handleToggleLove = (event: MouseEvent, item: LandscapeItem) => {
  event.stopPropagation();
  emit('toggle-love', item);
};

const handleToggleFavorite = (event: MouseEvent, item: LandscapeItem) => {
  event.stopPropagation();
  emit('toggle-favorite', item);
};

const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.classList.add('loaded');
};

const BATCH_SIZE = 24;
const visibleCount = ref(BATCH_SIZE);
const loadMoreRef = ref<HTMLElement | null>(null);
let loadMoreObserver: IntersectionObserver | null = null;

const visibleItems = computed(() => props.items.slice(0, visibleCount.value));

onMounted(() => {
  loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && visibleCount.value < props.items.length) {
      visibleCount.value = Math.min(visibleCount.value + BATCH_SIZE, props.items.length);
    }
  }, { rootMargin: '200px' });
});

watch(loadMoreRef, (el) => {
  if (!loadMoreObserver) return;
  loadMoreObserver.disconnect();
  if (el) loadMoreObserver.observe(el);
});

watch(() => props.items, () => {
  visibleCount.value = BATCH_SIZE;
});

onUnmounted(() => {
  loadMoreObserver?.disconnect();
});
</script>

<style scoped lang="scss" src="./index.scss" />
