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
        <svg class="scene-telescope" viewBox="0 0 250 170" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tsTube" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#475569" />
              <stop offset="0.28" stop-color="#94a3b8" />
              <stop offset="0.55" stop-color="#64748b" />
              <stop offset="1" stop-color="#1e293b" />
            </linearGradient>
            <linearGradient id="tsGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#fde68a" />
              <stop offset="0.5" stop-color="#fbbf24" />
              <stop offset="1" stop-color="#b45309" />
            </linearGradient>
            <linearGradient id="tsLens" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#a5f3fc" stop-opacity="0.9" />
              <stop offset="0.5" stop-color="#22d3ee" stop-opacity="0.55" />
              <stop offset="1" stop-color="#0e7490" stop-opacity="0.8" />
            </linearGradient>
            <radialGradient id="tsHub" cx="0.35" cy="0.3" r="1">
              <stop offset="0" stop-color="#cbd5e1" />
              <stop offset="1" stop-color="#334155" />
            </radialGradient>
          </defs>

          <g class="ts-rot" transform="rotate(-22 118 88)">
            <rect x="18" y="81" width="8" height="14" rx="2" fill="#0f172a" />
            <rect x="26" y="78" width="16" height="20" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1" />
            <rect x="30" y="98" width="12" height="7" rx="2" fill="#334155" stroke="#475569" stroke-width="0.8" />
            <rect x="42" y="75" width="100" height="26" rx="6" fill="url(#tsTube)" stroke="#0f172a" stroke-width="1" />
            <rect x="47" y="78.5" width="88" height="3.5" rx="1.75" fill="#e2e8f0" opacity="0.4" />
            <rect x="82" y="72.5" width="11" height="31" rx="2.5" fill="url(#tsGold)" stroke="#92400e" stroke-width="0.8" />
            <rect x="118" y="72.5" width="11" height="31" rx="2.5" fill="url(#tsGold)" stroke="#92400e" stroke-width="0.8" />
            <path d="M142 75 L170 68 L170 108 L142 101 Z" fill="url(#tsTube)" stroke="#0f172a" stroke-width="1" />
            <ellipse cx="170" cy="88" rx="9" ry="22" fill="#1e293b" stroke="#94a3b8" stroke-width="1.5" />
            <ellipse cx="170" cy="88" rx="6.5" ry="18.5" fill="url(#tsLens)" stroke="#fde68a" stroke-width="1" />
            <ellipse cx="168" cy="81" rx="2.2" ry="5" fill="#ecfeff" opacity="0.75" />
          </g>

          <g stroke="#475569" stroke-width="6.5" stroke-linecap="round">
            <line x1="118" y1="102" x2="74" y2="158" />
            <line x1="118" y1="102" x2="162" y2="158" />
            <line x1="118" y1="102" x2="118" y2="160" />
          </g>
          <line x1="86" y1="140" x2="150" y2="140" stroke="#334155" stroke-width="4" stroke-linecap="round" />
          <circle cx="74" cy="158" r="3.2" fill="url(#tsGold)" />
          <circle cx="162" cy="158" r="3.2" fill="url(#tsGold)" />
          <circle cx="118" cy="160" r="3.2" fill="url(#tsGold)" />
          <rect x="114.5" y="96" width="7" height="10" rx="2" fill="#334155" />
          <circle cx="118" cy="96" r="7.5" fill="url(#tsHub)" stroke="#fbbf24" stroke-width="1.2" />
        </svg>

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
      <button v-if="hasKeyword" class="act-btn act-clear" @click="$emit('clear-keyword')">
        <ClearKeywordIcon />
        <span>清除搜索词</span>
      </button>
      <button v-if="hasActiveFilters" class="act-btn act-reset" @click="$emit('reset-filters')">
        <ResetFilterIcon />
        <span>重置筛选条件</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SearchEmpty' })
import ClearKeywordIcon from '@/pages/Landscape/icons/components/search/Search/ClearKeywordIcon.vue'
import ResetFilterIcon from '@/pages/Landscape/icons/components/search/Search/ResetFilterIcon.vue'

defineProps<{
  hasKeyword: boolean
  hasActiveFilters: boolean
}>()

defineEmits<{
  (e: 'clear-keyword'): void
  (e: 'reset-filters'): void
}>()
</script>

<style scoped lang="scss" src="./index.scss" />