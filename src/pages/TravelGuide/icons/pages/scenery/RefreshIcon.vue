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
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth ?? 2"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 4h18" />
    <path d="M3 20h18" />
    <path d="M7 8v4a1.5 1.5 0 0 0 3 0V8" />
    <path d="M11 8v4a1.5 1.5 0 0 0 3 0V8" />
    <path d="M15 8v4a1.5 1.5 0 0 0 3 0V8" />
  </svg>
</template>