<template>
  <aside class="filter-sidebar">
    <div class="filter-header">
      <h2 class="filter-title">
        <FilterIcon class="filter-icon" :stroke-width="2" />
        <span class="title-text">筛选</span>
      </h2>
      <button
        v-if="activeFilterCount > 0"
        class="reset-btn"
        title="清除所有筛选"
        @click="clearAllFilters"
      >
        <TrashIcon :stroke-width="2" />
        <span>重置</span>
      </button>
    </div>

    <div class="filter-content">
      <!-- 最佳季节 -->
      <div class="filter-group" :class="{ active: activeCategory === 'season' }">
        <button class="group-trigger" @click="toggleSection('season')">
          <div class="group-info">
            <span class="group-icon">{{ seasonIcon }}</span>
            <span class="group-label">最佳季节</span>
            <span v-if="selectedFilters.season.length" class="group-badge">{{ selectedFilters.season.length }}</span>
          </div>
          <ChevronDownIcon class="chevron" :class="{ expanded: expandedSections.includes('season') }" :stroke-width="2" />
        </button>
        <div v-show="expandedSections.includes('season')" class="group-options">
          <div class="options-grid">
            <button
              v-for="season in seasonsWithCount"
              :key="season.id"
              :class="['option-card', { selected: selectedFilters.season.includes(season.id) }]"
              @click="toggleFilter('season', season.id)"
            >
              <span class="card-icon">{{ season.icon }}</span>
              <span class="card-label">{{ season.label }}</span>
              <span v-if="season.count > 0" class="card-count">{{ season.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 旅行方式 -->
      <div class="filter-group" :class="{ active: activeCategory === 'travelMode' }">
        <button class="group-trigger" @click="toggleSection('travelMode')">
          <div class="group-info">
            <span class="group-icon">🚗</span>
            <span class="group-label">旅行方式</span>
            <span v-if="selectedFilters.travelMode.length" class="group-badge">{{ selectedFilters.travelMode.length }}</span>
          </div>
          <ChevronDownIcon class="chevron" :class="{ expanded: expandedSections.includes('travelMode') }" :stroke-width="2" />
        </button>
        <div v-show="expandedSections.includes('travelMode')" class="group-options">
          <div class="options-grid">
            <button
              v-for="mode in travelModesWithCount"
              :key="mode.id"
              :class="['option-card', { selected: selectedFilters.travelMode.includes(mode.id) }]"
              @click="toggleFilter('travelMode', mode.id)"
            >
              <span class="card-icon">{{ mode.icon }}</span>
              <span class="card-label">{{ mode.label }}</span>
              <span v-if="mode.count > 0" class="card-count">{{ mode.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 风景主题 -->
      <div class="filter-group" :class="{ active: activeCategory === 'sceneryTheme' }">
        <button class="group-trigger" @click="toggleSection('sceneryTheme')">
          <div class="group-info">
            <span class="group-icon">🏞️</span>
            <span class="group-label">风景主题</span>
            <span v-if="selectedFilters.sceneryTheme.length" class="group-badge">{{ selectedFilters.sceneryTheme.length }}</span>
          </div>
          <ChevronDownIcon class="chevron" :class="{ expanded: expandedSections.includes('sceneryTheme') }" :stroke-width="2" />
        </button>
        <div v-show="expandedSections.includes('sceneryTheme')" class="group-options">
          <!-- 自然风光 -->
          <div class="options-section">
            <h3 class="section-title">自然风光</h3>
            <div class="options-grid">
              <button
                v-for="theme in naturalSceneryWithCount"
                :key="theme.id"
                :class="['option-card', { selected: selectedFilters.sceneryTheme.includes(theme.id) }]"
                @click="toggleFilter('sceneryTheme', theme.id)"
              >
                <span class="card-icon">{{ theme.icon }}</span>
                <span class="card-label">{{ theme.label }}</span>
                <span v-if="theme.count > 0" class="card-count">{{ theme.count }}</span>
              </button>
            </div>
          </div>
          <!-- 气象景观 -->
          <div class="options-section">
            <h3 class="section-title">气象景观</h3>
            <div class="options-grid">
              <button
                v-for="theme in weatherSceneryWithCount"
                :key="theme.id"
                :class="['option-card', { selected: selectedFilters.sceneryTheme.includes(theme.id) }]"
                @click="toggleFilter('sceneryTheme', theme.id)"
              >
                <span class="card-icon">{{ theme.icon }}</span>
                <span class="card-label">{{ theme.label }}</span>
                <span v-if="theme.count > 0" class="card-count">{{ theme.count }}</span>
              </button>
            </div>
          </div>
          <!-- 季节景观 -->
          <div class="options-section">
            <h3 class="section-title">季节景观</h3>
            <div class="options-grid">
              <button
                v-for="theme in seasonalSceneryWithCount"
                :key="theme.id"
                :class="['option-card', { selected: selectedFilters.sceneryTheme.includes(theme.id) }]"
                @click="toggleFilter('sceneryTheme', theme.id)"
              >
                <span class="card-icon">{{ theme.icon }}</span>
                <span class="card-label">{{ theme.label }}</span>
                <span v-if="theme.count > 0" class="card-count">{{ theme.count }}</span>
              </button>
            </div>
          </div>
          <!-- 人文景观 -->
          <div class="options-section">
            <h3 class="section-title">人文景观</h3>
            <div class="options-grid">
              <button
                v-for="theme in culturalSceneryWithCount"
                :key="theme.id"
                :class="['option-card', { selected: selectedFilters.sceneryTheme.includes(theme.id) }]"
                @click="toggleFilter('sceneryTheme', theme.id)"
              >
                <span class="card-icon">{{ theme.icon }}</span>
                <span class="card-label">{{ theme.label }}</span>
                <span v-if="theme.count > 0" class="card-count">{{ theme.count }}</span>
              </button>
            </div>
          </div>
          <!-- 生态摄影 -->
          <div class="options-section">
            <h3 class="section-title">生态摄影</h3>
            <div class="options-grid">
              <button
                v-for="theme in wildlifeSceneryWithCount"
                :key="theme.id"
                :class="['option-card', { selected: selectedFilters.sceneryTheme.includes(theme.id) }]"
                @click="toggleFilter('sceneryTheme', theme.id)"
              >
                <span class="card-icon">{{ theme.icon }}</span>
                <span class="card-label">{{ theme.label }}</span>
                <span v-if="theme.count > 0" class="card-count">{{ theme.count }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 地理位置 -->
      <div class="filter-group" :class="{ active: activeCategory === 'location' }">
        <button class="group-trigger" @click="toggleSection('location')">
          <div class="group-info">
            <span class="group-icon">📍</span>
            <span class="group-label">地理位置</span>
            <span v-if="selectedFilters.location.length" class="group-badge">{{ selectedFilters.location.length }}</span>
          </div>
          <ChevronDownIcon class="chevron" :class="{ expanded: expandedSections.includes('location') }" :stroke-width="2" />
        </button>
        <div v-show="expandedSections.includes('location')" class="group-options">
          <div class="options-list">
            <button
              v-for="loc in locationsWithCount"
              :key="loc.id"
              :class="['option-item', { selected: selectedFilters.location.includes(loc.id) }]"
              @click="toggleFilter('location', loc.id)"
            >
              <span class="item-dot"></span>
              <span class="item-label">{{ loc.label }}</span>
              <span v-if="loc.count > 0" class="item-count">{{ loc.count }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 天数范围 -->
      <div class="filter-group" :class="{ active: activeCategory === 'duration' }">
        <button class="group-trigger" @click="toggleSection('duration')">
          <div class="group-info">
            <span class="group-icon">⏱️</span>
            <span class="group-label">行程天数</span>
            <span v-if="selectedFilters.duration.length" class="group-badge">{{ selectedFilters.duration.length }}</span>
          </div>
          <ChevronDownIcon class="chevron" :class="{ expanded: expandedSections.includes('duration') }" :stroke-width="2" />
        </button>
        <div v-show="expandedSections.includes('duration')" class="group-options">
          <div class="options-list">
            <button
              v-for="dur in durationWithCount"
              :key="dur.id"
              :class="['option-item', { selected: selectedFilters.duration.includes(dur.id) }]"
              @click="toggleFilter('duration', dur.id)"
            >
              <span class="item-dot"></span>
              <span class="item-label">{{ dur.label }}</span>
              <span v-if="dur.count > 0" class="item-count">{{ dur.count }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import FilterIcon from '@/pages/Landscape/icon/components/guides/FilterSidebar/FilterIcon.vue';
import TrashIcon from '@/pages/Landscape/icon/common/TrashIcon.vue';
import ChevronDownIcon from '@/pages/Landscape/icon/common/ChevronDownIcon.vue';

interface FilterItem {
  id: string;
  icon?: string;
  label: string;
  count: number;
}

interface Props {
  travelModesWithCount: FilterItem[];
  naturalSceneryWithCount: FilterItem[];
  weatherSceneryWithCount: FilterItem[];
  seasonalSceneryWithCount: FilterItem[];
  culturalSceneryWithCount: FilterItem[];
  wildlifeSceneryWithCount: FilterItem[];
  locationsWithCount: FilterItem[];
  seasonsWithCount: FilterItem[];
  durationWithCount: FilterItem[];
  selectedFilters: {
    travelMode: string[];
    sceneryTheme: string[];
    location: string[];
    season: string[];
    duration: string[];
  };
  activeFilterCount: number;
  activeCategory: string;
  expandedSections: string[];
}

defineProps<Props>();

const seasonIcon = '🌸';

const emit = defineEmits<{
  (e: 'toggleSection', section: string): void;
  (e: 'toggleFilter', category: string, value: string): void;
  (e: 'clearAllFilters'): void;
}>();

const toggleSection = (section: string) => {
  emit('toggleSection', section);
};

const toggleFilter = (category: string, value: string) => {
  emit('toggleFilter', category, value);
};

const clearAllFilters = () => {
  emit('clearAllFilters');
};
</script>

<style scoped lang="scss" src="./index.scss" />
