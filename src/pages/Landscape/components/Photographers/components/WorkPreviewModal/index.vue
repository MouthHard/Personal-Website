<template>
  <div v-if="previewWork" class="work-preview-modal" @click="$emit('close')">
    <div class="lightbox-frame">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="$emit('close')">
          <CloseIcon />
        </button>

        <div class="image-viewport">

          <img v-if="isImageType" loading="lazy"
            :src="previewWork.cover || previewWork.image" alt="作品预览" />
          <div v-else-if="workType === 'video' || workType === 'timelapse'" class="video-viewport">
            <img loading="lazy" :src="previewWork.cover || previewWork.image" alt="作品预览" />
            <div class="video-play-overlay">
              <div class="play-btn-ring"></div>
              <PlayIcon :style="{ width: '48px', height: '48px' }" />
            </div>
            <div v-if="workType === 'timelapse'" class="timelapse-badge">
              <ClockIcon :style="{ width: '14px', height: '14px' }" />
              <span>延时摄影</span>
            </div>
            <div v-if="previewWork.duration" class="duration-badge">
              {{ previewWork.duration }}
            </div>
          </div>
          <div v-else-if="workType === 'aerial'" class="aerial-viewport">
            <img loading="lazy" :src="previewWork.cover || previewWork.image" alt="作品预览" />
            <div class="aerial-badge">
              <AerialIcon :style="{ width: '16px', height: '16px' }" />
              <span>航拍视角</span>
            </div>
          </div>
          <div v-else>
            <img loading="lazy" :src="previewWork.cover || previewWork.image" alt="作品预览" />
          </div>


        </div>

        <div class="info-bar">
          <div class="info-left">
            <h3 v-if="previewWork.title" class="work-title">{{ previewWork.title }}</h3>
            <div v-if="previewWork.author" class="work-author-row">
              <UserIcon :stroke-width="1.5" />
              <span class="author-name">{{ previewWork.author }}</span>
            </div>
          </div>

          <div class="info-center">
            <button 
              :class="['action-btn', 'like', { active: isLiked }]"
              @click="handleToggleLike"
            >
              <ThumbUpIcon />
              <span class="btn-count">{{ formatNumber(getCount().likes) }}</span>
            </button>
            <button 
              :class="['action-btn', 'love', { active: isLoved }]"
              @click="handleToggleLove"
            >
              <HeartIcon />
              <span class="btn-count">{{ formatNumber(getCount().loves) }}</span>
            </button>
            <button 
              :class="['action-btn', 'bookmark', { active: isFavorited }]"
              @click="handleToggleFavorite"
            >
              <BookmarkIcon />
              <span class="btn-count">{{ formatNumber(getCount().favorites) }}</span>
            </button>
            <button class="action-btn share" @click="handleShare">
              <ShareIcon />
              <span class="btn-count">{{ formatNumber(getCount().shares) }}</span>
            </button>
            <button class="action-btn download" @click="handleDownload">
              <DownloadIcon />
            </button>
          </div>

          <div class="info-right">
            <div class="tech-badge">
              <span class="tech-label">格式</span>
              <span class="tech-value">{{ workTypeConfig.format }}</span>
            </div>
            <div class="tech-badge">
              <span class="tech-label">类型</span>
              <span class="tech-value">{{ workTypeConfig.name }}</span>
            </div>
          </div>
        </div>

        <div class="viewport-footer">
          <span class="footer-label">{{ workTypeConfig.format }}</span>
          <span class="footer-dot"></span>
          <span class="footer-label">{{ workTypeConfig.name }}</span>
          <span class="footer-dot"></span>
          <span class="footer-label">ISO 100</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { workTypeConfigs } from '@/utils/landscape/constants';
import { showMessage } from '@/utils/landscape';
import { useInteractionStore, type InteractionItem } from '@/stores/landscape';
import { formatNumber } from '@/utils/landscape/format';
import CloseIcon from '@/pages/Landscape/icon/common/CloseIcon.vue';
import PlayIcon from '@/pages/Landscape/icon/common/PlayIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';
import AerialIcon from '@/pages/Landscape/icon/common/AerialIcon.vue';
import UserIcon from '@/pages/Landscape/icon/common/UserIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icon/common/DownloadIcon.vue';

interface PreviewWork {
  id?: string;
  image?: string;
  cover?: string;
  type?: string;
  duration?: string;
  title?: string;
  author?: string;
  authorId?: string;
  authorAvatar?: string;
  location?: string;
  category?: string;
}

const props = defineProps<{
  previewWork: PreviewWork | null
}>();

defineEmits<{
  close: []
}>();

const interactionStore = useInteractionStore();

const workType = computed(() => props.previewWork?.type || 'photo');
const workTypeConfig = computed(() => {
  return workTypeConfigs[workType.value] || workTypeConfigs.photo;
});
const isImageType = computed(() => ['photo', 'panorama', 'hdr', 'startrail', 'longexp'].includes(workType.value));

const workId = computed(() => props.previewWork?.id || `work-${Date.now()}`);
const workTitle = computed(() => props.previewWork?.title || '精选作品');

const getCount = () => interactionStore.getCount(workId.value);
const isLiked = computed(() => interactionStore.isLiked(workId.value));
const isLoved = computed(() => interactionStore.isLoved(workId.value));
const isFavorited = computed(() => interactionStore.isFavorited(workId.value));

const handleToggleLike = () => {
  const liked = interactionStore.toggleLike(workId.value);
  if (liked) {
    showMessage.like.success(workTitle.value);
  } else {
    showMessage.like.cancel();
  }
};

const handleToggleLove = () => {
  const item: InteractionItem = {
    id: workId.value,
    type: 'image',
    title: workTitle.value,
    image: props.previewWork?.cover || props.previewWork?.image || '',
    location: props.previewWork?.location || '',
    category: props.previewWork?.category || '',
    timestamp: Date.now(),
    author: props.previewWork?.author,
    authorId: props.previewWork?.authorId,
    authorAvatar: props.previewWork?.authorAvatar,
  };
  const loved = interactionStore.toggleLove(item);
  if (loved) {
    showMessage.love.success(workTitle.value, 'image');
  } else {
    showMessage.love.cancel(workTitle.value, 'image');
  }
};

const handleToggleFavorite = () => {
  const item: InteractionItem = {
    id: workId.value,
    type: 'image',
    title: workTitle.value,
    image: props.previewWork?.cover || props.previewWork?.image || '',
    location: props.previewWork?.location || '',
    category: props.previewWork?.category || '',
    timestamp: Date.now(),
    author: props.previewWork?.author,
    authorId: props.previewWork?.authorId,
    authorAvatar: props.previewWork?.authorAvatar,
  };
  const favorited = interactionStore.toggleFavorite(item);
  if (favorited) {
    showMessage.favorite.success(workTitle.value, 'image');
  } else {
    showMessage.favorite.cancel(workTitle.value, 'image');
  }
};

const handleShare = () => {

  showMessage.share.success(workTitle.value);
};

const handleDownload = () => {
  showMessage.download.success(workTitle.value);
};
</script>

<style scoped lang="scss" src="./index.scss" />
