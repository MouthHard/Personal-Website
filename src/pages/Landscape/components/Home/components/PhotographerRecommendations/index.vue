<template>
  <section v-if="photographers.length > 0" class="photographer-recommendations">
    <div class="gallery-header">
      <div class="header-left">
        <span class="title-label">ARTISTS</span>
        <h2 class="section-title">追帧旅人</h2>
        <p class="section-subtitle">发现优秀的风景摄影师</p>
      </div>
      <button class="more-btn" @click="handleMore">
        <span class="film-reel" aria-hidden="true"></span>
        <span class="btn-label">探索更多</span>
      </button>
    </div>

    <div class="artist-switcher">
      <div class="polaroid-deck">
        <div v-for="(artist, idx) in photographers" :key="artist.id"
          class="polaroid-card" :class="{ active: idx === activeIndex }"
          :style="cardStyle(idx)"
          @click="switchToArtist(artist.id)">
          <div class="photo-area">
            <img loading="lazy" :src="artist.avatar" :alt="artist.name" class="photo-img" />
            <div class="develop-film"></div>
          </div>
          <div class="signature-area">
            <span class="sig-name">{{ artist.name }}</span>
            <span class="sig-spec">{{ artist.specialty }}</span>
          </div>
        </div>
      </div>
      <button class="switcher-arrow switcher-arrow-left" @click="switchArtist(-1)">
        <ChevronLeftIcon />
      </button>
      <button class="switcher-arrow switcher-arrow-right" @click="switchArtist(1)">
        <ChevronRightIcon />
      </button>
    </div>

    <div class="gallery-stage">
      <div v-if="currentArtist" class="artist-panel">
        <Transition name="panel-slide" mode="out-in">
          <div :key="currentArtist.id" class="panel-inner">

            <div class="panel-avatar-area">
              <div class="avatar-frame">
                <img loading="lazy" :src="currentArtist.avatar" :alt="currentArtist.name" class="avatar-img" />
                <div class="develop-fade"></div>
              </div>
              <div class="avatar-glow"></div>
            </div>


            <div class="panel-identity">
              <span class="identity-specialty">
                {{ currentArtist.specialty }}
              </span>
              <h3 class="identity-name">
                <span class="name-text">{{ currentArtist.name }}</span>
                <span class="name-underline"></span>
              </h3>
              <div v-if="activeIndex === 0" class="identity-featured">
                <StarIcon :style="{ width: '15px', height: '15px' }" />
                <span>Featured</span>
              </div>
            </div>

            <div class="panel-divider"></div>

            <p class="panel-bio">{{ currentArtist.bio }}</p>

            <div class="panel-stats">
              <div class="stat-item">
                <span class="stat-num">{{ currentArtist.worksCount }}</span>
                <span class="stat-label">作品</span>
                <div class="stat-glow"></div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num">{{ formatNumber(interactionStore.getCount(getArtistId(currentArtist.id)).followers) }}</span>
                <span class="stat-label">粉丝</span>
                <div class="stat-glow"></div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num">{{ formatNumber(interactionStore.getCount(getArtistId(currentArtist.id)).likes) }}</span>
                <span class="stat-label">点赞</span>
                <div class="stat-glow"></div>
              </div>
            </div>

            <div class="panel-tags">
              <div class="tag tag-location">
                <LocationIcon :stroke-width="2" :style="{ width: '15px', height: '15px' }" />
                <span>{{ currentArtist.location }}</span>
              </div>
              <div class="tag tag-rating">
                <StarIcon :style="{ width: '15px', height: '15px' }" />
                <span>{{ currentArtist.rating }}</span>
              </div>
              <span v-for="(eq, i) in currentArtist.equipment" :key="eq" :class="['tag', 'tag-equip', `tag-equip-${i + 1}`]">
                {{ eq }}
              </span>
            </div>

            <div class="panel-actions">
              <button class="btn-follow" :class="{ followed: isFollowing(currentArtist.id) }"
                @click="toggleFollow(currentArtist.id)">
                <span class="btn-icon">
                  {{ isFollowing(currentArtist.id) ? '✓' : '+' }}
                </span>
                <span>
                  {{ isFollowing(currentArtist.id) ? '已关注' : '关注' }}
                </span>
              </button>
              <button class="btn-icon-only" :class="{ liked: isArtistLiked(currentArtist.id) }"
                @click="toggleArtistLike(currentArtist.id)">
                <ThumbUpIcon :filled="isArtistLiked(currentArtist.id)" :stroke-width="2" :style="{ width: '19px', height: '19px' }" />
              </button>

            </div>

            <div class="panel-content-tabs">
              <div class="tab-indicator" :style="tabIndicatorStyle"></div>
              <button v-for="(tab, ti) in contentTabs" :key="tab.key" :ref="(el) => {
                  if (el) tabRefs[ti] = el as HTMLElement;
                }
                  "
                class="content-tab" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
                <span class="tab-label">{{ tab.label }}</span>
                <span class="tab-count">{{ tabCounts[tab.key] || 0 }}</span>
              </button>
            </div>

          </div>
        </Transition>
      </div>

      <div class="works-gallery">
        <TransitionGroup name="gallery-item" tag="div" class="gallery-grid">
          <div v-for="(work, wi) in filteredWorks" :key="`${currentArtist.id}-${work.id}`" class="work-card"
            :class="[`work-${work.type}`, `card-size-${work.size || 'normal'}`]"
            :style="{ '--card-delay': `${wi * 0.06}s` }">
            <div class="card-media" :style="workHeightMap[work.id] ? { height: workHeightMap[work.id] + 'px' } : {}">
              <img v-if="work.type === 'photo'" loading="lazy" :src="work.cover" :alt="work.title" class="media-img" />
              <div v-if="work.type === 'photo'" class="card-shine"></div>

              <div v-else-if="work.type === 'video'" class="media-video">
                <img loading="lazy" :src="work.cover" :alt="work.title" class="media-img" />
                <div class="video-overlay">
                  <div class="play-btn">
                    <div class="play-ripple"></div>
                    <PlayIcon :style="{ width: '22px', height: '22px' }" />
                  </div>
                  <span v-if="work.duration" class="video-duration">
                    {{ work.duration }}
                  </span>
                </div>
              </div>

              <div v-else-if="work.type === 'guide'" class="media-guide">
                <img v-if="work.cover" loading="lazy" :src="work.cover" :alt="work.title" class="guide-bg-img" />
                <div class="guide-overlay"></div>
                <div class="guide-accent-line"></div>
                <div class="guide-content">
                  <div class="guide-icon">
                    <BookDetailIcon :style="{ width: '28px', height: '28px' }" />
                  </div>
                  <h4 class="guide-title">{{ work.title }}</h4>
                  <p class="guide-excerpt">{{ work.excerpt }}</p>
                  <div class="guide-read-more">
                    <span>阅读全文</span>
                    <ArrowRightIcon :style="{ width: '14px', height: '14px' }" />
                  </div>
                </div>
              </div>
            </div>

            <div class="card-info">
              <div class="card-info-row">
                <div class="card-type-badge" :class="`badge-${work.type}`">
                  <ImageIcon v-if="work.type === 'photo'" :stroke-width="2" :style="{ width: '10px', height: '10px' }" />
                  <PlayIcon v-else-if="work.type === 'video'" :style="{ width: '10px', height: '10px' }" />
                  <BookIcon v-else-if="work.type === 'guide'" :stroke-width="2" :style="{ width: '10px', height: '10px' }" />
                  <span v-if="work.type === 'photo'">Photo</span>
                  <span v-else-if="work.type === 'video'">Video</span>
                  <span v-else-if="work.type === 'guide'">Guide</span>
                </div>
                <span v-if="work.type !== 'guide'" class="card-title">
                  {{ work.title }}
                </span>
              </div>

              <div v-if="work.views || work.likes" class="card-actions">
                <span v-if="work.views" class="act-chip act-views">
                  <EyeIcon :stroke-width="2" />
                  {{ formatNumber(interactionStore.getCount(getWorkId(work.id)).views) }}
                </span>
                <button v-if="work.likes" class="act-chip act-like" :class="{ liked: isWorkLiked(work.id) }" @click.stop="handleWorkLike(work)">
                  <ThumbUpIcon :filled="isWorkLiked(work.id)" :stroke-width="2" />
                  {{ getWorkDisplayLikes(work) }}
                </button>
                <button class="act-chip act-love" :class="{ loved: isWorkLoved(work.id) }" @click.stop="handleWorkLove(work)">
                  <HeartIcon :filled="isWorkLoved(work.id)" :stroke-width="2" />
                  {{ getWorkDisplayLoves(work) }}
                </button>
                <button v-if="work.bookmarks" class="act-chip act-bookmark" :class="{ collected: isWorkFavorited(work.id) }" @click.stop="handleWorkFavorite(work)">
                  <BookmarkIcon :filled="isWorkFavorited(work.id)" :stroke-width="2" />
                  {{ getWorkDisplayBookmarks(work) }}
                </button>
                <button class="act-chip act-share" @click.stop="handleWorkShare(work)">
                  <ShareIcon :stroke-width="2" />
                  {{ getWorkDisplayShares(work) }}
                </button>
                <button v-if="work.type === 'photo' || work.type === 'video'" class="act-chip act-download">
                  <DownloadIcon :stroke-width="2" />
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>

      </div>
    </div>

  </section>

  <ShareMenu v-model:visible="showShareMenu" :work="shareWork" />
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { showMessage } from '@/utils/landscape';
import { contentTabs } from '@/constants/landscape';
import { useHomeViewData } from '@/composables/landscape';
import { useInteractionStore } from '@/stores/landscape';
import { parseCount, formatNumber } from '@/utils/landscape/format';
import { convertWorkToInteractionItem as buildWorkInteractionItem } from '@/utils/landscape/interaction';
import type { InteractionItem } from '@/typesOfPages/landscape';
import StarIcon from '@/pages/Landscape/icons/common/StarIcon.vue';
import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
import ShareMenu from '../../../common/ShareMenu/index.vue';
import PlayIcon from '@/pages/Landscape/icons/common/PlayIcon.vue';
import BookIcon from '@/pages/Landscape/icons/common/BookIcon.vue';
import ArrowRightIcon from '@/pages/Landscape/icons/common/ArrowRightIcon.vue';
import ImageIcon from '@/pages/Landscape/icons/common/ImageIcon.vue';
import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';
import ChevronLeftIcon from '@/pages/Landscape/icons/common/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/pages/Landscape/icons/common/ChevronRightIcon.vue';

import BookDetailIcon from '@/pages/Landscape/icons/components/home/PhotographerRecommendations/BookDetailIcon.vue';

const interactionStore = useInteractionStore();
const router = useRouter();
const { photographerRecommendations } = useHomeViewData();
const photographers = computed(() => photographerRecommendations());

const getArtistId = (id: string) => String(id);
const getWorkId = (id: string) => id;

watch(
  () => photographers.value.length,
  (len) => {
    if (len > 0) {
      interactionStore.registerBatch(
        photographers.value.flatMap(artist => [
          {
            id: getArtistId(artist.id),
            counts: {
              likes: parseCount(artist.likes || '0'),
              views: 0,
              loves: 0,
              favorites: parseCount(artist.bookmarks || '0'),
              shares: 0,
              followers: parseCount(artist.followers || '0'),
            },
          },
          ...(artist.works || []).map(work => ({
            id: getWorkId(work.id),
            counts: {
              likes: parseCount(work.likes || '0'),
              views: parseCount(work.views || '0'),
              loves: parseCount(work.loves || '0'),
              favorites: parseCount(work.bookmarks || '0'),
              shares: parseCount(work.shares || '0'),
            },
          }))
        ])
      );
    }
  },
  { immediate: true },
);

type WorkItem = ReturnType<typeof photographerRecommendations>[number]['works'][number];

const activeIndex = ref(0);
const activeTab = ref('all');
const tabRefs = ref<HTMLElement[]>([]);

const showShareMenu = ref(false);
const currentShareWork = ref<WorkItem | null>(null);
const shareWork = computed(() => {
  const w = currentShareWork.value;
  if (!w) return {};
  const type = w.type === 'video' ? ('video' as const) : w.type === 'guide' ? ('guide' as const) : ('image' as const);
  return {
    type,
    title: w.title,
    description: w.excerpt,
    cover: w.cover,
    duration: w.duration,
  };
});

const currentArtist = computed(() => photographers.value[activeIndex.value]);
const total = computed(() => photographers.value.length);

const cardStyle = (idx: number): Record<string, string> => {
  const n = photographers.value.length;
  let diff = idx - activeIndex.value;
  if (diff > n / 2) diff -= n;
  if (diff < -n / 2) diff += n;
  const absDiff = Math.abs(diff);
  const maxDiff = Math.floor(n / 2);
  const spacing = maxDiff > 0 ? (50 - 12) / maxDiff : 0;
  const leftPercent = 50 + diff * spacing;
  const rotate = diff * 5;
  const scale = absDiff === 0 ? 1 : Math.max(0.35, 0.78 - absDiff * 0.1);
  const opacity = absDiff === 0 ? 1 : Math.max(0.12, 0.8 - absDiff * 0.17);
  const brightness = absDiff === 0 ? 1 : Math.max(0.35, 1 - absDiff * 0.16);
  return {
    left: `${leftPercent}%`,
    transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
    opacity: String(opacity),
    zIndex: String(20 - absDiff),
    filter: `brightness(${brightness})`,
  };
};

const tabIndicatorStyle = computed(() => {
  const idx = contentTabs.findIndex((t) => t.key === activeTab.value);
  if (idx < 0 || !tabRefs.value[idx]) return { left: '0px', width: '0px' };
  const el = tabRefs.value[idx];
  return {
    left: `${el.offsetLeft}px`,
    width: `${el.offsetWidth}px`,
  };
});

watch(activeTab, () => {
  nextTick(() => {
    void tabIndicatorStyle.value;
  });
});

const filteredWorks = computed(() => {
  if (!currentArtist.value) return [];
  const works = currentArtist.value.works;
  if (activeTab.value === 'all') return works;
  return works.filter((w) => w.type === activeTab.value);
});

const workHeightMap = ref<Record<string, number>>({});

const generateRandomHeight = (type: string): number => {
  const ranges: Record<string, [number, number]> = {
    photo: [400, 480],
    guide: [380, 460],
    video: [420, 520],
  };
  const [min, max] = ranges[type] || [400, 480];
  const step = 20;
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
};

watch(
  () => filteredWorks.value,
  (works) => {
    const map: Record<string, number> = {};
    for (const w of works) {
      map[w.id] = generateRandomHeight(w.type);
    }
    workHeightMap.value = map;
  },
  { immediate: true },
);

const tabCounts = computed<Record<string, number>>(() => {
  if (!currentArtist.value) return { all: 0 };
  const works = currentArtist.value.works;
  const counts: Record<string, number> = { all: works.length };
  for (const w of works) {
    counts[w.type] = (counts[w.type] || 0) + 1;
  }
  return counts;
});

const switchArtist = (direction: number) => {
  activeTab.value = 'all';
  activeIndex.value =
    (activeIndex.value + direction + total.value) % total.value;
};

const switchToArtist = (id: string) => {
  const idx = photographers.value.findIndex((p) => p.id === id);
  if (idx !== -1) {
    activeTab.value = 'all';
    activeIndex.value = idx;
  }
};

const handleMore = () => {
  router.push({ name: 'LandscapePhotographers' });
};

const toggleFollow = (id: string) => {
  const artist = photographers.value.find(p => p.id === id);
  if (!artist) return;
  
  const isFollowing = interactionStore.toggleFollowPhotographer(id);
  
  if (isFollowing) {
    showMessage.follow.success(artist.name);
  } else {
    showMessage.follow.cancel(artist.name);
  }
};

const isFollowing = (id: string) => {
  return interactionStore.isFollowing(id);
};

const toggleArtistLike = (id: string) => {
  const artist = photographers.value.find(p => p.id === id);
  if (!artist) return;
  
  const aId = getArtistId(id);
  const c = interactionStore.getCount(aId);
  const item: InteractionItem = {
    id: aId,
    type: 'photographer',
    title: artist.name,
    image: artist.avatar,
    location: artist.location,
    category: artist.specialty,
    timestamp: Date.now(),
    likes: c.likes,
    views: c.views,
    favorites: c.favorites,
    shares: c.shares,
  };
  
  const isAdded = interactionStore.toggleLike(item);
  
  if (isAdded) {
    showMessage.like.success(artist.name);
  } else {
    showMessage.like.cancel();
  }
};

const isArtistLiked = (id: string) => {
  return interactionStore.isLiked(getArtistId(id));
};

const convertWorkToInteractionItem = (work: WorkItem, artist: any): InteractionItem => {
  return buildWorkInteractionItem(
    {
      ...work,
      image: work.cover,
      likes: work.likes ? parseCount(work.likes) : undefined,
      views: work.views ? parseCount(work.views) : undefined,
      loves: work.loves ? parseCount(work.loves) : undefined,
      favorites: work.bookmarks ? parseCount(work.bookmarks) : undefined,
      shares: work.shares ? parseCount(work.shares) : undefined,
    } as any,
    artist as any,
    (id) => interactionStore.getCount(id),
  );
};

const handleWorkLike = (work: WorkItem) => {
  const item = convertWorkToInteractionItem(work, currentArtist.value);
  const isAdded = interactionStore.toggleLike(item);
  if (isAdded) {
    showMessage.like.success(work.title);
  } else {
    showMessage.like.cancel();
  }
};

const handleWorkLove = (work: WorkItem) => {
  const item = convertWorkToInteractionItem(work, currentArtist.value);
  const isAdded = interactionStore.toggleLove(item);
  const type = work.type === 'photo' ? 'image' : work.type === 'video' ? 'video' : 'guide';
  if (isAdded) {
    showMessage.love.success(work.title, type);
  } else {
    showMessage.love.cancel(work.title, type);
  }
};

const handleWorkFavorite = (work: WorkItem) => {
  const item = convertWorkToInteractionItem(work, currentArtist.value);
  const isAdded = interactionStore.toggleFavorite(item);
  const type = work.type === 'photo' ? 'image' : work.type === 'video' ? 'video' : 'guide';
  if (isAdded) {
    showMessage.favorite.success(work.title, type);
  } else {
    showMessage.favorite.cancel(work.title, type);
  }
};

const handleWorkShare = (work: WorkItem) => {
  currentShareWork.value = work;
  showShareMenu.value = true;
};

const isWorkLiked = (id: string) => interactionStore.isLiked(getWorkId(id));
const isWorkLoved = (id: string) => interactionStore.isLoved(getWorkId(id));
const isWorkFavorited = (id: string) => interactionStore.isFavorited(getWorkId(id));

const getWorkDisplayLikes = (work: WorkItem): string => {
  return formatNumber(interactionStore.getCount(getWorkId(work.id)).likes);
};

const getWorkDisplayLoves = (work: WorkItem): string => {
  return formatNumber(interactionStore.getCount(getWorkId(work.id)).loves);
};

const getWorkDisplayBookmarks = (work: WorkItem): string => {
  return formatNumber(interactionStore.getCount(getWorkId(work.id)).favorites);
};

const getWorkDisplayShares = (work: WorkItem): string => {
  return formatNumber(interactionStore.getCount(getWorkId(work.id)).shares);
};
</script>

<style scoped lang="scss" src="./index.scss" />
