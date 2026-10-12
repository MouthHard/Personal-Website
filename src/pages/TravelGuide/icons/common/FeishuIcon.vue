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
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 11L21 3L13 21L11 13L3 11Z"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linejoin="round"
    />
    <path
      d="M11 13L21 3"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
      stroke-linecap="round"
    />
  </svg>
</template>