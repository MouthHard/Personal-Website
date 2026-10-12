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
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
    />
    <path
      d="M3 7L12 13L21 7"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>