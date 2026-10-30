<template>
  <svg class="icon" viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="ecFrame" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffdf7" />
        <stop offset="1" stop-color="#f5ebd5" />
      </linearGradient>
      <linearGradient id="ecBookA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e0c096" />
        <stop offset="1" stop-color="#c9a373" />
      </linearGradient>
      <linearGradient id="ecBookB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#efd8b4" />
        <stop offset="1" stop-color="#dcbb8e" />
      </linearGradient>
    </defs>

    <rect x="28" y="18" width="144" height="134" rx="12" fill="url(#ecFrame)" stroke="#c9a97a" stroke-width="3" />
    <rect x="36" y="26" width="128" height="118" rx="8" fill="none" stroke="#e4d3b3" stroke-width="1.5" />

    <line x1="36" y1="88" x2="164" y2="88" stroke="#c9a97a" stroke-width="3" />

    <rect x="48" y="46" width="17" height="42" rx="4" fill="url(#ecBookA)" stroke="#b87333" stroke-width="2" />
    <rect x="68" y="50" width="17" height="38" rx="4" fill="url(#ecBookB)" stroke="#b87333" stroke-width="2" />
    <rect x="110" y="46" width="36" height="42" rx="6" fill="none" stroke="#d2a184" stroke-width="2" stroke-dasharray="7 6" />

    <rect x="48" y="100" width="44" height="40" rx="6" fill="none" stroke="#d2a184" stroke-width="2" stroke-dasharray="7 6" />
    <rect x="106" y="106" width="17" height="34" rx="4" fill="url(#ecBookA)" stroke="#b87333" stroke-width="2" />
    <rect x="128" y="110" width="17" height="30" rx="4" fill="url(#ecBookB)" stroke="#b87333" stroke-width="2" />
  </svg>
</template>

<script setup lang="ts">
defineOptions({ name: 'EmptyCategoryIcon' });
</script>