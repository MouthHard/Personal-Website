<template>
  <div class="digital-section">
    <div class="section-header">
      <span class="title-icon"><SmartphoneIcon /></span>
      数字文创
    </div>

    <div class="digital-intro">
      <h2 class="intro-title">
        <span class="highlight">指尖畅游</span>
        <span class="sub">{{ museum.name }}数字文化体验</span>
      </h2>
      <p class="intro-desc">
        汇聚 App、小游戏、数字展览与壁纸等数字文创，把 {{ museum.name }} 装进口袋
      </p>
    </div>

    <div class="digital-grid">
      <div
        v-for="item in digitalProducts"
        :key="item.id"
        class="digital-card"
        :class="item.type"
      >
        <div class="card-glow"></div>
        <div class="card-type-badge">{{ item.typeText }}</div>
        <div class="card-icon">
          <component :is="item.icon" />
        </div>
        <div class="card-content">
          <h3 class="card-name">{{ item.name }}</h3>
          <p class="card-desc">{{ item.description }}</p>
        </div>
        <button class="card-action-btn">
          <span class="btn-text">{{ item.actionText }}</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { Museum } from '@/typesOfPages/museum/index';
  import {
    SmartphoneIcon,
    VrIcon,
    GlobeIcon,
    ImageIcon,
    HeadphoneIcon,
    VideoIcon,
  } from '@/pages/Museum/icons/common';
  import { markRaw } from 'vue';

  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();

  interface DigitalProduct {
    id: number;
    name: string;
    description: string;
    type: string;
    typeText: string;
    actionText: string;
    icon: ReturnType<typeof markRaw>;
  }

  const digitalProducts = computed<DigitalProduct[]>(() => {
    const name = props.museum.name;
    return [
      {
        id: 1,
        name: `${name}云展览`,
        description: `7×24小时线上展厅，${name}精品展览一览无余，指尖访古深度体验。`,
        type: 'app',
        typeText: 'App',
        actionText: '立即体验',
        icon: markRaw(SmartphoneIcon),
      },
      {
        id: 2,
        name: `${name}每日藏品`,
        description: `每日甄选一款${name}馆藏珍品，探寻文物背后令人惊叹的细节。`,
        type: 'app',
        typeText: 'App',
        actionText: '下载应用',
        icon: markRaw(SmartphoneIcon),
      },
      {
        id: 3,
        name: `${name}全景漫游`,
        description: `VR 全景技术还原${name}展厅实景，足不出户沉浸式参观。`,
        type: 'vr',
        typeText: '数字展',
        actionText: '进入漫游',
        icon: markRaw(VrIcon),
      },
      {
        id: 4,
        name: `${name}文物解谜`,
        description: `以${name}馆藏文物为题材的互动解谜游戏，寓教于乐趣味闯关。`,
        type: 'game',
        typeText: '小游戏',
        actionText: '开始游戏',
        icon: markRaw(GlobeIcon),
      },
      {
        id: 5,
        name: `${name}精选壁纸`,
        description: `由${name}官方摄影师拍摄的文物美图，构建智能标签分类下载。`,
        type: 'wallpaper',
        typeText: '壁纸',
        actionText: '下载壁纸',
        icon: markRaw(ImageIcon),
      },
      {
        id: 6,
        name: `${name}语音导览`,
        description: `专业讲解员配音的${name}文物音频导览，戴耳机即可边走边听。`,
        type: 'audio',
        typeText: '音频',
        actionText: '开始收听',
        icon: markRaw(HeadphoneIcon),
      },
    ];
  });
</script>

<style lang="scss" scoped src="./index.scss"></style>
