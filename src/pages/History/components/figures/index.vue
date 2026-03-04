<template>
  <div class="historical-figures">
    <div class="section-header">
      <h2 class="section-title">历史人物</h2>
      <p class="section-subtitle">中华五千年文明的杰出代表</p>
    </div>
    
    <!-- 人物分类筛选 -->
    <div class="figures-filters">
      <button 
        v-for="category in figureCategories" 
        :key="category.id"
        class="filter-btn"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>
    
    <!-- 人物卡片网格 -->
    <div class="figures-grid">
      <div 
        v-for="figure in filteredFigures" 
        :key="figure.id"
        class="figure-card"
        @click="selectFigure(figure)"
      >
        <div class="figure-portrait">
          <img :src="figure.portraitUrl" :alt="figure.name" />
          <div class="figure-dynasty">{{ figure.dynasty }}</div>
        </div>
        <div class="figure-info">
          <h3 class="figure-name">{{ figure.name }}</h3>
          <p class="figure-title">{{ figure.title }}</p>
          <p class="figure-brief">{{ figure.brief }}</p>
        </div>
      </div>
    </div>
    
    <!-- 人物详情模态框 -->
    <div class="figure-modal" v-if="selectedFigure" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <div class="modal-header">
          <div class="modal-portrait">
            <img :src="selectedFigure.portraitUrl" :alt="selectedFigure.name" />
          </div>
          <div class="modal-header-info">
            <h3 class="modal-name">{{ selectedFigure.name }}</h3>
            <p class="modal-dynasty">{{ selectedFigure.dynasty }}</p>
            <p class="modal-title">{{ selectedFigure.title }}</p>
            <div class="modal-tags">
              <span 
                v-for="tag in selectedFigure.tags" 
                :key="tag"
                class="modal-tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <div class="modal-details">
          <p>{{ selectedFigure.description }}</p>
          <div class="figure-achievements" v-if="selectedFigure.achievements">
            <h4>主要成就：</h4>
            <ul>
              <li v-for="(achievement, index) in selectedFigure.achievements" :key="index">
                {{ achievement }}
              </li>
            </ul>
          </div>
          <div class="figure-quotes" v-if="selectedFigure.quotes">
            <h4>经典名言：</h4>
            <blockquote>{{ selectedFigure.quotes }}</blockquote>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { historicalFigures } from '../../data/figures';
import './index.scss';

interface HistoricalFigure {
  id: string;
  name: string;
  dynasty: string;
  category: string;
  title: string;
  brief: string;
  description: string;
  achievements: string[];
  quotes: string;
  portraitUrl: string;
  tags: string[];
}


const activeCategory = ref('all');
const selectedFigure = ref<HistoricalFigure | null>(null);

const figureCategories = [
  { id: 'all', name: '全部人物' },
  { id: 'politics', name: '政治军事' },
  { id: 'culture', name: '文化艺术' },
  { id: 'science', name: '科技学术' },
  { id: 'philosophy', name: '思想哲学' }
];

const filteredFigures = computed(() => {
  if (activeCategory.value === 'all') {
    return historicalFigures;
  }
  return historicalFigures.filter((figure: HistoricalFigure) => figure.category === activeCategory.value);
});

const selectFigure = (figure: HistoricalFigure) => {
  selectedFigure.value = figure;
};

const closeModal = () => {
  selectedFigure.value = null;
};
</script>