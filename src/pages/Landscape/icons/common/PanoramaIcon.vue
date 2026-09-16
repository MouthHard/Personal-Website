<template>
  <svg
    viewBox="0 0 24 24"
    :fill="fill"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    :class="props.class"
    :style="props.style"
  >
    <path d="M2 18a10 10 0 0 1 20 0" />
    <circle cx="12" cy="8" r="3" />
    <path d="M2 18h20M6 18l1-3M18 18l-1-3M10 18l.5-2M14 18l-.5-2" />
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