<template>
  <svg viewBox="0 0 36 26" fill="none">
    <defs>
      <linearGradient id="peakBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a78bfa" stop-opacity="0.55" />
        <stop offset="1" stop-color="#312e81" stop-opacity="0.9" />
      </linearGradient>
      <linearGradient id="peakMid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#c4b5fd" stop-opacity="0.8" />
        <stop offset="1" stop-color="#4c1d95" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="peakFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6d28d9" stop-opacity="0.7" />
        <stop offset="1" stop-color="#1e1b4b" stop-opacity="0.95" />
      </linearGradient>
    </defs>
    <polygon points="2,24 10,8 18,24" fill="url(#peakBg)" />
    <polygon points="12,24 22,3 32,24" fill="url(#peakMid)" />
    <polygon points="24,24 30,12 36,24" fill="url(#peakFront)" />
    <path
      d="M22 0.5 L22.9 2.1 L24.5 3 L22.9 3.9 L22 5.5 L21.1 3.9 L19.5 3 L21.1 2.1 Z"
      fill="#fde68a"
    />
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ name: 'PeakBadgeIcon' });
</script>
