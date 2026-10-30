<template>
  <div class="poem-modal-loading">
    <div class="loading-paper">
      <span class="paper-corner tl"></span>
      <span class="paper-corner tr"></span>
      <span class="paper-corner bl"></span>
      <span class="paper-corner br"></span>

      <div class="skeleton-image">
        <span class="image-ink"></span>
      </div>

      <div class="skeleton-body">
        <div class="skeleton-meta">
          <span class="sk sk-pill"></span>
          <span class="sk sk-author"></span>
        </div>
        <span class="sk sk-title"></span>
        <div class="skeleton-lines">
          <span v-for="n in 3" :key="n" class="sk sk-line"></span>
        </div>
        <span class="sk sk-block"></span>
      </div>

      <div class="loading-hint">
        <span class="ink-drop"></span>
        <span class="ink-drop"></span>
        <span class="ink-drop"></span>
        <p>正在展开诗笺…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PoemModalLoading' });
</script>

<style scoped lang="scss">
@use './PoemModalLoading.scss';
</style>