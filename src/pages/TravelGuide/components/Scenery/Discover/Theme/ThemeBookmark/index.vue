<template>
  <aside class="bookmark-index">
    <div class="bookmark-caption">
      <span class="bc-glyph"><LayersIcon :size="28" /></span>
      <span class="bc-text">分类</span>
    </div>
    <button
      v-for="g in themeGroups"
      :key="g.key"
      class="bookmark-tab"
      :class="{ active: activeGroup === g.key, 'bm-play': g.key === 'play' }"
      @click="emit('select-group', g.key)"
    >
      <span class="bm-fold"></span>
      <span class="bm-stamp"></span>
      <span class="bm-icon"><component :is="groupIcon(g.key)" :size="20" /></span>
      <span class="bm-info">
        <span class="bm-text">{{ g.title }}</span>
        <span class="bm-count">{{ g.items.length }}</span>
      </span>
    </button>
  </aside>
</template>

<script setup lang="ts">
  import type { Component } from 'vue';
  import LayersIcon from '@/pages/TravelGuide/icons/pages/scenery/LayersIcon.vue';

  defineProps<{
    themeGroups: any[];
    activeGroup: string;
    groupIcon: (key: string) => Component;
  }>();

  const emit = defineEmits<{
    (e: 'select-group', key: string): void;
  }>();
</script>

<style scoped src="./index.scss" lang="scss" />