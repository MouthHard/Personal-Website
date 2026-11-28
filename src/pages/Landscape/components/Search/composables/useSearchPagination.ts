import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type Ref,
} from 'vue';

/** 搜索结果每页可选数量 */
export const SEARCH_PAGE_SIZE_OPTIONS = [6, 9, 12, 24, 36];

type PageItem = number | 'gap';

/** 模板中已声明的 ref 可传入复用，缺省由 composable 自行创建 */
export interface SearchPaginationRefs {
  sizeMenuRef?: Ref<HTMLElement | null>;
  sizeTriggerRef?: Ref<HTMLButtonElement | null>;
}

/**
 * 搜索结果分页：页码、每页数量菜单、翻页后的滚动定位。
 * 输入源变化由调用方通过 resetPage 在合适的时机重置页码。
 */
export function useSearchPagination<T>(
  results: Ref<T[]>,
  getScrollTarget: () => HTMLElement | null = () => null,
  refs: SearchPaginationRefs = {},
) {
  const pageSize = ref(SEARCH_PAGE_SIZE_OPTIONS[0]);
  const currentPage = ref(1);
  const sizeMenuOpen = ref(false);
  const sizeMenuRef = refs.sizeMenuRef ?? ref<HTMLElement | null>(null);
  const sizeTriggerRef =
    refs.sizeTriggerRef ?? ref<HTMLButtonElement | null>(null);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(results.value.length / pageSize.value)),
  );

  const paginatedResults = computed(() => {
    const page = Math.min(currentPage.value, totalPages.value);
    const start = (page - 1) * pageSize.value;
    return results.value.slice(start, start + pageSize.value);
  });

  const padPage = (value: number) => String(value).padStart(2, '0');

  const pageItems = computed<PageItem[]>(() => {
    const total = totalPages.value;
    const current = Math.min(currentPage.value, total);

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const items: PageItem[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) items.push('gap');
    for (let page = start; page <= end; page += 1) {
      items.push(page);
    }
    if (end < total - 1) items.push('gap');

    items.push(total);

    return items;
  });

  const goToPage = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages.value);
    if (target === currentPage.value) return;

    currentPage.value = target;
    nextTick(() => {
      getScrollTarget()?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const resetPage = () => {
    currentPage.value = 1;
  };

  const toggleSizeMenu = () => {
    sizeMenuOpen.value = !sizeMenuOpen.value;
  };

  const closeSizeMenu = (restoreFocus = false) => {
    if (!sizeMenuOpen.value) return;

    sizeMenuOpen.value = false;
    if (restoreFocus) {
      nextTick(() => sizeTriggerRef.value?.focus());
    }
  };

  const selectPageSize = (size: number) => {
    pageSize.value = size;
    closeSizeMenu(true);
  };

  const handleDocumentPointerDown = (event: PointerEvent) => {
    if (!sizeMenuOpen.value) return;

    const root = sizeMenuRef.value;
    if (root && !root.contains(event.target as Node)) {
      sizeMenuOpen.value = false;
    }
  };

  const handleDocumentKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeSizeMenu(true);
    }
  };

  watch(totalPages, (total) => {
    if (currentPage.value > total) {
      currentPage.value = total;
    }
  });

  onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleDocumentKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    document.removeEventListener('keydown', handleDocumentKeydown);
  });

  return {
    pageSizeOptions: SEARCH_PAGE_SIZE_OPTIONS,
    pageSize,
    currentPage,
    totalPages,
    paginatedResults,
    pageItems,
    padPage,
    resetPage,
    goToPage,
    sizeMenuOpen,
    sizeMenuRef,
    sizeTriggerRef,
    toggleSizeMenu,
    closeSizeMenu,
    selectPageSize,
  };
}
