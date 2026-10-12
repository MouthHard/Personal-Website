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
    <path
      d="M8 3L11 6M16 3L13 6"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
      stroke-linecap="round"
    />
    <rect
      x="3"
      y="6"
      width="18"
      height="13"
      rx="3"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
    />
    <path
      d="M10 10.5L15 12.5L10 14.5Z"
      fill="currentColor"
    />
  </svg>
</template>