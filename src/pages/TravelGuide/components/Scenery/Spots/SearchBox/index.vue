<script setup lang="ts">
  import { ref } from 'vue';
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';
  import SearchDropdown from './SearchDropdown/index.vue';
  import FilterBar from './FilterBar/index.vue';

  const props = defineProps<{
    selectedType: string;
    sortBy: string;
    allSpots: ScenerySpot[];
    externalQuery?: string;
  }>();

  const emit = defineEmits<{
    'update:selectedType': [value: string];
    'update:sortBy': [value: string];
    'debounced-query': [value: string];
    'clear-all': [];
  }>();

  const searchDropdownRef = ref<InstanceType<typeof SearchDropdown> | null>(null);

  defineExpose({
    clear: () => searchDropdownRef.value?.clear(),
  });
</script>

<template>
  <div class="filter-layout">
    <SearchDropdown
      ref="searchDropdownRef"
      :all-spots="props.allSpots"
      :external-query="props.externalQuery"
      @debounced-query="(v) => emit('debounced-query', v)"
    />
    <FilterBar
      :selected-type="props.selectedType"
      :sort-by="props.sortBy"
      :all-spots="props.allSpots"
      @update:selected-type="(v) => emit('update:selectedType', v)"
      @update:sort-by="(v) => emit('update:sortBy', v)"
    />
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>
