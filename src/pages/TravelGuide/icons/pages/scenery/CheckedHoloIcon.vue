<template>
  <svg
    class="checked-holo"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <circle class="holo-arc holo-arc-1" cx="50" cy="50" r="28" />
    <circle class="holo-arc holo-arc-2" cx="50" cy="50" r="40" />
    <circle class="holo-arc holo-arc-3" cx="50" cy="50" r="48" />
    <line class="holo-cross" x1="38" y1="50" x2="62" y2="50" />
    <line class="holo-cross" x1="50" y1="38" x2="50" y2="62" />
    <circle class="holo-core" cx="50" cy="50" r="2" />
  </svg>
</template>

<script setup lang="ts">
defineOptions({ name: 'CheckedHoloIcon' });
</script>

<style scoped>
  .checked-holo {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 90%;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 0;
    mix-blend-mode: screen;
    filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.7));
  }

  .holo-arc {
    fill: none;
    transform-box: fill-box;
    transform-origin: center;
  }

  .holo-arc-1 {
    stroke: rgba(103, 232, 249, 0.85);
    stroke-width: 1.8;
    stroke-dasharray: 65 110;
    animation: holo-arc-spin 3s linear infinite, holo-glow-flicker 2s ease-in-out infinite;
  }

  .holo-arc-2 {
    stroke: rgba(96, 165, 250, 0.75);
    stroke-width: 1.4;
    stroke-dasharray: 55 200;
    animation: holo-arc-spin-reverse 4s linear infinite, holo-glow-flicker 2.4s ease-in-out infinite 0.4s;
  }

  .holo-arc-3 {
    stroke: rgba(251, 191, 36, 0.65);
    stroke-width: 1.0;
    stroke-dasharray: 40 260;
    animation: holo-arc-spin 5s linear infinite, holo-glow-flicker 2.8s ease-in-out infinite 0.8s;
  }

  .holo-cross {
    stroke: rgba(103, 232, 249, 0.45);
    stroke-width: 0.6;
    stroke-linecap: round;
    animation: holo-glow-flicker 2.2s ease-in-out infinite 1.1s;
  }

  .holo-core {
    fill: rgba(103, 232, 249, 0.9);
    transform-box: fill-box;
    transform-origin: center;
    animation: holo-core-pulse 1.6s ease-in-out infinite;
  }

  @keyframes holo-arc-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes holo-arc-spin-reverse {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }

  @keyframes holo-core-pulse {
    0%, 100% { transform: scale(0.8); opacity: 0.4; }
    50% { transform: scale(1.6); opacity: 1; }
  }

  @keyframes holo-glow-flicker {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 1; }
  }
</style>