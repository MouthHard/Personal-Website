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
    <path d="M12 2v2M8 4h8l-1 2H9zM8 6v8a4 4 0 0 0 8 0V6M10 14v4M14 14v4M12 18v4" />
  </svg>
</template>
