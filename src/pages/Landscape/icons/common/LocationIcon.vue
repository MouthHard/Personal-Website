<template>
  <svg v-if="filled" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2a8 8 0 0 0-8 8c0 5.1 5.9 10.3 7.3 11.4a1.1 1.1 0 0 0 1.4 0C14.1 20.3 20 15.1 20 10a8 8 0 0 0-8-8zm0 5.2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    />
  </svg>
  <svg
    v-else
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
</template>

<script setup lang="ts">
  defineProps<{
    strokeWidth?: number;
    filled?: boolean;
  }>();
</script>
