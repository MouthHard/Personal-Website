<template>
  <svg viewBox="0 0 24 24" :fill="fill" stroke="currentColor" :stroke-width="strokeWidth" :class="props.class" :style="props.style">
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <circle cx="12" cy="12" r="5" />
    <line x1="2" y1="7" x2="5" y2="7" />
    <line x1="2" y1="17" x2="5" y2="17" />
    <line x1="19" y1="7" x2="22" y2="7" />
    <line x1="19" y1="17" x2="22" y2="17" />
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