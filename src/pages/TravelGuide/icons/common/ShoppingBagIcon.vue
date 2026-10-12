<script setup lang="ts">
  defineProps<{
    size?: number | string;
    strokeWidth?: number;
    filled?: boolean;
  }>();
</script>

<template>
  <svg
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-if="filled">
      <path d="M6 2L4 6v14h16V6l-2-4z" fill="currentColor" stroke="none" />
      <path d="M6 6h12" fill="none" stroke="#fff" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" />
      <path d="M9 10a3 3 0 0 0 6 0" fill="none" stroke="#fff" :stroke-width="strokeWidth ?? 2" stroke-linecap="round" />
    </template>
    <path
      v-else
      d="M6 2L4 6v14h16V6l-2-4zM6 6h12M9 10a3 3 0 0 0 6 0"
      fill="none"
      stroke="currentColor"
      :stroke-width="strokeWidth ?? 2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
