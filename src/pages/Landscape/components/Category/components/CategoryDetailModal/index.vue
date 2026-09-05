<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="item" class="modal-overlay" :class="item.type" @click="$emit('close')">
        <div class="modal-container" :class="item.type" @click.stop>
          <button class="modal-close" :class="item.type" @click="$emit('close')">
            <CloseIcon :stroke-width="2" />
          </button>

          <div class="modal-content">
            <div class="modal-media">
              <img v-if="item.type === 'image'" loading="lazy" :src="item.fullImage" :alt="item.title" />
              <video v-else :src="item.videoUrl" controls autoplay></video>
              <div class="media-type-badge" :class="item.type">
                <ImageIcon v-if="item.type === 'image'" :stroke-width="2" />
                <PlayIcon v-else :stroke-width="2" fill="none" />
                <span>{{ item.type === 'image' ? '图片' : '视频' }}</span>
              </div>
            </div>

            <div class="modal-info" :class="item.type">
              <div class="info-scroll">
                <div class="info-header">
                  <h2 class="modal-title" :class="item.type">{{ item.title }}</h2>
                  <p class="modal-description">{{ item.description }}</p>
                </div>

                <div class="modal-meta">
                  <div class="meta-item" :class="item.type">
                    <div class="meta-icon author" :class="item.type">
                      <UserIcon :stroke-width="2" />
                    </div>
                    <div class="meta-text">
                      <span class="meta-label">作者</span>
                      <span class="meta-value">{{ item.author }}</span>
                    </div>
                  </div>
                  <div class="meta-item" :class="item.type">
                    <div class="meta-icon location" :class="item.type">
                      <LocationIcon :stroke-width="2" />
                    </div>
                    <div class="meta-text">
                      <span class="meta-label">拍摄地点</span>
                      <span class="meta-value">{{ item.location }}</span>
                    </div>
                  </div>
                  <div class="meta-item" :class="item.type">
                    <div class="meta-icon date" :class="item.type">
                      <CalendarIcon :stroke-width="2" />
                    </div>
                    <div class="meta-text">
                      <span class="meta-label">发布日期</span>
                      <span class="meta-value">{{ item.date }}</span>
                    </div>
                  </div>
                  <div class="meta-item" :class="item.type">
                    <div class="meta-icon camera" :class="item.type">
                      <CameraIcon :stroke-width="2" />
                    </div>
                    <div class="meta-text">
                      <span class="meta-label">拍摄设备</span>
                      <span class="meta-value">{{ item.camera }}</span>
                    </div>
                  </div>
                </div>

                <div class="modal-tags-section">
                  <div class="section-label">
                    <TagIcon :stroke-width="2" />
                    <span>标签</span>
                  </div>
                  <div class="modal-tags">
                    <span v-for="tag in item.tags" :key="tag" class="tag" :class="item.type">{{ tag }}</span>
                  </div>
                </div>

                <div class="action-chips" :class="item.type">
                  <span class="act-chip act-views">
                    <EyeIcon :stroke-width="2" />
                    {{ formatNumber(getCount().views) }}
                  </span>
                  <button 
                    class="act-chip act-like" 
                    :class="{ active: isLiked }"
                    @click="handleToggleLike"
                  >
                    <ThumbUpIcon :stroke-width="2" />
                    {{ formatNumber(getCount().likes) }}
                  </button>
                  <button 
                    class="act-chip act-love" 
                    :class="{ active: isLoved }"
                    @click="handleToggleLove"
                  >
                    <HeartIcon :stroke-width="2" />
                    {{ formatNumber(getCount().loves) }}
                  </button>
                  <button 
                    class="act-chip act-bookmark" 
                    :class="{ active: isFavorited }"
                    @click="handleToggleFavorite"
                  >
                    <BookmarkIcon :stroke-width="2" />
                    {{ formatNumber(getCount().favorites) }}
                  </button>
                  <button class="act-chip act-share" @click="$emit('share', item)">
                    <ShareIcon :stroke-width="2" />
                    {{ formatNumber(getCount().shares) }}
                  </button>
                  <button class="act-chip act-download" @click="$emit('download', item)">
                    <DownloadIcon :stroke-width="2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInteractionStore } from '@/stores/landscape';
import { formatNumber } from '@/utils/landscape/format';
import type { LandscapeItem } from '@/typesOfPages/landscape';
import CloseIcon from '@/pages/Landscape/icon/common/CloseIcon.vue';
import LocationIcon from '@/pages/Landscape/icon/common/LocationIcon.vue';
import CalendarIcon from '@/pages/Landscape/icon/common/CalendarIcon.vue';
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue';
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';
import PlayIcon from '@/pages/Landscape/icon/common/PlayIcon.vue';
import UserIcon from '@/pages/Landscape/icon/common/UserIcon.vue';
import TagIcon from '@/pages/Landscape/icon/common/TagIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icon/common/DownloadIcon.vue';

const props = defineProps<{
  item: LandscapeItem | null;
}>();

const emit = defineEmits<{
  close: [];
  'toggle-like': [item: LandscapeItem];
  'toggle-love': [item: LandscapeItem];
  'toggle-favorite': [item: LandscapeItem];
  share: [item: LandscapeItem];
  download: [item: LandscapeItem];
}>();

const interactionStore = useInteractionStore();

const getCount = () => {
  if (!props.item) return { likes: 0, views: 0, loves: 0, favorites: 0, shares: 0 };
  return interactionStore.getCount(String(props.item.id));
};

const isLiked = computed(() => props.item ? interactionStore.isLiked(String(props.item.id)) : false);
const isLoved = computed(() => props.item ? interactionStore.isLoved(String(props.item.id)) : false);
const isFavorited = computed(() => props.item ? interactionStore.isFavorited(String(props.item.id)) : false);

const handleToggleLike = () => {
  if (!props.item) return;
  emit('toggle-like', props.item);
};

const handleToggleLove = () => {
  if (!props.item) return;
  emit('toggle-love', props.item);
};

const handleToggleFavorite = () => {
  if (!props.item) return;
  emit('toggle-favorite', props.item);
};
</script>

<style scoped lang="scss" src="./index.scss" />
