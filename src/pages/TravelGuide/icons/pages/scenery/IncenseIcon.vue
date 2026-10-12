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
    <path d="M6 14h12v1.2a3 3 0 0 1-3 2.8H9a3 3 0 0 1-3-2.8V14Z" />
    <path d="M4.5 14h15" />
    <path d="M9 11.5c0-2 1-3 0-5.5M12 11.5c0-2 1-3 0-5.5M15 11.5c0-2 1-3 0-5.5" />
  </svg>
</template>