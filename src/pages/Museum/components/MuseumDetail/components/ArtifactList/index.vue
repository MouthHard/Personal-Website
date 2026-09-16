<template>
  <div class="artifact-list">
    <div class="artifact-layout">

      <FilterMenu
        :artifacts="museumArtifacts"
        v-model:modelSelectedTypes="selectedTypes"
        v-model:modelSelectedPeriods="selectedPeriods"
        v-model:modelSearchKeyword="searchKeyword"
        :resultCount="filteredArtifacts.length"
      />

      <ArtifactContainer
        :artifacts="filteredArtifacts"
        :activeArtifactId="activeArtifactId"
        @artifact-click="openArtifactDetail"
      />
    </div>

    <!-- 文物详情弹窗 -->
    <ArtifactDetailModal
      :artifact="selectedArtifact"
      :candidates="museumArtifacts"
      @close="closeArtifactDetail"
      @select="openArtifactDetail"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Museum, Artifact, ArtifactDetail } from '@/typesOfPages/museum';
  import {
    artifactTypes,
    periods,
    periodMap,
  } from '@/constants/museum/artifactFilters';
  import { useMuseumDataStore } from '@/stores/museum';
  import FilterMenu from './components/FilterMenu/index.vue';
  import ArtifactContainer from './components/ArtifactContainer/index.vue';
  import ArtifactDetailModal from './components/ArtifactDetailModal/index.vue';

  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();
  const store = useMuseumDataStore();

  // 筛选状态
  const selectedTypes = ref<string>(artifactTypes[0]?.value || '');
  const selectedPeriods = ref<string>(periods[0]?.value || '');
  const searchKeyword = ref('');

  // 获取当前博物馆的文物列表
  const museumArtifacts = computed(() => {
    return store.getArtifactsByMuseumId(props.museum.id);
  });

  // 筛选逻辑
  const filteredArtifacts = computed(() => {
    const artifacts = museumArtifacts.value;

    return artifacts.filter((artifact) => {
      // 类型筛选
      if (
        selectedTypes.value &&
        selectedTypes.value !== 'all' &&
        selectedTypes.value !== artifact.category
      ) {
        return false;
      }

      // 年代筛选
      if (selectedPeriods.value && selectedPeriods.value !== 'all') {
        const periodNames = periodMap[selectedPeriods.value] || [];
        if (!periodNames.includes(artifact.period)) {
          return false;
        }
      }

      // 多字段搜索（名称、朝代、类型、描述、材质）
      if (searchKeyword.value) {
        const query = searchKeyword.value.toLowerCase();
        const name = artifact.name?.toLowerCase() || '';
        const period = artifact.period?.toLowerCase() || '';
        const category = artifact.category?.toLowerCase() || '';
        const description = artifact.description?.toLowerCase() || '';
        const material = artifact.basicInfo?.material?.toLowerCase() || '';
        const collection = artifact.basicInfo?.collection?.toLowerCase() || '';

        return (
          name.includes(query) ||
          period.includes(query) ||
          category.includes(query) ||
          description.includes(query) ||
          material.includes(query) ||
          collection.includes(query)
        );
      }

      return true;
    });
  });

  // 状态管理
  const selectedArtifact = ref<ArtifactDetail | null>(null);
  const activeArtifactId = ref<number | null>(null);

  // 方法
  const openArtifactDetail = async (artifact: Artifact) => {
    const detail = await store.getArtifactDetailById(artifact.id);
    if (detail) {
      selectedArtifact.value = { ...detail, image: detail.image || artifact.image };
      activeArtifactId.value = artifact.id;
    }
  };

  const closeArtifactDetail = () => {
    selectedArtifact.value = null;
    activeArtifactId.value = null;
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
