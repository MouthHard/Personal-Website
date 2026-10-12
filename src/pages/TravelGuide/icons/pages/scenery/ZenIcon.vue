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
    <path d="M12 21c-1.6-3-1.6-6 0-9.5 1.6 3.5 1.6 6.5 0 9.5Z" fill="currentColor" stroke="none" />
    <path d="M5.5 18c.4-3.2 2.2-5.2 6.5-6.2-1 4.2-3.2 6.2-6.5 6.2Z" fill="currentColor" stroke="none" opacity="0.82" />
    <path d="M18.5 18c-.4-3.2-2.2-5.2-6.5-6.2 1 4.2 3.2 6.2 6.5 6.2Z" fill="currentColor" stroke="none" opacity="0.82" />
    <path d="M3.5 13c1.6-2.6 4.2-3.6 8.5-3.1-2.2 3.2-5.2 4.2-8.5 3.1Z" fill="currentColor" stroke="none" opacity="0.66" />
    <path d="M20.5 13c-1.6-2.6-4.2-3.6-8.5-3.1 2.2 3.2 5.2 4.2 8.5 3.1Z" fill="currentColor" stroke="none" opacity="0.66" />
  </svg>
</template>