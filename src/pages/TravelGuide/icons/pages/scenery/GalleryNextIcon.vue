<script setup lang="ts">
  defineProps<{
    size?: number | string;
  }>();
</script>

<template>
  <svg
    :width="size ?? 36"
    :height="size ?? 36"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 朝右纸飞机 = 朝左纸飞机旋转 180 度 -->
    <g transform="rotate(180 16 16)">
      <!-- 飞行拖尾（右侧，表示向左飞行的尾迹） -->
      <line x1="28" y1="16" x2="30.5" y2="16" stroke="currentColor" stroke-width="1.6" opacity="0.35" stroke-linecap="round" />
      <line x1="28" y1="13.5" x2="29.8" y2="13.5" stroke="currentColor" stroke-width="0.9" opacity="0.22" stroke-linecap="round" />
      <line x1="28" y1="18.5" x2="29.8" y2="18.5" stroke="currentColor" stroke-width="0.9" opacity="0.22" stroke-linecap="round" />

      <!-- 上翼面（亮，折纸主面） -->
      <path d="M3 16 L27 9 L20 16 Z" fill="currentColor" opacity="0.95" />
      <!-- 下翼面（亮，折纸主面） -->
      <path d="M3 16 L27 23 L20 16 Z" fill="currentColor" opacity="0.95" />
      <!-- 后翼折叠面（暗，表现纸飞机尾部折叠） -->
      <path d="M20 16 L27 9 L27 23 Z" fill="currentColor" opacity="0.38" />

      <!-- 中线折痕（机头到机尾中点） -->
      <line x1="3.5" y1="16" x2="20" y2="16" stroke="currentColor" stroke-width="0.5" opacity="0.55" stroke-linecap="round" />

      <!-- 上翼内侧高光（表现折纸棱线） -->
      <path d="M5 15.5 L20 15.5" stroke="currentColor" stroke-width="0.35" opacity="0.3" stroke-linecap="round" />
      <!-- 下翼内侧暗线 -->
      <path d="M5 16.5 L20 16.5" stroke="currentColor" stroke-width="0.35" opacity="0.25" stroke-linecap="round" />

      <!-- 机头高光点 -->
      <circle cx="4" cy="16" r="0.7" fill="currentColor" opacity="0.75" />
    </g>
  </svg>
</template>
