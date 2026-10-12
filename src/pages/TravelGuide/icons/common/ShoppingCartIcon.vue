<script setup lang="ts">
  defineProps<{
    size?: number | string;
    strokeWidth?: number;
    filled?: boolean;
  }>();
</script>

<template>
  <svg
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-if="filled">
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.66-7.43H5.12z" fill="currentColor" stroke="none" />
      <circle cx="8" cy="21" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="21" r="1.5" fill="currentColor" stroke="none" />
    </template>
    <template v-else>
      <circle cx="8" cy="21" r="1" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" />
      <circle cx="19" cy="21" r="1" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.66-7.43H5.12" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" stroke-linejoin="round" />
    </template>
  </svg>
</template>