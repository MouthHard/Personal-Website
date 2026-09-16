<template>
  <div class="museum-page">
    <div v-if="store.error && !$route.params.id" class="page-error-state">
      <h3 class="error-title">数据加载失败</h3>
      <p class="error-message">{{ store.error }}</p>
      <button class="retry-button" @click="retryLoad">重新加载</button>
    </div>
    <template v-else>
      <HeroSection v-if="!$route.params.id" />

      <div v-if="!$route.params.id" class="content-grid">
        <MapSection
          :selected-province="selectedProvince"
          :museums="museums"
          @select="selectProvince"
        />

        <MuseumList
          :museums="museums"
          :selected-province="selectedProvince"
          @reset-province="selectedProvince = ''"
        />
      </div>

      <router-view v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import HeroSection from './components/HeroSection/index.vue';
  import MapSection from './components/MapSection/index.vue';
  import MuseumList from './components/MuseumList/index.vue';
  import { useMuseumDataStore } from '@/stores/museum';

  const store = useMuseumDataStore();
  const selectedProvince = ref('');

  const museums = computed(() => store.museums);

  onMounted(() => {
    store.ensureLoaded();
  });

  const selectProvince = (province: string) => {
    selectedProvince.value = province;
  };

  const retryLoad = () => {
    store.loadAll();
  };
</script>

<style lang="scss" src="./index.scss"></style>
