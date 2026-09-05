<template>
  <section class="ranking-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">
          <TrophyIcon :stroke-width="2.2" />
        </span>
        摄影师排行榜
      </h2>
      <p class="section-desc">发现最受欢迎的摄影师</p>
    </div>

    <div class="ranking-tabs">
      <button v-for="tab in rankingTabs" :key="tab.value" :class="['ranking-tab', { active: activeRankingTab === tab.value }]" @click="activeRankingTab = tab.value">
        <span class="tab-icon">
          <component :is="rankingTabIconMap[tab.value] || CameraIcon" :stroke-width="2.2" />
        </span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div v-if="rankingPhotographers.length > 0" class="ranking-list">
      <div v-for="(photographer, index) in rankingPhotographers" :key="photographer.id" class="ranking-item" :style="{ '--index': index }">
        <div class="rank-number" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
        <div class="rank-avatar">
          <img loading="lazy" :src="photographer.avatar" :alt="photographer.name" />
          <div class="avatar-ring"></div>
        </div>
        <div class="rank-info">
          <h3 class="rank-name">{{ photographer.name }}</h3>
          <p class="rank-title">{{ photographer.title }}</p>
        </div>
        <div class="rank-stats">
          <div class="rank-stat" :class="{ highlight: activeRankingTab === 'works' }">
            <ImageIcon :stroke-width="2.2" />
            <div class="stat-content">
              <span class="rank-stat-value">{{ photographer.worksCount }}</span>
              <span class="rank-stat-label">作品</span>
            </div>
          </div>
          <div class="rank-stat" :class="{ highlight: activeRankingTab === 'followers' }">
            <UsersIcon :stroke-width="2.2" />
            <div class="stat-content">
              <span class="rank-stat-value">{{ photographer.followers }}</span>
              <span class="rank-stat-label">粉丝</span>
            </div>
          </div>
          <div class="rank-stat" :class="{ highlight: activeRankingTab === 'likes' }">
            <ThumbUpIcon :stroke-width="2.2" />
            <div class="stat-content">
              <span class="rank-stat-value">{{ photographer.likes }}</span>
              <span class="rank-stat-label">点赞</span>
            </div>
          </div>
          <div class="rank-stat" :class="{ highlight: activeRankingTab === 'views' }">
            <EyeIcon :stroke-width="2.2" />
            <div class="stat-content">
              <span class="rank-stat-value">{{ photographer.views }}</span>
              <span class="rank-stat-label">浏览</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <StarIcon fill="none" :stroke-width="1.8" />
      </div>
      <p class="empty-text">暂无排行榜数据</p>
      <span class="empty-hint">排行榜数据即将呈现</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue';
import { usePhotographersViewData } from '@/composables/landscape';
import { rankingTabs } from '@/utils/landscape/constants';
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';
import UsersIcon from '@/pages/Landscape/icon/common/UsersIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import StarIcon from '@/pages/Landscape/icon/common/StarIcon.vue';
import TrophyIcon from '@/pages/Landscape/icon/components/photographers/RankingSection/TrophyIcon.vue';

const rankingTabIconMap: Record<string, Component> = {
  works: CameraIcon,
  followers: UsersIcon,
  likes: ThumbUpIcon,
  views: EyeIcon,
};

const activeRankingTab = ref('works');

const { allPhotographers } = usePhotographersViewData();
const photographers = computed(() => allPhotographers());

const parseCount = (value: string): number => {
  const num = parseFloat(value.replace(/[KMk]/gi, ''));
  if (value.toUpperCase().includes('K')) return num * 1000;
  if (value.toUpperCase().includes('M')) return num * 1000000;
  return num;
};

const rankingPhotographers = computed(() => {
  const list = [...photographers.value];
  
  if (activeRankingTab.value === 'works') {
    return list.sort((a, b) => parseCount(b.worksCount) - parseCount(a.worksCount)).slice(0, 5);
  } else if (activeRankingTab.value === 'followers') {
    return list.sort((a, b) => parseCount(b.followers) - parseCount(a.followers)).slice(0, 5);
  } else if (activeRankingTab.value === 'likes') {
    return list.sort((a, b) => parseCount(b.likes) - parseCount(a.likes)).slice(0, 5);
  } else {
    return list.sort((a, b) => parseCount(b.views) - parseCount(a.views)).slice(0, 5);
  }
});
</script>

<style scoped lang="scss" src="./index.scss" />
