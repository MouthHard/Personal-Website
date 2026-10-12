<template>
  <svg
    class="sort-active-indicator"
    viewBox="0 0 20 20"
    width="32"
    height="32"
    aria-hidden="true"
  >
    <polygon class="indicator-ring-1" points="10,2 17,6 17,14 10,18 3,14 3,6" />
    <polygon class="indicator-ring-2" points="10,5 14,7.5 14,12.5 10,15 6,12.5 6,7.5" />
    <polygon class="indicator-ring-3" points="10,7 12,8.5 12,11.5 10,13 8,11.5 8,8.5" />
    <circle class="indicator-core" cx="10" cy="10" r="1.5" />
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ name: 'SortActiveIndicator' });
</script>

<style scoped>
  .sort-active-indicator {
    animation: indicator-glow 1.6s ease-in-out infinite;
  }

  .indicator-ring-1 {
    fill: none;
    stroke-width: 1.5;
    transform-box: fill-box;
    transform-origin: center;
    animation:
      indicator-rotate 4s linear infinite,
      color-shift-1 6s linear infinite;
  }

  .indicator-ring-2 {
    fill: none;
    stroke-width: 1.2;
    transform-box: fill-box;
    transform-origin: center;
    animation:
      indicator-rotate-reverse 3s linear infinite,
      color-shift-2 6s linear infinite;
  }

  .indicator-ring-3 {
    fill: none;
    stroke-width: 1.0;
    transform-box: fill-box;
    transform-origin: center;
    animation:
      indicator-rotate 2s linear infinite,
      color-shift-3 6s linear infinite;
  }

  .indicator-core {
    fill: rgba(103, 232, 249, 1);
    animation: indicator-pulse 1.6s ease-in-out infinite;
  }

  @keyframes indicator-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes indicator-rotate-reverse {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }

  @keyframes indicator-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes indicator-glow {
    0%, 100% {
      filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.7));
    }
    50% {
      filter: drop-shadow(0 0 10px rgba(34, 211, 238, 1));
    }
  }

  @keyframes color-shift-1 {
    0%   { stroke: rgba(103, 232, 249, 1); }
    33%  { stroke: rgba(96, 165, 250, 1); }
    66%  { stroke: rgba(251, 191, 36, 1); }
    100% { stroke: rgba(103, 232, 249, 1); }
  }

  @keyframes color-shift-2 {
    0%   { stroke: rgba(96, 165, 250, 1); }
    33%  { stroke: rgba(251, 191, 36, 1); }
    66%  { stroke: rgba(103, 232, 249, 1); }
    100% { stroke: rgba(96, 165, 250, 1); }
  }

  @keyframes color-shift-3 {
    0%   { stroke: rgba(251, 191, 36, 1); }
    33%  { stroke: rgba(103, 232, 249, 1); }
    66%  { stroke: rgba(96, 165, 250, 1); }
    100% { stroke: rgba(251, 191, 36, 1); }
  }
</style>
