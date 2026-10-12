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
    <path d="M2 5h20" />
    <path d="M7 5l1.5 3M17 5l-1.5 3" />
    <rect x="5" y="8" width="14" height="8" rx="2" />
    <path d="M7 12h10" />
    <circle cx="8.5" cy="18.5" r="1.5" />
    <circle cx="15.5" cy="18.5" r="1.5" />
  </svg>
</template>