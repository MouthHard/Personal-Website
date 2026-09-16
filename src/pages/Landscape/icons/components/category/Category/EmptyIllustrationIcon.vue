<template>
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" :class="props.class" :style="props.style">
    <defs>
      <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(99, 102, 241, 0.6)"/>
        <stop offset="100%" stop-color="rgba(99, 102, 241, 0.05)"/>
      </linearGradient>
      <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(251, 191, 36, 0.8)"/>
        <stop offset="100%" stop-color="rgba(251, 191, 36, 0.1)"/>
      </linearGradient>
    </defs>
    <circle cx="150" cy="35" r="20" fill="url(#sunGrad)"/>
    <circle cx="150" cy="35" r="12" fill="rgba(251, 191, 36, 0.3)"/>
    <g stroke="rgba(251, 191, 36, 0.3)" stroke-width="1.5">
      <line x1="150" y1="8" x2="150" y2="2"/>
      <line x1="150" y1="62" x2="150" y2="68"/>
      <line x1="128" y1="35" x2="122" y2="35"/>
      <line x1="172" y1="35" x2="178" y2="35"/>
      <line x1="133" y1="18" x2="128" y2="13"/>
      <line x1="167" y1="52" x2="172" y2="57"/>
      <line x1="167" y1="18" x2="172" y2="13"/>
      <line x1="133" y1="52" x2="128" y2="57"/>
    </g>
    <path d="M0 140 L40 80 L70 110 L100 50 L130 95 L160 65 L200 110 L200 160 L0 160 Z" fill="url(#mountainGrad)"/>
    <path d="M0 140 L30 100 L55 120 L80 75 L110 115 L140 85 L170 120 L200 95 L200 160 L0 160 Z" fill="rgba(99, 102, 241, 0.15)"/>
    <path d="M98 55 L100 50 L102 55 Z" fill="rgba(255, 255, 255, 0.6)"/>
    <path d="M128 20 L130 15 L132 20 Z" fill="rgba(255, 255, 255, 0.5)"/>
    <path d="M168 60 L170 55 L172 60 Z" fill="rgba(255, 255, 255, 0.5)"/>
    <g opacity="0.5">
      <rect x="20" y="130" width="4" height="30" fill="rgba(34, 197, 94, 0.4)"/>
      <polygon points="15,130 22,110 29,130" fill="rgba(34, 197, 94, 0.3)"/>
      <rect x="170" y="135" width="4" height="25" fill="rgba(34, 197, 94, 0.4)"/>
      <polygon points="165,135 172,118 179,135" fill="rgba(34, 197, 94, 0.3)"/>
    </g>
    <path d="M80 160 L90 130 L100 110 L110 100 L120 105 L130 120 L140 140 L150 160" stroke="rgba(251, 191, 36, 0.3)" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
  </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
interface Props {
  class?: string
  style?: CSSProperties
}
const props = defineProps<Props>()
</script>