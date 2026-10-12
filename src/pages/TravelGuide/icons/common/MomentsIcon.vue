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
    <circle cx="12" cy="12" r="6" fill="currentColor" />
    <g
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
      stroke-linecap="round"
    >
      <line x1="12" y1="1.5" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="22.5" y2="12" />
      <line x1="4.96" y1="4.96" x2="7.06" y2="7.06" />
      <line x1="16.94" y1="16.94" x2="19.04" y2="19.04" />
      <line x1="4.96" y1="19.04" x2="7.06" y2="16.94" />
      <line x1="16.94" y1="7.06" x2="19.04" y2="4.96" />
    </g>
  </svg>
</template>