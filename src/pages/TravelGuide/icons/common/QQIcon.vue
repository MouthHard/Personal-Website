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
      d="M12 2.5c-3.3 0-5.5 2.8-5.5 6.2 0 1.2.3 2.3.8 3.2-.8.6-2.3 2-2.8 3.8-.3 1.2.2 2 .8 2.2.5.2 1.2-.1 1.7-.6.2.8.6 1.5 1.2 2-.3.3-.5.7-.5 1.1 0 .5.4.8 1 .8h9.2c.6 0 1-.3 1-.8 0-.4-.2-.8-.5-1.1.6-.5 1-1.2 1.2-2 .5.5 1.2.8 1.7.6.6-.2 1.1-1 .8-2.2-.5-1.8-2-3.2-2.8-3.8.5-.9.8-2 .8-3.2 0-3.4-2.2-6.2-5.5-6.2z"
      fill="currentColor"
      opacity="0.9"
    />
    <circle cx="9.5" cy="8.5" r="1" fill="#0a0e16" />
    <circle cx="14.5" cy="8.5" r="1" fill="#0a0e16" />
    <path
      d="M10.5 12h3"
      stroke="#0a0e16"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <path
      d="M8 19.5c0 1 1.8 2 4 2s4-1 4-2"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.5"
      stroke-linecap="round"
      fill="none"
    />
  </svg>
</template>