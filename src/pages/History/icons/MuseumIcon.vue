<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    class="museum-icon"
  >
    <!-- 博物馆建筑 -->
    <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
    <!-- 博物馆门 -->
    <rect x="10" y="10" width="4" height="10" />
    <!-- 博物馆窗户 -->
    <rect x="5" y="6" width="3" height="3" />
    <rect x="16" y="6" width="3" height="3" />
    <rect x="5" y="13" width="3" height="3" />
    <rect x="16" y="13" width="3" height="3" />
    <!-- 博物馆屋顶 -->
    <path d="M3 4L12 1L21 4" />
    <!-- 博物馆旗帜 -->
    <path d="M12 1V-2" />
    <path d="M10 -2L14 -2L12 -5Z" />
  </svg>
</template>

<script setup lang="ts">
// 博物馆推荐图标组件
</script>

<style scoped>
.museum-icon {
  transition: all 0.3s ease;
}

.museum-icon:hover {
  transform: scale(1.1);
}
</style>