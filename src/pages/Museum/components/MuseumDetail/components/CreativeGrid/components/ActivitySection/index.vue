<template>
  <div class="activity-section">
    <div class="section-header">
      <span class="title-icon"><LeafIcon /></span>
      文创活动
    </div>

    <div v-if="activities.length === 0" class="empty-state">
      <div class="empty-icon">
        <EmptyBoxIcon />
      </div>
      <h3 class="empty-title">暂无文创活动</h3>
      <p class="empty-description">该博物馆暂未举办文创活动，敬请期待</p>
    </div>

    <!-- 3D轮播容器 -->
    <div v-else class="carousel-wrapper">
      <button class="nav-arrow left" @click="prevSlide">
        <span>➺</span>
      </button>

      <div class="carousel-stage">
        <div class="carousel-track">
          <div
            v-for="(activity, index) in activities"
            :key="activity.id"
            :class="['carousel-slide', getSlideClass(index)]"
            :style="getSlideStyle(index)"
          >
            <div class="slide-card">
              <div class="card-image">
                <img loading="lazy" :src="activity.image" :alt="activity.title" />
                <div class="image-overlay">
                  <span class="type-badge">{{ activity.type }}</span>
                  <span :class="['status-badge', activity.status]">
                    <span v-if="activity.status === 'ongoing'" class="status-dot">●</span>
                    {{ getStatusText(activity.status) }}
                  </span>
                </div>
              </div>

              <div class="card-content">
                <h4 class="content-title">{{ activity.title }}</h4>

                <div class="content-meta">
                  <span class="meta-item">
                    <span class="meta-icon"><CalendarIcon /></span>
                    {{ activity.date }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon"><LocationIcon /></span>
                    {{ activity.location }}
                  </span>
                </div>

                <p class="content-desc">{{ activity.description }}</p>

                <!-- 名额进度 -->
                <div v-if="activity.quota" class="quota-section">
                  <div class="quota-bar">
                    <div
                      class="quota-fill"
                      :style="{
                        width:
                          ((activity?.enrolled || 0) / activity.quota) * 100 +
                          '%',
                      }"
                      :class="{
                        urgent: activity.quota - (activity?.enrolled || 0) <= 5,
                      }"
                    ></div>
                  </div>
                  <span class="quota-text">
                    已报名
                    <strong>{{ activity?.enrolled || 0 }}</strong>
                    / {{ activity.quota }}
                  </span>
                </div>

                <div class="action-area">
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

                  <button
                    :class="['action-btn', activity.status]"
                    :disabled="activity.status === 'ended'"
                    @click.stop="handleAction(activity)"
                  >
                    <span class="btn-text">{{ getActionText(activity) }}</span>
                    <span v-if="activity.status !== 'ended'" class="btn-icon">➤</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="nav-arrow right" @click="nextSlide">
        <span>➺</span>
      </button>
    </div>

    <!-- 指示器 -->
    <div v-if="activities.length > 0" class="carousel-indicators">
      <button
        v-for="(activity, index) in activities"
        :key="activity.id"
        :class="['indicator', { active: currentIndex === index }]"
        @click="goToSlide(index)"
      >
        <FoodPointIcon />
      </button>
    </div>

    <ShareModal
      v-model:visible="shareVisible"
      :title="shareTitle"
      :description="shareDescription"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useMuseumDataStore } from '@/stores/museum';
  import type { Museum } from '@/typesOfPages/museum/index';
  import { FoodPointIcon } from '@/pages/Museum/icons/pages/CreativeProduct';
  import { ShareModal } from '@/pages/Museum/components/common';
  import { ShareIcon, LikeIcon, LikeFilledIcon, StarIcon, StarFilledIcon, EmptyBoxIcon, LeafIcon, CalendarIcon, LocationIcon } from '@/pages/Museum/icons/common/index.ts';
  import { deriveStatus } from '@/utils/museum';
  import { useActivityPrefs } from '@/composables/museum/useActivityPrefs';

  interface Activity {
    id: number;
    title: string;
    description: string;
    image: string;
    type: string;
    date: string;
    location: string;
    status: 'upcoming' | 'ongoing' | 'ended';
    quota?: number;
    enrolled?: number;
    favorited?: boolean;
  }

  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();
  const store = useMuseumDataStore();


  const activities = computed<Activity[]>(() => {
    return store.getCreativeActivitiesByMuseumId(props.museum.id).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      type: item.time || '活动',
      date: item.date,
      location: item.location || '待定',
      status: deriveStatus(item.date),
    }));
  });


  const getStatusText = (status: 'upcoming' | 'ongoing' | 'ended') => {
    const texts = { upcoming: '未开始', ongoing: '进行中', ended: '已结束' };
    return texts[status];
  };

  const currentIndex = ref(0);
  const totalItems = computed(() => activities.value.length);

  // 获取卡片的类名
  const getSlideClass = (index: number) => {
    const diff = index - currentIndex.value;
    if (diff === 0) return 'active';
    if (diff === -1 || diff === totalItems.value - 1) return 'prev';
    if (diff === 1 || diff === -(totalItems.value - 1)) return 'next';
    return 'hidden';
  };

  // 获取卡片的样式
  const getSlideStyle = (index: number) => {
    const diff = index - currentIndex.value;
    const normalizedDiff =
      diff < -1
        ? diff + totalItems.value
        : diff > 1
          ? diff - totalItems.value
          : diff;

    return {
      '--index': normalizedDiff,
    };
  };

  const prevSlide = () => {
    if (totalItems.value === 0) return;
    currentIndex.value =
      currentIndex.value === 0 ? totalItems.value - 1 : currentIndex.value - 1;
  };

  const nextSlide = () => {
    if (totalItems.value === 0) return;
    currentIndex.value =
      currentIndex.value === totalItems.value - 1 ? 0 : currentIndex.value + 1;
  };

  const goToSlide = (index: number) => {
    currentIndex.value = index;
  };

  const getActionText = (activity: Activity) => {
    const texts = {
      upcoming: '预约活动',
      ongoing: '参加活动',
      ended: '已结束',
    };
    return texts[activity.status];
  };

  const handleAction = (_activity: Activity) => {

  };

  const {
    isLiked: prefsIsLiked,
    isFavored: prefsIsFavored,
    toggleLike: prefsToggleLike,
    toggleFavorite: prefsToggleFavorite,
  } = useActivityPrefs(() => props.museum.id);

  const isLiked = (activity: Activity) => prefsIsLiked(activity.id);
  const isFavored = (activity: Activity) => prefsIsFavored(activity.id);

  const handleLikeClick = (activity: Activity) => prefsToggleLike(activity.id, activity.title);
  const handleFavoriteClick = (activity: Activity) => prefsToggleFavorite(activity.id, activity.title);

  const handleShare = (activity: Activity) => {
    shareTitle.value = activity.title;
    shareDescription.value = activity.description;
    shareVisible.value = true;
  };

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');
</script>

<style lang="scss" scoped src="./index.scss"></style>
