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
      d="M9 17V6L18 4V15"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      cx="7"
      cy="17"
      r="2"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
    />
    <circle
      cx="16"
      cy="15"
      r="2"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
    />
  </svg>
</template>