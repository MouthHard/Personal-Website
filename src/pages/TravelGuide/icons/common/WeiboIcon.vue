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
      d="M9.5 10.5c-3.6 0-6.5 2.2-6.5 5s2.9 5 6.5 5 6.5-2.2 6.5-5-2.9-5-6.5-5z"
      fill="currentColor"
      opacity="0.9"
    />
    <circle cx="7" cy="14.5" r="1.2" fill="#0a0e16" />
    <circle cx="12" cy="15.5" r="0.8" fill="#0a0e16" />
    <path
      d="M16 4c-1.8 0-3.5.6-4.8 1.6"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 2"
      stroke-linecap="round"
    />
    <path
      d="M16.5 7c-.9 0-1.8.3-2.5.8"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linecap="round"
    />
    <path
      d="M17 10c-.4 0-.8.1-1.1.3"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.5"
      stroke-linecap="round"
    />
    <circle cx="17.5" cy="4.5" r="1.3" fill="currentColor" />
  </svg>
</template>