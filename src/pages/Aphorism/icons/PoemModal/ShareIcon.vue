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
    <circle cx="17.6" cy="5.4" r="2.75" :fill="fill" />
    <circle cx="6.4" cy="12" r="2.75" :fill="fill" />
    <circle cx="17.6" cy="18.6" r="2.75" :fill="fill" />
    <line x1="8.7" y1="10.7" x2="15.2" y2="6.7" stroke="currentColor" stroke-width="2.3" />
    <line x1="8.7" y1="13.3" x2="15.2" y2="17.3" stroke="currentColor" stroke-width="2.3" />
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