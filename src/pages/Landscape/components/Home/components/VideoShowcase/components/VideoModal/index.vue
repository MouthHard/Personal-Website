<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="video-modal" @click="$emit('close')">
        <div class="modal-wrapper" @click.stop>
          <button class="modal-close" @click="$emit('close')">
            <CloseIcon :stroke-width="2" />
          </button>

          <div class="modal-content">
            <div class="player-section">
              <div class="player-container">
                <video
                  ref="videoPlayer"
                  :src="video?.url"
                  class="video-player"
                  controls
                  autoplay
                  @ended="$emit('ended')"
                ></video>
                <div class="player-frame"></div>
              </div>
            </div>

            <div class="info-panel">
              <div class="panel-header">
                <span
                  class="panel-category"
                  :data-category="video?.category"
                >
                  {{ video?.category }}
                </span>
                <h2 class="panel-title">{{ video?.title }}</h2>
                <p class="panel-location">{{ video?.location }}</p>
              </div>

              <div class="panel-author">
                <img
                  loading="lazy"
                  :src="video?.authorAvatar"
                  class="author-avatar"
                />
                <div class="author-info">
                  <span class="author-name">
                    {{ video?.authorName }}
                  </span>
                  <span class="author-title">
                    {{ video?.category }}
                  </span>
                </div>
                <button class="follow-btn" @click="$emit('follow')">
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
              </div>

              <div class="panel-stats">
                <div class="stat-item">
                  <EyeIcon :stroke-width="2" />
                  <span>{{ video ? formatNumber(counts.views) : '' }}</span>
                </div>
                <button
                  type="button"
                  class="stat-item stat-interactive like"
                  :class="{ active: isLiked }"
                  @click="$emit('like')"
                >
                  <ThumbUpIcon :filled="isLiked" />
                  <span>{{ video ? formatNumber(counts.likes) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="stat-item stat-interactive love"
                  :class="{ active: isLoved }"
                  @click="$emit('love')"
                >
                  <HeartIcon :filled="isLoved" />
                  <span>{{ video ? formatNumber(counts.loves) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="stat-item stat-interactive bookmark"
                  :class="{ active: isFavorited }"
                  @click="$emit('favorite')"
                >
                  <BookmarkIcon :filled="isFavorited" :stroke-width="2" />
                  <span>{{ video ? formatNumber(counts.favorites) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="stat-item stat-interactive share"
                  @click="$emit('share')"
                >
                  <ShareIcon :stroke-width="2" />
                  <span>{{ video ? formatNumber(counts.shares) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="stat-item stat-interactive download"
                  @click="$emit('download')"
                >
                  <DownloadIcon :stroke-width="2" />
                </button>
              </div>

              <div class="playlist">
                <h4>播放列表</h4>
                <div class="playlist-items">
                  <div
                    v-for="item in playlist"
                    :key="item.id"
                    :class="[
                      'playlist-item',
                      { active: video?.id === item.id },
                    ]"
                    @click="$emit('select', item)"
                  >
                    <img
                      loading="lazy"
                      :src="item.poster"
                      class="playlist-thumb"
                    />
                    <div class="playlist-info">
                      <span class="playlist-title">{{ item.title }}</span>
                      <span class="playlist-duration">
                        {{ item.duration }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatNumber } from '@/utils/landscape/format';
import CloseIcon from '@/pages/Landscape/icon/common/CloseIcon.vue';
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icon/common/DownloadIcon.vue';

interface Video {
  id: string | number;
  url?: string;
  poster: string;
  title: string;
  duration: string;
  category: string;
  location: string;
  authorAvatar?: string;
  authorName?: string;
}

interface Counts {
  views: number;
  likes: number;
  loves: number;
  favorites: number;
  shares: number;
}

const props = defineProps<{
  visible: boolean;
  video: Video | null;
  playlist: Video[];
  counts: Counts;
  isLiked: boolean;
  isLoved: boolean;
  isFavorited: boolean;
  isFollowing: boolean;
}>();


const emit = defineEmits<{
  close: [];
  ended: [];
  follow: [];
  like: [];
  love: [];
  favorite: [];
  share: [];
  download: [];
  select: [video: Video];
}>();

const videoPlayer = ref<HTMLVideoElement | null>(null);

watch(
  () => props.video,
  (newVideo) => {
    if (newVideo && videoPlayer.value) {
      videoPlayer.value.src = newVideo.url || '';
      videoPlayer.value.play();
    }
  }
);

defineExpose({ videoPlayer });
</script>

<style scoped lang="scss" src="./index.scss" />
