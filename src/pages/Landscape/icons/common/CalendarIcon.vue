<template>
  <svg v-if="filled" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path
      d="M5 4.5h14A2.5 2.5 0 0 1 21.5 7v12a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 19V7A2.5 2.5 0 0 1 5 4.5z"
    />
    <rect x="6.2" y="2" width="2.2" height="5" rx="1.1" />
    <rect x="15.6" y="2" width="2.2" height="5" rx="1.1" />
  </svg>
  <svg
    v-else
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
</template>

<script setup lang="ts">
  defineProps<{
    strokeWidth?: number;
    filled?: boolean;
  }>();
</script>
