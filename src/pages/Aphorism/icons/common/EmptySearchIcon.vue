<template>
  <svg class="icon" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="esRodShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#a8865f" />
        <stop offset="0.5" stop-color="#6f5a3e" />
        <stop offset="1" stop-color="#8b7355" />
      </linearGradient>
      <linearGradient id="esPaper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffdf7" />
        <stop offset="1" stop-color="#f6ecd6" />
      </linearGradient>
    </defs>

    <rect x="10" y="30" width="18" height="110" rx="9" fill="url(#esRodShade)" />
    <rect x="172" y="30" width="18" height="110" rx="9" fill="url(#esRodShade)" />
    <circle cx="19" cy="30" r="9" fill="#a8865f" />
    <circle cx="19" cy="140" r="9" fill="#a8865f" />
    <circle cx="181" cy="30" r="9" fill="#a8865f" />
    <circle cx="181" cy="140" r="9" fill="#a8865f" />

    <rect x="26" y="24" width="148" height="122" rx="10" fill="url(#esPaper)" stroke="#c9a97a" stroke-width="3" />

    <line x1="52" y1="58" x2="120" y2="58" stroke="#dcc8a5" stroke-width="5" stroke-linecap="round" stroke-dasharray="11 9" />
    <line x1="52" y1="82" x2="112" y2="82" stroke="#dcc8a5" stroke-width="5" stroke-linecap="round" stroke-dasharray="11 9" />

    <g transform="translate(124 94)">
      <rect width="46" height="46" rx="9" fill="#cd5c5c" />
      <rect x="5" y="5" width="36" height="36" rx="6" fill="none" stroke="#fff" stroke-opacity="0.85" stroke-width="2" />
      <text x="23" y="32" text-anchor="middle" font-size="24" font-weight="bold" fill="#fff"
        font-family="STKaiti, KaiTi, Noto Serif SC, serif">空</text>
    </g>
  </svg>
</template>

<script setup lang="ts">
defineOptions({ name: 'EmptySearchIcon' });
</script>