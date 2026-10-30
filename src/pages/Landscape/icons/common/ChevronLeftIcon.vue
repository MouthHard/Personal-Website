<template>
  <svg
    viewBox="0 0 24 24"
    :fill="fill"
    :class="props.class"
    :style="props.style"
  >
    <path d="M18 7.5 Q14.25 8 11.5 12 Q14.25 16 18 16.5 Z" />
    <path d="M11 7.5 Q7.25 8 4.5 12 Q7.25 16 11 16.5 Z" />
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
