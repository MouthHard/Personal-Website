<script setup lang="ts">
  import { computed } from 'vue';
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';

  const props = defineProps<{
    selectedType: string;
    sortBy: string;
    allSpots: ScenerySpot[];
  }>();

  const emit = defineEmits<{
    'update:selectedType': [value: string];
    'update:sortBy': [value: string];
  }>();

  const typeFilters = computed(() => [
    { value: '', label: '全部', count: props.allSpots.length },
    {
      value: 'nature',
      label: '自然',
      count: props.allSpots.filter((s) => s.type === 'nature').length,
    },
    {
      value: 'culture',
      label: '人文',
      count: props.allSpots.filter((s) => s.type === 'culture').length,
    },
  ]);

  const sortOptions = [
    { value: 'default', label: '综合' },
    { value: 'rating', label: '好评' },
    { value: 'hot', label: '热度' },
  ];
</script>

<template>
  <div class="filter-container">
    <div class="filter-options">
      <div
        v-for="t in typeFilters"
        :key="t.value"
        class="filter-chip"
        :class="{ active: selectedType === t.value }"
        @click="emit('update:selectedType', t.value)"
      >
        <span class="chip-text">{{ t.label }}</span>
        <span class="chip-count">{{ t.count }}</span>
      </div>
    </div>

    <div class="sort-options">
      <span class="sort-label">排序</span>
      <div
        v-for="s in sortOptions"
        :key="s.value"
        class="sort-chip"
        :class="{ active: sortBy === s.value }"
        @click="emit('update:sortBy', s.value)"
      >
        {{ s.label }}
      </div>
    </div>
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>