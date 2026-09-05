<template>
  <div 
    class="optimized-image" 
    :class="{ 
      'is-loaded': isLoaded, 
      'is-error': isError,
      'is-loading': isLoading 
    }"
    :style="containerStyle"
  >
    <div v-if="showPlaceholder && !isLoaded && !isError" class="image-placeholder">
      <div class="shimmer"></div>
    </div>
    
    <img
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />
    
    <div v-if="isError" class="image-error">
      <ImageIcon :stroke-width="1.5" />
      <span v-if="showErrorText">{{ errorText }}</span>
    </div>
    
    <div v-if="isLoaded && showOverlay" class="image-overlay">
      <slot name="overlay"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue'

interface Props {
  src: string
  alt: string
  placeholder?: string
  lazy?: boolean
  progressive?: boolean
  showPlaceholder?: boolean
  showErrorText?: boolean
  errorText?: string
  showOverlay?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  aspectRatio?: string
  width?: string | number
  height?: string | number
  fallbackSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true,
  progressive: false,
  showPlaceholder: true,
  showErrorText: true,
  errorText: '图片加载失败',
  showOverlay: false,
  objectFit: 'cover',
  aspectRatio: '',
  width: '',
  height: '',
  fallbackSrc: ''
})

const emit = defineEmits<{
  (e: 'load'): void
  (e: 'error', error: Error): void
}>()

const isLoaded = ref(false)
const isError = ref(false)
const isLoading = ref(true)
const currentSrc = ref(props.placeholder || props.src)

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio
  }
  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return style
})

const imageStyle = computed(() => ({
  objectFit: props.objectFit
}))

const handleLoad = () => {
  isLoaded.value = true
  isLoading.value = false
  isError.value = false
  emit('load')
}

const handleError = () => {
  if (props.fallbackSrc && currentSrc.value !== props.fallbackSrc) {
    currentSrc.value = props.fallbackSrc
    return
  }
  
  isError.value = true
  isLoading.value = false
  isLoaded.value = false
  emit('error', new Error(`Failed to load image: ${props.src}`))
}

const retry = () => {
  isError.value = false
  isLoading.value = true
  isLoaded.value = false
  currentSrc.value = props.src
}

let preloadImage: HTMLImageElement | null = null

const preloadSrc = (src: string) => {
  if (preloadImage) {
    preloadImage.onload = null
    preloadImage.onerror = null
  }
  if (props.progressive && props.placeholder && props.placeholder !== src) {
    preloadImage = new Image()
    preloadImage.src = src
    preloadImage.onload = () => {
      currentSrc.value = src
    }
    preloadImage.onerror = () => {
      if (props.fallbackSrc) {
        currentSrc.value = props.fallbackSrc
      }
    }
  } else {
    currentSrc.value = src
  }
}

onMounted(() => {
  preloadSrc(props.src)
})

watch(() => props.src, (newSrc) => {
  isLoaded.value = false
  isError.value = false
  isLoading.value = true
  currentSrc.value = props.placeholder || newSrc
  preloadSrc(newSrc)
})

onUnmounted(() => {
  if (preloadImage) {
    preloadImage.onload = null
    preloadImage.onerror = null
    preloadImage = null
  }
})

defineExpose({
  retry,
  isLoaded,
  isError,
  isLoading
})
</script>

<style scoped lang="scss" src="./index.scss" />
