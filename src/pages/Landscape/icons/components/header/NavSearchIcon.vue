<template>
  <svg
    viewBox="0 0 24 24"
    :fill="fill"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="props.class"
    :style="props.style"
  >
    <circle cx="10" cy="10" r="6" />
    <line x1="14.5" y1="14.5" x2="20" y2="19.5" />
    <path d="M10 7 L10.6 9.4 L13 10 L10.6 10.6 L10 13 L9.4 10.6 L7 10 L9.4 9.4 Z" />
  </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
interface Props {
  fill?: string
  strokeWidth?: number | string
  class?: string
  style?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  fill: 'none',
  strokeWidth: 2
})
</script>