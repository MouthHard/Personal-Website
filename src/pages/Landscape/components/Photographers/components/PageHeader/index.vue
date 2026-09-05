<template>
  <header class="page-header">
    <div class="header-content">
      <div class="title-group">
        <div class="lens-ring">
          <div v-for="i in 8" :key="i" class="lens-blade" :style="{ '--i': i }"></div>
          <div class="lens-core"></div>
        </div>
        <div class="title-block">
          <h1 class="main-title">定格诗者</h1>
          <p class="subtitle">探索全球顶尖风光摄影师的作品与故事</p>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat-item amber">
          <div class="stat-icon">
            <LensIcon :stroke-width="1.5" />
          </div>
          <div class="stat-text">
            <span class="stat-value">{{ statsA }}</span>
            <span class="stat-label">摄影师</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item cyan">
          <div class="stat-icon">
            <ImageIcon :stroke-width="1.5" />
          </div>
          <div class="stat-text">
            <span class="stat-value">{{ statsB }}</span>
            <span class="stat-label">作品</span>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item rose">
          <div class="stat-icon">
            <GlobeIcon :stroke-width="1.5" />
          </div>
          <div class="stat-text">
            <span class="stat-value">{{ statsC }}</span>
            <span class="stat-label">拍摄地</span>
          </div>
        </div>
      </div>
    </div>
    <div class="camera-dial">
      <div v-for="i in 36" :key="i" class="dial-mark" :style="{ '--a': (i - 1) * 10 + 'deg' }"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useLandscapeDataStore } from '@/stores/landscape';
  import { formatNumber } from '@/utils/landscape/format';
  import LensIcon from '@/pages/Landscape/icon/components/photographers/PageHeader/LensIcon.vue';
  import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';
  import GlobeIcon from '@/pages/Landscape/icon/common/GlobeIcon.vue';

  const dataStore = useLandscapeDataStore();

  const statsA = computed(() => formatNumber(dataStore.getAllPhotographers().length));
  const statsB = computed(() => formatNumber(dataStore.getAllImages().length + dataStore.getAllVideos().length));
  const statsC = computed(() => {
    const locations = new Set<string>();
    dataStore.getAllImages().forEach(img => { if (img.location) locations.add(img.location); });
    dataStore.getAllVideos().forEach(vid => { if (vid.location) locations.add(vid.location); });
    return formatNumber(locations.size);
  });
</script>

<style scoped lang="scss" src="./index.scss" />
