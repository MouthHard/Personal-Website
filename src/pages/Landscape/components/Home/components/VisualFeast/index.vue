<template>
  <section v-if="images.length > 0" ref="feedRef" class="visual-feast-section">
    <div class="section-header">
      <SectionHeaderPlate
        tone="pink"
        label="GALLERY"
        title="视觉盛宴"
        subtitle="精选全球最美风景，每一帧都是艺术品"
        chapter="CHAPTER · 07"
      >
        <template #icon>
          <ImageIcon />
        </template>
        <template #action>
          <button class="more-btn" type="button">
            <span class="film-holes top" aria-hidden="true"></span>
            <span class="more-text">更多</span>
            <span class="more-arrow" aria-hidden="true">
              <ArrowRightIcon :stroke-width="2.4" />
            </span>
            <span class="film-holes bottom" aria-hidden="true"></span>
          </button>
        </template>
      </SectionHeaderPlate>
    </div>

    <div class="masonry-grid">
      <div
        v-for="(item, index) in visibleImages"
        :key="item.id"
        class="masonry-item"
        role="button"
        tabindex="0"
        :aria-label="`查看${item.title}`"
        :style="{
          '--delay': `${index * 0.05}s`,
          '--card-height': getCardHeight(index),
        }"
        @click="openImageModal(item, index)"
        @keydown.enter.prevent="openImageModal(item, index)"
        @keydown.space.prevent="openImageModal(item, index)"
      >
        <div class="image-card">
          <span class="glass-sheen" aria-hidden="true"></span>
          <div class="image-container">
            <LandscapeImage
              :src="item.thumbnail || item.url"
              :alt="item.title"
              loading="lazy"
            />
          </div>
          <div class="image-overlay">
            <div class="overlay-content">
              <h3>{{ item.title }}</h3>
              <p class="location">
                <LocationIcon :stroke-width="2" />
                {{ item.location }}
              </p>
              <div class="action-rings">
                <span class="ring-node r-views" @click.stop>
                  <span class="ring-body">
                    <EyeIcon :stroke-width="2" />
                  </span>
                  <span class="ring-val">
                    {{ formatNumber(getImageCount(item.id).views) }}
                  </span>
                </span>
                <button
                  class="ring-node r-like"
                  :class="{ active: isImageLiked(item.id) }"
                  @click.stop="toggleImageLike(item)"
                >
                  <span class="ring-body">
                    <ThumbUpIcon :filled="isImageLiked(item.id)" />
                  </span>
                  <span class="ring-val">
                    {{ formatNumber(getImageCount(item.id).likes) }}
                  </span>
                </button>
                <button
                  class="ring-node r-love"
                  :class="{ active: isImageLoved(item.id) }"
                  @click.stop="toggleImageLove(item)"
                >
                  <span class="ring-body">
                    <HeartIcon :filled="isImageLoved(item.id)" />
                  </span>
                  <span class="ring-val">
                    {{ formatNumber(getImageCount(item.id).loves) }}
                  </span>
                </button>
                <button
                  class="ring-node r-bookmark"
                  :class="{ active: isImageFavorited(item.id) }"
                  @click.stop="toggleImageFavorite(item)"
                >
                  <span class="ring-body">
                    <BookmarkIcon :filled="isImageFavorited(item.id)" />
                  </span>
                  <span class="ring-val">
                    {{ formatNumber(getImageCount(item.id).favorites) }}
                  </span>
                </button>
                <button
                  class="ring-node r-share"
                  @click.stop="toggleImageShare(item)"
                >
                  <span class="ring-body">
                    <ShareIcon />
                  </span>
                  <span class="ring-val">
                    {{ formatNumber(getImageCount(item.id).shares) }}
                  </span>
                </button>
                <button
                  class="ring-node r-download"
                  @click.stop="handleDownload(item)"
                >
                  <span class="ring-body">
                    <DownloadIcon />
                  </span>
                  <span class="ring-val">下载</span>
                </button>
              </div>
            </div>
          </div>
          <div class="image-badge">{{ item.category }}</div>
        </div>
      </div>
    </div>

    <!-- 片尾引带：抽出余下的底片 / 卷回画册 -->
    <div
      v-if="canToggleFeed"
      class="feast-toggle"
      :class="{ 'is-open': feedExpanded }"
    >
      <span class="toggle-rail left" aria-hidden="true"></span>
      <button
        class="feast-tab"
        type="button"
        :aria-expanded="feedExpanded"
        @click="toggleFeed"
      >
        <span class="tab-holes top" aria-hidden="true"></span>
        <span class="tab-holes bottom" aria-hidden="true"></span>
        <span class="tab-badge" aria-hidden="true">
          <ChevronDownIcon :stroke-width="2.4" />
        </span>
        <span class="tab-copy">
          <span class="tab-label">
            {{ feedExpanded ? '收起作品' : '展开更多作品' }}
          </span>
          <span class="tab-meta">
            {{
              feedExpanded
                ? `已展示 ${images.length} 张`
                : `还有 ${hiddenImagesCount} 张未看`
            }}
          </span>
        </span>
      </button>
      <span class="toggle-rail right" aria-hidden="true"></span>
    </div>

    <!-- 图片详情弹窗 · 单反相机取景器（光学取景 HUD） -->
    <ViewfinderModal
      :visible="showImageModal"
      :image="selectedImage"
      :current-index="currentImageIndex"
      :total="images.length"
      :counts="modalCounts"
      :liked="selectedImage ? isImageLiked(selectedImage.id) : false"
      :loved="selectedImage ? isImageLoved(selectedImage.id) : false"
      :favorited="selectedImage ? isImageFavorited(selectedImage.id) : false"
      @close="closeImageModal"
      @navigate="navigateImage"
      @like="toggleImageLike(selectedImage)"
      @love="toggleImageLove(selectedImage)"
      @favorite="toggleImageFavorite(selectedImage)"
      @share="toggleImageShare(selectedImage)"
      @download="handleDownload(selectedImage)"
    />
  </section>

  <ShareMenu v-model:visible="showShareMenu" :work="shareWork" />
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, watch } from 'vue';
  import { showMessage, createSimpleInteractionItem } from '@/utils/landscape';
  import {
    useInteractionStore,
    useLandscapeDataStore,
  } from '@/stores/landscape';
  import { formatNumber } from '@/utils/landscape/format';
  import { masonryCardHeights } from '@/constants/landscape';
  import type { GlobalImage } from '@/typesOfPages/landscape/data';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import ShareMenu from '../../../common/ShareMenu/index.vue';
  import ViewfinderModal from './ViewfinderModal/index.vue';
  import SectionHeaderPlate from '../common/SectionHeaderPlate/index.vue';
  import { useShareMenu } from '../../composables/useShareMenu';
  import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';

  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';

  import ArrowRightIcon from '@/pages/Landscape/icons/common/ArrowRightIcon.vue';
  import ChevronDownIcon from '@/pages/Landscape/icons/common/ChevronDownIcon.vue';
  import ImageIcon from '@/pages/Landscape/icons/common/ImageIcon.vue';

  const interactionStore = useInteractionStore();
  const dataStore = useLandscapeDataStore();
  const showImageModal = ref(false);
  const selectedImage = ref<GlobalImage | null>(null);
  const currentImageIndex = ref(0);

  const modalCounts = computed(() => {
    const img = selectedImage.value;
    if (!img) return { views: 0, likes: 0, loves: 0, favorites: 0, shares: 0 };
    return getImageCount(img.id);
  });

  const { visible: showShareMenu, shareWork, openShareMenu } = useShareMenu();

  const images = computed(() => dataStore.getAllImages());

  // 折叠：首屏只放 6 张（三列两排），余下的等拉手抽出
  const INITIAL_IMAGES = 6;
  const feedExpanded = ref(false);
  const feedRef = ref<HTMLElement | null>(null);

  const visibleImages = computed(() =>
    feedExpanded.value ? images.value : images.value.slice(0, INITIAL_IMAGES),
  );

  const hiddenImagesCount = computed(() =>
    Math.max(0, images.value.length - INITIAL_IMAGES),
  );

  const canToggleFeed = computed(() => images.value.length > INITIAL_IMAGES);

  const toggleFeed = () => {
    feedExpanded.value = !feedExpanded.value;
    if (feedExpanded.value) return;
    nextTick(() => {
      const el = feedRef.value;
      if (el && el.getBoundingClientRect().top < 0) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const getGlobalId = (id: string | number) => String(id);

  const getCardHeight = (index: number) => {
    return `${masonryCardHeights[index % masonryCardHeights.length]}px`;
  };

  watch(
    () => images.value.length,
    (len) => {
      if (len === 0) return;
      interactionStore.registerBatch(
        images.value.map((img: GlobalImage) => ({
          id: getGlobalId(img.id),
          counts: {
            likes: img.likes || 0,
            views: img.views || 0,
            loves: img.loves || 0,
            favorites: img.favorites || 0,
            shares: img.shares || 0,
          },
        })),
      );
    },
    { immediate: true },
  );

  const getImageCount = (id: string | number) =>
    interactionStore.getCount(getGlobalId(id));

  const isImageLiked = (id: string | number) =>
    interactionStore.isLiked(getGlobalId(id));
  const isImageLoved = (id: string | number) =>
    interactionStore.isLoved(getGlobalId(id));
  const isImageFavorited = (id: string | number) =>
    interactionStore.isFavorited(getGlobalId(id));

  const toggleImageLike = (image: GlobalImage | null) => {
    if (!image) return;
    const gId = getGlobalId(image.id);
    const item = createSimpleInteractionItem(gId, 'image', image.title, {
      image: image.thumbnail || '',
      location: image.location,
      category: image.category,
    });
    const isAdded = interactionStore.toggleLike(item);
    if (isAdded) {
      showMessage.like.success(image.title);
    } else {
      showMessage.like.cancel();
    }
  };

  const toggleImageLove = (image: GlobalImage | null) => {
    if (!image) return;
    const gId = getGlobalId(image.id);
    const item = createSimpleInteractionItem(gId, 'image', image.title, {
      image: image.thumbnail || '',
      location: image.location,
      category: image.category,
      author: image.author,
      authorId: image.authorId,
    });
    const isAdded = interactionStore.toggleLove(item);
    if (isAdded) {
      showMessage.love.success(image.title, 'image');
    } else {
      showMessage.love.cancel(image.title, 'image');
    }
  };

  const toggleImageFavorite = (image: GlobalImage | null) => {
    if (!image) return;
    const gId = getGlobalId(image.id);
    const item = createSimpleInteractionItem(gId, 'image', image.title, {
      image: image.thumbnail || '',
      location: image.location,
      category: image.category,
      author: image.author,
      authorId: image.authorId,
    });
    const isAdded = interactionStore.toggleFavorite(item);
    if (isAdded) {
      showMessage.favorite.success(image.title, 'image');
    } else {
      showMessage.favorite.cancel(image.title, 'image');
    }
  };

  const toggleImageShare = (image: GlobalImage | null) => {
    if (!image) return;
    openShareMenu({
      type: 'image',
      title: image.title,
      cover: image.thumbnail || image.url,
      author: image.author,
      date: image.date,
      location: image.location,
      category: image.category,
      camera: image.camera,
    });
  };

  const handleDownload = (image: GlobalImage | null) => {
    if (!image) return;
    showMessage.download.success(image.title);
  };

  const openImageModal = (image: GlobalImage, index: number) => {
    selectedImage.value = image;
    currentImageIndex.value = index;
    showImageModal.value = true;
  };

  const closeImageModal = () => {
    showImageModal.value = false;
  };

  const navigateImage = (direction: number) => {
    const newIndex = currentImageIndex.value + direction;
    if (newIndex >= 0 && newIndex < images.value.length) {
      currentImageIndex.value = newIndex;
      selectedImage.value = images.value[newIndex];
    }
  };
</script>

<style scoped lang="scss" src="./index.scss" />
