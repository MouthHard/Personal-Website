<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import type { SceneryData, ScenerySpot } from '@/typesOfPages/travelGuide';
  import StatsSection from './StatsSection/index.vue';
  import SeasonsSection from './SeasonsSection/index.vue';
  import HighlightsSection from './HighlightsSection/index.vue';

  interface Stat {
    value: string | number;
    label: string;
  }

  interface Season {
    name: string;
    description: string;
    activities: string[];
  }

  const props = defineProps<{
    sceneryData?: SceneryData;
  }>();

  const emit = defineEmits<{
    (e: 'navigate-to-spot', spotName: string): void;
  }>();

  const stats = ref<Stat[]>([]);
  const hotSpots = ref<ScenerySpot[]>([]);
  const detailedSeasons = ref<Season[]>([]);

  const handleSpotClick = (spotName: string) => {
    const spots = props.sceneryData?.spots || [];
    const matched = spots.find((s) => spotName.includes(s.name));
    emit('navigate-to-spot', matched ? matched.name : spotName);
  };

  const initData = () => {
    stats.value = [];
    hotSpots.value = [];
    detailedSeasons.value = [];

    if (props.sceneryData?.overview) {
      const overview = props.sceneryData.overview;
      const spots = props.sceneryData.spots || [];
      const avgRating =
        spots.length > 0
          ? (spots.reduce((sum, s) => sum + (s.rating || 0), 0) / spots.length).toFixed(1)
          : '0';
      const totalReviewCount = spots.reduce((sum, s) => {
        const m = (s.reviewCount || '').match(/([\d,]+)/);
        return sum + (m ? parseInt(m[1].replace(/,/g, ''), 10) : 0);
      }, 0);
      const formatCount = (n: number): string =>
        n >= 10000 ? (n / 10000).toFixed(1) + '万' : String(n);
      const routeCount = props.sceneryData.routes?.length || 0;
      const fiveACount =
        overview.fiveACount ?? spots.filter((s) => s.level === '5A').length;
      const worldHeritageCount = overview.worldHeritageCount ?? 0;
      const heritageCount =
        overview.intangibleHeritageCount ??
        (props.sceneryData.craftWorkshops?.filter((c: any) => c.heritageLevel).length || 0) +
          (props.sceneryData.performances?.filter((p: any) => p.heritageLevel).length || 0);

      stats.value = [
        { value: fiveACount, label: '5A景区' },
        { value: worldHeritageCount, label: '世界遗产' },
        { value: heritageCount, label: '国家级非遗' },
        { value: avgRating, label: '平均评分' },
        { value: formatCount(totalReviewCount), label: '总点评' },
        { value: routeCount, label: '推荐路线' },
      ];

      const sortedSpots = [...spots].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      hotSpots.value = sortedSpots.slice(0, 6);

      if (props.sceneryData.seasonal && props.sceneryData.seasonal.length > 0) {
        detailedSeasons.value = props.sceneryData.seasonal.map((season) => ({
          name: season.name,
          description: season.description,
          activities: season.activities,
        }));
      } else {
        detailedSeasons.value = [
          { name: '春季', description: '万物复苏，春暖花开', activities: ['赏花', '踏青', '春游'] },
          { name: '夏季', description: '阳光明媚，绿树成林', activities: ['避暑', '游泳', '露营'] },
          { name: '秋季', description: '秋高气爽，层林尽叶', activities: ['赏秋', '登山', '采摘'] },
          { name: '冬季', description: '银装素裹，冰天雪地', activities: ['滑雪', '温泉', '赏雪'] },
        ];
      }
    } else {
      detailedSeasons.value = [
        { name: '春季', description: '万物复苏，春暖花开', activities: ['赏花', '踏青', '春游'] },
        { name: '夏季', description: '阳光明媚，绿树成林', activities: ['避暑', '游泳', '露营'] },
        { name: '秋季', description: '秋高气爽，层林尽叶', activities: ['赏秋', '登山', '采摘'] },
        { name: '冬季', description: '银装素裹，冰天雪地', activities: ['滑雪', '温泉', '赏雪'] },
      ];
    }
  };

  watch(
    () => props.sceneryData,
    (newData) => {
      if (newData) {
        initData();
      }
    },
    { deep: true },
  );

  onMounted(() => {
    initData();
  });
</script>

<template>
  <div class="control-panel">
    <StatsSection :stats="stats" />
    <SeasonsSection :seasons="detailedSeasons" @spot-click="handleSpotClick" />
    <HighlightsSection :hot-spots="hotSpots" @spot-click="handleSpotClick" />
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>
