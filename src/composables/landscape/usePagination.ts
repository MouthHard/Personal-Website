import { type Ref, type ComputedRef } from 'vue'

export interface UsePaginationOptions {
  pageSize?: number
  initialPage?: number
}

export interface UsePaginationReturn<T> {
  currentPage: Ref<number>
  currentPageSize: Ref<number>
  totalPages: ComputedRef<number>
  paginatedItems: ComputedRef<T[]>
  hasNextPage: ComputedRef<boolean>
  hasPrevPage: ComputedRef<boolean>
  startIndex: ComputedRef<number>
  endIndex: ComputedRef<number>
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  firstPage: () => void
  lastPage: () => void
  setPageSize: (size: number) => void
}
