<script setup lang="ts">
defineProps<{ flip?: boolean }>();
</script>

<template>
  <svg v-once viewBox="0 0 70 40" :class="{ flip }">
    <circle cx="45" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="1.8" />
    <circle cx="45" cy="20" r="5" fill="none" stroke="currentColor" stroke-width="1.4" />
    <circle cx="45" cy="20" r="2" fill="currentColor" />
    <path d="M45 12 C41 8 41 4 45 2 C49 4 49 8 45 12" fill="none" stroke="currentColor" stroke-width="1.3" />
    <path d="M53 20 C57 16 61 16 63 20 C61 24 57 24 53 20" fill="none" stroke="currentColor" stroke-width="1.3" />
    <path d="M45 28 C41 32 41 36 45 38 C49 36 49 32 45 28" fill="none" stroke="currentColor" stroke-width="1.3" />
    <path d="M37 20 C33 16 29 16 27 20 C29 24 33 24 37 20" fill="none" stroke="currentColor" stroke-width="1.3" />
    <path d="M51 14 C55 10 59 10 61 14 C59 18 55 18 51 14" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.85" />
    <path d="M51 26 C55 30 59 30 61 26 C59 22 55 22 51 26" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.85" />
    <path d="M39 14 C35 10 31 10 29 14 C31 18 35 18 39 14" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.85" />
    <path d="M39 26 C35 30 31 30 29 26 C31 22 35 22 39 26" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.85" />
    <path d="M27 20 C23 20 19 14 15 20 C13 22 11 20 9 20 C5 20 3 16 1 20"
      fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M15 20 C13 15 11 13 9 16 C8 17 9 19 12 18" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
    <circle cx="1" cy="20" r="1.8" fill="none" stroke="currentColor" stroke-width="1.1" />
    <circle cx="1" cy="20" r="0.7" fill="currentColor" />
    <path d="M9 28 Q13 26 17 28" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6" />
    <path d="M53 28 Q57 26 61 28" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6" />
    <path d="M9 12 Q13 10 17 12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6" />
    <path d="M53 12 Q57 10 61 12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6" />
  </svg>
</template>

<style scoped>
.flip {
  transform: scaleX(-1);
}
</style>
