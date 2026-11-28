<template>
  <svg viewBox="0 0 120 72" fill="none">
    <defs>
      <linearGradient id="emptyPeakBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6d5bb5" stop-opacity="0.32" />
        <stop offset="1" stop-color="#181430" stop-opacity="0.85" />
      </linearGradient>
      <linearGradient id="emptyPeakMid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8f7dd6" stop-opacity="0.5" />
        <stop offset="1" stop-color="#241d4a" stop-opacity="0.9" />
      </linearGradient>
      <linearGradient id="emptyPeakFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4c3f86" stop-opacity="0.6" />
        <stop offset="1" stop-color="#120f28" stop-opacity="0.95" />
      </linearGradient>
    </defs>
    <polygon points="0,66 16,34 34,66" fill="url(#emptyPeakBack)" />
    <polygon points="26,66 58,10 90,66" fill="url(#emptyPeakMid)" />
    <polygon points="76,66 96,40 120,66" fill="url(#emptyPeakFront)" />
    <path
      d="M58 1.6 L59.3 4.4 L62.1 5.7 L59.3 7 L58 9.8 L56.7 7 L53.9 5.7 L56.7 4.4 Z"
      fill="#fde68a"
    />
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ name: 'EmptyPeakIcon' });
</script>
