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
    <path d="M2 18V8M2 12h13a3 3 0 0 1 3 3v3M2 18h20" />
    <path d="M6 12V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3" />
  </svg>
</template>