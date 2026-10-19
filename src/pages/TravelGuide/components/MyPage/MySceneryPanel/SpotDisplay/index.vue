<script setup lang="ts">
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';
  import {
    CloseIcon,
    LocationIcon,
    StarIcon,
    ThumbUpIcon,
    HeartIcon,
    FlagIcon,
    ShareIcon,
  } from '@/pages/TravelGuide/icons/common';

  defineProps<{
    spots: ScenerySpot[];
    isLike: (id: string) => boolean;
    isWant: (id: string) => boolean;
    isBeen: (id: string) => boolean;
  }>();

  const emit = defineEmits<{
    (e: 'open', spot: ScenerySpot): void;
    (e: 'remove', id: string): void;
    (e: 'like', id: string): void;
    (e: 'want', id: string): void;
    (e: 'been', id: string): void;
    (e: 'share', id: string): void;
  }>();
</script>

<template>
  <ul class="ticket-board">
    <li
      v-for="spot in spots"
      :key="spot.id"
      class="ticket"
      @click="emit('open', spot)"
    >
      <!-- 主票区 -->
      <div class="ticket-main">
        <span class="watermark">ADMISSION</span>
        <div class="ticket-photo">
          <img :src="spot.image" :alt="spot.name" loading="lazy" />
          <div class="photo-vignette" />
        </div>
        <div class="ticket-title-row">
          <h3 class="ticket-name">{{ spot.name }}</h3>
          <span v-if="spot.level" class="ticket-level">{{ spot.level }}</span>
        </div>
        <div class="ticket-loc">
          <LocationIcon :size="18" />
          <span>{{ spot.location }}</span>
        </div>
        <div v-if="spot.tags && spot.tags.length" class="ticket-tags">
          <span v-for="t in spot.tags.slice(0, 3)" :key="t" class="tt-tag">{{ t }}</span>
        </div>
      </div>

      <!-- 穿孔撕线 -->
      <div class="ticket-tear">
        <span class="tear-notch top" />
        <span class="tear-line" />
        <span class="tear-notch bottom" />
      </div>

      <!-- 票根区 -->
      <div class="ticket-stub">
        <div v-if="spot.rating" class="stub-rating">
          <StarIcon :size="20" />
          <b>{{ spot.rating.toFixed(1) }}</b>
          <span class="rating-label">评分</span>
        </div>
        <div class="stub-type">
          <i class="type-dot" :class="spot.type" />
          <span>{{ spot.type === 'nature' ? '自然景观' : '人文景观' }}</span>
        </div>
        <div class="stub-divider" />
        <div class="stub-actions">
          <button class="s-act s-like" :class="{ on: isLike(spot.id) }" title="点赞" @click.stop="emit('like', spot.id)">
            <ThumbUpIcon :size="22" :filled="isLike(spot.id)" />
          </button>
          <button class="s-act s-want" :class="{ on: isWant(spot.id) }" title="想去" @click.stop="emit('want', spot.id)">
            <HeartIcon :size="22" :filled="isWant(spot.id)" />
          </button>
          <button class="s-act s-been" :class="{ on: isBeen(spot.id) }" title="去过" @click.stop="emit('been', spot.id)">
            <FlagIcon :size="22" :filled="isBeen(spot.id)" />
          </button>
          <button class="s-act s-share" title="分享" @click.stop="emit('share', spot.id)">
            <ShareIcon :size="18" />
          </button>
          <button class="s-act s-remove" title="移除" @click.stop="emit('remove', spot.id)">
            <CloseIcon :size="18" />
          </button>
        </div>
        <div class="stub-barcode" />
        <span class="stub-no">No. {{ spot.id.slice(-6).toUpperCase() }}</span>
      </div>
    </li>
  </ul>
</template>

<style scoped src="./index.scss" lang="scss"></style>
