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
    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM12 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM12 12v10" />
  </svg>
</template>
