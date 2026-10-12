<script setup lang="ts">
  defineProps<{
    size?: number | string;
    strokeWidth?: number;
  }>();
</script>

<template>
  <svg
    :width="size ?? 22"
    :height="size ?? 22"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="18" cy="5" r="3" fill="currentColor" />
    <circle cx="6" cy="12" r="3" fill="currentColor" />
    <circle cx="18" cy="19" r="3" fill="currentColor" />
    <path d="M8.59 13.51l6.83 3.98" stroke="currentColor" :stroke-width="strokeWidth ?? 2" fill="none" stroke-linecap="round" />
    <path d="M15.41 6.49l-6.82 3.98" stroke="currentColor" :stroke-width="strokeWidth ?? 2" fill="none" stroke-linecap="round" />
  </svg>
</template>
