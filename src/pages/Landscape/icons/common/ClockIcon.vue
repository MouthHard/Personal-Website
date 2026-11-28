<template>
  <svg v-if="filled" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6zM11.1 6.4h1.8v4.7h3.7v1.8h-5.5z"
    />
  </svg>
  <svg
    v-else
    viewBox="0 0 24 24"
    :fill="fill"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    :class="props.class"
    :style="props.style"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
</template>

<script setup lang="ts">
  import type { CSSProperties } from 'vue';
  interface Props {
    fill?: string;
    strokeWidth?: number | string;
    class?: string;
    style?: CSSProperties;
    filled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    fill: 'none',
    strokeWidth: 2,
  });
</script>
