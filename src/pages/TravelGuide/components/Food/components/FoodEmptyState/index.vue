<template>
  <section class="food-empty-state">
    <div class="empty-glow"></div>
    <div class="empty-frame">
      <div class="frame-corner tl"></div>
      <div class="frame-corner tr"></div>
      <div class="frame-corner bl"></div>
      <div class="frame-corner br"></div>
      <div class="frame-scanline"></div>
      <div class="empty-core">
        <component :is="currentIcon" class="empty-icon" />
        <div class="empty-label">{{ currentConfig.label }}</div>
        <h3 class="empty-title">{{ currentConfig.title }}</h3>
        <p class="empty-desc">{{ currentConfig.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue';
  import BowlRiceIcon from '../../../../icons/common/BowlRiceIcon.vue';
  import ShoppingBagIcon from '../../../../icons/common/ShoppingBagIcon.vue';
  import CalendarIcon from '../../../../icons/common/CalendarIcon.vue';
  import LightbulbIcon from '../../../../icons/common/LightbulbIcon.vue';
  import UtensilsIcon from '../../../../icons/common/UtensilsIcon.vue';
  import LocationIcon from '../../../../icons/common/LocationIcon.vue';
  import ClockIcon from '../../../../icons/common/ClockIcon.vue';

  interface EmptyConfig {
    icon: Component;
    label: string;
    title: string;
    desc: string;
  }

  const CONFIGS: Record<string, EmptyConfig> = {
    'popular': {
      icon: BowlRiceIcon,
      label: 'POPULAR.EMPTY',
      title: '必吃清单待录入',
      desc: '该省份的必吃美食正在整理中，敬请期待',
    },
    'souvenir': {
      icon: ShoppingBagIcon,
      label: 'SOUVENIR.EMPTY',
      title: '伴手礼暂缺',
      desc: '特产推荐正在选品中，稍后回来看看',
    },
    'seasonal': {
      icon: CalendarIcon,
      label: 'SEASONAL.EMPTY',
      title: '当季时令待更新',
      desc: '四季美食推荐正在筹备中',
    },
    'guide': {
      icon: LightbulbIcon,
      label: 'GUIDE.EMPTY',
      title: '攻略筹备中',
      desc: '一日三餐、美食路线与避坑贴士正在撰写',
    },
    'meal-plan': {
      icon: UtensilsIcon,
      label: 'MEAL.EMPTY',
      title: '暂无三餐安排',
      desc: '一日三餐推荐正在整理中',
    },
    'food-routes': {
      icon: LocationIcon,
      label: 'ROUTE.EMPTY',
      title: '暂无美食路线',
      desc: '寻味路线规划中，敬请期待',
    },
    'tips': {
      icon: LightbulbIcon,
      label: 'TIPS.EMPTY',
      title: '暂无避坑贴士',
      desc: '当地美食小贴士正在收集中',
    },
    'map': {
      icon: LocationIcon,
      label: 'MAP.EMPTY',
      title: '暂无名店数据',
      desc: '当地名店信息正在收录中',
    },
    'categories': {
      icon: UtensilsIcon,
      label: 'GALLERY.EMPTY',
      title: '暂无美食图鉴',
      desc: '美食分类整理中，敬请期待',
    },
  };

  const props = withDefaults(defineProps<{ type?: string }>(), {
    type: 'popular',
  });

  const currentConfig = computed(() => CONFIGS[props.type] || CONFIGS['popular']);
  const currentIcon = computed(() => currentConfig.value.icon);
</script>

<style scoped lang="scss" src="./index.scss" />