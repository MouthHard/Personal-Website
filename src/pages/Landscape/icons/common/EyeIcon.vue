<template>
  <svg
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="filled ? 1 : strokeWidth"
    :fill-rule="filled ? 'evenodd' : 'nonzero'"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- 实心态：外轮廓与瞳孔合成单条路径，靠 evenodd 把瞳孔挖成洞 -->
    <path
      v-if="filled"
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 1 1 0-5.6z"
    />
    <template v-else>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </template>
  </svg>
</template>

<script setup lang="ts">
  defineProps<{
    strokeWidth?: number;
    filled?: boolean;
  }>();
</script>
