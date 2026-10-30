<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="item" class="album-overlay" :class="item.type" @click="$emit('close')">
        <div class="album-book" :class="item.type" @click.stop>
          <span class="album-corner tl"></span>

          <span class="album-corner bl"></span>
          <span class="album-corner br"></span>


          <div class="album-page page-left" :class="item.type">
            <div class="page-texture"></div>
            <div class="photo-slot" :class="item.type">
              <div class="photo-stack" :class="item.type">
                <div class="stack-photo p1"></div>
                <div class="stack-photo p2"></div>
                <div class="stack-photo p3"></div>
                <div class="stack-photo p4"></div>
                <div class="stack-photo p5"></div>
                <div class="stack-photo p6"></div>
                <div class="stack-photo p7"></div>
              </div>

              <div class="photo-print" :class="item.type">
                <div class="photo-white-frame">
                  <img v-if="item.type === 'image'" loading="lazy" :src="item.fullImage" :alt="item.title" />
                  <video v-else :src="item.videoUrl" controls autoplay></video>
                  <div class="photo-foot">
                    <span class="photo-watermark">{{ item.type === 'image' ? 'IMAGE' : 'VIDEO' }} · LANDSCAPE</span>
                    <span class="photo-location">{{ item.location }}</span>
                  </div>
                </div>
              </div>

              <div class="photo-stamp" :class="item.type">
                <span class="stamp-mark">{{ item.type === 'image' ? 'PHOTO' : 'CLIP' }}</span>
                <span class="stamp-sep">·</span>
                <span class="stamp-no">{{ String(getCount().views).padStart(4, '0') }}</span>
              </div>

              <span class="photo-folio">— {{ item.id }} —</span>
            </div>
          </div>

          <div class="album-binding" :class="item.type">
            <span class="bind-cap cap-top"></span>
            <span class="bind-rod"></span>
            <span class="bind-rivet r1"></span>
            <span class="bind-rivet r2"></span>
            <span class="bind-rivet r3"></span>
            <span class="bind-cap cap-bottom"></span>
            <span class="bind-ribbon" :class="item.type"></span>
          </div>

          <div class="album-page page-right" :class="item.type">
            <div class="page-texture"></div>

            <div class="journal-head" :class="item.type">
              <span class="head-rule"></span>
              <h2 class="journal-title">{{ item.title }}</h2>

            </div>

            <div class="journal-meta">
              <div class="meta-row" :class="item.type">
                <div class="meta-seal seal-author" :class="item.type"><UserIcon :stroke-width="2" /></div>
                <div class="meta-cell">
                  <span class="cell-label">摄影 / AUTHOR</span>
                  <span class="cell-value">{{ item.author }}</span>
                </div>
              </div>
              <div class="meta-row" :class="item.type">
                <div class="meta-seal seal-location" :class="item.type"><LocationIcon :stroke-width="2" /></div>
                <div class="meta-cell">
                  <span class="cell-label">地点 / LOCATION</span>
                  <span class="cell-value">{{ item.location }}</span>
                </div>
              </div>
              <div class="meta-row" :class="item.type">
                <div class="meta-seal seal-date" :class="item.type"><CalendarIcon :stroke-width="2" /></div>
                <div class="meta-cell">
                  <span class="cell-label">日期 / DATE</span>
                  <span class="cell-value">{{ item.date }}</span>
                </div>
              </div>
              <div class="meta-row" :class="item.type">
                <div class="meta-seal seal-camera" :class="item.type"><CameraIcon :stroke-width="2" /></div>
                <div class="meta-cell">
                  <span class="cell-label">器材 / GEAR</span>
                  <span class="cell-value">{{ item.camera }}</span>
                </div>
              </div>
            </div>

            <div class="journal-tags" :class="item.type">
              <div class="tags-label">
                <TagIcon :stroke-width="2" />
                <span>标签 · TAGS</span>
              </div>
              <div class="tags-list">
                <span
                  v-for="(tag, i) in item.tags"
                  :key="tag"
                  class="tag-sticker"
                  :class="item.type"
                  :style="{ '--rot': (i % 2 === 0 ? -1 : 1) * (2 + (i % 3)) + 'deg' }"
                >{{ tag }}</span>
              </div>
            </div>

            <div class="journal-postmarks" :class="item.type">
              <button
                class="postmark pm-like"
                :class="[{ active: isLiked }, item.type]"
                :style="{ '--pm-rot': '-3deg' }"
                @click="handleToggleLike"
              >
                <span class="pm-inner">
                  <span class="pm-icon"><ThumbUpIcon :stroke-width="2.2" :filled="isLiked" /></span>
                  <span class="pm-count">{{ formatNumber(getCount().likes) }}</span>
                  <span class="pm-text">LIKE</span>
                </span>
              </button>
              <button
                class="postmark pm-love"
                :class="[{ active: isLoved }, item.type]"
                :style="{ '--pm-rot': '2.5deg' }"
                @click="handleToggleLove"
              >
                <span class="pm-inner">
                  <span class="pm-icon"><HeartIcon :stroke-width="2.2" :filled="isLoved" /></span>
                  <span class="pm-count">{{ formatNumber(getCount().loves) }}</span>
                  <span class="pm-text">LOVE</span>
                </span>
              </button>
              <button
                class="postmark pm-keep"
                :class="[{ active: isFavorited }, item.type]"
                :style="{ '--pm-rot': '-1.5deg' }"
                @click="handleToggleFavorite"
              >
                <span class="pm-inner">
                  <span class="pm-icon"><BookmarkIcon :stroke-width="2.2" :filled="isFavorited" /></span>
                  <span class="pm-count">{{ formatNumber(getCount().favorites) }}</span>
                  <span class="pm-text">KEEP</span>
                </span>
              </button>
              <button
                class="postmark pm-share"
                :class="item.type"
                :style="{ '--pm-rot': '3deg' }"
                @click="$emit('share', item)"
              >
                <span class="pm-inner">
                  <span class="pm-icon"><ShareIcon :stroke-width="2.2" /></span>
                  <span class="pm-count">{{ formatNumber(getCount().shares) }}</span>
                  <span class="pm-text">SHARE</span>
                </span>
              </button>
              <button
                class="postmark pm-save"
                :class="item.type"
                :style="{ '--pm-rot': '-2.5deg' }"
                @click="$emit('download', item)"
              >
                <span class="pm-inner">
                  <span class="pm-icon"><DownloadIcon :stroke-width="2.2" /></span>
                  <span class="pm-text">SAVE</span>
                </span>
              </button>
            </div>

          </div>

          <button class="album-close" :class="item.type" aria-label="合上相册" @click="$emit('close')">
            <CloseIcon :stroke-width="2.8" />
            <span class="close-string"></span>
          </button>
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
import CloseIcon from '@/pages/Landscape/icons/common/CloseIcon.vue';
import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
import CalendarIcon from '@/pages/Landscape/icons/common/CalendarIcon.vue';
import CameraIcon from '@/pages/Landscape/icons/common/CameraIcon.vue';
import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
import UserIcon from '@/pages/Landscape/icons/common/UserIcon.vue';
import TagIcon from '@/pages/Landscape/icons/common/TagIcon.vue';
import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';


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
