<template>
  <aside class="province-sidebar">
    <ProvinceSidebarBack class="cyber-bg-effects" />


    <div class="search-box">
      <input
        :value="searchQuery"
        type="text"
        placeholder="搜索省份..."
        class="search-input"
        @input="
          $emit('update:searchQuery', ($event.target as HTMLInputElement).value)
        "
      />
      <span class="search-icon">
        <SearchIcon />
      </span>
    </div>

    <div class="region-filter">
      <button
        v-for="region in regions"
        :key="region"
        class="region-button"
        :class="{ active: selectedRegion === region }"
        @click="$emit('update:selectedRegion', region)"
      >
        <span class="btn-text">{{ region }}</span>
        <span class="btn-glow"></span>
        <span class="btn-particles"></span>
      </button>
    </div>

    <div class="province-list">
      <div class="list-header">
        <div class="header-left">
          <component :is="provinceSelectorIcon" class="title-icon" />
          <h3 class="glitch-text" data-text="省份选择">省份选择</h3>
        </div>
        <span class="header-status">ONLINE</span>
      </div>
      <div class="list-content">
        <div
          v-for="(province, index) in filteredProvinces"
          :key="province.id"
          class="province-item"
          :class="{ selected: province.id === selectedProvinceId }"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="$emit('select-province', province.id)"
        >
          <div class="item-glow"></div>
          <div class="item-grid"></div>
          <div class="item-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <div class="item-scan-line"></div>
          <div class="item-side-bar"></div>
          <span class="province-name">{{ province.name }}</span>
          <span class="province-abbreviation">{{ province.abbreviation }}</span>
          <span class="province-region">{{ province.region }}</span>
          <div class="item-data-line"></div>
          <div class="item-shine"></div>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import SearchIcon from '../../icons/common/SearchIcon.vue';
  import { ProvinceSidebarBack } from '@/pages/TravelGuide/icons/common/index';
    import type { Component } from 'vue';
  import type { Province } from '@/typesOfPages/travelGuide';

  defineProps<{
    provinceSelectorIcon: Component;
    searchQuery: string;
    selectedRegion: string;
    regions: string[];
    filteredProvinces: Province[];
    selectedProvinceId: string;
  }>();

  defineEmits<{
    (e: 'update:searchQuery', query: string): void;
    (e: 'update:selectedRegion', region: string): void;
    (e: 'select-province', provinceId: string): void;
  }>();
</script>

<style scoped src="./index.scss" lang="scss" />
