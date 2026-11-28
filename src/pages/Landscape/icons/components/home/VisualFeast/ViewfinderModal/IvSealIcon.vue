<template>
  <svg viewBox="0 0 60 60" class="iv-seal-svg">
    <defs>
      <filter id="SealRough" x="-6%" y="-6%" width="112%" height="112%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
      </filter>
    </defs>
    <g filter="url(#SealRough)">
      <circle
        cx="30"
        cy="30"
        r="26"
        fill="none"
        stroke="#a02828"
        stroke-width="1.6"
        opacity="0.45"
        stroke-dasharray="58 6 40 5 36 4"
      />
      <circle
        cx="30"
        cy="30"
        r="22"
        fill="none"
        stroke="#a02828"
        stroke-width="0.8"
        opacity="0.3"
        stroke-dasharray="50 5 38 4"
      />
      <path
        d="M30 15 L31.8 20 L36.5 19 L32.8 22.5 L34.8 27 L30 24.5 L25.2 27 L27.2 22.5 L23.5 19 L28.2 20 Z"
        fill="#a02828"
        opacity="0.4"
      />
      <text
        x="30"
        y="36"
        text-anchor="middle"
        font-size="7"
        font-weight="700"
        fill="#a02828"
        opacity="0.5"
        letter-spacing="0.8"
      >
        APPROVED
      </text>
      <text
        x="30"
        y="43"
        text-anchor="middle"
        font-size="6"
        fill="#a02828"
        opacity="0.38"
        letter-spacing="0.5"
      >
        签 发
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ name: 'IvSealIcon' });
</script>
