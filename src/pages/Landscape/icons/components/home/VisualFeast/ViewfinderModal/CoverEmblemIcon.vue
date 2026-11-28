<template>
  <svg viewBox="0 0 60 60" class="emblem-svg">
    <!-- 外圈双线 -->
    <circle
      cx="30"
      cy="30"
      r="28"
      fill="none"
      stroke="#d4a84b"
      stroke-width="1.3"
    />
    <circle
      cx="30"
      cy="30"
      r="25"
      fill="none"
      stroke="#d4a84b"
      stroke-width="0.5"
      opacity="0.7"
    />
    <!-- 左麦穗秆 -->
    <path
      d="M30 48 Q23 40 18 24"
      fill="none"
      stroke="#d4a84b"
      stroke-width="0.8"
      opacity="0.85"
    />
    <!-- 左麦粒 -->
    <g fill="#d4a84b" opacity="0.85">
      <ellipse
        cx="25"
        cy="42"
        rx="1.1"
        ry="2.2"
        transform="rotate(-25 25 42)"
      />
      <ellipse
        cx="22"
        cy="36"
        rx="1.1"
        ry="2.2"
        transform="rotate(-35 22 36)"
      />
      <ellipse
        cx="19"
        cy="30"
        rx="1.1"
        ry="2.2"
        transform="rotate(-45 19 30)"
      />
      <ellipse
        cx="18"
        cy="25"
        rx="1.1"
        ry="2.2"
        transform="rotate(-55 18 25)"
      />
    </g>
    <!-- 左麦芒 -->
    <g stroke="#d4a84b" stroke-width="0.4" opacity="0.5" fill="none">
      <path d="M25 42 L23 38" />
      <path d="M22 36 L20 32" />
      <path d="M19 30 L17 26" />
    </g>
    <!-- 右麦穗秆 -->
    <path
      d="M30 48 Q37 40 42 24"
      fill="none"
      stroke="#d4a84b"
      stroke-width="0.8"
      opacity="0.85"
    />
    <!-- 右麦粒 -->
    <g fill="#d4a84b" opacity="0.85">
      <ellipse cx="35" cy="42" rx="1.1" ry="2.2" transform="rotate(25 35 42)" />
      <ellipse cx="38" cy="36" rx="1.1" ry="2.2" transform="rotate(35 38 36)" />
      <ellipse cx="41" cy="30" rx="1.1" ry="2.2" transform="rotate(45 41 30)" />
      <ellipse cx="42" cy="25" rx="1.1" ry="2.2" transform="rotate(55 42 25)" />
    </g>
    <!-- 右麦芒 -->
    <g stroke="#d4a84b" stroke-width="0.4" opacity="0.5" fill="none">
      <path d="M35 42 L37 38" />
      <path d="M38 36 L40 32" />
      <path d="M41 30 L43 26" />
    </g>
    <!-- 中心五角星 -->
    <path
      d="M30 14 L32.2 21 L39.5 21 L33.6 25.5 L35.8 32.5 L30 28 L24.2 32.5 L26.4 25.5 L20.5 21 L27.8 21 Z"
      fill="#d4a84b"
      opacity="0.95"
    />
    <!-- 底部绶带 -->
    <path
      d="M16 47 Q30 53 44 47 L44 49 Q30 55 16 49 Z"
      fill="#d4a84b"
      opacity="0.25"
    />
    <path
      d="M16 47 Q30 53 44 47"
      fill="none"
      stroke="#d4a84b"
      stroke-width="0.8"
      opacity="0.7"
    />
    <path
      d="M16 49 Q30 55 44 49"
      fill="none"
      stroke="#d4a84b"
      stroke-width="0.6"
      opacity="0.5"
    />
    <!-- 中心圆点 -->
    <circle cx="30" cy="30" r="1.8" fill="#d4a84b" opacity="0.6" />
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ name: 'CoverEmblemIcon' });
</script>
