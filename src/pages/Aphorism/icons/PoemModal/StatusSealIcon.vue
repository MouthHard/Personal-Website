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
    <path d="M2 20h20v2H2z" />
    <path d="M4 18l1-10 4 4 3-6 3 6 4-4 1 10z" />
    <circle cx="4" cy="6" r="1.5" />
    <circle cx="20" cy="6" r="1.5" />
    <circle cx="12" cy="3" r="1.5" />
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
