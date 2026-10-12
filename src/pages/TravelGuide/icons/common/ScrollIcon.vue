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
    <path d="M5 3h14v18H5zM5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2M8 8h8M8 12h8M8 16h5" />
  </svg>
</template>
