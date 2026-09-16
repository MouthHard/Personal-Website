<template>
  <div v-if="selectedExhibition" class="exhibition-detail">
    <!-- Header：左封面图 + 右信息区 -->
    <div class="detail-header">
      <div class="header-cover">
        <img loading="lazy" :src="selectedExhibition.image" :alt="selectedExhibition.title" />
        <div
          v-if="selectedExhibition.status"
          class="status-badge"
          :style="{ background: getStatusGradient(selectedExhibition.status) }"
        >
          {{ selectedExhibition.status }}
        </div>
      </div>
      <div class="header-info">
        <h3 class="detail-title">{{ selectedExhibition.title }}</h3>
        <div class="header-tags">
          <span v-if="selectedExhibition.category" class="tag-item category">
            {{ selectedExhibition.category }}
          </span>
          <span class="tag-item date">{{ selectedExhibition.date }}</span>
        </div>
        <div v-if="selectedExhibition.location" class="header-location">
          <LocationIcon class="loc-icon" />
          <span>{{ selectedExhibition.location }}</span>
        </div>
        <div class="header-actions">
          <button
            class="action-btn follow-btn"
            :class="{ active: isFollowed(selectedExhibition.id) }"
            @click="toggleFollow(selectedExhibition.id, selectedExhibition.title)"
          >
            <component
              :is="isFollowed(selectedExhibition.id) ? BellFilledIcon : BellIcon"
              class="btn-icon"
            />
            <span>{{ isFollowed(selectedExhibition.id) ? '已关注' : '关注' }}</span>
          </button>
          <button
            class="action-btn favorite-btn"
            :class="{ active: isFavorited(selectedExhibition.id) }"
            @click="toggleFavorite(selectedExhibition.id, selectedExhibition.title)"
          >
            <component
              :is="isFavorited(selectedExhibition.id) ? StarFilledIcon : StarIcon"
              class="btn-icon"
            />
            <span>{{ isFavorited(selectedExhibition.id) ? '已收藏' : '收藏' }}</span>
          </button>
          <button class="action-btn share-btn" @click="handleShare(selectedExhibition)">
            <ShareIcon class="btn-icon" />
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>

    <div class="detail-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'overview' }"
        @click="activeTab = 'overview'"
      >
        展览概览
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'exhibits' }"
        @click="activeTab = 'exhibits'"
      >
        展品欣赏
      </button>
    </div>

    <div v-if="activeTab === 'overview'" class="detail-content">
      <div class="content-section section-overview">
        <h4 class="section-title">展览简介</h4>
        <p class="detail-description">{{ selectedExhibition.description }}</p>
      </div>

      <div v-if="highlights.length > 0" class="content-section section-highlights">
        <h4 class="section-title">展览亮点</h4>
        <ul class="highlights-list">
          <li v-for="(point, i) in highlights" :key="i" class="highlight-item">
            <span class="highlight-marker">{{ i + 1 }}</span>
            <span class="highlight-text">{{ point }}</span>
          </li>
        </ul>
      </div>

      <div v-if="visitInfo" class="content-section section-guide">
        <h4 class="section-title">参观指南</h4>
        <div class="visit-guide">
          <div v-if="visitInfo.openTime" class="guide-row">
            <span class="guide-label">开放时间</span>
            <span class="guide-value">
              {{ typeof visitInfo.openTime === 'string' ? visitInfo.openTime : visitInfo.openTime.regularTime }}
              <template v-if="typeof visitInfo.openTime === 'object' && visitInfo.openTime.closeDay">
                （闭馆：{{ visitInfo.openTime.closeDay }}）
              </template>
            </span>
          </div>
          <div v-if="visitInfo.ticket" class="guide-row">
            <span class="guide-label">门票价格</span>
            <span class="guide-value">
              {{ typeof visitInfo.ticket === 'string' ? visitInfo.ticket : visitInfo.ticket.price }}
            </span>
          </div>
          <div v-if="visitInfo.transportation?.address" class="guide-row">
            <span class="guide-label">展馆地址</span>
            <span class="guide-value">{{ visitInfo.transportation.address }}</span>
          </div>
          <div v-if="visitInfo.transportation?.metro" class="guide-row">
            <span class="guide-label">交通指引</span>
            <span class="guide-value">{{ visitInfo.transportation.metro }}</span>
          </div>
          <div v-if="visitInfo.rules?.forbidden?.length" class="guide-row">
            <span class="guide-label">参观须知</span>
            <span class="guide-value">{{ visitInfo.rules.forbidden.join('；') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'exhibits'" class="detail-content">
      <div class="content-section section-exhibits">
        <h4 class="section-title">展品欣赏</h4>
        <div v-if="exhibitionArtifacts.length > 0" class="exhibits-masonry">
          <div v-for="(artifact, i) in exhibitionArtifacts" :key="artifact.id" class="exhibit-item">
            <div class="exhibit-image" :class="`size-${(i % 3) + 1}`">
              <img loading="lazy" :src="artifact.image" :alt="artifact.name" />
            </div>
            <div class="exhibit-info">
              <h5 class="exhibit-title">{{ artifact.name }}</h5>
              <span v-if="artifact.period" class="exhibit-period">{{ artifact.period }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-exhibits">
          <p>暂无展品信息</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="exhibition-detail-empty">
    <div class="empty-content">
      <div class="empty-icon"><MuseumBuildingIcon /></div>
      <h3>请选择一个展览</h3>
      <p>点击左侧展览卡片查看详细信息</p>
    </div>
  </div>
  <ShareModal
    v-model:visible="shareVisible"
    :title="shareTitle"
    :description="shareDescription"
  />
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { Exhibition, MuseumDetailInfo } from '@/typesOfPages/museum/index';
  import { useMuseumDataStore } from '@/stores/museum';
  import {
    MuseumBuildingIcon,
    LocationIcon,
    BellIcon,
    BellFilledIcon,
    StarIcon,
    StarFilledIcon,
    ShareIcon,
  } from '@/pages/Museum/icons/common';
  import { useExhibitionPrefs } from '@/composables/museum/useExhibitionPrefs';
  import { useCurrentMuseumId } from '@/composables/museum/useCurrentMuseumId';
  import { ShareModal } from '@/pages/Museum/components/common';

  const props = defineProps({
    selectedExhibition: {
      type: Object as () => Exhibition | null,
      default: null,
    },
  });

  const store = useMuseumDataStore();
  const activeTab = ref('overview');
  const museumDetails = ref<MuseumDetailInfo | null>(null);

  const { isFollowed, isFavorited, toggleFollow, toggleFavorite } = useExhibitionPrefs(useCurrentMuseumId());

  const exhibitionArtifacts = computed(() => {
    if (!props.selectedExhibition) return [];
    return store.getArtifactsByMuseumId(props.selectedExhibition.museumId);
  });

  const highlights = computed(() => {
    return props.selectedExhibition?.highlights ?? [];
  });

  const visitInfo = computed(() => {
    return museumDetails.value?.visitInfo;
  });

  const getStatusGradient = (status: string) => {
    switch (status) {
      case '热门':
        return 'linear-gradient(135deg, #8B0000 0%, #A0522D 100%)';
      case '最新':
        return 'linear-gradient(135deg, #1E3A8A 0%, #1e40af 100%)';
      case '即将结束':
        return 'linear-gradient(135deg, #78350F 0%, #92400E 100%)';
      case '筹备中':
        return 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)';
      case '已结束':
        return 'linear-gradient(135deg, #374151 0%, #4b5563 100%)';
      default:
        return 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)';
    }
  };

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShare = (exhibition: Exhibition) => {
    shareTitle.value = exhibition.title;
    shareDescription.value = exhibition.description;
    shareVisible.value = true;
  };

  watch(
    () => props.selectedExhibition?.museumId,
    async (museumId) => {
      if (museumId) {
        museumDetails.value = await store.getMuseumDetailsById(museumId);
      } else {
        museumDetails.value = null;
      }
    },
    { immediate: true },
  );
</script>

<style lang="scss" scoped src="./index.scss"></style>
