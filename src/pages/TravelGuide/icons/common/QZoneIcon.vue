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
    <circle
      cx="12"
      cy="12"
      r="7.5"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
    />
    <polygon
      points="12,5.5 14.1,10.3 19.2,10.3 15.1,13.9 16.5,18.5 12,15.8 7.5,18.5 8.9,13.9 4.8,10.3 9.9,10.3"
      fill="currentColor"
    />
  </svg>
</template>