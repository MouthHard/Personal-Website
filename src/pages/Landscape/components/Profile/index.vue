<template>
  <div class="profile-page">
    <!-- 宇宙背景装饰 -->
    <div class="cosmic-bg">
      <div class="nebula"></div>
      <div class="stars"></div>
    </div>

    <!-- 个人资料展示区-->
    <ProfileHeader :user="user" :stats="stats" @update:user="handleUserUpdate" />

    <!-- 内容导航 -->
    <ContentTabs v-model:activeTab="activeTab" :tabs="tabs" />

    <!-- 作品展示区-->
    <section class="gallery-section">
      <div class="gallery-header">
        <h2 class="gallery-title">{{ currentTabTitle }}</h2>
      </div>

      <!-- 分类筛选-->
      <CategoryFilter v-model:selectedCategory="selectedCategory" :categories="currentCategories" />

      <div v-if="allItems.length > 0" class="gallery-masonry">
        <div v-for="col in 2" :key="col" class="masonry-col">
          <template v-for="item in getVisibleColumnItems(col - 1, 2)" :key="item.id">
            <ImageCard v-if="item.type === 'image'" :item="item.data" :delay="`${item.globalIndex * 0.06}s`" />
            <VideoCard v-else-if="item.type === 'video'" :item="item.data" :delay="`${item.globalIndex * 0.06}s`" />
            <PhotographerCard v-else-if="item.type === 'photographer'" :item="item.data" :delay="`${item.globalIndex * 0.06}s`" />
            <GuideCard v-else-if="item.type === 'guide'" :item="item.data" :delay="`${item.globalIndex * 0.06}s`" />
          </template>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-orbit">
          <span class="orbit-dot d1"></span>
          <span class="orbit-dot d2"></span>
          <span class="orbit-dot d3"></span>
        </div>
        <div class="empty-icon-wrap">
          <div class="icon-ring"></div>
          <div class="icon-ring inner"></div>
          <div class="empty-icon">
            <CameraIcon />
          </div>
        </div>
        <h3>{{ getEmptyTitle }}</h3>
        <p>{{ getEmptyDescription }}</p>
        <div class="empty-hint">
          <SparkleIcon class="hint-spark" />
          <span>优质作品将被推荐至首页</span>
          <SparkleIcon class="hint-spark" />
        </div>
      </div>

      <div ref="scrollSentinel" v-if="allItems.length > visibleCount" class="scroll-sentinel"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Profile' });
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import ProfileHeader from './components/ProfileHeader/index.vue';
import ContentTabs from './components/ContentTabs/index.vue';
import CategoryFilter from './components/CategoryFilter/index.vue';
import ImageCard from './components/ImageCard/index.vue';
import VideoCard from './components/VideoCard/index.vue';
import PhotographerCard from './components/PhotographerCard/index.vue';
import GuideCard from './components/GuideCard/index.vue';
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue';
import SparkleIcon from '@/pages/Landscape/icon/common/SparkleIcon.vue';
import { useInteractionStore } from '@/stores/landscape';
import { userProfile, profileTabs, profileCategories } from '@/utils/landscape/constants';
import { useProfileViewData } from '@/composables/landscape';
import { useProfileItems, useProfileStats } from '@/composables/landscape/profile';
import type { User } from '@/typesOfPages/landscape';

const interactionStore = useInteractionStore();

const activeTab = ref('favorites');
const selectedCategory = ref('image');

const user = ref<any>(userProfile);
const baseTabs = profileTabs;
const categories = profileCategories;

const handleUserUpdate = (updatedUser: User) => {
  user.value = updatedUser;
};

const { myImages, myVideos, myPhotographers, myGuides } = useProfileViewData();
const images = computed(() => myImages());
const videos = computed(() => myVideos());
const photographers = computed(() => myPhotographers());
const guides = computed(() => myGuides());

const { stats } = useProfileStats();

watch([images, videos, photographers, guides], ([newImages, newVideos, newPhotographers, newGuides]) => {
  const batch: Array<{ id: string; counts: { likes: number; loves: number; views: number; favorites: number; shares: number } }> = [];
  
  newImages.forEach((img: any) => batch.push({
    id: String(img.id),
    counts: { likes: img.likes || 0, loves: img.loves || 0, views: img.views || 0, favorites: img.favorites || 0, shares: img.shares || 0 },
  }));
  newVideos.forEach((vid: any) => batch.push({
    id: String(vid.id),
    counts: { likes: vid.likes || 0, loves: vid.loves || 0, views: vid.views || 0, favorites: vid.bookmarks || 0, shares: vid.shares || 0 },
  }));
  newPhotographers.forEach((p: any) => batch.push({
    id: String(p.id),
    counts: { likes: parseFloat(p.likes) || 0, loves: 0, views: parseFloat(p.views) || 0, favorites: parseFloat(p.bookmarks) || 0, shares: 0 },
  }));
  newGuides.forEach((guide: any) => batch.push({
    id: String(guide.id),
    counts: { likes: guide.likes || 0, loves: guide.loves || 0, views: guide.views || 0, favorites: guide.bookmarks || 0, shares: guide.shares || 0 },
  }));
  
  if (batch.length > 0) {
    interactionStore.registerBatch(batch);
  }
}, { immediate: true });

const tabs = computed(() => {
  return [
    { ...baseTabs[0], count: interactionStore.favoritesCount },
    { ...baseTabs[1], count: interactionStore.lovesCount },
    { ...baseTabs[2], count: 0 },
    { ...baseTabs[3], count: interactionStore.followingCount },
  ];
});

const dynamicCategories = computed(() => {
  const counts = activeTab.value === 'favorites' 
    ? interactionStore.favoritesByTypeCount 
    : interactionStore.lovesByTypeCount;
  
  return categories.map(cat => ({
    ...cat,
    count: counts[cat.id as keyof typeof counts] || 0,
  }));
});

const { allItems } = useProfileItems(
  activeTab,
  selectedCategory,
  images,
  videos,
  photographers,
  guides
);

const currentCategories = computed(() => {
  if (activeTab.value === 'following') {
    return [];
  }
  
  if (activeTab.value === 'favorites' || activeTab.value === 'likes') {
    return dynamicCategories.value;
  }
  
  const baseCategories = categories.map(cat => ({ ...cat, count: 0 }));
  if (activeTab.value === 'uploads') {
    return baseCategories.filter(cat => ['image', 'video', 'guide'].includes(cat.id));
  }

  return baseCategories;
});

const currentTabTitle = computed(() => {
  const tab = tabs.value.find(t => t.key === activeTab.value);
  return tab?.name || '';
});

const getEmptyTitle = computed(() => {
  const titles: Record<string, string> = {
    following: '暂无关注的摄影师',
    favorites: '暂无收藏内容',
    likes: '暂无喜欢的内容',
    uploads: '暂无上传作品',
    collections: '暂无收藏集',
  };
  return titles[activeTab.value] || '暂无内容';
});

const getEmptyDescription = computed(() => {
  const descriptions: Record<string, string> = {
    following: '去发现页关注喜欢的摄影师吧',
    favorites: '浏览内容时点击收藏按钮添加到这里',
    likes: '浏览内容时点击喜欢按钮添加到这里',
    uploads: '开始上传你的第一个作品吧',
    collections: '创建你的第一个收藏集',
  };
  return descriptions[activeTab.value] || '这里还没有任何内容';
});

const PAGE_SIZE = 12;
const visibleCount = ref(PAGE_SIZE);
const scrollSentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const getVisibleColumnItems = (colIndex: number, totalCols: number) => {
  const visible = allItems.value.slice(0, visibleCount.value);
  return visible.filter((_, i) => i % totalCols === colIndex);
};

const setupObserver = () => {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && visibleCount.value < allItems.value.length) {
        visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, allItems.value.length);
      }
    },
    { rootMargin: '200px' }
  );
  if (scrollSentinel.value) observer.observe(scrollSentinel.value);
};

watch([activeTab, selectedCategory], () => {
  visibleCount.value = PAGE_SIZE;
  nextTick(() => setupObserver());
});

watch(scrollSentinel, () => setupObserver());

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped lang="scss" src="./index.scss" />
