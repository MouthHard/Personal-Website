  <template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="video-modal" @click="$emit('close')">
        <div class="modal-wrapper" @click.stop>
          <div class="speaker-grille"></div>

          <button class="modal-close" @click="$emit('close')">
            <CloseIcon :stroke-width="2.5" />
          </button>

          <div class="modal-content">
            <div class="player-section">
              <div class="crt-bezel">
                <div class="bezel-screw screw-tl"></div>
                <div class="bezel-screw screw-tr"></div>
                <div class="bezel-screw screw-bl"></div>
                <div class="bezel-screw screw-br"></div>
                <div class="bezel-vents"></div>
                <div class="player-container">
                  <div v-if="!hasStarted" class="video-preview">
                    <img :src="video?.poster" class="preview-poster" :alt="video?.title" />
                    <button class="preview-play-btn" @click="startVideo" aria-label="播放视频">
                      <PlayIcon :stroke-width="2.5" />
                    </button>
                  </div>
                  <video
                    v-else
                    ref="videoPlayer"
                    :src="video?.url"
                    class="video-player"
                    controls
                    autoplay
                    @ended="$emit('ended')"
                  ></video>
                  <div class="crt-scanlines"></div>
                  <div class="crt-glare"></div>
                  <div class="crt-vignette"></div>
                </div>
                <div class="crt-bottom-bar">
                  <div class="crt-brand">
                    <span class="brand-dot"></span>
                    <span class="brand-text">TRINITRON</span>
                  </div>
                  <div class="crt-buttons">
                    <span class="crt-btn btn-power" title="电源"></span>
                    <span class="crt-btn" title="菜单"></span>
                    <span class="crt-btn" title="CH+"></span>
                    <span class="crt-btn" title="CH-"></span>
                    <span class="crt-btn" title="VOL+"></span>
                    <span class="crt-btn" title="VOL-"></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-panel">
              <div class="control-deck">
                <div class="deck-screw screw-tl"></div>
                <div class="deck-screw screw-tr"></div>
                <div class="deck-screw screw-bl"></div>
                <div class="deck-screw screw-br"></div>

                <div class="knob channel-knob">
                  <div class="knob-base">
                    <div class="knob-ring">
                      <span v-for="n in 12" :key="'ck'+n" class="knob-tick"></span>
                    </div>
                    <div class="knob-body">
                      <div class="knob-indicator"></div>
                      <div class="knob-grip"></div>
                    </div>
                  </div>
                  <span class="knob-label">CH</span>
                </div>

                <div class="deck-title">
                  <div class="title-screen">
                    <div class="screen-scanline"></div>
                    <div class="screen-frame">
                      <span class="sticker-category" :data-category="video?.category">{{ video?.category }}</span>
                      <h2 class="sticker-title">{{ video?.title }}</h2>
                      <p class="sticker-location">
                        <LocationIcon :stroke-width="2.2" class="loc-pin" />
                        {{ video?.location }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="knob volume-knob">
                  <div class="knob-base">
                    <div class="knob-ring">
                      <span v-for="n in 12" :key="'vk'+n" class="knob-tick"></span>
                    </div>
                    <div class="knob-body">
                      <div class="knob-indicator"></div>
                      <div class="knob-grip"></div>
                    </div>
                  </div>
                  <span class="knob-label">VOL</span>
                </div>
              </div>

              <div class="program-sticker">
                <div class="sticker-rivet rivet-tl"></div>
                <div class="sticker-rivet rivet-tr"></div>
                <div class="sticker-rivet rivet-bl"></div>
                <div class="sticker-rivet rivet-br"></div>

                <div class="badge-frame">
                  <img
                    loading="lazy"
                    :src="video?.authorAvatar"
                    class="author-avatar"
                  />
                  <div class="badge-glass"></div>
                </div>
                <div class="author-info">
                  <span class="author-name">{{ video?.author }}</span>
                  <span class="author-title">频道主播 · {{ video?.category }}</span>
                </div>
                <button class="follow-btn" :class="{ following: isFollowing }" @click="$emit('follow')">
                  <span class="follow-led"></span>
                  <span class="follow-text">{{ isFollowing ? '已订阅' : '订阅' }}</span>
                </button>
              </div>

              <div class="led-display">
                <div class="led-item">
                  <EyeIcon :stroke-width="2" />
                  <span class="led-num">{{ video ? formatNumber(counts.views) : '' }}</span>
                </div>
                <button
                  type="button"
                  class="led-item led-interactive like"
                  :class="{ active: isLiked }"
                  @click="$emit('like')"
                >
                  <ThumbUpIcon :filled="isLiked" />
                  <span class="led-num">{{ video ? formatNumber(counts.likes) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="led-item led-interactive love"
                  :class="{ active: isLoved }"
                  @click="$emit('love')"
                >
                  <HeartIcon :filled="isLoved" />
                  <span class="led-num">{{ video ? formatNumber(counts.loves) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="led-item led-interactive bookmark"
                  :class="{ active: isFavorited }"
                  @click="$emit('favorite')"
                >
                  <BookmarkIcon :filled="isFavorited" :stroke-width="2" />
                  <span class="led-num">{{ video ? formatNumber(counts.favorites) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="led-item led-interactive share"
                  @click="$emit('share')"
                >
                  <ShareIcon :stroke-width="2" />
                  <span class="led-num">{{ video ? formatNumber(counts.shares) : '' }}</span>
                </button>
                <button
                  type="button"
                  class="led-item led-interactive download"
                  @click="$emit('download')"
                >
                  <DownloadIcon :stroke-width="2" />
                </button>
              </div>

              <div class="vhs-rack">
                <h4 class="rack-title">
                  <span class="rack-icon"></span>
                  录像带架
                </h4>
                <div class="rack-items">
                  <div
                    v-for="item in sortedPlaylist"
                    :key="item.id"
                    :class="['vhs-tape', { active: video?.id === item.id }]"
                    @click="$emit('select', item)"
                  >
                    <div class="tape-body">
                      <div class="tape-reels">
                        <div class="tape-reel left"></div>
                        <div class="tape-reel right"></div>
                      </div>
                      <img
                        loading="lazy"
                        :src="item.poster"
                        class="tape-thumb"
                      />
                      <div class="tape-label">
                        <span class="tape-title">{{ item.title }}</span>
                        <span class="tape-duration">{{ item.duration }}</span>
                      </div>
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
import { ref, watch, nextTick, computed } from 'vue';
import { formatNumber } from '@/utils/landscape/format';
import type { GlobalVideo } from '@/typesOfPages/landscape/data';
import CloseIcon from '@/pages/Landscape/icons/common/CloseIcon.vue';
import PlayIcon from '@/pages/Landscape/icons/common/PlayIcon.vue';
import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';

interface Counts {
  views: number;
  likes: number;
  loves: number;
  favorites: number;
  shares: number;
}

const props = defineProps<{
  visible: boolean;
  video: GlobalVideo | null;
  playlist: GlobalVideo[];
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
  select: [video: GlobalVideo];
}>();

const videoPlayer = ref<HTMLVideoElement | null>(null);
const hasStarted = ref(false);

const sortedPlaylist = computed(() => {
  const currentId = props.video?.id;
  if (!currentId) return props.playlist;
  const current = props.playlist.find((item) => item.id === currentId);
  if (!current) return props.playlist;
  return [current, ...props.playlist.filter((item) => item.id !== currentId)];
});

const startVideo = () => {
  hasStarted.value = true;
  nextTick(() => {
    if (videoPlayer.value && props.video) {
      videoPlayer.value.src = props.video.url || '';
      videoPlayer.value.play();
    }
  });
};

watch(
  () => props.video,
  () => {
    hasStarted.value = false;
  }
);

defineExpose({ videoPlayer });
</script>

<style scoped lang="scss" src="./index.scss" />
