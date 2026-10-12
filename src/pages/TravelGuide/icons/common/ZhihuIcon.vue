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
      d="M4 5.5C4 4.12 5.12 3 6.5 3H17.5C18.88 3 20 4.12 20 5.5V12.5C20 13.88 18.88 15 17.5 15H11L7 18.5V15H6.5C5.12 15 4 13.88 4 12.5V5.5z"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linejoin="round"
    />
    <circle cx="8.5" cy="9" r="1.1" fill="currentColor" />
    <circle cx="12" cy="9" r="1.1" fill="currentColor" />
    <circle cx="15.5" cy="9" r="1.1" fill="currentColor" />
  </svg>
</template>