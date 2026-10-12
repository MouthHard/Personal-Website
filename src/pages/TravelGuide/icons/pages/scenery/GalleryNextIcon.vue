<script setup lang="ts">
  defineProps<{
    size?: number | string;
  }>();
</script>

<template>
  <svg
    :width="size ?? 36"
    :height="size ?? 36"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 主飞镖箭头：流线型填充，方向明确向右 -->
    <path
      d="M5 9 Q14 9 21 16 Q14 23 5 23 L11 16 Z"
      fill="currentColor"
      opacity="0.95"
    />
    <!-- 箭头高光描边 -->
    <path
      d="M5 9 Q14 9 21 16"
      stroke="currentColor"
      stroke-width="0.8"
      opacity="0.5"
      stroke-linecap="round"
      fill="none"
    />
    <!-- 尾部运动刻线（两条，表示方向运动） -->
    <line x1="2" y1="13" x2="2" y2="19" stroke="currentColor" stroke-width="2" opacity="0.55" stroke-linecap="round" />
    <line x1="4.5" y1="14.5" x2="4.5" y2="17.5" stroke="currentColor" stroke-width="1.4" opacity="0.32" stroke-linecap="round" />
  </svg>
</template>
