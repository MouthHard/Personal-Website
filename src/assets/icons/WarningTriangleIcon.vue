<script setup lang="ts">
  defineOptions({ name: 'WarningTriangleIcon' });
</script>

<template>
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 6L58 54H6L32 6Z"
      stroke="#ffb000"
      stroke-width="3"
      stroke-linejoin="round"
      fill="rgba(255, 176, 0, 0.08)"
    />
    <path
      d="M32 24V40"
      stroke="#ffb000"
      stroke-width="3.5"
      stroke-linecap="round"
    />
    <circle cx="32" cy="48" r="2.5" fill="#ffb000" />
  </svg>
</template>