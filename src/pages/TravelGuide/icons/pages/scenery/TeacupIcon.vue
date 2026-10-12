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
    <path d="M5 9h12l-1 6.2a3 3 0 0 1-3 2.8H9a3 3 0 0 1-3-2.8L5 9Z" />
    <path d="M17 11h1.8a2.2 2.2 0 0 1 0 4.4H17" />
    <path d="M8 5c0 1.4 1 2 1 3.4M12 5c0 1.4 1 2 1 3.4M16 5c0 1.4 1 2 1 3.4" />
  </svg>
</template>