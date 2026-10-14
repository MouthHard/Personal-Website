<template>
  <div class="scenery-gallery">
    <div v-if="sceneryGallery.length > 0" class="carousel-container">
      <StarfieldBackground />

      <div class="carousel-header">
        <div class="header-content">
          <div class="icon-container">
            <GalleryPanelIcon class="panel-icon" />
          </div>

          <div class="text-content">
            <p class="section-title">风光画廊</p>
            <p class="section-subtitle">
              探索目的地的绝美风光，感受自然与人文魅力
            </p>
          </div>
        </div>
      </div>

      <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(image, index) in sceneryGallery" :key="index" class="carousel-item">
          <div class="carousel-content">
            <div class="carousel-image-container">
              <img loading="lazy" :src="image.url" class="carousel-image" />
            </div>
            <div class="carousel-description-container">
              <div class="carousel-title-row">
                <h4 class="carousel-title" @click="$emit('navigate-to-spot', image.title)">{{ image.title }}</h4>
                <span class="carousel-rating">
                  <span class="rating-icon">
                    <StarIcon />
                  </span>
                  {{ image.rating || 5.0 }}
                </span>
              </div>
              <p class="carousel-description">{{ image.description }}</p>
              <div class="carousel-info">
                <span class="info-item">
                  <span class="info-icon">
                    <LocationIcon />
                  </span>
                  {{ image.location || '景区 ' }}
                </span>
              </div>
              <div class="carousel-actions">
                <button class="gallery-action action-like" :class="{ active: isSpotLike(image.id) }" aria-label="点赞景点"
                  @click.stop="handleToggleLike(image.id, image.title)">
                  <ThumbUpIcon class="action-icon" :filled="isSpotLike(image.id)" />
                </button>
                <button class="gallery-action action-want" :class="{ active: isSpotWant(image.id) }" aria-label="想去景点"
                  @click.stop="handleToggleWant(image.id, image.title)">
                  <HeartIcon class="action-icon" :filled="isSpotWant(image.id)" />
                </button>
                <button class="gallery-action action-share" aria-label="分享景点" @click.stop="handleShare(image)">
                  <ShareIcon class="action-icon" />
                </button>
                <button class="gallery-action action-been" :class="{ active: isSpotBeen(image.id) }" aria-label="去过景点"
                  @click.stop="handleToggleBeen(image.id, image.title)">
                  <FlagIcon class="action-icon" :filled="isSpotBeen(image.id)" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="carousel-controls">
        <button class="carousel-control prev" aria-label="上一个" @click="prevSlide">
          <GalleryPrevIcon class="control-icon" />
        </button>
        <button class="carousel-control next" aria-label="下一个" @click="nextSlide">
          <GalleryNextIcon class="control-icon" />
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <PictureIcon />
      </div>
      <h4 class="empty-title">暂无风光图片</h4>
      <p class="empty-description">该地区暂无风光图片数</p>
    </div>

    <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl"
      @close="closeShare" />
  </div>
</template>

<script setup lang="ts">
import LocationIcon from '../../../../../icons/common/LocationIcon.vue';
import PictureIcon from '../../../../../icons/pages/scenery/PictureIcon.vue';
import StarIcon from '../../../../../icons/common/StarIcon.vue';
import HeartIcon from '../../../../../icons/common/HeartIcon.vue';
import ThumbUpIcon from '../../../../../icons/common/ThumbUpIcon.vue';
import ShareIcon from '../../../../../icons/common/ShareIcon.vue';
import FlagIcon from '../../../../../icons/common/FlagIcon.vue';
import { ref, computed } from 'vue';
import type { ScenerySpot, SceneryData } from '@/typesOfPages/travelGuide';
import {
  StarfieldBackground,
  GalleryPanelIcon,
  GalleryPrevIcon,
  GalleryNextIcon,
} from '@/pages/TravelGuide/icons/pages/scenery';
import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';
import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';

const props = defineProps<{
  sceneryData?: SceneryData;
}>();

defineEmits<{
  (e: 'navigate-to-spot', spotName: string): void;
}>();

const { isSpotLike, toggleSpotLike, isSpotWant, toggleSpotWant, isSpotBeen, toggleSpotBeen } = useSceneryPrefs();
const { show: showToast } = useTravelToast();
const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

const handleToggleLike = (id: string, name: string) => {
  const wasLike = isSpotLike(id);
  toggleSpotLike(id);
  showToast({ type: 'success', message: wasLike ? `已取消点赞「${name}」` : `已点赞「${name}」` });
};
const handleToggleWant = (id: string, name: string) => {
  const wasWant = isSpotWant(id);
  toggleSpotWant(id);
  showToast({ type: 'success', message: wasWant ? `已移出想去清单「${name}」` : `已加入想去清单「${name}」` });
};
const handleShare = (image: { title: string; location: string; rating?: number; ticketPrice: string }) => {
  openShare(
    image.title,
    `${image.title}｜${image.location}｜评分 ${image.rating ?? 4.5}｜门票 ${image.ticketPrice || '免费'}`,
  );
};
const handleToggleBeen = (id: string, name: string) => {
  const wasBeen = isSpotBeen(id);
  toggleSpotBeen(id);
  showToast({ type: 'success', message: wasBeen ? `已取消「${name}」去过标记` : `已标记「${name}」为去过` });
};

const currentSlide = ref(0);

// 使用计算属性替代方法，避免每次渲染都返回新数组
const sceneryGallery = computed(() => {
  // 从props获取数据，如果没有则返回空数组
  if (props.sceneryData?.spots && props.sceneryData.spots.length > 0) {
    return props.sceneryData.spots.slice(0, 3).map((spot: ScenerySpot) => ({
      id: spot.id,
      url: spot.image,
      title: spot.name,
      description: spot.description,
      location: spot.location,
      rating: spot.rating,
      ticketPrice: spot.ticketPrice || '',
    }));
  }

  return [];
});

const prevSlide = () => {
  const totalSlides = sceneryGallery.value.length;
  if (totalSlides <= 1) return;

  if (currentSlide.value === 0) {
    currentSlide.value = totalSlides - 1;
  } else {
    currentSlide.value--;
  }
};

const nextSlide = () => {
  const totalSlides = sceneryGallery.value.length;
  if (totalSlides <= 1) return;

  if (currentSlide.value === totalSlides - 1) {
    currentSlide.value = 0;
  } else {
    currentSlide.value++;
  }
};
</script>

<style scoped lang="scss" src="./index.scss"></style>
