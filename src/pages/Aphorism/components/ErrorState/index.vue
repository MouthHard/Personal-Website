<template>
  <div class="error-state">
    <div class="error-card">
      <span class="er-seal">误</span>
      <svg class="er-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="7.4" x2="12" y2="13" />
        <circle cx="12" cy="16.4" r="0.95" fill="currentColor" stroke="none" />
      </svg>
      <h3>诗卷未能展开</h3>
      <p>{{ message || '诗词数据加载失败，请检查网络后重试' }}</p>
      <button class="er-retry" @click="emit('retry')">重新展开</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import './index.scss';

defineOptions({ name: 'ErrorState' });

defineProps<{
  message?: string | null;
}>();

const emit = defineEmits<{
  (e: 'retry'): void;
}>();
</script>