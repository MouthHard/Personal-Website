<template>
  <div class="museum-recommendations">
    <!-- 模块标题 -->
    <div class="section-header">
      <h2 class="section-title">博物馆推荐</h2>
      <p class="section-subtitle">探索中国顶级博物馆，感受历史文化魅力</p>
    </div>

    <!-- 博物馆分类筛选 -->
    <div class="category-filter">
      <button 
        v-for="category in museumCategories" 
        :key="category.id"
        class="filter-btn"
        :class="{ active: state.activeCategory === category.id }"
        @click="state.activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- 博物馆网格 -->
    <div class="museum-grid">
      <div 
        v-for="museum in filteredMuseums" 
        :key="museum.id"
        class="museum-card"
        @click="selectMuseum(museum)"
      >
        <div class="museum-image">
          <img :src="museum.imageUrl" :alt="museum.name" />
          <div class="museum-overlay">
            <span class="museum-rating">{{ museum.rating }}分</span>
            <span class="museum-visitors">{{ museum.visitors }}万/年</span>
          </div>
        </div>
        <div class="museum-info">
          <h3 class="museum-name">{{ museum.name }}</h3>
          <p class="museum-location">{{ museum.location }}</p>
          <p class="museum-highlight">{{ museum.highlight }}</p>
        </div>
      </div>
    </div>

    <!-- 博物馆详情模态框 -->
    <div v-if="state.selectedMuseum" class="museum-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">&times;</button>
        
        <div class="modal-header">
          <h2>{{ state.selectedMuseum.name }}</h2>
          <div class="museum-meta">
            <span class="meta-item">{{ state.selectedMuseum.location }}</span>
            <span class="meta-item">{{ state.selectedMuseum.rating }}分</span>
            <span class="meta-item">{{ state.selectedMuseum.visitors }}万/年</span>
          </div>
        </div>

        <div class="modal-body">
          <div class="museum-detail-image">
            <img :src="state.selectedMuseum.imageUrl" :alt="state.selectedMuseum.name" />
          </div>
          
          <div class="museum-detail-info">
            <h3>博物馆简介</h3>
            <p>{{ state.selectedMuseum.description }}</p>
            
            <h3>镇馆之宝</h3>
            <ul class="treasures-list">
              <li v-for="(treasure, index) in state.selectedMuseum.treasures" :key="index">
                {{ treasure }}
              </li>
            </ul>
            
            <h3>参观信息</h3>
            <div class="visit-info">
              <p><strong>开放时间：</strong>{{ state.selectedMuseum.openHours }}</p>
              <p><strong>门票价格：</strong>{{ state.selectedMuseum.ticketPrice }}</p>
              <p><strong>交通信息：</strong>{{ state.selectedMuseum.transportation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { museumsData } from '../../data/museums.ts';
import './index.scss';

interface Museum {
  id: string;
  name: string;
  location: string;
  description: string;
  highlight: string;
  rating: number;
  visitors: number;
  category: string;
  imageUrl: string;
  treasures: string[];
  openHours: string;
  ticketPrice: string;
  transportation: string;
}

const state = reactive({
  activeCategory: 'all' as string,
  selectedMuseum: null as Museum | null
});

const museumCategories = [
  { id: 'all', name: '全部博物馆' },
  { id: 'national', name: '国家级博物馆' },
  { id: 'provincial', name: '省级博物馆' },
  { id: 'specialized', name: '专题博物馆' },
  { id: 'historical', name: '历史博物馆' },
  { id: 'art', name: '艺术博物馆' }
];

const filteredMuseums = computed(() => {
  if (state.activeCategory === 'all') {
    return museumsData;
  }
  return museumsData.filter((museum: Museum) => museum.category === state.activeCategory);
});

const selectMuseum = (museum: Museum) => {
  state.selectedMuseum = museum;
};

const closeModal = () => {
  state.selectedMuseum = null;
};
</script>