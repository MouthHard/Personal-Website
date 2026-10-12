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
    <ellipse cx="12" cy="14" rx="5.5" ry="6.5" fill="currentColor" opacity="0.92" />
    <path
      d="M12 7.5c0-2.6.9-4.2 3-5"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linecap="round"
    />
    <path
      d="M12 7.5c-1.4-2.2-2.9-3.2-4.8-3.8"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linecap="round"
    />
    <circle cx="9.6" cy="16" r="0.9" fill="#0a0e16" />
    <circle cx="14.4" cy="16" r="0.9" fill="#0a0e16" />
  </svg>
</template>