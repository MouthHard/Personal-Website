<template>
  <section class="new-photographers-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">
          <SparkleIcon :stroke-width="0" />
        </span>
        新晋摄影师
      </h2>
      <div class="header-right">
        <p class="section-desc">最近加入的优秀摄影师</p>
        <button class="show-more-btn">
          <span>展示更多</span>
          <ChevronRightIcon :stroke-width="2.2" />
        </button>
      </div>
    </div>

    <div v-if="photographers.length > 0" class="new-photographers-grid">
      <article v-for="(photographer, index) in photographers" :key="photographer.id" class="photographer-card new" :style="{ '--delay': `${index * 0.1}s` }">
        <div class="card-left">
          <div class="avatar-section">
            <div class="avatar-ring"></div>
            <img loading="lazy" :src="photographer.avatar" :alt="photographer.name" class="avatar" />
            <div class="new-badge">
              <StarIcon fill="currentColor" :stroke-width="0" />
            </div>
          </div>
          <div class="info-section">
            <h3 class="name">{{ photographer.name }}</h3>
            <p class="title">{{ photographer.title }}</p>
            <div class="bio">{{ photographer.bio || '专注于摄影艺术创作，用镜头记录美好瞬间' }}</div>
            <div class="tags-row">
              <span v-for="tag in photographer.tags?.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="stats-mini">
              <div class="stat">
                <ImageIcon :stroke-width="2.2" />
                <span>{{ photographer.worksCount }}</span>
              </div>
              <div class="stat">
                <ThumbUpIcon :stroke-width="2.2" />
                <span>{{ photographer.likes }}</span>
              </div>
              <div class="stat">
                <UsersIcon :stroke-width="2.2" />
                <span>{{ photographer.followers || '1.2K' }}</span>
              </div>
              <div class="stat">
                <EyeIcon :stroke-width="2.2" />
                <span>{{ photographer.views || '12.5K' }}</span>
              </div>
            </div>
            <div class="action-buttons">
              <button class="follow-btn" :class="{ following: getFollowingState(photographer) }" @click="$emit('toggle-follow', photographer)">
                <span>{{ getFollowingState(photographer) ? '已关注' : '关注' }}</span>
              </button>
              <button
                class="interaction-btn"
                :class="{ active: interactionStore.isLiked(getPhotographerId(photographer)) }"
                @click="toggleLike(photographer)"
              >
                <ThumbUpIcon :stroke-width="2.2" />
                <span>点赞</span>
              </button>
              <button class="view-btn">
                <ImageIcon :stroke-width="2.2" />
              </button>
            </div>
            <div class="join-info">
              <ClockIcon :stroke-width="2.2" />
              <span>{{ photographer.joinDate || '最近加入' }}</span>
            </div>
          </div>
        </div>
        <div class="card-right">
          <div class="works-grid">
            <div v-for="(work, idx) in photographer.worksPreview?.slice(0, 6)" :key="idx" class="work-item" @click="$emit('preview', { ...work, author: photographer.name, authorId: photographer.id, authorAvatar: photographer.avatar })">
              <img loading="lazy" :src="work.image" :alt="work.title || `作品 ${idx + 1}`" />
              <div class="work-type-tag" :class="`type-${work.type || 'photo'}`">
                {{ getWorkTypeLabel(work.type) }}
              </div>
              <div class="work-overlay">
                <div class="overlay-aperture">
                  <div class="ring"></div>
                  <div class="ring"></div>
                  <div class="ring"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">
      <div class="empty-icon">
        <SparkleIcon :stroke-width="0" />
      </div>
      <h3>暂无新晋摄影师</h3>
      <p>快来成为第一个新晋摄影师吧</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { showMessage } from '@/utils/landscape';
import { useInteractionStore } from '@/stores/landscape';

import { workTypeLabels } from '@/utils/landscape/constants';
import { usePhotographersViewData } from '@/composables/landscape';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import ChevronRightIcon from '@/pages/Landscape/icon/common/ChevronRightIcon.vue';
import StarIcon from '@/pages/Landscape/icon/common/StarIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';

import UsersIcon from '@/pages/Landscape/icon/common/UsersIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';

import SparkleIcon from '@/pages/Landscape/icon/common/SparkleIcon.vue';
import type { Photographer } from '@/typesOfPages/landscape';

defineEmits<{
  preview: [work: { image?: string; type?: string; author?: string; authorId?: string; authorAvatar?: string; id?: string; cover?: string; title?: string; likes?: number; loves?: number; favorites?: number; views?: number; shares?: number }]
  'toggle-follow': [photographer: Photographer]
}>();

const getWorkTypeLabel = (type?: string) => workTypeLabels[type || 'photo'] || '照片';

const { newPhotographers } = usePhotographersViewData();
const photographers = computed(() => newPhotographers());
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
