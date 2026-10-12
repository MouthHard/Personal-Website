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
    <path d="M4 3l8 2 8-2v8a8 8 0 0 1-16 0zM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM16 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
</template>
