<template>
  <aside class="modal-aside">
    <div class="console-brand">TRAVEL&nbsp;BOY</div>
    <div class="modal-hero">
      <div class="screen-led"></div>
      <img :src="spot.image" :alt="spot.name" class="modal-image" loading="lazy" />
      <div class="modal-hero-shade"></div>
    </div>

    <div class="prism-strip">
      <div class="prism-shard shard-type">
        <LocationIcon width="13" height="13" />
        <span>{{ spot.type === 'nature' ? '自然景观' : '人文景观' }}</span>
      </div>
      <div v-if="spot.level" class="prism-shard shard-level">
        <span class="shard-level-badge">{{ spot.level }}</span>
        <span>级景区</span>
      </div>
      <span
        v-for="cat in spot.landscapeCategory || []"
        :key="cat"
        class="prism-shard shard-cat"
      >{{ cat }}</span>
      <div v-if="spot.rating" class="prism-shard shard-rating">
        <StarIcon width="13" height="13" />
        <span class="shard-rating-num">{{ spot.rating }}</span>
      </div>
      <div v-if="spot.reviewCount" class="prism-shard shard-reviews">
        <span>{{ spot.reviewCount }}</span>
      </div>
    </div>

    <!-- 投币口 + CREDIT 显示 -->
    <div class="aside-price-console">
      <span class="coin-slot"></span>
      <span class="price-console-label">CREDIT</span>
      <span class="price-console-value">{{ spot.ticketPrice }}</span>
    </div>

    <!-- 操作按钮组（5键统一风格，不同颜色） -->
    <div class="aside-actions">
      <button
        class="action-btn act-like"
        :class="{ active: isSpotLike(spot.id) }"
        @click="emit('toggle-like', spot.id)"
      >
        <ThumbUpIcon width="16" height="16" :filled="isSpotLike(spot.id)" />
        <span class="action-label">点赞</span>
      </button>
      <button class="action-btn act-share" @click="emit('share', spot.id)">
        <LinkIcon width="16" height="16" />
        <span class="action-label">分享</span>
      </button>
      <button
        class="action-btn act-want"
        :class="{ active: isSpotWant(spot.id) }"
        @click="emit('toggle-want', spot.id)"
      >
        <HeartIcon width="16" height="16" :filled="isSpotWant(spot.id)" />
        <span class="action-label">想去</span>
      </button>
      <button
        class="action-btn act-been"
        :class="{ active: isSpotBeen(spot.id) }"
        @click="emit('toggle-been', spot.id)"
      >
        <FlagIcon width="16" height="16" :filled="isSpotBeen(spot.id)" />
        <span class="action-label">去过</span>
      </button>
      <button class="action-btn act-nav" @click="emit('navigate', spot.id)">
        <MapIcon width="16" height="16" />
        <span class="action-label">导航</span>
      </button>
    </div>

    <div class="console-speaker">
      <span v-for="n in 6" :key="n"></span>
    </div>

  </aside>
</template>

<script setup lang="ts">
  import StarIcon from '../../../icons/common/StarIcon.vue';
  import ThumbUpIcon from '../../../icons/common/ThumbUpIcon.vue';
  import HeartIcon from '../../../icons/common/HeartIcon.vue';
  import LinkIcon from '../../../icons/common/LinkIcon.vue';
  import LocationIcon from '../../../icons/common/LocationIcon.vue';
  import FlagIcon from '../../../icons/common/FlagIcon.vue';
  import MapIcon from '../../../icons/common/MapIcon.vue';
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';

  defineProps<{
    spot: ScenerySpot;
  }>();

  const { isSpotLike, isSpotWant, isSpotBeen } = useSceneryPrefs();

  const emit = defineEmits<{
    'toggle-like': [spotId: string];
    'toggle-want': [spotId: string];
    'toggle-been': [spotId: string];
    share: [spotId: string];
    navigate: [spotId: string];
  }>();
</script>

<style scoped lang="scss" src="./index.scss" />
