<template>
  <section class="activities-section">
    <div class="section-header">
      <h2 class="section-title">活动预告</h2>
      <button class="more-button" @click="emit('update:activeTab', 'creative')">更多</button>
    </div>
    <div v-if="homeActivities.length === 0" class="empty-state">
      <div class="empty-icon">
        <EmptyBoxIcon />
      </div>
      <h3 class="empty-title">暂无活动预告</h3>
      <p class="empty-description">该博物馆暂无活动安排，敬请期待</p>
    </div>
    <div v-else class="activities-container">
      <div
        v-for="(activity, index) in homeActivities"
        :key="index"
        class="activity-card"
        @click="emit('update:activeTab', 'creative')"
      >
        <!-- 赛博朋克SVG背景 -->
        <CyberpunkBackground />

        <div class="title-bar">
          <h3 class="activity-title">{{ activity.title }}</h3>
          <span :class="['status-tag', activity.status]">
            {{ getStatusText(activity.status) }}
          </span>
        </div>

        <div class="activity-image">
          <img loading="lazy" :src="activity.image" :alt="activity.title" />
        </div>

        <div class="activity-info">
          <p class="activity-description">{{ activity.description }}</p>

          <div class="info-row">
            <div class="info-item date-item">
              <span class="info-icon"><CalendarIcon /></span>
              <span class="info-text">{{ activity.date }}</span>
            </div>
            <div class="info-item location-item">
              <span class="info-icon"><LocationIcon /></span>
              <span class="info-text">{{ activity.location || props.museum.name }}</span>
            </div>
          </div>

          <div class="action-row">
            <div class="interaction-icons">
              <button
                class="social-btn like-btn"
                :class="{ active: isLiked(activity) }"
                title="点赞"
                @click.stop="handleLikeClick(activity)"
              >
                <LikeFilledIcon v-if="isLiked(activity)" />
                <LikeIcon v-else />
              </button>
              <button
                class="social-btn star-btn"
                :class="{ active: isFavored(activity) }"
                title="收藏"
                @click.stop="handleFavoriteClick(activity)"
              >
                <StarFilledIcon v-if="isFavored(activity)" />
                <StarIcon v-else />
              </button>
              <button
                class="social-btn share-btn"
                title="分享"
                @click.stop="handleShare(activity)"
              >
                <ShareIcon />
              </button>
            </div>
            <div class="action-group">
              <button class="detail-link" @click.stop="emit('update:activeTab', 'creative')">
                查看详情
                <span class="link-arrow">›</span>
              </button>
              <button
                :class="['action-button', activity.status]"
                :disabled="activity.status === 'ended'"
                @click.stop="reserveActivity(activity)"
              >
                {{ getActionText(activity.status) }}
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
  import { ref, computed } from 'vue';
  import type { Museum } from '@/typesOfPages/museum';
  import { useMuseumDataStore } from '@/stores/museum';
  import { CyberpunkBackground } from '@/pages/Museum/icons/pages';
  import { ShareModal } from '@/pages/Museum/components/common';
  import { deriveStatus } from '@/utils/museum';
  import { useActivityPrefs } from '@/composables/museum/useActivityPrefs';
  import {
    EmptyBoxIcon,
    LocationIcon,
    CalendarIcon,
    LikeIcon,
    LikeFilledIcon,
    StarIcon,
    StarFilledIcon,
    ShareIcon,
  } from '@/pages/Museum/icons/common';

  interface HomeActivity {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    location: string;
    status: 'upcoming' | 'ongoing' | 'ended';
  }

  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{ 'update:activeTab': [tab: string] }>();
  const store = useMuseumDataStore();


  const getStatusText = (status: 'upcoming' | 'ongoing' | 'ended') => {
    const texts = { upcoming: '未开始', ongoing: '进行中', ended: '已结束' };
    return texts[status];
  };

  const getActionText = (status: 'upcoming' | 'ongoing' | 'ended') => {
    const texts = { upcoming: '预约活动', ongoing: '参加活动', ended: '已结束' };
    return texts[status];
  };

  const homeActivities = computed<HomeActivity[]>(() => {
    if (!props.museum) return [];
    return store
      .getCreativeActivitiesByMuseumId(props.museum.id)
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        date: item.date,
        location: item.location || props.museum.name,
        status: deriveStatus(item.date),
      }))
      .filter((a) => a.status === 'ongoing' || a.status === 'upcoming');
  });

  const {
    isLiked: prefsIsLiked,
    isFavored: prefsIsFavored,
    toggleLike: prefsToggleLike,
    toggleFavorite: prefsToggleFavorite,
  } = useActivityPrefs(() => props.museum.id);

  const isLiked = (activity: HomeActivity) => prefsIsLiked(activity.id);
  const isFavored = (activity: HomeActivity) => prefsIsFavored(activity.id);

  const handleLikeClick = (activity: HomeActivity) => prefsToggleLike(activity.id, activity.title);
  const handleFavoriteClick = (activity: HomeActivity) => prefsToggleFavorite(activity.id, activity.title);

  const handleShare = (activity: HomeActivity) => {
    shareTitle.value = activity.title;
    shareDescription.value = activity.description;
    shareVisible.value = true;
  };

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const reserveActivity = (_activity: HomeActivity) => {

  };

</script>

<style lang="scss" scoped src="./index.scss"></style>
