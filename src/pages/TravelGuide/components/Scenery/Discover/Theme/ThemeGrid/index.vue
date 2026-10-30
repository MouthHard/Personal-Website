<template>
  <div class="postcard-grid">
    <div class="grid-caption">
      <span class="gc-bar"></span>
      <span class="gc-text">{{ currentGroup.title }}</span>
      <span class="gc-count">{{ currentGroup.items.length }}张</span>
    </div>
    <div class="grid-slots">
      <button
        v-for="(theme, ti) in currentGroup.items"
        :key="theme.key"
        class="postcard-slot"
        :class="{ active: currentThemeKey === theme.key, tilt: Number(ti) % 2 === 1 }"
        @click="emit('select-theme', theme.key)"
      >
        <span class="ps-corner ps-corner--tl"></span>
        <span class="ps-corner ps-corner--bl"></span>
        <span class="ps-corner ps-corner--br"></span>
        <span class="ps-active-ring"></span>
        <span class="ps-postmark">
          <span class="pm-ring"></span>
          <span class="pm-num">{{ theme.avgRating.toFixed(1) }}</span>
        </span>
        <span class="ps-stamp"><component :is="theme.icon" :size="24" /></span>
        <span class="ps-caption">{{ theme.name }}</span>
        <span class="ps-tags">
          <span class="ps-tag ps-tag--spots">{{ theme.spots.length }}处</span>
          <span class="ps-tag ps-tag--season">{{ theme.bestSeason }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    currentGroup: any;
    currentThemeKey: string | null;
  }>();

  const emit = defineEmits<{
    (e: 'select-theme', key: string): void;
  }>();
</script>

<style scoped src="./index.scss" lang="scss" />