<script setup lang="ts">
  import { SparklesIcon } from '@/pages/TravelGuide/icons/common';
  defineProps<{
    title?: string;
    hint?: string;
  }>();
</script>

<template>
  <div class="my-empty">
    <div class="empty-orb">
      <div class="orb-ring ring-1"></div>
      <div class="orb-ring ring-2"></div>
      <div class="orb-ring ring-3"></div>
      <div class="orb-core">
        <SparklesIcon :size="28" />
      </div>
    </div>
    <p class="empty-title">{{ title ?? '暂无记录' }}</p>
    <p class="empty-hint">{{ hint ?? '去探索页面标记你喜欢的内容吧' }}</p>
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>