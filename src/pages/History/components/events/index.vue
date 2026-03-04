<template>
  <div class="historical-events">
    <div class="section-header">
      <h2 class="section-title">历史事件</h2>
      <p class="section-subtitle">影响中华文明进程的重要时刻</p>
    </div>
    
    <!-- 事件分类筛选 -->
    <div class="event-filters">
      <button 
        v-for="category in eventCategories" 
        :key="category.id"
        class="filter-btn"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>
    
    <!-- 事件网格 -->
    <div class="events-grid">
      <div 
        v-for="event in filteredEvents" 
        :key="event.id"
        class="event-card"
        @click="selectEvent(event)"
      >
        <div class="event-image">
          <img :src="event.imageUrl" :alt="event.title" />
          <div class="event-period">{{ event.period }}</div>
        </div>
        <div class="event-content">
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-brief">{{ event.brief }}</p>
          <div class="event-tags">
            <span 
              v-for="tag in event.tags" 
              :key="tag"
              class="event-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 事件详情模态框 -->
    <div class="event-modal" v-if="selectedEvent" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <h3 class="modal-title">{{ selectedEvent.title }}</h3>
        <p class="modal-period">{{ selectedEvent.period }}</p>
        <div class="modal-image">
          <img :src="selectedEvent.imageUrl" :alt="selectedEvent.title" />
        </div>
        <div class="modal-details">
          <p>{{ selectedEvent.description }}</p>
          <div class="event-impact" v-if="selectedEvent.impact">
            <h4>历史影响：</h4>
            <p>{{ selectedEvent.impact }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { historicalEvents } from '../../data/events';
import './index.scss';

interface HistoricalEvent {
  id: string;
  title: string;
  period: string;
  category: string;
  brief: string;
  description: string;
  impact: string;
  imageUrl: string;
  tags: string[];
}


const activeCategory = ref('all');
const selectedEvent = ref<HistoricalEvent | null>(null);

const eventCategories = [
  { id: 'all', name: '全部事件' },
  { id: 'political', name: '政治军事' },
  { id: 'cultural', name: '文化科技' },
  { id: 'economic', name: '经济社会' },
  { id: 'diplomatic', name: '外交民族' }
];

const filteredEvents = computed(() => {
  if (activeCategory.value === 'all') {
    return historicalEvents;
  }
  return historicalEvents.filter((event: HistoricalEvent) => event.category === activeCategory.value);
});

const selectEvent = (event: HistoricalEvent) => {
  selectedEvent.value = event;
};

const closeModal = () => {
  selectedEvent.value = null;
};
</script>