<template>
  <!-- 博物馆介绍 -->
  <MuseumIntroSection :museum="museum" />

  <!-- 最新展览 -->
  <ExhibitionsSection :museum="museum" @update:active-tab="(tab) => emit('update:activeTab', tab)" />

  <!-- 文物精选 -->
  <ArtifactsSection :museum="museum" @update:active-tab="(tab) => emit('update:activeTab', tab)" />

  <!-- 活动预告 -->
  <ActivitiesSection :museum="museum" @update:active-tab="(tab) => emit('update:activeTab', tab)" />

  <!-- 博物馆新闻 -->
  <NewsSection :museum="museum" />

  <!-- 沉浸式体验 -->
  <ImmersiveSection :museum="museum" @update:active-tab="(tab) => emit('update:activeTab', tab)" />
</template>

<script setup lang="ts">
  import type { Museum } from '@/typesOfPages/museum';
  import MuseumIntroSection from './components/MuseumIntroSection/index.vue';
  import ExhibitionsSection from './components/ExhibitionsSection/index.vue';
  import ArtifactsSection from './components/ArtifactsSection/index.vue';
  import ActivitiesSection from './components/ActivitiesSection/index.vue';
  import NewsSection from './components/NewsSection/index.vue';
  import ImmersiveSection from './components/ImmersiveSection/index.vue';

  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{ 'update:activeTab': [tab: string] }>();
</script>

<style lang="scss" scoped></style>
