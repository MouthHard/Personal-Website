<template>
  <svg
    viewBox="0 0 24 24"
    :fill="fill"
    :class="props.class"
    :style="props.style"
  >
    <path d="M6 7.5 Q9.75 8 12.5 12 Q9.75 16 6 16.5 Z" />
    <path d="M13 7.5 Q16.75 8 19.5 12 Q16.75 16 13 16.5 Z" />
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
  fill: 'currentColor',
  strokeWidth: 2
})
</script>
