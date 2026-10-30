<template>
  <div class="search-page">
    <div class="chart-table">
      <div class="chart-surface">
        <i class="grid-line v-1"></i>
        <i class="grid-line v-2"></i>
        <i class="grid-line h-1"></i>
        <i class="grid-line h-2"></i>
        <span class="chart-star s-1"></span>
        <span class="chart-star s-2"></span>
        <span class="chart-star s-3"></span>
        <span class="chart-star s-4"></span>
        <span class="chart-star s-5"></span>
        <div class="compass-rose" aria-hidden="true">
          <i class="rose-n"></i>
          <i class="rose-e"></i>
          <i class="rose-s"></i>
          <i class="rose-w"></i>
        </div>
      </div>

      <div class="search-box-wrapper">
        <SearchBox />
      </div>

      <div class="filter-bar">
        <div class="filter-group type-group">
          <div class="group-label">
            <span class="label-en">MARKS</span>
            <span class="label-cn">类型</span>
          </div>
          <div class="pin-field">
            <button v-for="type in typeFilters" :key="type.value" class="flag-pin"
              :class="[{ active: selectedType === type.value }, `t-${type.value}`]" @click="handleTypeChange(type.value)">

              <span class="pin-flag">
                <span class="flag-icon">
                  <TypeImageIcon v-if="type.value === 'image'" />
                  <TypeVideoIcon v-else-if="type.value === 'video'" />
                  <TypeGuideIcon v-else-if="type.value === 'guide'" />
                  <TypePhotographerIcon v-else />
                </span>
                <span class="flag-label">{{ type.label }}</span>
                <span v-if="type.value !== 'all'" class="flag-count">{{ getTypeCount(type.value) }}</span>
              </span>
            </button>
          </div>
        </div>


        <div class="filter-group sort-group">
          <div class="group-label">
            <span class="label-en">SCALE</span>
            <span class="label-cn">排序</span>
          </div>
          <div class="scale-bar">
            <span class="orb-shuttle" :style="orbStyle"></span>
            <button v-for="sort in currentSortOptions" :key="sort.value" class="scale-mark"
              :class="{ active: selectedSort === sort.value }" @click="handleSortChange(sort.value)">
              <span class="mark-label">{{ sort.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="filteredResults.length > 0" class="result-grid" :class="`cols-${gridColumns}`">
      <SearchResultCard v-for="item in filteredResults" :key="item.id" :item="item" :sort-mode="selectedSort"
        @like="handleLike" @bookmark="handleBookmark" @share="handleShare" @love="handleLove" @follow="handleFollow" />
    </div>

    <SearchEmpty
      v-else
      :has-keyword="hasKeyword"
      :has-active-filters="hasActiveFilters"
      @clear-keyword="clearKeyword"
      @reset-filters="resetFilters"
    />
  </div>

  <ShareMenu v-model:visible="showShareMenu" :work="shareWork" />
</template>

<script setup lang="ts">
defineOptions({ name: 'Search' });
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchResultCard from './components/SearchResultCard/index.vue'
import SearchBox from './components/SearchBox/index.vue'
import SearchEmpty from './components/SearchEmpty/index.vue'
import TypeImageIcon from '@/pages/Landscape/icons/components/search/Search/TypeImageIcon.vue'
import TypeVideoIcon from '@/pages/Landscape/icons/components/search/Search/TypeVideoIcon.vue'
import TypeGuideIcon from '@/pages/Landscape/icons/components/search/Search/TypeGuideIcon.vue'
import TypePhotographerIcon from '@/pages/Landscape/icons/components/search/Search/TypePhotographerIcon.vue'
import { useSearchViewData } from '@/composables/landscape'
import { useInteractionStore } from '@/stores/landscape'
import { useSearchHistory } from '@/composables/landscape/useSearchHistory'

import { typeFilters, SearchPhotographerSortOptions, SearchContentSortOptions } from '@/constants/landscape'
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
import ShareMenu from '../common/ShareMenu/index.vue'

const route = useRoute()
const router = useRouter()
const interactionStore = useInteractionStore()
()
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

const orbStyle = computed(() => {
  const total: number = currentSortOptions.value.length
  if (total === 0) return { display: 'none' }
  const idx: number = currentSortOptions.value.findIndex(o => o.value === selectedSort.value)
  const index = idx >= 0 ? idx : 0
  return {
    width: `calc((100% - 12px) / ${total})`,
    transform: `translateX(${index * 100}%)`,
  }
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

  const interactionItem = createSimpleInteractionItem(id, item.type, item.title, {
    image: item.thumbnail,
    location: item.location,
    author: item.author || item.name,
    authorId: (item as any).authorId,
    authorAvatar: item.authorAvatar || (item as any).avatar,
  })
  const isLiked = interactionStore.toggleLike(interactionItem)
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
    location: item.location,
    author: item.author || item.name,
    authorId: (item as any).authorId,
    authorAvatar: item.authorAvatar || (item as any).avatar,
  })

  const isFavorited = interactionStore.toggleFavorite(interactionItem)
  if (isFavorited) {
    showMessage.favorite.success(item.title, item.type)
  } else {
    showMessage.favorite.cancel(item.title, item.type)
  }
}

const showShareMenu = ref(false)
const currentShareItem = ref<SearchResultItem | null>(null)
const shareWork = computed(() => {
  const item = currentShareItem.value
  if (!item) return {}
  const type = item.type === 'video' ? ('video' as const) : item.type === 'guide' ? ('guide' as const) : ('image' as const)
  return {
    type,
    title: item.title,
    cover: item.thumbnail,
    location: item.location,
    author: item.author || item.name,
  }
})

const handleShare = (id: string) => {
  const item = getItemById(id)
  if (!item) return
  currentShareItem.value = item
  showShareMenu.value = true
}

const handleLove = (id: string) => {
  const item = getItemById(id)
  if (!item) return

  const interactionItem = createSimpleInteractionItem(id, item.type, item.title, {
    image: item.thumbnail,
    location: item.location,
    author: item.author || item.name,
    authorId: (item as any).authorId,
    authorAvatar: item.authorAvatar || (item as any).avatar,
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
    showMessage.follow.success(item.name || item.title)
  } else if (wasFollowing && !isAdded) {
    showMessage.follow.cancel(item.name || item.title)
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

const hasKeyword = computed(() => !!searchKeyword.value)
const hasActiveFilters = computed(() => {
  return selectedType.value !== 'image' || selectedSort.value !== 'relevance'
})

const clearKeyword = () => {
  const query: Record<string, string> = {}
  if (selectedType.value !== 'all') query.type = selectedType.value
  if (selectedSort.value !== 'relevance') query.sort = selectedSort.value
  router.replace({ path: '/landscape/search', query })
}

const resetFilters = () => {
  const query: Record<string, string> = {}
  if (searchKeyword.value) query.q = searchKeyword.value
  router.replace({ path: '/landscape/search', query })
}

let registerTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedRegister = (results: SearchResultItem[]) => {
  if (registerTimer) clearTimeout(registerTimer)
  registerTimer = setTimeout(() => {
    interactionStore.registerBatch(
      results.map((item: SearchResultItem) => ({
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
