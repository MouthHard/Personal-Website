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
      d="M8.5 3C4.36 3 1 5.69 1 9c0 1.89 1.08 3.56 2.78 4.66L3 17l3.2-1.36c.72.18 1.5.28 2.3.28.28 0 .55-.01.82-.03C9.12 15.07 8.8 14.3 8.8 13.5c0-2.76 2.91-5 6.5-5 .33 0 .66.03.98.08C15.78 4.96 12.44 3 8.5 3z"
      fill="currentColor"
      opacity="0.9"
    />
    <circle cx="5.5" cy="8" r="0.9" fill="#0a0e16" />
    <circle cx="10.5" cy="8" r="0.9" fill="#0a0e16" />
    <path
      d="M23 13.5C23 10.74 20.09 8.5 16.5 8.5S10 10.74 10 13.5s2.91 5 6.5 5c.78 0 1.52-.1 2.2-.28L22 19.5l-.78-2.16C22.34 16.28 23 14.97 23 13.5z"
      fill="currentColor"
    />
    <circle cx="14.5" cy="13" r="0.7" fill="#0a0e16" />
    <circle cx="18.5" cy="13" r="0.7" fill="#0a0e16" />
  </svg>
</template>