<script setup lang="ts">
  defineProps<{
    size?: number | string;
    strokeWidth?: number;
  }>();
</script>

<template>
  <svg
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth ?? 1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <ellipse cx="12" cy="13" rx="7.5" ry="5" />
    <path d="M6.5 12c2 1 4 1 6 0M9 15.2c2 0 4-1 5.2-2.2" opacity="0.55" />
  </svg>
</template>