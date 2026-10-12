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
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth ?? 2"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-if="filled">
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
      <polyline points="16 8 11 13 8 10" fill="none" stroke="#fff" stroke-width="2.2" />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 8 11 13 8 10" />
    </template>
  </svg>
</template>
