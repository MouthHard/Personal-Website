<template>
  <div class="search-page">
    <div class="search-box-wrapper">
      <SearchBox />
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <label>类型：</label>
        <div class="filter-options">
          <button v-for="type in typeFilters" :key="type.value" class="filter-option"
            :class="{ active: selectedType === type.value }" @click="handleTypeChange(type.value)">
            <span class="option-icon">{{ type.icon }}</span>
            <span class="option-label">{{ type.label }}</span>
            <span v-if="type.value !== 'all'" class="option-count">{{ getTypeCount(type.value) }}</span>
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label>排序：</label>
        <div class="filter-options">
          <button v-for="sort in currentSortOptions" :key="sort.value" class="filter-option"
            :class="{ active: selectedSort === sort.value }" @click="handleSortChange(sort.value)">
            {{ sort.label }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="searchKeyword" class="result-stats">
      <p>
        找到 <span class="count">{{ filteredResults.length }}</span> 个与 "<span class="keyword">{{ searchKeyword }}</span>"
        相关的结果
      </p>
    </div>

    <div v-if="filteredResults.length > 0" class="result-grid" :class="`cols-${gridColumns}`">
      <SearchResultCard v-for="item in filteredResults" :key="item.id" :item="item" :sort-mode="selectedSort"
        @like="handleLike" @bookmark="handleBookmark" @share="handleShare" @love="handleLove" @follow="handleFollow" />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>未找到相关结果</h3>
      <p>试试其他关键词或筛选条件</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Search' });
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchResultCard from './components/SearchResultCard/index.vue'
import SearchBox from './components/SearchBox/index.vue'
import { useSearchViewData } from '@/composables/landscape'
import { useInteractionStore } from '@/stores/landscape'
import { useSearchHistory } from '@/composables/landscape/useSearchHistory'

import { typeFilters, SearchPhotographerSortOptions, SearchContentSortOptions } from '@/utils/landscape/constants'
import {
  convertImageToSearchResult,
  convertVideoToSearchResult,
  convertGuideToSearchResult,
  convertPhotographerToSearchResult,
  sanitizeKeyword,
  sortSearchResults,
  filterSearchResults,
  showMessage,
  createSimpleInteractionItem,
} from '@/utils/landscape'
import type { SearchResultItem } from '@/utils/landscape'

const route = useRoute()
const router = useRouter()
const interactionStore = useInteractionStore()
const { addHistory } = useSearchHistory()


const searchKeyword = computed(() => {
  const q = route.query.q
  const raw = q ? (Array.isArray(q) ? q[0] || '' : q || '') : ''
  return sanitizeKeyword(raw)
})

const selectedType = computed(() => {
  const type = route.query.type
  return type ? (Array.isArray(type) ? type[0] || 'image' : type || 'image') : 'image'
})

const selectedSort = computed(() => {
  const sort = route.query.sort
  return sort ? (Array.isArray(sort) ? sort[0] || 'relevance' : sort || 'relevance') : 'relevance'
})

const gridColumns = ref(3)

const photographerSortOptions = SearchPhotographerSortOptions
const contentSortOptions = SearchContentSortOptions

const currentSortOptions = computed(() => {
  return selectedType.value === 'photographer' ? photographerSortOptions : contentSortOptions
})

const { searchImages, searchVideos, searchGuides, searchPhotographers } = useSearchViewData()

const mockSearchResults = computed<SearchResultItem[]>(() => {
  const keyword = searchKeyword.value || ''
  const images = searchImages(keyword).map(convertImageToSearchResult)
  const videos = searchVideos(keyword).map(convertVideoToSearchResult)
  const guides = searchGuides(keyword).map(convertGuideToSearchResult)
  const photographers = searchPhotographers(keyword).map(convertPhotographerToSearchResult)

  return [...images, ...videos, ...guides, ...photographers]
})

const typeCounts = computed(() => {
  const counts: Record<string, number> = { all: mockSearchResults.value.length }
  for (const item of mockSearchResults.value) {
    counts[item.type] = (counts[item.type] || 0) + 1
  }
  return counts
})

const getTypeCount = (type: string) => typeCounts.value[type] || 0

const filteredResults = computed(() => {
  let results = filterSearchResults(mockSearchResults.value, searchKeyword.value, selectedType.value)
  return sortSearchResults(results, selectedSort.value)
})

const hasGuideCards = computed(() => {
  return filteredResults.value.some(item => item.type === 'guide')
})

const getItemById = (id: string): SearchResultItem | undefined => {
  return mockSearchResults.value.find(item => String(item.id) === id)
}

const handleLike = (id: string) => {
  const item = getItemById(id)
  if (!item) return

  const isLiked = interactionStore.toggleLike(id)
  if (isLiked) {
    showMessage.like.success(item.title)
  } else {
    showMessage.like.cancel()
  }
}

const handleBookmark = (id: string) => {
  const item = getItemById(id)
  if (!item) return

  const interactionItem = createSimpleInteractionItem(id, item.type, item.title, {
    image: item.thumbnail,
    location: (item as any).location,
    author: (item as any).author || (item as any).name,
    authorId: (item as any).authorId,
    authorAvatar: (item as any).authorAvatar || (item as any).avatar,
  })

  const isFavorited = interactionStore.toggleFavorite(interactionItem)
  if (isFavorited) {
    showMessage.favorite.success(item.title, item.type)
  } else {
    showMessage.favorite.cancel(item.title, item.type)
  }
}

const handleShare = (id: string) => {
  const item = getItemById(id)
  if (!item) return


  showMessage.share.success(item.title)
}

const handleLove = (id: string) => {
  const item = getItemById(id)
  if (!item) return

  const interactionItem = createSimpleInteractionItem(id, item.type, item.title, {
    image: item.thumbnail,
    location: (item as any).location,
    author: (item as any).author || (item as any).name,
    authorId: (item as any).authorId,
    authorAvatar: (item as any).authorAvatar || (item as any).avatar,
  })

  const isLoved = interactionStore.toggleLove(interactionItem)
  if (isLoved) {
    showMessage.love.success(item.title, item.type)
  } else {
    showMessage.love.cancel(item.title, item.type)
  }
}

const handleFollow = (id: string) => {
  const item = getItemById(id)
  if (!item || item.type !== 'photographer') return

  const wasFollowing = interactionStore.isFollowing(id)
  const isAdded = interactionStore.toggleFollowPhotographer(id)
  if (!wasFollowing && isAdded) {
    showMessage.follow.success((item as any).name || item.title)
  } else if (wasFollowing && !isAdded) {
    showMessage.follow.cancel((item as any).name || item.title)
  }
}

const updateGridColumns = () => {
  const width = window.innerWidth
  const isGuide = hasGuideCards.value

  if (isGuide) {
    if (width >= 900) gridColumns.value = 2
    else gridColumns.value = 1
  } else {
    if (width >= 1200) gridColumns.value = 3
    else if (width >= 800) gridColumns.value = 2
    else gridColumns.value = 1
  }
}

const buildQuery = (overrides: { type?: string; sort?: string } = {}) => {
  const query: Record<string, string> = {}
  if (searchKeyword.value) query.q = searchKeyword.value
  const t = overrides.type !== undefined ? overrides.type : selectedType.value
  const s = overrides.sort !== undefined ? overrides.sort : selectedSort.value
  if (t !== 'all') query.type = t
  if (s !== 'relevance') query.sort = s
  return query
}

const handleTypeChange = (type: string) => {
  if (searchKeyword.value) {
    addHistory(searchKeyword.value)
  }
  router.replace({ path: '/landscape/search', query: buildQuery({ type }) })
}

const handleSortChange = (sort: string) => {
  if (searchKeyword.value) {
    addHistory(searchKeyword.value)
  }
  router.replace({ path: '/landscape/search', query: buildQuery({ sort }) })
}

let registerTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedRegister = (results: any[]) => {
  if (registerTimer) clearTimeout(registerTimer)
  registerTimer = setTimeout(() => {
    interactionStore.registerBatch(
      results.map((item: any) => ({
        id: String(item.id),
        counts: {
          likes: item.likes || 0,
          loves: item.loves || 0,
          views: item.views || 0,
          favorites: item.bookmarks || 0,
          shares: item.shares || 0,
        },
      }))
    )
    registerTimer = null
  }, 200)
}


watch(mockSearchResults, (results) => {
  if (results.length > 0) {
    debouncedRegister(results)
  }
}, { immediate: true })

watch(hasGuideCards, () => {
  updateGridColumns()
})

onMounted(() => {
  updateGridColumns()
  window.addEventListener('resize', updateGridColumns)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateGridColumns)
  if (registerTimer) clearTimeout(registerTimer)
})
</script>

<style scoped lang="scss" src="./index.scss" />
