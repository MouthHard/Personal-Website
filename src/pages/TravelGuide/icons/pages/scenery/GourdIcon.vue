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
    <path d="M10 4h4v1.6a2 2 0 0 1-1 1.8 4 4 0 1 1-2 0 2 2 0 0 1-1-1.8V4Z" />
    <path d="M10.5 4h3" />
  </svg>
</template>