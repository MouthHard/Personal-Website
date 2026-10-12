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
      d="M3 6.5C3 4.57 4.57 3 6.5 3H17.5C19.43 3 21 4.57 21 6.5V14.5C21 16.43 19.43 18 17.5 18H12L7.5 21V18H6.5C4.57 18 3 16.43 3 14.5V6.5z"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linejoin="round"
    />
    <path
      d="M7.5 9h3M13.5 9h3M7.5 12.5h6"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
      stroke-linecap="round"
    />
  </svg>
</template>