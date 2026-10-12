<script setup lang="ts">
  defineProps<{
    size?: number | string;
  }>();
</script>

<template>
  <svg
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2 L22 12 L12 22 L2 12 Z" />
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
</template>