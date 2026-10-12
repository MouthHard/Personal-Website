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
    fill="currentColor"
    stroke="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 2a10 10 0 0 0 0 20c1 0 2-1 2-2s-1-2-1-3 1-2 2-2h3a4 4 0 0 0 4-4 10 10 0 0 0-10-9zM7 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
</template>
