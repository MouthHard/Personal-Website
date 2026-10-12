<script setup lang="ts">
  defineProps<{
    size?: number | string;
    strokeWidth?: number;
  }>();
</script>

<template>
  <svg
    :width="size ?? 22"
    :height="size ?? 22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="4.5"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
    />
    <path
      d="M8.5 8V16M8.5 8H11.5a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H8.5M12.5 12L15.5 16"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>