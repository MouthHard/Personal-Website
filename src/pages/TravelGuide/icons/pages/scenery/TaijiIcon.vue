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
    :stroke-width="strokeWidth ?? 1.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 9 9 0 0 1 0-18Z" fill="currentColor" stroke="none" />
    <circle cx="12" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="16.5" r="1.3" fill="none" stroke="currentColor" />
  </svg>
</template>