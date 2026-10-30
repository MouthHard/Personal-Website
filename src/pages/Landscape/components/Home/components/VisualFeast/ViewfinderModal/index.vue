<template>
  <div v-if="visible" class="vf-modal" @click="emit('close')">
    <div class="vf-camera" @click.stop>
      <button aria-label="关闭" class="vf-close" @click="emit('close')">
        <span class="vf-close-x"></span>
      </button>

      <!-- 取景器金属顶板（品牌头） -->
      <div class="vf-topplate">
        <span class="vf-plate-rivets"><i></i><i></i><i></i><i></i></span>
        <span class="vf-brand">OPTICAL&nbsp;VIEWFINDER</span>
        <span class="vf-model">OVF-FULL&nbsp;FRAME</span>
        <span class="vf-led"><span class="vf-led-dot"></span>FOCUS</span>
        <span class="vf-plate-rivets right"><i></i><i></i><i></i><i></i></span>
      </div>

      <!-- 顶部 HUD 条 -->
      <div class="vf-hud vf-hud-top">
        <div class="hud-group">
          <span class="hud-frame">① {{ String(currentIndex + 1).padStart(2, '0') }}/{{ String(total).padStart(2, '0') }}</span>
          <span class="hud-sep"></span>
          <span class="hud-date">{{ image?.date || '----/--/--' }}</span>
        </div>
        <div class="hud-group">
          <span class="hud-cat">{{ image?.category }}</span>
          <span class="hud-sep"></span>
          <span class="hud-cam">{{ image?.camera || 'UNKNOWN' }}</span>
        </div>
      </div>

      <!-- 中间区：左竖条 + 取景框 + 右竖条 -->
      <div class="vf-body">
        <!-- 左侧竖条：互动数据（相机参数刻度） -->
        <div class="vf-rail vf-rail-left">
          <div class="rail-head">METERING</div>
          <div class="param-list">
            <div class="param-row param-views">
              <span class="param-key">ISO</span>
              <span class="param-val">{{ formatNumber(counts.views) }}</span>
              <span class="param-label">浏览</span>
            </div>
            <button class="param-row param-like" :class="{ active: liked }" @click="emit('like')">
              <span class="param-key">F2.8</span>
              <span class="param-val">{{ formatNumber(counts.likes) }}</span>
              <span class="param-label">点赞</span>
              <ThumbUpIcon class="param-icon" :filled="liked" />
            </button>
            <button class="param-row param-love" :class="{ active: loved }" @click="emit('love')">
              <span class="param-key">1/250</span>
              <span class="param-val">{{ formatNumber(counts.loves) }}</span>
              <span class="param-label">喜爱</span>
              <HeartIcon class="param-icon" :filled="loved" />
            </button>
            <button class="param-row param-bookmark" :class="{ active: favorited }" @click="emit('favorite')">
              <span class="param-key">EV+1</span>
              <span class="param-val">{{ formatNumber(counts.favorites) }}</span>
              <span class="param-label">收藏</span>
              <BookmarkIcon class="param-icon" :filled="favorited" />
            </button>
            <button class="param-row param-share" @click="emit('share')">
              <span class="param-key">AWB</span>
              <span class="param-val">{{ formatNumber(counts.shares) }}</span>
              <span class="param-label">分享</span>
              <ShareIcon class="param-icon" />
            </button>
          </div>
        </div>

        <!-- 中央取景框 -->
        <div class="vf-viewfinder">
          <div class="vf-frame">
            <img class="vf-image" loading="lazy" :src="image?.url" />
            <!-- 三分线网格 -->
            <div class="vf-grid">
              <span class="grid-line gh1"></span>
              <span class="grid-line gh2"></span>
              <span class="grid-line gv1"></span>
              <span class="grid-line gv2"></span>
            </div>
            <!-- 对焦框角标 -->
            <span class="focus-corner fc-tl"></span>
            <span class="focus-corner fc-tr"></span>
            <span class="focus-corner fc-bl"></span>
            <span class="focus-corner fc-br"></span>
            <!-- 对焦确认提示 -->
            <span class="focus-confirm"><i class="fc-dot"></i>FOCUS</span>
            <!-- 取景框右下角参数 -->
            <span class="vf-overlay-param">{{ image?.camera || '---' }}</span>
            <!-- 取景框左上角分类 -->
            <span class="vf-overlay-cat">{{ image?.category }}</span>
          </div>
        </div>

        <!-- 右侧竖条：作者 + 标签 + 多维分类 -->
        <div class="vf-rail vf-rail-right">
          <div class="rail-head">INFO</div>
          <div class="info-scroll">
            <div class="author-cell">
              <span class="cell-key">AUTHOR</span>
              <span class="cell-val">{{ image?.author || '匿名' }}</span>
            </div>
            <div class="tags-cell">
              <span class="cell-key">TAGS</span>
              <div class="tag-grid">
                <span v-for="t in (image?.tags || [])" :key="t" class="tag-chip">{{ t }}</span>
              </div>
            </div>
            <div class="cat-tags-cell">
              <span class="cell-key">CLASSIFY</span>
              <div class="classify-list">
                <div v-for="ct in (image?.categoryTags || [])" :key="ct.dimension + ct.subCategory" class="classify-row">
                  <span class="classify-dim">{{ ct.dimension }}</span>
                  <span class="classify-val">{{ ct.subCategory }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部 HUD 条 -->
      <div class="vf-hud vf-hud-bottom">
        <div class="hud-title-loc">
          <h3 class="hud-title">{{ image?.title }}</h3>
          <span class="hud-location"><LocationIcon :stroke-width="1.5" /> {{ image?.location }}</span>
        </div>
        <div class="hud-exposure">
          <span class="exp-label-l">-3</span>
          <span class="exp-track">
            <i v-for="n in 7" :key="n" class="exp-mark" :class="{ center: n === 4 }"></i>
            <span class="exp-pointer" :style="{ left: '50%' }"></span>
          </span>
          <span class="exp-label-r">+3</span>
          <span class="exp-label">EV</span>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="vf-actions">
        <!-- 导航拨盘 -->
        <div class="nav-dial">
          <button class="dial-btn dial-prev" :disabled="currentIndex <= 0" @click="emit('navigate', -1)">
            <ChevronLeftIcon :stroke-width="2.5" />
          </button>
          <div class="dial-center">
            <span class="dial-current">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
            <span class="dial-sep">/</span>
            <span class="dial-total">{{ String(total).padStart(2, '0') }}</span>
          </div>
          <button class="dial-btn dial-next" :disabled="currentIndex >= total - 1" @click="emit('navigate', 1)">
            <ChevronRightIcon :stroke-width="2.5" />
          </button>
          <div class="dial-progress">
            <div class="dial-progress-bar" :style="{ width: `${((currentIndex + 1) / total) * 100}%` }"></div>
          </div>
        </div>
        <!-- 操作金属按键 -->
        <div class="action-keys">
          <button class="key-btn key-like" :class="{ active: liked }" @click="emit('like')">
            <span class="key-body"><ThumbUpIcon :filled="liked" /></span>
            <span class="key-val">{{ formatNumber(counts.likes) }}</span>
          </button>
          <button class="key-btn key-love" :class="{ active: loved }" @click="emit('love')">
            <span class="key-body"><HeartIcon :filled="loved" /></span>
            <span class="key-val">{{ formatNumber(counts.loves) }}</span>
          </button>
          <button class="key-btn key-bookmark" :class="{ active: favorited }" @click="emit('favorite')">
            <span class="key-body"><BookmarkIcon :filled="favorited" /></span>
            <span class="key-val">{{ formatNumber(counts.favorites) }}</span>
          </button>
          <button class="key-btn key-share" @click="emit('share')">
            <span class="key-body"><ShareIcon /></span>
            <span class="key-val">{{ formatNumber(counts.shares) }}</span>
          </button>
          <button class="key-btn key-download" @click="emit('download')">
            <span class="key-body"><DownloadIcon /></span>
            <span class="key-val">DL</span>
          </button>
        </div>
      </div>

      <!-- 快门闪光层 -->
      <div class="vf-shutter-flash"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/landscape/format';
import type { GlobalImage } from '@/typesOfPages/landscape/data';
import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';
import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
import ChevronLeftIcon from '@/pages/Landscape/icons/common/ChevronLeftIcon.vue';
import ChevronRightIcon from '@/pages/Landscape/icons/common/ChevronRightIcon.vue';

interface InteractionCounts {
  views: number;
  likes: number;
  loves: number;
  favorites: number;
  shares: number;
}

defineProps<{
  visible: boolean;
  image: GlobalImage | null;
  currentIndex: number;
  total: number;
  counts: InteractionCounts;
  liked: boolean;
  loved: boolean;
  favorited: boolean;
}>();

const emit = defineEmits<{
  close: [];
  navigate: [direction: number];
  like: [];
  love: [];
  favorite: [];
  share: [];
  download: [];
}>();
</script>

<style scoped lang="scss" src="./index.scss" />