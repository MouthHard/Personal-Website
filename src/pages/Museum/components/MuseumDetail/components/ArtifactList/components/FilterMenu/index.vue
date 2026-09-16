<template>
  <div class="artifact-sidebar">
    <div class="sidebar-content">
      <!-- 搜索框 -->
      <ArtifactSearchBox
        :artifacts="artifacts"
        v-model="searchKeyword"
        @search="handleSearch"
      />

      <!-- 搜索结果计数 -->
      <div v-if="searchKeyword || hasActiveFilter" class="result-count">
        <span class="count-icon"><TargetIcon /></span>
        <span class="count-text">
          找到 <strong>{{ resultCount }}</strong> 件文物
        </span>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-container">
        <!-- 文物类型筛选 -->
        <div class="filter-group">
          <h3 class="filter-title">文物类型</h3>
          <div class="filter-options">
            <button
              v-for="type in artifactTypes"
              :key="type.value"
              :class="[
                'filter-option',
                { active: selectedTypes === type.value },
              ]"
              @click="toggleType(type.value)"
            >
              <span class="btn-text">{{ type.label }}</span>
              <span class="btn-shine"></span>
              <span class="btn-ripple"></span>
            </button>
          </div>
        </div>

        <!-- 年代筛选 -->
        <div class="filter-group">
          <h3 class="filter-title">年代</h3>
          <div class="filter-options period-options">
            <button
              v-for="period in periods"
              :key="period.value"
              :class="[
                'filter-option',
                { active: selectedPeriods === period.value },
              ]"
              @click="togglePeriod(period.value)"
            >
              <span class="btn-text">{{ period.label }}</span>
              <span class="btn-shine"></span>
              <span class="btn-ripple"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import type { Artifact } from '@/typesOfPages/museum';
  import { artifactTypes, periods } from '@/constants/museum/artifactFilters';
  import { TargetIcon } from '@/pages/Museum/icons/common';
  import ArtifactSearchBox from './components/ArtifactSearchBox/index.vue';

  interface Props {
    artifacts: Artifact[];
    modelSelectedTypes?: string;
    modelSelectedPeriods?: string;
    modelSearchKeyword?: string;
    resultCount?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelSelectedTypes: '',
    modelSelectedPeriods: '',
    modelSearchKeyword: '',
    resultCount: 0,
  });

  const emit = defineEmits<{
    (e: 'update:modelSelectedTypes', value: string): void;
    (e: 'update:modelSelectedPeriods', value: string): void;
    (e: 'update:modelSearchKeyword', value: string): void;
    (e: 'search', value: string): void;
  }>();

  const selectedTypes = ref<string>(
    props.modelSelectedTypes || artifactTypes[0]?.value || '',
  );
  const selectedPeriods = ref<string>(
    props.modelSelectedPeriods || periods[0]?.value || '',
  );
  const searchKeyword = ref<string>(props.modelSearchKeyword);

  const hasActiveFilter = computed(() => {
    return (
      (selectedTypes.value && selectedTypes.value !== 'all') ||
      (selectedPeriods.value && selectedPeriods.value !== 'all')
    );
  });

  watch(
    () => props.modelSelectedTypes,
    (newVal) => {
      selectedTypes.value = newVal;
    },
  );

  watch(
    () => props.modelSelectedPeriods,
    (newVal) => {
      selectedPeriods.value = newVal;
    },
  );

  watch(
    () => props.modelSearchKeyword,
    (newVal) => {
      searchKeyword.value = newVal;
    },
  );

  watch(selectedTypes, (newVal) => {
    emit('update:modelSelectedTypes', newVal);
  });

  watch(selectedPeriods, (newVal) => {
    emit('update:modelSelectedPeriods', newVal);
  });

  watch(searchKeyword, (newVal) => {
    emit('update:modelSearchKeyword', newVal);
  });

  const toggleType = (type: string) => {
    selectedTypes.value = selectedTypes.value === type ? '' : type;
  };

  const togglePeriod = (period: string) => {
    selectedPeriods.value = selectedPeriods.value === period ? '' : period;
  };

  const handleSearch = (keyword: string) => {
    emit('search', keyword);
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
