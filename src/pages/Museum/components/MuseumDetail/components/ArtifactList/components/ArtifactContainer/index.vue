<template>
  <div class="artifact-main">
    <div class="artifact-container">
      <div v-if="artifacts.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">未找到相关文物</h3>
        <p class="empty-description">尝试更换搜索关键词或调整筛选条件</p>
        <div class="empty-tips">
          <span class="tip-item">💡 提示：</span>
          <span class="tip-text">使用更简短的关键词可能会有更多结果</span>
        </div>
      </div>
      <div
        v-for="artifact in artifacts"
        v-else
        :key="artifact.id"
        class="artifact-item"
        :class="{ active: activeArtifactId === artifact.id }"
        @click="handleArtifactClick(artifact)"
      >
        <div class="artifact-card">
          <div
            class="artifact-card-inner"
            :class="{ flipped: activeArtifactId === artifact.id }"
          >
            <div class="artifact-card-face front">
              <div class="artifact-image">
                <img
                  v-if="!failedImages.has(artifact.id)"
                  loading="lazy"
                  :src="artifact.image"
                  :alt="artifact.name"
                  @error="failedImages.add(artifact.id)"
                />
                <div v-else class="artifact-image-placeholder">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                  </svg>
                  <span>{{ artifact.name }}</span>
                </div>
                <div class="artifact-actions">
                  <button class="action-btn">
                    <HeartIcon />
                  </button>
                  <button class="action-btn">
                    <StarIcon />
                  </button>
                  <button class="action-btn">
                    <ShareIcon />
                  </button>
                </div>
              </div>
              <div class="artifact-info">
                <h3 class="artifact-name">{{ artifact.name }}</h3>
                <p class="artifact-period">{{ artifact.period }}</p>
                <p class="artifact-description">
                  {{ artifact.description }}
                </p>
              </div>
            </div>
            <!-- 卡片背面 -->
            <div class="artifact-card-face back"></div>
          </div>
        </div>
        <div
          class="artifact-disc"
          :class="{ active: activeArtifactId === artifact.id }"
        >
          <!-- 未激活状态 - 椭圆圆盘 -->
          <InactiveDiscIcon v-if="activeArtifactId !== artifact.id" />
          <!-- 激活状态 - 圆形圆盘 -->
          <ActiveDiscIcon v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 导入图标组件
  import {
    HeartIcon,
    StarIcon,
    ShareIcon,
    InactiveDiscIcon,
    ActiveDiscIcon
  } from "@/pages/Museum/icon/pages/ArtifactContainer";

  const failedImages = reactive(new Set<number>());

  // 定义 Props
  interface Props {
    artifacts: any[];
    activeArtifactId: number | null;
  }

  defineProps<Props>();

  // 定义 Emits
  const emit = defineEmits<{
    (e: 'artifactClick', artifact: any): void;
  }>();

  // 处理文物点击
  const handleArtifactClick = (artifact: any) => {
    emit('artifactClick', artifact);
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
