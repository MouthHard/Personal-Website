<template>
  <div class="dynasties-timeline">
    <div class="section-header">
      <h2 class="section-title">朝代更迭</h2>
      <p class="section-subtitle">中华五千年文明的朝代变迁</p>
    </div>
    
    <!-- 时间轴控制 -->
    <div class="timeline-controls">
      <button class="control-btn" @click="scrollToStart">回到起点</button>
      <button class="control-btn" @click="scrollToEnd">前往近代</button>
      <div class="time-filter">
        <select v-model="timeFilter" @change="filterDynasties">
          <option value="all">全部朝代</option>
          <option value="ancient">上古时期</option>
          <option value="imperial">帝制时期</option>
          <option value="modern">近代时期</option>
        </select>
      </div>
    </div>
    
    <!-- 时间轴 -->
    <div class="timeline-container" ref="timelineContainer">
      <div class="timeline-track">
        <div 
          v-for="dynasty in filteredDynasties" 
          :key="dynasty.id"
          class="dynasty-item"
          :class="{ active: selectedDynasty === dynasty.id }"
          @click="selectDynasty(dynasty)"
        >
          <div class="dynasty-dot"></div>
          <div class="dynasty-content">
            <h3 class="dynasty-name">{{ dynasty.name }}</h3>
            <p class="dynasty-period">{{ dynasty.period }}</p>
            <div class="dynasty-details" v-if="selectedDynasty === dynasty.id">
              <p>{{ dynasty.description }}</p>
              <div class="dynasty-highlights">
                <h4>重要事件：</h4>
                <ul>
                  <li v-for="(event, index) in dynasty.highlights" :key="index">
                    {{ event }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 朝代地图 -->
    <div class="dynasty-map" v-if="selectedDynastyData">
      <h3 class="map-title">{{ selectedDynastyData.name }}疆域图</h3>
      <div class="map-container">
        <img 
          :src="selectedDynastyData.mapUrl" 
          :alt="selectedDynastyData.name + '疆域图'"
          class="map-image"
        />
        <div class="map-info">
          <p>{{ selectedDynastyData.mapDescription }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { dynastiesData } from '../../data/dynasties';
import './index.scss';

interface Dynasty {
  id: string;
  name: string;
  period: string;
  era: string;
  description: string;
  highlights: string[];
  mapUrl: string;
  mapDescription: string;
}

const selectedDynasty = ref('');
const timeFilter = ref('all');
const timelineContainer = ref<HTMLElement>();

const filteredDynasties = computed(() => {
  if (timeFilter.value === 'all') {
    return dynastiesData;
  }
  return dynastiesData.filter((dynasty: Dynasty) => dynasty.era === timeFilter.value);
});

const selectedDynastyData = computed(() => {
  return dynastiesData.find((dynasty: Dynasty) => dynasty.id === selectedDynasty.value);
});

const selectDynasty = (dynasty: Dynasty) => {
  selectedDynasty.value = selectedDynasty.value === dynasty.id ? '' : dynasty.id;
};

const scrollToStart = () => {
  timelineContainer.value?.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToEnd = () => {
  if (timelineContainer.value) {
    timelineContainer.value.scrollTo({ 
      top: timelineContainer.value.scrollHeight, 
      behavior: 'smooth' 
    });
  }
};

const filterDynasties = () => {
  selectedDynasty.value = '';
};

onMounted(() => {
  // 初始选择第一个朝代
  if (dynastiesData.length > 0) {
    selectDynasty(dynastiesData[0]);
  }
});
</script>