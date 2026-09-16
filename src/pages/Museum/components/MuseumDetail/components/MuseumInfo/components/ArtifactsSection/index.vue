<template>
  <section class="artifacts-section">
    <div class="section-header">
      <h2 class="section-title">文物精选</h2>
      <button class="more-button" @click="emit('update:activeTab', 'artifacts')">
        <span class="button-decoration"><SparkleIcon /></span>
        <span>更多</span>
      </button>
    </div>
    <div v-if="homeArtifacts.length === 0" class="empty-state">
      <div class="empty-icon">
        <VaseIcon />
      </div>
      <h3 class="empty-title">暂无馆藏文物</h3>
      <p class="empty-description">该博物馆暂未录入文物信息</p>
    </div>
    <div v-else class="artifacts-container">
      <div class="artifacts-wrapper" :style="getWrapperStyle()">
        <div
          v-for="(artifact, index) in homeArtifacts"
          :key="index"
          class="artifact-card"
          :style="getCardStyle(index)"
          @click="emit('update:activeTab', 'artifacts')"
          @mouseenter="handleMouseEnter(index)"
          @mouseleave="handleMouseLeave"
        >
          <div class="artifact-image">
            <img v-if="artifact.image"               loading="lazy"
              :src="artifact.image"
              :alt="artifact.name"
            />
            <div v-else class="image-placeholder">
              <span class="placeholder-icon"><VaseIcon /></span>
            </div>
          </div>
          <div class="artifact-info">
            <h3 class="artifact-name">{{ artifact.name }}</h3>
            <p class="artifact-period">{{ artifact.period }}</p>
            <div class="action-buttons">
              <button
                class="action-button like-button"
                :class="{ active: isThumbsUp(artifact.id) }"
                @click.stop="toggleThumbsUp(artifact.id, artifact.name)"
              >
                <span class="button-icon">
                  <LikeFilledIcon v-if="isThumbsUp(artifact.id)" />
                  <LikeIcon v-else />
                </span>
                <span class="button-text">点赞</span>
              </button>
              <button

                class="action-button collect-button"
                :class="{ active: isFavored(artifact.id) }"
                @click.stop="toggleFavor(artifact.id, artifact.name)"
              >
                <span class="button-icon">
                  <StarFilledIcon v-if="isFavored(artifact.id)" />
                  <StarIcon v-else />
                </span>
                <span class="button-text">收藏</span>
              </button>
              <button class="action-button share-button" @click.stop="handleShare(artifact)">
                <span class="button-icon"><ShareIcon /></span>
                <span class="button-text">分享</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ShareModal
      v-model:visible="shareVisible"
      :title="shareTitle"
      :description="shareDescription"
    />
  </section>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { Museum, Artifact } from '@/typesOfPages/museum';
  import { useMuseumDataStore } from '@/stores/museum';
  import {
    VaseIcon,
    SparkleIcon,

    StarIcon,
    StarFilledIcon,
    ShareIcon,
    LikeIcon,
    LikeFilledIcon,
  } from '@/pages/Museum/icons/common';
  import { useArtifactPrefs } from '@/composables/museum/useArtifactPrefs';
  import { ShareModal } from '@/pages/Museum/components/common';

  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{ 'update:activeTab': [tab: string] }>();
  const store = useMuseumDataStore();

  const hoveredIndex = ref<number | null>(null);

  const { isFavored, isThumbsUp, toggleFavor, toggleThumbsUp } = useArtifactPrefs(() => props.museum.id);

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShare = (artifact: Artifact) => {
    shareTitle.value = `文物 · ${artifact.name}`;
    shareDescription.value = artifact.description || '';
    shareVisible.value = true;
  };

  const homeArtifacts = computed(() => {
    if (!props.museum) return [];
    return store.getArtifactsByMuseumId(props.museum.id);
  });

  const getCardStyle = (index: number) => {
    const baseOffset = 60;

    let left = index * baseOffset;
    let zIndex = homeArtifacts.value.length - index;
    let transform = '';
    let transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

    // 当悬停在某个卡片上时
    if (hoveredIndex.value !== null) {
      if (index === hoveredIndex.value) {
        // 当前悬停的卡片
        zIndex = homeArtifacts.value.length + 1; // 提升到最上层
        transform = 'translateY(-10px) scale(1.05)';
      } else if (index > hoveredIndex.value) {
        // 右侧的卡片
        left = index * baseOffset + 100; // 右移100px
        zIndex = homeArtifacts.value.length - index; // 保持原有层级
      }
    }

    return {
      left: `${left}px`,
      zIndex,
      transform,
      transition,
    };
  };

  const handleMouseEnter = (index: number) => {
    hoveredIndex.value = index;
  };

  const getWrapperStyle = () => {
    const baseOffset = 60;
    const cardWidth = 380;
    const hoverExtraWidth = 150;
    const totalWidth = homeArtifacts.value.length * cardWidth + (homeArtifacts.value.length - 1) * baseOffset + hoverExtraWidth + 100;
    return {
      width: `${totalWidth}px`,
      minHeight: '400px',
    };
  };

  const handleMouseLeave = () => {
    hoveredIndex.value = null;
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
