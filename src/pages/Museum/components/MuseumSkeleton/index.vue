<template>
  <div class="museum-skeleton" :class="`skeleton-${type}`">
    <template v-if="type === 'list'">
      <div class="skeleton-hero"></div>
      <div class="skeleton-content">
        <div class="skeleton-map-area skeleton-shimmer"></div>
        <div class="skeleton-list-area">
          <div class="skeleton-list-header">
            <div class="skeleton-title skeleton-shimmer"></div>
            <div class="skeleton-search skeleton-shimmer"></div>
          </div>
          <div class="skeleton-grid">
            <div v-for="i in 6" :key="i" class="skeleton-card">
              <div class="skeleton-card-image skeleton-shimmer"></div>
              <div class="skeleton-card-body">
                <div class="skeleton-card-title skeleton-shimmer"></div>
                <div class="skeleton-card-tags">
                  <div class="skeleton-tag skeleton-shimmer"></div>
                  <div class="skeleton-tag skeleton-shimmer"></div>
                </div>
                <div class="skeleton-card-desc skeleton-shimmer"></div>
                <div class="skeleton-card-desc skeleton-shimmer" style="width: 60%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'detail'">
      <div class="skeleton-detail-header skeleton-shimmer"></div>
      <div class="skeleton-detail-tabs">
        <div v-for="i in 5" :key="i" class="skeleton-tab skeleton-shimmer"></div>
      </div>
      <div class="skeleton-detail-content">
        <div class="skeleton-detail-image skeleton-shimmer"></div>
        <div class="skeleton-detail-info">
          <div class="skeleton-detail-title skeleton-shimmer"></div>
          <div class="skeleton-detail-row skeleton-shimmer"></div>
          <div class="skeleton-detail-row skeleton-shimmer" style="width: 70%;"></div>
          <div class="skeleton-detail-row skeleton-shimmer" style="width: 50%;"></div>
        </div>
        <div class="skeleton-detail-grid">
          <div v-for="i in 4" :key="i" class="skeleton-detail-card">
            <div class="skeleton-detail-card-image skeleton-shimmer"></div>
            <div class="skeleton-detail-card-title skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ type?: 'list' | 'detail' }>(), {
    type: 'list',
  });
</script>

<style scoped lang="scss" src="./index.scss" />