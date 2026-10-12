<template>
  <section v-if="foodMapLocations && foodMapLocations.length > 0" class="shops-section">
    <div class="ambient-glow"></div>

    <header class="section-header">
      <div class="header-left">
        <div class="header-icon-wrap">
          <LocationIcon class="header-icon" />
        </div>
        <div class="header-titles">
          <h2 class="header-title">名店寻味</h2>
          <p class="header-subtitle">老字号与必去餐厅 · 在哪里能吃到</p>
        </div>
      </div>
      <div class="header-controls">
        <div class="search-box">
          <SearchIcon class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索餐厅或地点..."
            class="search-input"
            :class="{ 'has-content': searchQuery.length > 0 }"
          />
          <button
            v-if="searchQuery.length > 0"
            class="search-clear"
            type="button"
            aria-label="清除搜索内容"
            @click="clearSearch"
          >
            <CloseIcon :size="14" :stroke-width="2.5" />
          </button>
        </div>
        <div class="type-tabs">
          <button
            v-for="option in typeOptions"
            :key="option.value"
            class="type-tab"
            :class="{ active: selectedType === option.value }"
            @click="selectedType = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </header>

    <div class="shops-layout">
      <LocationList
        :locations="filteredLocations"
        :selected-location="selectedLocation"
        @select="openLocationDetail"
      />
      <LocationDetail
        :selected-location="selectedLocation"
        :all-foods="allFoods"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import SearchIcon from '../../../icons/common/SearchIcon.vue';
  import CloseIcon from '../../../icons/common/CloseIcon.vue';
  import LocationIcon from '../../../icons/common/LocationIcon.vue';

  import LocationList from './components/LocationList/index.vue';
  import LocationDetail from './components/LocationDetail/index.vue';

  import type { Food, FoodLocation } from '@/typesOfPages/travelGuide';

  const props = defineProps<{
    foodMapLocations?: FoodLocation[];
    allFoods?: Food[];
  }>();

  const selectedLocation = ref<FoodLocation | null>(null);
  const searchQuery = ref('');
  const debouncedQuery = ref('');
  const selectedType = ref('');

  const updateDebounced = useDebounceFn((val: string) => {
    debouncedQuery.value = val;
  }, 200);
  watch(searchQuery, (val) => updateDebounced(val));

  const clearSearch = () => {
    searchQuery.value = '';
    debouncedQuery.value = '';
  };

  const typeOptions = computed(() => {
    const types = new Set<string>();
    for (const loc of props.foodMapLocations || []) {
      if (loc.type) types.add(loc.type);
    }
    return [
      { label: '全部', value: '' },
      ...Array.from(types).map((t) => ({ label: t, value: t })),
    ];
  });

  const filteredLocations = computed(() => {
    const locations = props.foodMapLocations || [];
    return locations.filter((location) => {
      const q = debouncedQuery.value.toLowerCase();
      const matchesSearch =
        !q ||
        location.name.toLowerCase().includes(q) ||
        location.location.toLowerCase().includes(q);
      const matchesType = !selectedType.value || location.type === selectedType.value;
      return matchesSearch && matchesType;
    });
  });

  const openLocationDetail = (location: FoodLocation) => {
    selectedLocation.value = location;
  };

  watch(
    filteredLocations,
    (newLocations) => {
      if (newLocations.length > 0 && !selectedLocation.value) {
        openLocationDetail(newLocations[0]);
      } else if (newLocations.length === 0) {
        selectedLocation.value = null;
      }
    },
    { immediate: true },
  );

  watch(
    () => props.foodMapLocations,
    () => {
      if (filteredLocations.value.length > 0) {
        openLocationDetail(filteredLocations.value[0]);
      }
    },
  );
</script>

<style scoped lang="scss" src="./index.scss" />
