<template>
  <section v-if="destinations.length > 0" class="popular-destinations">
    <div class="section-header">
      <div class="header-left">
        <span class="title-label">DESTINATIONS</span>
        <h2 class="section-title">梦境之地</h2>
        <p class="section-subtitle">探索世界最令人向往的旅行目的地</p>
      </div>
      <button class="more-btn" aria-label="刷新目的地" @click="handleMore">
        <span class="ticket-stub" aria-hidden="true">
          <span class="stamp-teeth"></span>
          <span class="stamp-face"></span>
          <span class="stamp-glyph"></span>
        </span>
        <span class="ticket-tear" aria-hidden="true"></span>
        <span class="more-text">
          <span class="more-label">刷新</span>
          <span class="more-sub">下一站</span>
        </span>
        <span class="ticket-route" aria-hidden="true">
          <span class="route-line"></span>
          <span class="route-plane"></span>
        </span>
        <span class="btn-shine"></span>
      </button>
    </div>

    <div class="destinations-gallery">
      <div class="gallery-track">
        <div v-for="(dest, index) in destinations" :key="dest.id" class="gallery-item"
          :class="{ 'item-large': index === 0, 'item-wide': index === 3 }" :style="{ '--delay': `${index * 0.15}s` }"
          @mouseenter="activeDestination = dest.id" @mouseleave="activeDestination = null">
          <!-- 背景图片 -->
          <div class="item-background">
            <img :src="dest.images.spring" :alt="dest.name" loading="lazy" />
            <div class="background-overlay"></div>
          </div>

          <!-- 悬浮信息卡片 -->
          <div class="item-content" :class="{ active: activeDestination === dest.id }">
            <div class="content-tags">
              <span class="tag tag-season">
                <ClockIcon :stroke-width="2" />
                {{ dest.bestTime }}
              </span>

            </div>

            <div class="content-main">
              <div class="title-row">
                <h3 class="dest-name">{{ dest.name }}</h3>
                <div class="location-badge">
                  <LocationIcon :stroke-width="2" />
                  <span>{{ dest.country }}</span>
                </div>
              </div>

              <div class="rating-row">
                <div class="stars">
                  <span v-for="i in 5" :key="i" :class="['star', { filled: i <= dest.rating }]">
                    ★
                  </span>
                </div>
                <span class="score">{{ dest.score }}</span>
                <span class="photos-count">
                  <ImageIcon :stroke-width="2" />
                  {{ dest.photos }} 张照片
                </span>
              </div>

              <p class="dest-tips">{{ dest.tips }}</p>

              <div class="dest-stats">
                <span class="stat-item stat-views">
                  <EyeIcon :stroke-width="2" />
                  {{ fmt(getDestCount(dest.id).views) }}
                </span>
                <button class="stat-item stat-interactive stat-like"
                  :class="{ active: interactionStore.isLiked(getDestId(dest.id)) }" @click.stop="handleToggleLike(dest)">
                  <ThumbUpIcon :stroke-width="2" :filled="interactionStore.isLiked(getDestId(dest.id))" />
                  {{ fmt(getDestCount(dest.id).likes) }}
                </button>
                <span class="stat-item stat-love">
                  <HeartIcon :stroke-width="2" />
                  {{ fmt(getDestCount(dest.id).loves) }}
                </span>
                <span class="stat-item stat-favorite">
                  <BookmarkIcon :stroke-width="2" />
                  {{ fmt(getDestCount(dest.id).favorites) }}
                </span>
                <span class="stat-item stat-share">
                  <ShareIcon :stroke-width="2" />
                  {{ fmt(getDestCount(dest.id).shares) }}
                </span>
              </div>
            </div>

            <button class="explore-btn" @click="handleExplore(dest)">探索此地</button>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import ClockIcon from '@/pages/Landscape/icons/common/ClockIcon.vue';
import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
import ImageIcon from '@/pages/Landscape/icons/common/ImageIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
import { useInteractionStore, useLandscapeDataStore } from '@/stores/landscape';
import type { Destination } from '@/typesOfPages/landscape/home';
import { showMessage, createSimpleInteractionItem } from '@/utils/landscape';
import { formatNumber as fmt } from '@/utils/landscape/format';

const router = useRouter();
const interactionStore = useInteractionStore();
const dataStore = useLandscapeDataStore();
const activeDestination = ref<number | null>(null);


const allDestinations = computed(() => dataStore.getAllPopularDestinations());
const pageIndex = ref(0);

const destinations = computed(() => {
  const all = allDestinations.value;
  if (all.length <= 4) return all;
  const start = pageIndex.value * 4;
  return all.slice(start, start + 4);
});

function pickRandomDestinations() {
  const all = allDestinations.value;
  if (all.length <= 4) {
    pageIndex.value = 0;
    return;
  }
  const totalPages = Math.ceil(all.length / 4);
  pageIndex.value = (pageIndex.value + 1) % totalPages;
}


const getDestId = (id: string | number) => `pd-${id}`;
const getDestCount = (id: string | number) => interactionStore.getCount(getDestId(id));

const handleToggleLike = (dest: Destination) => {
  const dId = getDestId(dest.id);
  const item = createSimpleInteractionItem(dId, 'image', dest.name, {
    image: dest.images?.spring || '',
    location: dest.country,
  });
  const isLiked = interactionStore.toggleLike(item);
  if (isLiked) {
    showMessage.like.success(dest.name);
  } else {
    showMessage.like.cancel();
  }
};


const handleMore = () => {
  pickRandomDestinations();
};

const handleExplore = (dest: Destination) => {
  if (dest.navigation) {
    router.push({
      path: '/landscape/category',
      query: {
        dimension: dest.navigation.dimension,
        category: dest.navigation.category,
        subCategory: dest.navigation.subCategory,
      },
    });
  }
};

watch(
  () => destinations.value,
  (newDests) => {
    if (!newDests || newDests.length === 0) return;
    interactionStore.registerBatch(
      newDests.map((dest) => ({
        id: getDestId(dest.id),
        counts: {
          likes: dest.likes || 0,
          views: parseInt(dest.views.replace(/,/g, '')) || 0,
          loves: dest.loves || 0,
          favorites: dest.favorites || 0,
          shares: dest.shares || 0,
        },
      }))
    );
  },
  { immediate: true, deep: true },
);
</script>

<style scoped lang="scss" src="./index.scss" />
