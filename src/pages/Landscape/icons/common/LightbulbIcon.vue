<template>
  <svg viewBox="0 0 24 24" fill="none" :stroke="stroke" :stroke-width="strokeWidth" :class="props.class" :style="props.style" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.8.14-1.63-.12-2.4C14.5 10.5 13.5 9.5 13 8c-.32-1-.2-2 .2-3C11.5 5 10 6.5 9.5 8.5c-.5 1.5-.5 3 .2 4.5.25.5.4 1 .3 1.5-.1.5-.5 1-1 1.5h6z" />
  </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
interface Props {
  stroke?: string
  strokeWidth?: number | string
  class?: string
  style?: CSSProperties
}
const props = withDefaults(defineProps<Props>(), {
  stroke: 'currentColor',
  strokeWidth: 2,
})
</script>