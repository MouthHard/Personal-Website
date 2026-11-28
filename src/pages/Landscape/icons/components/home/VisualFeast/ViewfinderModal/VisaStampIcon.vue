<template>
  <svg viewBox="0 0 100 100" class="visa-stamp">
    <defs>
      <filter id="StampRough" x="-6%" y="-6%" width="112%" height="112%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
    </defs>
    <g filter="url(#StampRough)">
      <!-- 外圈主印（缺墨断续） -->
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="#9b5fc8"
        stroke-width="2"
        opacity="0.88"
        stroke-dasharray="62 7 42 6 50 9 36 5"
      />
      <!-- 外圈副印（偏移双印） -->
      <circle
        cx="51.5"
        cy="49"
        r="46"
        fill="none"
        stroke="#9b5fc8"
        stroke-width="1.4"
        opacity="0.38"
        stroke-dasharray="50 12 45 8 40 6"
      />
      <!-- 内圈 -->
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="#9b5fc8"
        stroke-width="1"
        opacity="0.72"
        stroke-dasharray="72 6 50 8 40 5"
      />
      <!-- 顶部弧线 -->
      <path
        d="M50 14 A36 36 0 0 1 86 50"
        fill="none"
        stroke="#9b5fc8"
        stroke-width="0.8"
        opacity="0.62"
        stroke-dasharray="22 4 16 3"
      />
      <!-- 中心星 -->
      <path
        d="M50 30 L52 34 L56 32 L53 36 L57 38 L52 37 L50 41 L48 37 L43 38 L47 36 L44 32 L48 34 Z"
        fill="#9b5fc8"
        opacity="0.8"
      />
      <!-- 文字主印 -->
      <text
        x="50"
        y="40"
        text-anchor="middle"
        font-size="11"
        font-weight="700"
        fill="#9b5fc8"
        opacity="0.92"
        letter-spacing="1"
      >
        VISA
      </text>
      <text
        x="50"
        y="54"
        text-anchor="middle"
        font-size="9"
        font-weight="700"
        fill="#9b5fc8"
        opacity="0.88"
        letter-spacing="0.5"
      >
        CHINA
      </text>
      <text
        x="50"
        y="68"
        text-anchor="middle"
        font-size="8"
        fill="#9b5fc8"
        opacity="0.78"
      >
        2026
      </text>
      <!-- 文字副印（偏移） -->
      <text
        x="51.5"
        y="41"
        text-anchor="middle"
        font-size="11"
        font-weight="700"
        fill="#9b5fc8"
        opacity="0.32"
        letter-spacing="1"
      >
        VISA
      </text>
      <text
        x="51.5"
        y="55"
        text-anchor="middle"
        font-size="9"
        font-weight="700"
        fill="#9b5fc8"
        opacity="0.28"
        letter-spacing="0.5"
      >
        CHINA
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ name: 'VisaStampIcon' });
</script>
