<template>
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <template v-if="type === 'success'">
      <circle
        cx="17.3"
        cy="6.6"
        r="2.1"
        fill="currentColor"
        fill-opacity=".22"
      />
      <path d="M2.4 18.4 L8.4 9.2 L12 14.4 L15 10.4 L21.6 18.4" />
      <path d="M2.4 18.4 H21.6" />
    </template>
    <template v-else-if="type === 'info'">
      <circle cx="12" cy="12" r="8.6" />
      <path
        d="M15.4 8.6 L13.5 13.5 L8.6 15.4 L10.5 10.5 Z"
        fill="currentColor"
        fill-opacity=".18"
      />
      <circle cx="12" cy="12" r="1.05" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="type === 'error'">
      <path
        d="M17 13.6 A3.2 3.2 0 0 0 16.4 7.4 A4.3 4.3 0 0 0 8 8.2 A3 3 0 0 0 7.9 13.6"
      />
      <path d="M12.6 12.4 L10.4 16.2 H12.9 L10.9 19.8" />
    </template>
    <template v-else>
      <circle cx="8.8" cy="8.6" r="2.9" />
      <path
        d="M8.8 2.4 V3.8 M8.8 13.4 V14.8 M2.6 8.6 H4 M13.6 8.6 H15 M4.4 4.2 L5.4 5.2 M12.2 12 L13.2 13"
      />
      <path
        d="M13.4 19.2 A3.2 3.2 0 0 1 13.6 13 A4.2 4.2 0 0 1 21.4 13.8 A2.8 2.8 0 0 1 21.2 19.2 Z"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ name: 'StatusWeatherIcon' });

  defineProps<{
    type: 'success' | 'info' | 'error' | 'warning';
  }>();
</script>
