<script setup lang="ts">
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';

  defineProps<{
    hotSpots: ScenerySpot[];
  }>();

  const emit = defineEmits<{
    (e: 'spot-click', spotName: string): void;
  }>();
</script>

<template>
  <section class="panel-section highlights-section">
    <h3 class="panel-title">
      <span class="panel-icon">
        <StarIcon />
      </span>
      热门景点
    </h3>
    <div class="highlights-scroll">
      <span
        v-for="(spot, index) in hotSpots"
        :key="spot.id"
        class="highlight-item"
        :class="`highlight-${(index % 8) + 1}`"
        @click="emit('spot-click', spot.name)"
      >
        <span class="highlight-name">{{ spot.name }}</span>
        <span v-if="spot.rating" class="highlight-rating">
          <StarIcon :size="10" class="rating-star" />
          <span class="rating-num">{{ spot.rating.toFixed(1) }}</span>
        </span>
        <span class="highlight-tooltip">
          <span class="tooltip-desc">{{ spot.highlight || spot.description }}</span>
          <span class="tooltip-meta">
            <span v-if="spot.ticketPrice" class="tooltip-price">{{ spot.ticketPrice }}</span>
            <span v-if="spot.bestTime" class="tooltip-best-time">最佳{{ spot.bestTime }}</span>
          </span>
        </span>
      </span>
      <span v-if="hotSpots.length === 0" class="empty-highlight">
        暂无热门景点数据
      </span>
    </div>
  </section>
</template>

<style scoped src="./index.scss" lang="scss"></style>