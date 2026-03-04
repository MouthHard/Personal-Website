<template>
  <div class="cultural-heritage">
    <h2 class="section-title">文化遗产</h2>
    <p class="section-subtitle">中华文明的珍贵遗产</p>
    
    <!-- 遗产分类筛选 -->
    <div class="heritage-filters">
      <button 
        v-for="category in heritageCategories" 
        :key="category.id"
        class="filter-btn"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>
    
    <!-- 遗产展示 -->
    <div class="heritage-showcase">
      <!-- 遗产图片轮播 -->
      <div class="heritage-carousel" v-if="filteredHeritage.length > 0">
        <div class="carousel-container">
          <div 
            class="carousel-track"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div 
              v-for="heritage in filteredHeritage" 
              :key="heritage.id"
              class="carousel-slide"
            >
              <img :src="heritage.imageUrl" :alt="heritage.name" />
              <div class="carousel-caption">
                <h3>{{ heritage.name }}</h3>
                <p>{{ heritage.location }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 轮播控制 -->
        <button class="carousel-btn prev" @click="prevSlide">‹</button>
        <button class="carousel-btn next" @click="nextSlide">›</button>
        
        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <span 
            v-for="(heritage, index) in filteredHeritage" 
            :key="heritage.id"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="currentSlide = index"
          ></span>
        </div>
      </div>
      
      <!-- 遗产列表 -->
      <div class="heritage-list">
        <div 
          v-for="heritage in filteredHeritage" 
          :key="heritage.id"
          class="heritage-item"
          @click="selectHeritage(heritage)"
        >
          <div class="heritage-image">
            <img :src="heritage.thumbnailUrl" :alt="heritage.name" />
          </div>
          <div class="heritage-info">
            <h3 class="heritage-name">{{ heritage.name }}</h3>
            <p class="heritage-location">{{ heritage.location }}</p>
            <p class="heritage-brief">{{ heritage.brief }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 遗产详情模态框 -->
    <div class="heritage-modal" v-if="selectedHeritage" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <h3 class="modal-title">{{ selectedHeritage.name }}</h3>
        <p class="modal-location">{{ selectedHeritage.location }}</p>
        <div class="modal-gallery">
          <img 
            v-for="(image, index) in selectedHeritage.images" 
            :key="index"
            :src="image" 
            :alt="selectedHeritage.name"
          />
        </div>
        <div class="modal-details">
          <p>{{ selectedHeritage.description }}</p>
          <div class="heritage-features" v-if="selectedHeritage.features">
            <h4>主要特征：</h4>
            <ul>
              <li v-for="(feature, index) in selectedHeritage.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { culturalHeritage } from '../../data/heritage';
import './index.scss';

interface CulturalHeritage {
  id: string;
  name: string;
  location: string;
  category: string;
  brief: string;
  description: string;
  features: string[];
  imageUrl: string;
  thumbnailUrl: string;
  images: string[];
}


const activeCategory = ref('all');
const selectedHeritage = ref<CulturalHeritage | null>(null);
const currentSlide = ref(0);
let autoplayInterval: number | null = null;

const heritageCategories = [
  { id: 'all', name: '全部遗产' },
  { id: 'site', name: '文化遗址' },
  { id: 'building', name: '古建筑' },
  { id: 'artifact', name: '文物' },
  { id: 'intangible', name: '非物质文化遗产' }
];

const filteredHeritage = computed(() => {
  if (activeCategory.value === 'all') {
    return culturalHeritage;
  }
  return culturalHeritage.filter((heritage: CulturalHeritage) => heritage.category === activeCategory.value);
});

const selectHeritage = (heritage: CulturalHeritage) => {
  selectedHeritage.value = heritage;
};

const closeModal = () => {
  selectedHeritage.value = null;
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % filteredHeritage.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + filteredHeritage.value.length) % filteredHeritage.value.length;
};

const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>