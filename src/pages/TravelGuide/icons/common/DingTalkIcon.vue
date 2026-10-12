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
      d="M13 2L5 13H11L9 22L19 10H13L13 2Z"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linejoin="round"
    />
  </svg>
</template>