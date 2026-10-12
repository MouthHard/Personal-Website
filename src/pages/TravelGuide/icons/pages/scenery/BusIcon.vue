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
    <path d="M8 6v6" />
    <path d="M15 6v6" />
    <path d="M2 12h19.6" />
    <path d="M18 18h3s-.5-1.7-1-2.8c-.5-1-1.2-1.2-1.6-1.2" />
    <path d="M18 18h3s.2-1.4-.3-2.5" />
    <path d="M19.5 18 18 21" />
    <path d="M3 18l1.5-3.5L7 18" />
    <path d="M8.5 18h3v-1.8c0-1-.6-2-1.5-2s-1.5 1-1.5 2V18z" />
  </svg>
</template>