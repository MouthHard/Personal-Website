<template>
  <div class="landscape-loading">
    <div class="loading-stars">
      <div
        v-for="star in stars"
        :key="star.id"
        class="star"
        :style="{
          left: star.left + '%',
          top: star.top + '%',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's',
        }"
      ></div>
    </div>

    <div class="loading-content">
      <div class="loading-orb">
        <div class="orb-ring orb-ring-1"></div>
        <div class="orb-ring orb-ring-2"></div>
        <div class="orb-ring orb-ring-3"></div>
        <div class="orb-core"></div>
      </div>
      <p class="loading-text">正在加载影像作品</p>
      <div class="loading-bar">
        <div class="bar-track">
          <div class="bar-fill"></div>
        </div>
      </div>
      <div class="loading-skeleton">
        <div v-for="i in 4" :key="i" class="skeleton-card">
          <div class="skeleton-image shimmer"></div>
          <div class="skeleton-line shimmer"></div>
          <div class="skeleton-line shimmer" style="width: 60%;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }));
</script>

<style scoped lang="scss" src="./index.scss" />