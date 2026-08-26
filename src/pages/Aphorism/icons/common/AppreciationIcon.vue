<template>
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    :fill="fill"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

interface Props {
  fill?: string;
  strokeWidth?: number | string;
  class?: string;
  style?: CSSProperties;
}

withDefaults(defineProps<Props>(), {
  fill: 'currentColor',
  strokeWidth: 0,
});
</script>