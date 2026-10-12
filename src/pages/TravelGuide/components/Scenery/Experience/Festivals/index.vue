<template>
  <div class="experience-festivals">
    <CulturalFestivals :festivals="festivals" :province-id="provinceId" />
  </div>
</template>

<script setup lang="ts">
  import CulturalFestivals from './CulturalFestivals/index.vue';

  defineProps<{
    festivals: any[];
    provinceId: string;
  }>();
</script>

<style scoped src="./index.scss" lang="scss" />
