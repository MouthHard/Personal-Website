<template>
  <div class="exhibition-scrollable">
    <div v-if="exhibitions.length === 0" class="empty-state">
      <div class="empty-icon">
        <SearchXIcon />
      </div>
      <h3 class="empty-title">未找到相关展览</h3>
      <p class="empty-description">尝试更换筛选条件或搜索关键词</p>
    </div>
    <div v-else class="category-exhibitions">
      <div
        v-for="exhibition in exhibitions"
        :key="exhibition.id"
        class="exhibition-item"
        :class="{ active: selectedExhibitionId === exhibition.id }"
        :style="{
          '--bg-image': `url(${getExhibitionBackground(exhibition.id)})`,
        }"
        @click="selectExhibition(exhibition)"
      >
        <div class="exhibition-image">
          <img loading="lazy" :src="exhibition.image" :alt="exhibition.title" />
          <div
            v-if="exhibition.status"
            class="status-badge"
            :style="{
              background: getStatusGradient(exhibition.status),
            }"
          >
            {{ exhibition.status }}
          </div>
        </div>
        <div class="exhibition-details">
          <h3 class="exhibition-title">{{ exhibition.title }}</h3>
          <p class="exhibition-date">展览时间：{{ exhibition.date }}</p>
          <p v-if="exhibition.location" class="exhibition-location">
            展览地点：{{ exhibition.location }}
          </p>
          <p class="exhibition-description">{{ exhibition.description }}</p>
          <div class="exhibition-actions">
            <button
              class="action-btn follow-btn"
              :class="{ active: isFollowed(exhibition.id) }"
              @click.stop="toggleFollow(exhibition.id, exhibition.title)"
            >
              <component
                :is="isFollowed(exhibition.id) ? BellFilledIcon : BellIcon"
                class="btn-icon"
              />
              <span>{{ isFollowed(exhibition.id) ? '已关注' : '关注' }}</span>
            </button>
            <button
              class="action-btn favorite-btn"
              :class="{ active: isFavorited(exhibition.id) }"
              @click.stop="toggleFavorite(exhibition.id, exhibition.title)"
            >
              <component
                :is="isFavorited(exhibition.id) ? StarFilledIcon : StarIcon"
                class="btn-icon"
              />
              <span>{{ isFavorited(exhibition.id) ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="action-btn share-btn" @click.stop="handleShare(exhibition)">
              <ShareIcon class="btn-icon" />
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <ShareModal
      v-model:visible="shareVisible"
      :title="shareTitle"
      :description="shareDescription"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { Exhibition } from '@/typesOfPages/museum/index';
  import { SearchXIcon, BellIcon, BellFilledIcon, StarIcon, StarFilledIcon, ShareIcon } from '@/pages/Museum/icons/common';
  import { useExhibitionPrefs } from '@/composables/museum/useExhibitionPrefs';
  import { useCurrentMuseumId } from '@/composables/museum/useCurrentMuseumId';
  import { ShareModal } from '@/pages/Museum/components/common';

  // Props
  const props = defineProps({
    exhibitions: {
      type: Array as () => Exhibition[],
      default: () => [],
    },
    selectedExhibitionId: {
      type: Number,
      default: null,
    },
  });

  // Emits
  const emit = defineEmits(['selectExhibition']);

  // 展览卡片背景图（OSS 托管）
  const OSS_BASE = 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/museum/exhibition/card-bg';
  const backgroundImageArray = Array.from({ length: 10 }, (_, i) => `${OSS_BASE}/card${i + 1}.webp`);

  // 存储每个展览的背景图片索引
  const exhibitionBackgrounds = ref<Record<number, number>>({});

  // 获取展览的背景图片
  const getExhibitionBackground = (exhibitionId: number) => {
    if (!exhibitionBackgrounds.value[exhibitionId]) {
      exhibitionBackgrounds.value[exhibitionId] = Math.floor(
        Math.random() * backgroundImageArray.length,
      );
    }
    return backgroundImageArray[exhibitionBackgrounds.value[exhibitionId]];
  };

  // 根据状态获取背景渐变色
  const getStatusGradient = (status: string) => {
    switch (status) {
      case '热门':
        return 'linear-gradient(135deg, #8B0000 0%, #A0522D 100%)';
      case '最新':
        return 'linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)';
      case '即将结束':
        return 'linear-gradient(135deg, #78350F 0%, #92400E 100%)';
      case '筹备中':
        return 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)';
      case '已结束':
        return 'linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)';
      default:
        return 'linear-gradient(135deg, #306d47 0%, #245e38 50%, #174e29 100%)';
    }
  };

  // 选择展览
  const selectExhibition = (exhibition: Exhibition) => {
    emit('selectExhibition', exhibition);
  };

  // ===== 关注 / 收藏 / 分享（与详情面板共享状态） =====
  const { isFollowed, isFavorited, toggleFollow, toggleFavorite } = useExhibitionPrefs(useCurrentMuseumId());

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShare = (exhibition: Exhibition) => {
    shareTitle.value = exhibition.title;
    shareDescription.value = exhibition.description;
    shareVisible.value = true;
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
