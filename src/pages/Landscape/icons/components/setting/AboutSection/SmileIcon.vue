<template>
  <svg viewBox="0 0 24 24" :fill="fill" stroke="currentColor" :stroke-width="strokeWidth" :class="props.class" :style="props.style">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 15s1.5-2 4-2 4 2 4 2" />
    <circle cx="12" cy="9" r="3" />
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