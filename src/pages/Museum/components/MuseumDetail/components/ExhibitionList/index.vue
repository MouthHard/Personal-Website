<template>
  <section class="exhibition-list-container">
    <div class="exhibition-main">
      <div class="exhibition-left">
        <ExhibitionHeader
          v-model:status-filter="statusFilter"
          v-model:theme-filter="themeFilter"
          :categories="categories"
          @search="handleSearch"
        />

        <ExhibitionCardList
          :exhibitions="filteredExhibitions"
          :selected-exhibition-id="selectedExhibition?.id"
          @select-exhibition="selectExhibition"
        />
      </div>

      <div class="exhibition-right">
        <ExhibitionDetail :selected-exhibition="selectedExhibition" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useMuseumDataStore } from '@/stores/museum';
  import type { Exhibition, Museum } from '@/typesOfPages/museum/index';

  // 导入子组件
  import ExhibitionHeader from './components/ExhibitionHeader/index.vue';
  import ExhibitionCardList from './components/ExhibitionCardList/index.vue';
  import ExhibitionDetail from './components/ExhibitionDetail/index.vue';

  // 接收博物馆参数
  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();
  const store = useMuseumDataStore();

  const statusFilter = ref('all');
  const themeFilter = ref('all');
  const selectedExhibition = ref<Exhibition | null>(null);
  const searchQuery = ref('');

  // 选择展览
  const selectExhibition = (exhibition: Exhibition) => {
    selectedExhibition.value = exhibition;
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    searchQuery.value = query;
  };

  // 获取当前博物馆的展览数据
  const allExhibitions = computed(() => {
    return store.getExhibitionsByMuseumId(props.museum.id);
  });

  // 展览分类（从当前博物馆真实数据动态统计，保证覆盖全部品类）
  const categories = computed(() => {
    const nameSet = allExhibitions.value.reduce((acc, item) => {
      if (item.category) acc.add(item.category);
      return acc;
    }, new Set<string>());
    return [...nameSet].map((name, i) => ({
      id: i + 1,
      name,
      icon: '',
      count: allExhibitions.value.filter((item) => item.category === name).length,
    }));
  });

  // 筛选后的展览
  const filteredExhibitions = computed(() => {
    let result = allExhibitions.value;

    // 状态筛选（status 由服务层按日期派生）
    if (statusFilter.value !== 'all') {
      const filterStatus = (statuses: string[]) =>
        result.filter((item) => item.status !== undefined && statuses.includes(item.status));
      switch (statusFilter.value) {
        case 'hot': // 热门推荐：当前及未来可看的展览（未结束）
          result = result.filter((item) => item.status !== '已结束');
          break;
        case 'latest':
          result = filterStatus(['最新']);
          break;
        case 'ending':
          result = filterStatus(['即将结束']);
          break;
        case 'planning':
          result = filterStatus(['筹备中']);
          break;
        case 'historical':
          result = filterStatus(['已结束']);
          break;
      }
    }

    // 主题筛选
    if (themeFilter.value !== 'all') {
      const selectedCategoryName = categories.value.find(
        (cat) => cat.id.toString() === themeFilter.value,
      )?.name;
      result = result.filter((item) => item.category === selectedCategoryName);
    }

    // 搜索筛选
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.location && item.location.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.status &&
            item.status.toLowerCase().includes(query))
        );
      });
    }

    return result;
  });

  // 监听筛选结果变化，当结果为空时清空选中的展览详情
  watch(filteredExhibitions, (newFilteredExhibitions) => {
    if (newFilteredExhibitions.length === 0) {
      selectedExhibition.value = null;
    } else {
      // 如果当前选中的展览不在筛选结果中，也清空选中状态
      if (selectedExhibition.value) {
        const isSelectedInResults = newFilteredExhibitions.some(
          (exhibition) => exhibition.id === selectedExhibition.value?.id,
        );
        if (!isSelectedInResults) {
          selectedExhibition.value = null;
        }
      }
    }
  });
</script>

<style lang="scss" scoped src="./index.scss"></style>
