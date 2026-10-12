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
    <rect
      x="2.5"
      y="7"
      width="13"
      height="10"
      rx="2"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
    />
    <circle
      cx="9"
      cy="12"
      r="2.4"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.6"
    />
    <path
      d="M15.5 10L21 8V16L15.5 14"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>