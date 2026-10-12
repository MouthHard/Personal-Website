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
    :stroke-width="strokeWidth ?? 2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 2v20M4.22 4.22l15.56 15.56M19.78 4.22L4.22 19.78M2 12h20M5 5l2 2M17 17l2 2M19 5l-2 2M5 19l2-2" />
  </svg>
</template>
