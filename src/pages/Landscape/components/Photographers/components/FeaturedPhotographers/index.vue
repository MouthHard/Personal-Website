<template>
  <section class="featured-photographers-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">
          <StarIcon :stroke-width="0" />
        </span>
        推荐摄影师
      </h2>
      <div class="header-right">
        <p class="section-desc">精选全球优秀风光摄影师</p>
        <button class="show-more-btn">
          <span>展示更多</span>
          <ChevronRightIcon :stroke-width="2.2" />
        </button>
      </div>
    </div>

    <div v-if="photographers.length > 0" class="featured-grid">
      <article v-for="(photographer, index) in photographers" :key="photographer.id" class="photographer-card featured"
        :style="{ '--delay': `${index * 0.1}s` }">
        <div class="card-banner">
          <img loading="lazy" :src="photographer.banner || photographer.avatar" :alt="photographer.name"
            class="banner-image" />
          <div class="banner-overlay"></div>
        </div>

        <div class="card-content">
          <div class="photographer-header">
            <div class="avatar-wrapper">
              <img loading="lazy" :src="photographer.avatar" :alt="photographer.name" class="avatar" />
              <div class="avatar-ring"></div>
            </div>
            <div class="photographer-info">
              <h3 class="name">{{ photographer.name }}</h3>
              <p class="title">{{ photographer.title }}</p>
              <div class="specialty-tags">
                <span v-for="tag in photographer.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <p class="bio">{{ photographer.bio }}</p>

          <div class="stats-row">
            <div class="stat">
              <ImageIcon :stroke-width="2.2" />
              <span class="value">{{ photographer.works }}</span>
              <span class="label">作品</span>
            </div>
            <div class="stat">
              <EyeIcon :stroke-width="2.2" />
              <span class="value">{{ photographer.views }}</span>
              <span class="label">浏览</span>
            </div>
            <div class="stat">
              <ThumbUpIcon :stroke-width="2.2" />
              <span class="value">{{ photographer.likes }}</span>
              <span class="label">点赞</span>
            </div>
            <div class="stat">
              <UsersIcon :stroke-width="2.2" />
              <span class="value">{{ photographer.followers }}</span>
              <span class="label">粉丝</span>
            </div>
          </div>

          <div class="works-preview">
            <div v-for="(work, idx) in photographer.worksPreview.slice(0, 3)" :key="idx" class="preview-item"
              @click="$emit('preview', { ...work, author: photographer.name, authorId: photographer.id, authorAvatar: photographer.avatar })">
              <img loading="lazy" :src="work.image" :alt="work.title || `作品 ${idx + 1}`" />
              <div class="preview-overlay">
                <SearchPlusIcon :stroke-width="2.2" />
              </div>
            </div>
            <div v-if="photographer.worksPreview.length > 3" class="preview-item preview-more"
              @click="$emit('preview', { ...photographer.worksPreview[3], author: photographer.name, authorId: photographer.id, authorAvatar: photographer.avatar })">
              <img loading="lazy" :src="photographer.worksPreview[3].image" :alt="'作品 4'" />
              <div class="more-overlay">
                <span class="more-count">+{{ photographer.worksPreview.length - 3 }}</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn follow" :class="{ following: getFollowingState(photographer) }"
              @click="$emit('toggle-follow', photographer)">
              <UserPlusIcon v-if="!getFollowingState(photographer)" :stroke-width="2.2" />
              <span>{{ getFollowingState(photographer) ? '已关注' : '关注' }}</span>
            </button>
            <button class="action-btn secondary"
              :class="{ active: interactionStore.isLiked(getPhotographerId(photographer)) }"
              @click="toggleLike(photographer)">
              <ThumbUpIcon class="like-icon" :stroke-width="2.5" />
              <span class="count">点赞</span>
            </button>
            <button class="action-btn view">
              <ImageIcon :stroke-width="2.2" />
              <span>查看作品</span>
            </button>
          </div>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">
      <div class="empty-icon">
        <CameraIcon :stroke-width="2.2" />
      </div>
      <h3>暂无推荐摄影师</h3>
      <p>敬请期待更多优秀摄影师</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { showMessage } from '@/utils/landscape';
import { useInteractionStore } from '@/stores/landscape';

import { usePhotographersViewData } from '@/composables/landscape';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import ChevronRightIcon from '@/pages/Landscape/icon/common/ChevronRightIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';

import UsersIcon from '@/pages/Landscape/icon/common/UsersIcon.vue';
import SearchPlusIcon from '@/pages/Landscape/icon/components/photographers/FeaturedPhotographers/SearchPlusIcon.vue';
import UserPlusIcon from '@/pages/Landscape/icon/common/UserPlusIcon.vue';
import StarIcon from '@/pages/Landscape/icon/common/StarIcon.vue';
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue';
import type { Photographer } from '@/typesOfPages/landscape';

defineEmits<{
  preview: [work: { image?: string; type?: string; author?: string; authorId?: string; authorAvatar?: string; id?: string; cover?: string; title?: string; likes?: number; loves?: number; favorites?: number; views?: number; shares?: number }]
  'toggle-follow': [photographer: Photographer]
}>();

const { featuredPhotographers } = usePhotographersViewData();
const photographers = computed(() => featuredPhotographers());
const interactionStore = useInteractionStore();


const getFollowingState = (photographer: Photographer): boolean => {
  return interactionStore.isFollowing(String(photographer.id));
};

const getPhotographerId = (photographer: Photographer): string => {
  return String(photographer.id);
};

watch(
  () => photographers.value.length,
  (len) => {
    if (len === 0) return;
    photographers.value.forEach(photographer => {
      const id = getPhotographerId(photographer);
      interactionStore.registerCount(id, {
        likes: parseInt(photographer.likes?.replace(/[KM]/g, '') || '0') * (photographer.likes?.includes('K') ? 1000 : photographer.likes?.includes('M') ? 1000000 : 1),
        views: parseInt(photographer.views?.replace(/[KM]/g, '') || '0') * (photographer.views?.includes('K') ? 1000 : photographer.views?.includes('M') ? 1000000 : 1),
        loves: 0,
        favorites: 0,
        shares: 0
      });

      if (photographer.worksPreview && Array.isArray(photographer.worksPreview)) {
        interactionStore.registerBatch(
          photographer.worksPreview.map(work => ({
            id: work.id || `work-${photographer.id}-${Math.random()}`,
            counts: {
              likes: work.likes || 0,
              loves: work.loves || 0,
              favorites: work.favorites || 0,
              views: work.views || 0,
              shares: work.shares || 0,
            }
          }))
        );
      }
    });
  },
  { immediate: true },
);

const toggleLike = (photographer: Photographer) => {
  const id = getPhotographerId(photographer);
  const isAdded = interactionStore.toggleLike(id);
  if (isAdded) {
    showMessage.like.success(photographer.name);
  } else {
    showMessage.like.cancel();
  }
};
</script>

<style scoped lang="scss" src="./index.scss" />
