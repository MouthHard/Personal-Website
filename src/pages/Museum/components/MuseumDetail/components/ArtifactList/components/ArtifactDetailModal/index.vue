<template>
  <div class="artifact-modal" :class="{ open: artifact }">
    <div v-if="artifact" class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ artifact.name }}</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <img
          v-if="artifact.image && !imageFailed"
          loading="lazy"
          :src="artifact.image"
          class="artifact-detail-image"
          @error="imageFailed = true"
        />
        <div v-else class="artifact-detail-placeholder">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
          </svg>
          <span>{{ artifact.name }}</span>
        </div>
        <div class="modal-content-grid">
          <div class="artifact-detail-description">
            <strong>描述：</strong>
            {{ artifact.description }}
          </div>
          <div class="modal-actions-container">
            <div class="modal-actions">
              <button class="modal-action-btn love">
                <HeartIcon />
              </button>
              <button class="modal-action-btn favorite">
                <StarIcon />
              </button>
              <button class="modal-action-btn share">
                <ShareIcon />
              </button>
            </div>
          </div>
          <div v-if="artifact.basicInfo" class="artifact-detail-section">
            <h3 class="section-title">基础信息</h3>
            <p
              v-if="artifact.basicInfo?.periodDetail"
              class="section-content basic-info-content"
            >
              <strong>详细年代：</strong>
              {{ artifact.basicInfo.periodDetail }}
            </p>
            <p
              v-if="artifact.basicInfo?.material"
              class="section-content basic-info-content"
            >
              <strong>材质工艺：</strong>
              {{ artifact.basicInfo.material }}
            </p>
            <p
              v-if="artifact.basicInfo?.dimensions"
              class="section-content basic-info-content"
            >
              <strong>规格：</strong>
              {{ artifact.basicInfo.dimensions }}
            </p>
            <p
              v-if="artifact.basicInfo?.collection"
              class="section-content basic-info-content"
            >
              <strong>收藏机构：</strong>
              {{ artifact.basicInfo.collection }}
            </p>
            <p
              v-if="artifact.basicInfo?.excavation"
              class="section-content basic-info-content"
            >
              <strong>出土信息：</strong>
              {{ artifact.basicInfo.excavation }}
            </p>
          </div>
          <div v-if="artifact.appearance" class="artifact-detail-section">
            <h3 class="section-title">外观细节</h3>
            <p class="section-content simple-content">
              {{ artifact.appearance }}
            </p>
          </div>
          <div v-if="artifact.historicalValue" class="artifact-detail-section">
            <h3 class="section-title">历史价值</h3>
            <p class="section-content simple-content">
              {{ artifact.historicalValue }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ArtifactDetail } from '@/typesOfPages/museum';
  import { HeartIcon, StarIcon, ShareIcon } from "@/pages/Museum/icon/pages/ArtifactContainer";

  const imageFailed = ref(false);

  interface Props {
    artifact: ArtifactDetail | null;
  }

  const props = defineProps<Props>();

  watch(() => props.artifact, () => { imageFailed.value = false; });

  // 定义 Emits
  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  // 处理关闭
  const handleClose = () => {
    emit('close');
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
