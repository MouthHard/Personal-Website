<template>
  <div class="digital-section">
    <div class="section-header">
      <h4 class="section-title">
        <span class="title-icon"><GlobeIcon /></span>
        数字体验
      </h4>
      <p class="section-subtitle">沉浸式数字技术带你穿越时空，感受文物背后的故事</p>
    </div>

    <div v-if="filteredItems.length > 0" class="digital-showcase">
      <div class="featured-card" @click="openExperience(filteredItems[0])">
        <div class="featured-image">
          <img loading="lazy" :src="filteredItems[0].image" :alt="filteredItems[0].title" />
          <div class="featured-overlay"></div>
          <div class="featured-glow"></div>
        </div>
        <div class="featured-content">
          <span class="featured-badge" :class="typeClass(filteredItems[0])">
            <component :is="typeIcon(filteredItems[0])" />
            {{ typeLabel(filteredItems[0]) }}
          </span>
          <h3 class="featured-title">{{ filteredItems[0].title }}</h3>
          <p class="featured-desc">{{ filteredItems[0].description }}</p>
          <button class="featured-btn">
            <span class="btn-icon"><VrIcon /></span>
            <span class="btn-text">进入体验</span>
            <span class="btn-glow"></span>
            <span class="btn-sweep"></span>
          </button>
        </div>
      </div>

      <div v-if="filteredItems.length > 1" class="digital-cards">
        <div
          v-for="item in filteredItems.slice(1)"
          :key="item.id"
          class="digital-card"
          @click="openExperience(item)"
        >
          <div class="card-image">
            <img loading="lazy" :src="item.image" :alt="item.title" />
            <div class="card-overlay"></div>
            <span class="card-badge" :class="typeClass(item)">
              <component :is="typeIcon(item)" />
              {{ typeLabel(item) }}
            </span>
            <div class="card-play">
              <VrIcon />
            </div>
          </div>
          <div class="card-body">
            <h5>{{ item.title }}</h5>
            <p>{{ item.description }}</p>
          </div>
          <div class="card-footer">
            <button class="card-btn">
              <span class="btn-text">进入体验</span>
              
              <span class="btn-glow"></span>
              <span class="btn-sweep"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <div class="no-data-icon"><GlobeIcon /></div>
      <p class="no-data-text">暂无数字体验内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue';
  import { useMuseumDataStore } from '@/stores/museum';
  import type { ImmersiveExperience } from '@/typesOfPages/museum';
  import {
    GlobeIcon,
    VrIcon,
    SmartphoneIcon,
    VideoIcon,
    HeadphoneIcon,
    CameraIcon,
    TargetIcon,
  } from '@/pages/Museum/icons/common';

  const props = defineProps<{
    museumId: number;
    hallName?: string;
  }>();

  const store = useMuseumDataStore();

  const hallKeywordMap: Record<string, string[]> = {
    青铜器馆: ['青铜'],
    书画馆: ['书画', '画'],
    陶瓷馆: ['陶瓷', '瓷'],
    钟表馆: ['钟表'],
    玉器馆: ['玉'],
    珍宝馆: ['珍宝', '宫廷'],
    雕塑馆: ['雕塑'],
    家具馆: ['家具'],
    武备馆: ['武备', '兵器'],
    戏曲馆: ['戏曲'],
    古建馆: ['古建', '建筑'],
    数字馆: ['数字', 'VR', 'AR'],
  };

  const filteredItems = computed(() => {
    const allItems = store.getImmersiveByMuseumId(props.museumId);
    if (!allItems || allItems.length === 0) return [];

    if (props.hallName) {
      for (const [hallKey, keywords] of Object.entries(hallKeywordMap)) {
        if (props.hallName.includes(hallKey.replace('馆', ''))) {
          const matched = allItems.filter(
            (item: ImmersiveExperience) =>
              keywords.some(
                (kw) => item.title.includes(kw) || item.description.includes(kw),
              ),
          );
          if (matched.length > 0) return matched;
        }
      }
    }

    return allItems;
  });

  const typeLabel = (item: ImmersiveExperience): string => {
    const title = item.title.toLowerCase();
    if (title.includes('vr') || title.includes('虚拟')) return 'VR虚拟';
    if (title.includes('ar') || title.includes('增强')) return 'AR增强';
    if (title.includes('互动')) return '互动体验';
    if (title.includes('全景')) return '全景展厅';
    if (title.includes('夜游')) return '夜游体验';
    if (title.includes('还原') || title.includes('沉浸')) return '沉浸剧场';
    if (title.includes('制作') || title.includes('体验')) return '互动体验';
    return '数字展览';
  };

  const typeClass = (item: ImmersiveExperience): string => {
    const label = typeLabel(item);
    const map: Record<string, string> = {
      VR虚拟: 'type-vr',
      AR增强: 'type-ar',
      互动体验: 'type-interactive',
      全景展厅: 'type-panorama',
      夜游体验: 'type-night',
      沉浸剧场: 'type-theater',
      数字展览: 'type-digital',
    };
    return map[label] || 'type-digital';
  };

  const typeIcon = (item: ImmersiveExperience): Component => {
    const label = typeLabel(item);
    const map: Record<string, Component> = {
      VR虚拟: VrIcon,
      AR增强: SmartphoneIcon,
      互动体验: TargetIcon,
      全景展厅: GlobeIcon,
      夜游体验: CameraIcon,
      沉浸剧场: VideoIcon,
      数字展览: HeadphoneIcon,
    };
    return map[label] || HeadphoneIcon;
  };

  const openExperience = (_item: ImmersiveExperience) => {};
</script>

<style lang="scss" scoped src="./index.scss"></style>
