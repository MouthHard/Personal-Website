<template>
  <section class="all-photographers-section">
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">
          <span class="title-icon">
            <CameraIcon :stroke-width="2.2" />
          </span>
          所有摄影师
        </h2>
        <p class="section-desc">发现全球优秀摄影师，探索精彩作品</p>
      </div>
      <div class="header-right">
        <div class="pagination-info">
          <UsersIcon :stroke-width="2.2" />
          <span>显示 {{ startIndex }}-{{ endIndex }} / {{ filteredPhotographers.length }} 位</span>
        </div>
      </div>
    </div>

    <div class="filter-container">
      <div class="filter-left">
        <div class="filter-tabs">
          <button v-for="tag in visibleFilterTags" :key="tag.id"
            :class="['filter-tab', { active: selectedTag === tag.id }]" :style="getTagStyle(tag.id)"
            @click="selectedTag = tag.id">
            <span v-if="tag.id === 'all'" class="tab-icon">
              <CameraIcon :stroke-width="2.2" />
            </span>
            <span class="tab-label">{{ tag.name }}</span>
            <span v-if="tag.count" class="tab-count">{{ tag.count }}</span>
          </button>
          <button v-if="hasMoreTags" class="filter-tab more-btn" @click="showAllTags = !showAllTags">
            <span class="tab-icon">
              <component :is="showAllTags ? ChevronUpIcon : ChevronDownIcon" :stroke-width="2.2" />
            </span>
            <span class="tab-label">{{ showAllTags ? '收起' : '更多' }}</span>
          </button>
        </div>
      </div>
      <div class="filter-right">
        <div class="search-box">
          <SearchIcon :stroke-width="2.2" />
          <input v-model="searchQuery" type="text" placeholder="搜索摄影师..." @input="handleSearch" />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
            <CloseIcon :stroke-width="2.2" />
          </button>
        </div>
        <div ref="sortDropdownRef" class="sort-dropdown">
          <button class="sort-btn" @click="showSortMenu = !showSortMenu">
            <SortIcon :stroke-width="2.2" />
            <span>{{ currentSortLabel }}</span>
            <ChevronDownIcon class="arrow" :stroke-width="2.2" />
          </button>
          <div v-if="showSortMenu" class="sort-menu">
            <button v-for="sort in sortOptions" :key="sort.value"
              :class="['sort-option', { active: sortBy === sort.value }]" @click="selectSort(sort.value)">
              <span>{{ sort.label }}</span>
              <CheckIcon v-if="sortBy === sort.value" :stroke-width="2.2" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div :class="['photographers-container', viewMode]">
      <article v-for="(photographer, index) in paginatedPhotographers" :key="photographer.id" class="photographer-card"
        :style="{ '--delay': `${index * 0.05}s` }">
        <!-- 卡片顶部：作品预览-->
        <div class="card-preview">
          <div class="preview-grid">
            <div v-for="(work, idx) in photographer.worksPreview?.slice(0, 4)" :key="work.id || idx"
              class="preview-item"
              @click="$emit('preview', { ...(typeof work === 'string' ? { image: work } : work), author: photographer.name, authorId: photographer.id, authorAvatar: photographer.avatar })">
              <img loading="lazy" :src="typeof work === 'string' ? work : work.image"
                :alt="typeof work === 'string' ? `作品 ${idx + 1}` : (work.title || `作品 ${idx + 1}`)" />
              <div class="preview-overlay">
                <SearchPlusIcon :stroke-width="2.2" />
              </div>
            </div>
          </div>
          <div class="preview-badge">
            <ImageIcon :stroke-width="2.2" />
            <span>{{ photographer.works }}</span>
          </div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-content">
          <div class="photographer-header">
            <div class="avatar-wrapper">
              <img loading="lazy" :src="photographer.avatar" :alt="photographer.name" class="avatar" />
              <div class="avatar-ring"></div>
            </div>
            <div class="photographer-info">
              <div class="name-row">
                <h3 class="name">{{ photographer.name }}</h3>
                <div class="badges">
                  <span v-if="photographer.verified" class="badge verified">
                    <VerifiedBadgeIcon :stroke-width="2.2" />
                  </span>
                  <span v-if="photographer.isPro" class="badge pro">PRO</span>
                  <span v-if="photographer.isOnline" class="badge online">在线</span>
                  <span v-else-if="photographer.lastActive"
                    class="badge last-active">{{ photographer.lastActive }}</span>
                </div>
              </div>
              <p class="title">{{ photographer.title }}</p>
              <div v-if="photographer.location" class="location">
                <LocationIcon :stroke-width="2.2" />
                <span>{{ photographer.location }}</span>
              </div>
            </div>
          </div>

          <p v-if="photographer.bio" class="bio" :title="photographer.bio">{{ photographer.bio }}</p>

          <div class="tags-row">
            <span v-for="tag in photographer.tags?.slice(0, 3)" :key="tag" class="tag"
              @click="selectedTag = tag">{{ tag }}</span>
            <span v-if="photographer.tags?.length > 3" class="tag more">+{{ photographer.tags.length - 3 }}</span>
          </div>

          <div v-if="photographer.workTypes?.length" class="work-types-row">
            <span v-for="typeId in photographer.workTypes" :key="typeId" class="work-type-chip"
              :style="{ '--type-color': getWorkTypeColor(typeId) }">
              <span class="type-icon">
                <component :is="workTypeIconMap[typeId] || CameraIcon" :stroke-width="2.2" />
              </span>
              <span class="type-name">{{ getWorkTypeName(typeId) }}</span>
            </span>
          </div>

          <div class="stats-grid">
            <div class="stat-item">
              <ImageIcon :stroke-width="2.2" />
              <div class="stat-content">
                <span class="stat-value">{{ photographer.works }}</span>
                <span class="stat-label">作品</span>
              </div>
            </div>
            <div class="stat-item">
              <ThumbUpIcon :stroke-width="2.2" />
              <div class="stat-content">
                <span class="stat-value">{{ photographer.likes }}</span>
                <span class="stat-label">点赞</span>
              </div>
            </div>
            <div class="stat-item">
              <EyeIcon :stroke-width="2.2" />
              <div class="stat-content">
                <span class="stat-value">{{ photographer.views || '0' }}</span>
                <span class="stat-label">浏览</span>
              </div>
            </div>
            <div class="stat-item">
              <UsersIcon :stroke-width="2.2" />
              <div class="stat-content">
                <span class="stat-value">{{ photographer.followers || '0' }}</span>
                <span class="stat-label">粉丝</span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn follow" :class="{ following: getFollowingState(photographer) }"
              @click="handleFollow(photographer)">
              <UserPlusIcon v-if="!getFollowingState(photographer)" :stroke-width="2.2" />
              <CheckIcon v-else :stroke-width="2.2" />
              <span>{{ getFollowingState(photographer) ? '已关注' : '关注' }}</span>
            </button>
            <button class="action-btn secondary like-btn"
              :class="{ active: interactionStore.isLiked(getPhotographerId(photographer)) }"
              @click="toggleLike(photographer)">
              <ThumbUpIcon class="like-icon" :stroke-width="2.5" />

            </button>
            <button class="action-btn secondary" @click="handleShare(photographer)">
              <ShareIcon :stroke-width="2.2" />
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-if="totalPages > 1" class="pagination-container">
      <button class="pagination-btn prev" :disabled="currentPage === 1" @click="prevPage">
        <ChevronLeftIcon />
        <span>上一页</span>
      </button>
      <div class="pagination-numbers">
        <button v-for="page in visiblePages" :key="page"
          :class="['page-number', { active: currentPage === page, ellipsis: page === '...' }]"
          @click="page !== '...' && goToPage(page as number)">
          {{ page }}
        </button>
      </div>
      <button class="pagination-btn next" :disabled="currentPage === totalPages" @click="nextPage">
        <span>下一页</span>
        <ChevronRightIcon />
      </button>
    </div>

    <div v-if="filteredPhotographers.length === 0" class="empty-state">
      <SearchIcon />
      <h3>未找到摄影师</h3>
      <p>尝试调整筛选条件或搜索关键词</p>
      <button class="reset-btn" @click="resetFilters">重置筛选</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, type Component } from 'vue';
import { showMessage } from '@/utils/landscape';
import { useInteractionStore } from '@/stores/landscape';

import { workTypes, workTypeIcons, workTypeLabels, sortOptions as sortOptionsData } from '@/utils/landscape/constants';
import { usePhotographersViewData } from '@/composables/landscape';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import SearchIcon from '@/pages/Landscape/icon/common/SearchIcon.vue';
import CloseIcon from '@/pages/Landscape/icon/common/CloseIcon.vue';
import CheckIcon from '@/pages/Landscape/icon/common/CheckIcon.vue';
import ChevronDownIcon from '@/pages/Landscape/icon/common/ChevronDownIcon.vue';
import ChevronUpIcon from '@/pages/Landscape/icon/common/ChevronUpIcon.vue';
import ChevronLeftIcon from '@/pages/Landscape/icon/common/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/pages/Landscape/icon/common/ChevronRightIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';

import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import UsersIcon from '@/pages/Landscape/icon/common/UsersIcon.vue';
import UserPlusIcon from '@/pages/Landscape/icon/common/UserPlusIcon.vue';
import LocationIcon from '@/pages/Landscape/icon/common/LocationIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';
import SearchPlusIcon from '@/pages/Landscape/icon/components/photographers/FeaturedPhotographers/SearchPlusIcon.vue';
import SortIcon from '@/pages/Landscape/icon/components/photographers/AllPhotographers/SortIcon.vue';
import VerifiedBadgeIcon from '@/pages/Landscape/icon/components/photographers/AllPhotographers/VerifiedBadgeIcon.vue';
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue';
import VideoIcon from '@/pages/Landscape/icon/common/VideoIcon.vue';
import BookIcon from '@/pages/Landscape/icon/common/BookIcon.vue';
import PanoramaIcon from '@/pages/Landscape/icon/common/PanoramaIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';
import AerialIcon from '@/pages/Landscape/icon/common/AerialIcon.vue';
import SparkleIcon from '@/pages/Landscape/icon/common/SparkleIcon.vue';
import StarIcon from '@/pages/Landscape/icon/common/StarIcon.vue';
import RainbowIcon from '@/pages/Landscape/icon/common/RainbowIcon.vue';

import type { Photographer } from '@/typesOfPages/landscape';

const workTypeIconMap: Record<string, Component> = {
  photo: CameraIcon,
  video: VideoIcon,
  guide: BookIcon,
  panorama: PanoramaIcon,
  timelapse: ClockIcon,
  aerial: AerialIcon,
  longexp: SparkleIcon,
  startrail: StarIcon,
  hdr: RainbowIcon,
};

const emit = defineEmits<{
  'toggle-follow': [photographer: Photographer]
  'preview': [data: { image?: string; author?: string; authorId?: string; authorAvatar?: string; id?: string; cover?: string; title?: string; type?: string; likes?: number; loves?: number; favorites?: number; views?: number; shares?: number }]
}>();

const interactionStore = useInteractionStore();


const getFollowingState = (photographer: Photographer): boolean => {
  return interactionStore.isFollowing(String(photographer.id));
};

const getPhotographerId = (photographer: Photographer): string => {
  return String(photographer.id);
};

const selectedTag = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(12);
const viewMode = ref<'grid' | 'list'>('grid');
const sortBy = ref('default');
const showSortMenu = ref(false);

const sortDropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (e: MouseEvent) => {
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(e.target as Node)) {
    showSortMenu.value = false;
  }
};

const { allPhotographers } = usePhotographersViewData();
const photographers = computed(() => allPhotographers());

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
});

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

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
});

const tagColors = [
  { main: '#D4943A', light: '#FFB74D', dark: '#B4641E' },
  { main: '#F59E0B', light: '#FBBF24', dark: '#D97706' },
  { main: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
  { main: '#F43F5E', light: '#FB7185', dark: '#E11D48' },
  { main: '#10B981', light: '#34D399', dark: '#059669' },
  { main: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED' },
  { main: '#3B82F6', light: '#60A5FA', dark: '#2563EB' },
  { main: '#EF4444', light: '#FCA5A5', dark: '#DC2626' },
];

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getTagStyle = (tagId: string): Record<string, string> => {
  if (tagId === 'all') return {};
  const color = tagColors[hashString(tagId) % tagColors.length];
  return {
    '--tag-color': color.main,
    '--tag-color-light': color.light,
    '--tag-color-dark': color.dark,
  };
};

const filterTags = computed(() => {
  const tagCountMap = new Map<string, number>();
  photographers.value.forEach(p => {
    p.tags?.forEach(tag => {
      tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
    });
  });
  const tags = Array.from(tagCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ id: name, name, icon: '🏷️', count }));
  return [{ id: 'all', name: '全部', icon: '📷', count: photographers.value.length }, ...tags];
});

const showAllTags = ref(false);
const MAX_TAGS_INLINE = 6;

const visibleFilterTags = computed(() => {
  if (showAllTags.value) {
    return filterTags.value;
  }
  return filterTags.value.slice(0, MAX_TAGS_INLINE);
});

const hasMoreTags = computed(() => filterTags.value.length > MAX_TAGS_INLINE);

const workTypesList = ref(workTypes.map(key => ({
  key,
  icon: workTypeIcons[key] || '📷',
  name: workTypeLabels[key] || key,
  color: '#F59E0B'
})));

const sortOptions = sortOptionsData;


const parseCount = (value: string): number => {
  const num = parseFloat(value.replace(/[KMk]/gi, ''));
  if (value.toUpperCase().includes('K')) return num * 1000;
  if (value.toUpperCase().includes('M')) return num * 1000000;
  return num;
};

const filteredPhotographers = computed(() => {
  let result = [...photographers.value];

  if (selectedTag.value !== 'all') {
    result = result.filter(p => p.tags && p.tags.includes(selectedTag.value));
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      (p.location || '').toLowerCase().includes(query) ||
      (p.specialty || '').toLowerCase().includes(query) ||
      (p.bio || '').toLowerCase().includes(query) ||
      (p.category || '').toLowerCase().includes(query) ||
      p.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      p.worksPreview?.some(work => (work.title || '').toLowerCase().includes(query))
    );
  }

  if (sortBy.value === 'works') {
    result.sort((a, b) => parseCount(b.works) - parseCount(a.works));
  } else if (sortBy.value === 'likes') {
    result.sort((a, b) => parseCount(b.likes) - parseCount(a.likes));
  } else if (sortBy.value === 'followers') {
    result.sort((a, b) => parseCount(b.followers) - parseCount(a.followers));
  } else if (sortBy.value === 'active') {
    result.sort((a, b) => {
      const aOnline = a.isOnline ? 1 : 0;
      const bOnline = b.isOnline ? 1 : 0;
      if (bOnline !== aOnline) return bOnline - aOnline;
      return parseCount(b.views) - parseCount(a.views);
    });
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredPhotographers.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredPhotographers.value.length));

const paginatedPhotographers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPhotographers.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (current > 3) {
      pages.push('...');
    }
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) {
      pages.push('...');
    }
    pages.push(total);
  }
  return pages;
});

const currentSortLabel = computed(() => {
  const option = sortOptions.find(opt => opt.value === sortBy.value);
  return option?.label || '默认排序';
});

const handleSearch = () => {
  currentPage.value = 1;
};

const selectSort = (value: string) => {
  sortBy.value = value;
  showSortMenu.value = false;
};

const handleFollow = (photographer: Photographer) => {
  emit('toggle-follow', photographer);
};

const toggleLike = (photographer: Photographer) => {
  const id = getPhotographerId(photographer);
  const isAdded = interactionStore.toggleLike(id);
  if (isAdded) {
    showMessage.like.success(photographer.name);
  } else {
    showMessage.like.cancel();
  }
};


const getWorkTypeName = (typeId: string) => {
  const type = workTypesList.value.find(t => t.key === typeId);
  return type?.name || typeId;
};

const getWorkTypeColor = (typeId: string) => {
  const type = workTypesList.value.find(t => t.key === typeId);
  return type?.color || '#F59E0B';
};

const handleShare = (photographer: Photographer) => {
  // 实现分享功能

};

const resetFilters = () => {
  selectedTag.value = 'all';
  searchQuery.value = '';
  sortBy.value = 'default';
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

watch([selectedTag, searchQuery, sortBy], () => {
  currentPage.value = 1;
});
</script>

<style scoped lang="scss" src="./index.scss" />
