<template>
  <header class="sticky-header">
    <div class="header-left">
      <div class="tab-navigation">
        <button v-for="tab in tabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }"
          @click="$emit('update:activeTab', tab.id)">
          <span class="tab-icon">
            <component :is="tab.icon" />
          </span>
          <span class="tab-name">{{ tab.name }}</span>
        </button>
      </div>
    </div>

    <div class="header-center">
      <div class="header-title">
        <h1 class="hero-title">{{ activeTab === 'mypage' ? '我的旅游足迹' : `${currentProvinceName}旅游指引` }}</h1>
      </div>
    </div>

    <div class="header-right">
      <button class="back-home-button" @click="$emit('back-home')">
        <span class="back-icon">
          <HomeIcon />
        </span>
        <span class="back-text">返回首页</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import HomeIcon from '../../icons/common/HomeIcon.vue';
import type { Tab } from '@/typesOfPages/travelGuide';

defineProps<{
  currentProvinceName: string;
  tabs: Tab[];
  activeTab: string;
}>();

defineEmits<{
  (e: 'update:activeTab', tabId: string): void;
  (e: 'back-home'): void;
}>();
</script>

<style scoped src="./index.scss" lang="scss" />
