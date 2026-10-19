<template>
  <section class="cultural-festivals">
    <FestivalCalendar
      :current-year="currentYear"
      :total-festival-count="totalFestivalCount"
      :months-list="monthsList"
      :selected-month="selectedMonth"
      @select-month="selectMonth"
    />

    <template v-if="totalFestivalCount > 0">
      <FestivalModal
        :selected-month-data="selectedMonthData"
        :selected-month="selectedMonth"
        :current-year="currentYear"
        :selected-festival="selectedFestival"
        :page-festivals="pageFestivals"
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-list="pageList"
        :province-id="props.provinceId"
        :is-experience-favorite="isExperienceFavorite"
        :is-experience-been="isExperienceBeen"
        @select-festival="selectFestival"
        @close-detail="closeDetail"
        @close-panel="closePanel"
        @change-page="changePage"
        @go-to-page="goToPage"
        @toggle-favorite="onToggleFavorite"
        @toggle-been="onToggleBeen"
        @share="shareFestival"
      />
    </template>

    <TravelShareModal
      :visible="shareVisible"
      :title="shareTitle"
      :share-text="shareText"
      :share-url="shareUrl"
      @close="closeShare"
    />
  </section>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelShare } from '../../../../TravelShareModal/useTravelShare';
  import TravelShareModal from '../../../../TravelShareModal/index.vue';
  import FestivalCalendar from './FestivalCalendar/index.vue';
  import FestivalModal from './FestivalModal/index.vue';

  const { show: showToast } = useTravelToast();
  const {
    isExperienceFavorite,
    isExperienceBeen,
    toggleExperienceFavorite,
    toggleExperienceBeen,
  } = useSceneryPrefs();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const shareFestival = (item: any): void => {
    if (!item?.name) return;
    openShare(item.name, `${item.name}｜${item.location || ''}｜节庆时令`);
    showToast({ type: 'share', message: `正在分享 ${item.name}` });
  };

  const onToggleFavorite = (item: any): void => {
    if (!item?.id) return;
    const wasFav = isExperienceFavorite(item.id, props.provinceId, 'festival');
    toggleExperienceFavorite(item.id, props.provinceId, 'festival');
    showToast({ type: 'info', message: wasFav ? `已取消收藏 ${item.name}` : `已收藏 ${item.name}` });
  };

  const onToggleBeen = (item: any): void => {
    if (!item?.id) return;
    const wasBeen = isExperienceBeen(item.id, props.provinceId, 'festival');
    toggleExperienceBeen(item.id, props.provinceId, 'festival');
    showToast({ type: 'success', message: wasBeen ? `已取消体验 ${item.name}` : `已体验 ${item.name}` });
  };

  const props = defineProps<{
    festivals: any[];
    provinceId: string;
  }>();

  const currentYear = ref(new Date().getFullYear());
  const currentMonth = ref(new Date().getMonth() + 1);
  const selectedMonth = ref<number | null>(null);
  const selectedFestival = ref<any>(null);
  const currentPage = ref(1);
  const pageSize = 6;

  const getSeason = (monthValue: number) => {
    if ([12, 1, 2].includes(monthValue)) return { key: 'winter', name: '冬' };
    if ([3, 4, 5].includes(monthValue)) return { key: 'spring', name: '春' };
    if ([6, 7, 8].includes(monthValue)) return { key: 'summer', name: '夏' };
    return { key: 'autumn', name: '秋' };
  };

  const totalFestivalCount = computed(() => (props.festivals || []).length);

  const monthsList = computed(() => {
    const monthLabels = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月',
    ];

    const grouped: Record<string, any[]> = {};
    (props.festivals || []).forEach((festival: any) => {
      const m = festival.month;
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push(festival);
    });

    return monthLabels.map((label, idx) => {
      const value = idx + 1;
      const season = getSeason(value);
      const festivals = (grouped[label] || []).slice().sort((a: any, b: any) => {
        const dayA = parseInt(String(a.day).replace('日', '')) || 0;
        const dayB = parseInt(String(b.day).replace('日', '')) || 0;
        return dayA - dayB;
      });
      return {
        value,
        label,
        festivals,
        isCurrent: value === currentMonth.value,
        season: season.key,
        seasonName: season.name,
      };
    });
  });

  const selectedMonthData = computed(() => {
    if (selectedMonth.value === null) return null;
    return monthsList.value.find((m) => m.value === selectedMonth.value) || null;
  });

  const totalPages = computed(() => {
    if (!selectedMonthData.value) return 1;
    return Math.max(1, Math.ceil(selectedMonthData.value.festivals.length / pageSize));
  });

  const pageFestivals = computed(() => {
    if (!selectedMonthData.value) return [];
    const list = selectedMonthData.value.festivals;
    const start = (currentPage.value - 1) * pageSize;
    return list.slice(start, start + pageSize);
  });

  const pageList = computed(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const nums = Array.from(
      new Set([1, total, cur - 1, cur, cur + 1]),
    ).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const result: (number | string)[] = [];
    nums.forEach((n, i) => {
      if (i > 0 && nums[i - 1] !== n - 1) result.push('...');
      result.push(n);
    });
    return result;
  });

  const changePage = (page: number) => {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value);
  };

  const goToPage = (p: number | string) => {
    if (typeof p === 'number') currentPage.value = p;
  };

  watch(selectedMonth, () => {
    currentPage.value = 1;
  });

  const selectMonth = (monthValue: number) => {
    selectedMonth.value =
      selectedMonth.value === monthValue ? null : monthValue;
    selectedFestival.value = null;
  };

  const selectFestival = (festival: any) => {
    selectedFestival.value = festival;
  };

  const closeDetail = () => {
    selectedFestival.value = null;
  };

  const closePanel = () => {
    selectedMonth.value = null;
    selectedFestival.value = null;
  };

  const onEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedMonth.value !== null) closePanel();
  };

  onMounted(() => document.addEventListener('keydown', onEscKey));
  onUnmounted(() => document.removeEventListener('keydown', onEscKey));
</script>

<style scoped src="./index.scss" lang="scss" />
