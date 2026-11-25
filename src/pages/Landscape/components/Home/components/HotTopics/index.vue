<template>
  <section v-if="displayedTopics.length > 0" class="hot-topics">
    <div class="section-header">
      <div class="title-wrapper">
        <span class="plate-glow" aria-hidden="true"></span>
        <span class="plate-sheen-clip" aria-hidden="true">
          <span class="plate-sheen"></span>
        </span>
        <span class="plate-corner tl" aria-hidden="true"></span>
        <span class="plate-corner tr" aria-hidden="true"></span>
        <span class="plate-corner bl" aria-hidden="true"></span>
        <span class="plate-corner br" aria-hidden="true"></span>

        <div class="header-left">
          <span class="title-badge" aria-hidden="true">
            <TrendIcon />
          </span>
          <div class="header-text">
            <span class="title-label">LANDSCAPE THEMES</span>
            <h2 class="section-title">万象景章</h2>
            <p class="section-subtitle">· 风光主题</p>
          </div>
        </div>

        <span class="plate-chapter" aria-hidden="true">CHAPTER · 02</span>
      </div>
    </div>

    <div class="topics-container">
      <div
        v-for="(topic, index) in displayedTopics"
        :key="topic.id"
        class="topic-card"
        :class="`card-${index + 1}`"
      >
        <div class="card-image">
          <LandscapeImage
            :src="topic.image"
            :alt="topic.title"
            loading="lazy"
          />
          <span class="card-badge">{{ topic.category }}</span>
          <span class="card-number">
            <CompassIcon class="compass-face" aria-hidden="true" />
            <span class="compass-num">0{{ index + 1 }}</span>
          </span>
        </div>
        <div class="card-content">
          <div class="publish-time-top">
            <CalendarIcon class="time-svg" />
            <span class="time-text">{{ topic.date }}</span>
          </div>

          <div class="content-header">
            <h3>{{ topic.title }}</h3>
            <div class="title-tags">
              <span class="season-tag">{{ topic.bestSeason }}</span>
            </div>
          </div>

          <p class="description">{{ topic.description }}</p>

          <div class="hot-locations">
            <div class="section-label">
              <LocationIcon class="label-svg" />
              <span class="label-text">热门地点</span>
            </div>
            <div class="locations-list">
              <span
                v-for="(location, idx) in topic.locations.slice(0, 3)"
                :key="idx"
                class="location-item"
                @click.stop
              >
                <span class="loc-dot"></span>
                {{ location }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="card-stats">
              <span class="stat stat-views">
                <EyeIcon />
                <span class="stat-value">
                  {{ formatNumber(getTopicCount(topic).views) }}
                </span>
              </span>
              <span class="stat stat-likes">
                <ThumbUpIcon />
                <span class="stat-value">
                  {{ formatNumber(getTopicCount(topic).likes) }}
                </span>
              </span>
              <span class="stat stat-favorites">
                <BookmarkIcon />
                <span class="stat-value">
                  {{ formatNumber(getTopicCount(topic).favorites) }}
                </span>
              </span>
              <span class="stat stat-comments">
                <CommentIcon />
                <span class="stat-value">{{ topic.comments }}</span>
              </span>
            </div>

            <button class="view-detail-btn" @click="openTopicDetail(topic)">
              <PlayCircleIcon />
              <span>查看详情</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="canToggle" class="load-more-container">
        <button
          class="load-more-btn"
          :class="{ expanded: isExpanded }"
          :aria-expanded="isExpanded"
          @click="toggleExpanded"
        >
          <ChevronDownIcon class="arrow-icon" />
          <span>
            {{
              isExpanded ? '收起主题' : `展开全部 ${hotTopics.length} 个主题`
            }}
          </span>
          <ChevronDownIcon class="arrow-icon" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Topic } from '@/typesOfPages/landscape/home';
  import {
    useLandscapeDataStore,
    useInteractionStore,
  } from '@/stores/landscape';
  import { parseCount, formatNumber } from '@/utils/landscape/format';
  import TrendIcon from '@/pages/Landscape/icons/components/home/HotTopics/TrendIcon.vue';
  import PlayCircleIcon from '@/pages/Landscape/icons/components/home/HotTopics/PlayCircleIcon.vue';

  import CalendarIcon from '@/pages/Landscape/icons/common/CalendarIcon.vue';
  import CompassIcon from '@/pages/Landscape/icons/common/CompassIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ChevronDownIcon from '@/pages/Landscape/icons/common/ChevronDownIcon.vue';
  import CommentIcon from '@/pages/Landscape/icons/components/profile/VideoCard/CommentIcon.vue';

  const router = useRouter();
  const dataStore = useLandscapeDataStore();
  const interactionStore = useInteractionStore();

  const hotTopics = computed(() => dataStore.getAllHotTopics());

  // 折叠态固定展示 3 张风景主题卡片，展开态展示全部
  const COLLAPSED_COUNT = 3;
  const isExpanded = ref(false);

  const displayedTopics = computed(() =>
    isExpanded.value
      ? hotTopics.value
      : hotTopics.value.slice(0, COLLAPSED_COUNT),
  );

  const getTopicId = (topic: Topic) => `topic-${topic.id}`;

  const getTopicCount = (topic: Topic) =>
    interactionStore.getCount(getTopicId(topic));

  watch(
    () => displayedTopics.value,
    (topics) => {
      topics.forEach((topic) => {
        interactionStore.registerCount(getTopicId(topic), {
          views: parseCount(topic.views),
          likes: parseCount(topic.likes),
          favorites: parseCount(topic.favorites || '0'),
        });
      });
    },
    { immediate: true },
  );

  // 主题数量超过折叠阈值才提供展开/收起切换
  const canToggle = computed(() => hotTopics.value.length > COLLAPSED_COUNT);

  const toggleExpanded = () => {
    if (!canToggle.value) return;
    isExpanded.value = !isExpanded.value;
  };

  const openTopicDetail = (topic: Topic) => {
    // 跳转到分类页面，并传递导航参数
    if (topic.navigation) {
      router.push({
        path: '/landscape/category',
        query: {
          dimension: topic.navigation.dimension,
          category: topic.navigation.category,
          subCategory: topic.navigation.subCategory,
        },
      });
    }
  };
</script>

<style scoped lang="scss" src="./index.scss" />
