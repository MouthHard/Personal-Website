<template>
  <div class="control-panel">
    <section class="panel-section stats-section">
      <h3 class="panel-title">
        <span class="panel-icon">
          <StatsIcon />
        </span>
        数据概览
      </h3>
      <div class="stats-grid">
        <template v-if="stats.length > 0">
          <div v-for="(stat, index) in stats" :key="index" class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </template>
        <div v-else class="empty-stats">
          <div class="empty-icon"><ChartIcon /></div>
          <div class="empty-text">暂无数据</div>
        </div>
      </div>
    </section>

    <section class="panel-section seasons-section">
      <h3 class="panel-title">
        <span class="panel-icon">
          <SeasonsPanelIcon />
        </span>
        季节特色
      </h3>
      <div class="seasons-detail">
        <template v-if="detailedSeasons.length > 0">
          <div
            v-for="(season, index) in detailedSeasons"
            :key="index"
            class="season-detail-item"
            :data-season="season.name"
            :style="`--index: ${index}`"
          >
            <h4 class="season-name">{{ season.name }}</h4>
            <p class="season-description">{{ season.description }}</p>
            <div class="season-activities">
              <span
                v-for="(activity, actIndex) in season.activities"
                :key="actIndex"
                class="activity-tag"
                :class="`tag-${(actIndex % 4) + 1}`"
                @click="handleSpotClick(activity)"
              >
                {{ activity }}
              </span>
            </div>
          </div>
        </template>
        <div v-else class="empty-seasons">
          <div class="empty-icon"><FlowerIcon /></div>
          <div class="empty-title">暂无季节数据</div>
          <p class="empty-description">该地区暂无最佳季节数</p>
        </div>
      </div>
    </section>

    <section class="panel-section highlights-section">
      <h3 class="panel-title">
        <span class="panel-icon">
          <StarIcon />
        </span>
        热门景点
      </h3>
      <div class="highlights-scroll">
        <span
          v-for="(spot, index) in hotSpots"
          :key="spot.id"
          class="highlight-item"
          :class="`highlight-${(index % 8) + 1}`"
          @click="handleSpotClick(spot.name)"
        >
          <span class="highlight-name">{{ spot.name }}</span>
          <span v-if="spot.rating" class="highlight-rating">
            <StarIcon :size="10" class="rating-star" />
            <span class="rating-num">{{ spot.rating.toFixed(1) }}</span>
          </span>
          <span class="highlight-tooltip">
            <span class="tooltip-desc">{{ spot.highlight || spot.description }}</span>
            <span class="tooltip-meta">
              <span v-if="spot.ticketPrice" class="tooltip-price">{{ spot.ticketPrice }}</span>
              <span v-if="spot.bestTime" class="tooltip-best-time">最佳{{ spot.bestTime }}</span>
            </span>
          </span>
        </span>
        <span v-if="hotSpots.length === 0" class="empty-highlight">
          暂无热门景点数据
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ChartIcon from '../../../../../icons/pages/scenery/ChartIcon.vue';
import FlowerIcon from '../../../../../icons/pages/scenery/FlowerIcon.vue';
import StarIcon from '../../../../../icons/common/StarIcon.vue';
  import { ref, watch, onMounted } from 'vue';
  import type { SceneryData, ScenerySpot } from '@/typesOfPages/travelGuide';
  import {
    StatsIcon,
    SeasonsPanelIcon,
  } from '@/pages/TravelGuide/icons/pages/scenery';

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

  // 初始化数据
  const initData = () => {
    // 重置所有数据为默认空状态
    stats.value = [];
    hotSpots.value = [];
    detailedSeasons.value = [];

    if (props.sceneryData?.overview) {
      // 从sceneryData获取数据
      const overview = props.sceneryData.overview;

      // 从 spots 聚合质量与丰富度指标
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
      // 5A 景区数：优先用 overview 官方数据，fallback 到 spots 聚合
      const fiveACount =
        overview.fiveACount ?? spots.filter((s) => s.level === '5A').length;
      // 世界遗产数：来自 UNESCO 名单
      const worldHeritageCount = overview.worldHeritageCount ?? 0;
      // 国家级非遗数：优先用 overview 官方数据，fallback 到体验数据中带 heritageLevel 的项目
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

      // 热门景点：取 spots 前6个（按评分降序）
      const sortedSpots = [...spots].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      hotSpots.value = sortedSpots.slice(0, 6);

      // 季节特色
      if (props.sceneryData.seasonal && props.sceneryData.seasonal.length > 0) {
        // 直接使用后端提供的季节数
        detailedSeasons.value = props.sceneryData.seasonal.map((season) => ({
          name: season.name,
          description: season.description,
          activities: season.activities,
        }));
      } else {
        // 无季节数据时使用默认春夏秋冬
        detailedSeasons.value = [
          {
            name: '春季',
            description: '万物复苏，春暖花开',
            activities: ['赏花', '踏青', '春游'],
          },
          {
            name: '夏季',
            description: '阳光明媚，绿树成林',
            activities: ['避暑', '游泳', '露营'],
          },
          {
            name: '秋季',
            description: '秋高气爽，层林尽叶',
            activities: ['赏秋', '登山', '采摘'],
          },
          {
            name: '冬季',
            description: '银装素裹，冰天雪地',
            activities: ['滑雪', '温泉', '赏雪'],
          },
        ];
      }
    } else {
      // 无数据时显示默认春夏秋冬
      detailedSeasons.value = [
        {
          name: '春季',
          description: '万物复苏，春暖花开',
          activities: ['赏花', '踏青', '春游'],
        },
        {
          name: '夏季',
          description: '阳光明媚，绿树成林',
          activities: ['避暑', '游泳', '露营'],
        },
        {
          name: '秋季',
          description: '秋高气爽，层林尽叶',
          activities: ['赏秋', '登山', '采摘'],
        },
        {
          name: '冬季',
          description: '银装素裹，冰天雪地',
          activities: ['滑雪', '温泉', '赏雪'],
        },
      ];
    }
  };

  // 监听sceneryData变化，实时更新数据
  watch(
    () => props.sceneryData,
    (newData) => {
      // 只有当sceneryData真正变化时才更新
      if (newData) {
        initData();
      }
    },
    { deep: true },
  );

  // 初始化数据
  onMounted(() => {
    initData();
  });
</script>

<style scoped lang="scss" src="./index.scss" />
