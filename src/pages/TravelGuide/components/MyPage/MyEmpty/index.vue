<script setup lang="ts">
  import { SparklesIcon } from '@/pages/TravelGuide/icons/common';
  defineProps<{
    title?: string;
    hint?: string;
  }>();
</script>

<template>
  <div class="my-empty">
    <div class="radar-scope">
      <div class="radar-sweep" />
      <div class="radar-grid" />
      <div class="radar-ring r1" />
      <div class="radar-ring r2" />
      <div class="radar-ring r3" />
      <div class="radar-crosshair ch-h" />
      <div class="radar-crosshair ch-v" />
      <span class="radar-bracket br-tl" />
      <span class="radar-bracket br-tr" />
      <span class="radar-bracket br-bl" />
      <span class="radar-bracket br-br" />
      <div class="radar-core">
        <SparklesIcon :size="32" />
      </div>
      <span class="radar-blip blip-1" />
      <span class="radar-blip blip-2" />
      <span class="radar-blip blip-3" />
      <span class="radar-blip blip-4" />
      <span class="radar-blip blip-5" />
    </div>
    <p class="empty-title">{{ title ?? '暂无记录' }}</p>
    <p class="empty-hint">{{ hint ?? '去探索页面标记你喜欢的内容吧' }}</p>
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>
