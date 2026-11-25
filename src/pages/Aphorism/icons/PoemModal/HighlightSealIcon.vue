<template>
  <svg
    viewBox="0 0 24 24"
    :fill="fill"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 17h6V9H3v8zm2-6h2v4H5v-4z" />
    <path d="M15 17h6V9h-6v8zm2-6h2v4h-2v-4z" />
    <path d="M9 7l3-4 3 4" />
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
    class: '',
    style: () => ({}),
  });
</script>
