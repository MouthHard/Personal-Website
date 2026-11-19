<template>
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    :fill="fill"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
</template>

<script setup lang="ts">
  interface Props {
    fill?: string;
    strokeWidth?: number | string;
  }

  withDefaults(defineProps<Props>(), {
    fill: 'none',
    strokeWidth: 2,
  });

  // 注意：不要把 class / style 声明为 prop —— 那会拦截 Vue 的自动 attribute 透传，
  // 导致使用处传入的 class（如 class="me-icon"）无法落到根 <svg> 上，尺寸约束失效。
  // 保持 inheritAttrs 默认开启，class 自动透传到根元素。
</script>
