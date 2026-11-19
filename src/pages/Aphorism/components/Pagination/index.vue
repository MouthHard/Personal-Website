<template>
  <div class="pagination">
    <button
      type="button"
      class="pagination-button"
      :disabled="currentPage === 1"
      title="上一页"
      @click="goToPage(currentPage - 1)"
    >
      <BackArrowIcon class="button-icon" />
      <span class="button-text">上一页</span>
    </button>

    <div class="pagination-pages">
      <button
        v-for="(page, index) in visiblePages"
        :key="`${page}-${index}`"
        type="button"
        class="page-button"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <button
      type="button"
      class="pagination-button"
      :disabled="currentPage === totalPages"
      title="下一页"
      @click="goToPage(currentPage + 1)"
    >
      <span class="button-text">下一页</span>
      <NextArrowIcon class="button-icon" />
    </button>

    <!-- 每页条数选择器 -->
    <div class="page-size-selector">
      <span class="page-size-label">每页</span>
      <div class="page-size-dropdown" :class="{ open: isDropdownOpen }">
        <button type="button" class="page-size-trigger" @click="toggleDropdown">
          <span class="page-size-value">{{ pageSize }}</span>
          <span class="page-size-arrow">▾</span>
        </button>
        <div v-if="isDropdownOpen" class="page-size-options">
          <button
            v-for="size in pageSizeOptions"
            :key="size"
            type="button"
            class="page-size-option"
            :class="{ active: size === pageSize }"
            @click="selectPageSize(size)"
          >
            {{ size }}
          </button>
        </div>
      </div>
      <span class="page-size-label">条</span>
    </div>

    <div class="pagination-info">
      <span class="info-text">第 {{ currentPage }} / {{ totalPages }} 页</span>
      <span class="info-divider">|</span>
      <span class="info-text">共 {{ totalItems }} 条</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import BackArrowIcon from '../../icons/common/BackArrowIcon.vue';
  import NextArrowIcon from '../../icons/common/NextArrowIcon.vue';
  import { PAGE_SIZE_OPTIONS } from '@/utils/aphorism/constants';
  import './index.scss';

  const props = defineProps<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    maxVisiblePages?: number;
    pageSize?: number;
  }>();

  const emit = defineEmits<{
    (e: 'page-change', page: number): void;
    (e: 'page-size-change', size: number): void;
  }>();

  const pageSizeOptions = PAGE_SIZE_OPTIONS;
  const isDropdownOpen = ref(false);

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const selectPageSize = (size: number) => {
    isDropdownOpen.value = false;
    if (size !== props.pageSize) {
      emit('page-size-change', size);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.page-size-dropdown')) {
      isDropdownOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const maxVisiblePages = computed(() => props.maxVisiblePages || 7);

  const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const current = props.currentPage;
    const total = props.totalPages;
    const max = maxVisiblePages.value;

    if (total <= max) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(max / 2);

      if (current <= half + 1) {
        for (let i = 1; i <= max - 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - half) {
        pages.push(1);
        pages.push('...');
        for (let i = total - max + 3; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        const start = current - Math.floor((max - 4) / 2);
        const end = current + Math.ceil((max - 4) / 2);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  });

  const goToPage = (page: number | string) => {
    if (typeof page === 'number' && page !== props.currentPage) {
      emit('page-change', page);
    }
  };
</script>
