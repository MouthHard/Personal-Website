<template>
  <div class="empty-state">
    <div class="empty-scene">
      <div class="scene-glow"></div>

      <div class="scene-stars">
        <span class="dust d-1"></span>
        <span class="dust d-2"></span>
        <span class="dust d-3"></span>
        <span class="dust d-4"></span>
        <span class="dust d-5"></span>
        <span class="dust d-6"></span>
      </div>

      <div class="scene-horizon"></div>

      <div class="scope-float">
        <TelescopeIcon />

        <div class="scope-beam"></div>

        <div class="lost-stars">
          <span class="lost s-1"></span>
          <span class="lost s-2"></span>
          <span class="lost s-3"></span>
        </div>
      </div>
    </div>

    <div class="empty-copy">
      <div class="copy-tag">
        <i class="tag-line"></i>
        <span>NO RESULTS</span>
        <i class="tag-line right"></i>
      </div>
      <h3>未找到相关结果</h3>
      <p>望远镜扫遍了这片星海，试试其他关键词，或重置筛选条件重新探索</p>
    </div>

    <div v-if="hasKeyword || hasActiveFilters" class="empty-actions">
      <button
        v-if="hasKeyword"
        class="act-btn act-clear"
        @click="$emit('clear-keyword')"
      >
        <ClearKeywordIcon />
        <span>清除搜索词</span>
      </button>
      <button
        v-if="hasActiveFilters"
        class="act-btn act-reset"
        @click="$emit('reset-filters')"
      >
        <ResetFilterIcon />
        <span>重置筛选条件</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'SearchEmpty' });
  import ClearKeywordIcon from '@/pages/Landscape/icons/components/search/Search/ClearKeywordIcon.vue';
  import ResetFilterIcon from '@/pages/Landscape/icons/components/search/Search/ResetFilterIcon.vue';
  import TelescopeIcon from '@/pages/Landscape/icons/components/search/SearchEmpty/TelescopeIcon.vue';

  defineProps<{
    hasKeyword: boolean;
    hasActiveFilters: boolean;
  }>();

  defineEmits<{
    (e: 'clear-keyword'): void;
    (e: 'reset-filters'): void;
  }>();
</script>

<style scoped lang="scss" src="./index.scss" />
