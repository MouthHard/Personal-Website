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
    <path d="M4 9h13v6.5a4.5 4.5 0 0 1-4.5 4.5H8.5A4.5 4.5 0 0 1 4 15.5V9Z" />
    <path d="M17 11h2a2.5 2.5 0 0 1 0 5h-2" />
    <path d="M7 5c0 1.2 0.8 1.8 0.8 3M11 5c0 1.2 0.8 1.8 0.8 3M15 5c0 1.2 0.8 1.8 0.8 3" />
  </svg>
</template>