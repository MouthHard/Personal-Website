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
      <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z" fill="currentColor" stroke="none" />
      <path d="M16 2v8c0 1.1.9 2 2 2v10h2V2h-4z" fill="currentColor" stroke="none" />
    </template>
    <template v-else>
      <path d="M4 2v6M7 2v6M10 2v6" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" />
      <path d="M4 8a3 3 0 0 0 6 0" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" />
      <path d="M7 11v11" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" />
      <path d="M17 2c-2 0-3 3-3 7s1 5 3 5" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" />
      <path d="M17 14v8" fill="none" stroke="currentColor" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" />
    </template>
  </svg>
</template>