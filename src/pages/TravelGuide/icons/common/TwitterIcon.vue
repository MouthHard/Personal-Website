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
      d="M20 5c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1a3.6 3.6 0 0 0-6.2 2.5c0 .3 0 .5.1.8-3-.1-5.6-1.6-7.4-3.8a3.6 3.6 0 0 0-.5 3.6c.3.5.7.9 1.2 1.2-.6 0-1.2-.2-1.7-.5v.1c0 1.7 1.2 3.2 2.8 3.5-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.8 2.5 3.4 2.5a7.3 7.3 0 0 1-5.4 1.5c1.6 1 3.5 1.6 5.6 1.6 6.7 0 10.4-5.6 10.4-10.4v-.5c.7-.5 1.3-1.2 1.8-2z"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>
</template>