<template>
  <aside class="shops-list">
    <article
      v-for="location in locations"
      :key="location.id"
      class="shop-card"
      :class="{ active: selectedLocation?.id === location.id }"
      @click="$emit('select', location)"
    >
      <div class="plasma-injector">
        <span class="injector-arc"></span>
        <span class="injector-core"></span>
      </div>

      <div class="card-body">
        <div class="shop-image-wrap">
          <img
            :src="location.image"
            :alt="location.name"
            class="shop-image"
            loading="lazy"
          />
          <div class="image-shade"></div>
          <div class="energy-ring">
            <span class="ring-outer"></span>
            <span class="ring-inner"></span>
          </div>
          <span class="shop-type-badge">{{ location.type }}</span>
          <span v-if="location.rating" class="shop-rating">
            <StarIcon class="rating-star" />
            <span class="rating-value">{{ location.rating }}</span>
          </span>
        </div>

        <div class="shop-info">
          <h3 class="shop-name">{{ location.name }}</h3>
          <p class="shop-location">
            <LocationIcon class="loc-icon" />
            <span>{{ location.location }}</span>
          </p>
          <div class="shop-meta">
            <span class="meta-foods">
              <PlateIcon class="meta-icon" />
              <span class="meta-count">{{ location.foods.length }}</span>
              <span class="meta-unit">道美食</span>
            </span>
          </div>
        </div>
      </div>

      <div class="reactor-base">
        <span class="base-arc"></span>
        <span class="base-bolt base-bolt-left"></span>
        <span class="base-bolt base-bolt-right"></span>
      </div>
    </article>

    <div v-if="locations.length === 0" class="shops-empty">
      <PlateIcon class="empty-icon" />
      <p class="empty-text">未找到匹配的餐厅</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import PlateIcon from '../../../../../icons/pages/food/PlateIcon.vue';
  import StarIcon from '../../../../../icons/common/StarIcon.vue';
  import LocationIcon from '../../../../../icons/common/LocationIcon.vue';

  import type { FoodLocation } from '@/typesOfPages/travelGuide';

  defineProps<{
    locations: FoodLocation[];
    selectedLocation: FoodLocation | null;
  }>();

  defineEmits<{
    select: [location: FoodLocation];
  }>();
</script>

<style scoped lang="scss" src="./index.scss" />