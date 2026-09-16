<template>
  <div class="featured-carousel">
    <header>热门推荐</header>
    <div
      v-if="featuredProducts.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">
        <EmptyBoxIcon />
      </div>
      <h3 class="empty-title">暂无热门推荐</h3>
      <p class="empty-description">该博物馆暂未上架文创产品，敬请期待</p>
    </div>
    <div
      v-else
      class="carousel-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="carousel-wrapper">
        <div
          class="carousel-slides"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(product, index) in featuredProducts"
            :key="product.id || index"
            class="carousel-slide"
          >
            <div class="carousel-image">
              <img loading="lazy"                 :src="product.image || getDefaultImage(index)"
                class="product-image"
                @error="handleImageError"
              />
            </div>

            <div class="carousel-content">
              <h3 class="carousel-title">{{ product.name }}</h3>
              <p class="carousel-desc">{{ product.description }}</p>
              <div class="carousel-action">
                <span class="carousel-price">¥{{ product.price }}</span>
                <button
                  class="carousel-buy-btn"
                  @click="handleBuyClick(product)"
                >
                  立即购买
                </button>
                <button
                  class="carousel-like-btn"
                  :class="{ active: isLiked(product) }"
                  aria-label="点赞"
                  @click="handleLikeClick(product)"
                >
                  <LikeFilledIcon v-if="isLiked(product)" />
                  <LikeIcon v-else />
                </button>
                <button
                  class="carousel-favorite-btn"
                  :class="{ active: isFavored(product) }"
                  aria-label="收藏"
                  @click="handleFavoriteClick(product)"
                >
                  <StarFilledIcon v-if="isFavored(product)" />
                  <StarIcon v-else />
                </button>
                <button

                  class="carousel-share-btn"
                  aria-label="分享"
                  @click="handleShareClick(product)"
                >
                  <ShareIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="featuredProducts.length > 1"
        class="carousel-btn prev"
        aria-label="上一张"
        @click="prevSlide"
      >
        <CornArrowIcon />
      </button>
      <button
        v-if="featuredProducts.length > 1"
        class="carousel-btn next"
        aria-label="下一张"
        @click="nextSlide"
      >
        <CornArrowIcon />
      </button>

      <div v-if="featuredProducts.length > 1" class="carousel-indicators">
        <button
          v-for="(_, index) in featuredProducts"
          :key="`indicator-${index}`"
          class="indicator"
          :class="{ active: index === currentSlide }"
          :aria-label="`跳转到第${index + 1}张`"
          @click="goToSlide(index)"
        >
          <CarouselIndicatorIcon :is-active="index === currentSlide" />
        </button>
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
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import type { CreativeProduct } from '@/typesOfPages/museum/index';
  import {
    StarIcon,
    ShareIcon,
    CarouselIndicatorIcon,
    CornArrowIcon,
  } from '@/pages/Museum/icons/pages/CreativeProduct';
  import {
    EmptyBoxIcon,
    LikeIcon,
    LikeFilledIcon,
    StarFilledIcon,
  } from '@/pages/Museum/icons/common';
  import { ShareModal } from '@/pages/Museum/components/common';
  import { useCreativePrefs } from '@/composables/museum/useCreativePrefs';
  import { useCurrentMuseumId } from '@/composables/museum/useCurrentMuseumId';

  const props = defineProps<{
    creativeProducts: CreativeProduct[];
  }>();

  const emit = defineEmits<{
    (e: 'buy', product: CreativeProduct): void;
  }>();

  const currentSlide = ref(0);
  let autoSlideInterval: number | null = null;
  const isHovering = ref(false);

  onMounted(() => {
    startAutoSlide();
  });

  onUnmounted(() => {
    stopAutoSlide();
  });

  const startAutoSlide = () => {
    if (
      !isHovering.value &&
      !autoSlideInterval &&
      featuredProducts.value.length > 1
    ) {
      autoSlideInterval = window.setInterval(() => {
        nextSlide();
      }, 5000);
    }
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  };

  const handleMouseEnter = () => {
    isHovering.value = true;
    stopAutoSlide();
  };

  const handleMouseLeave = () => {
    isHovering.value = false;
    startAutoSlide();
  };

  // 最多显示5个产品
  const featuredProducts = computed(() => {
    return props.creativeProducts.slice(0, 5);
  });

  const nextSlide = () => {
    if (featuredProducts.value.length === 0) return;
    currentSlide.value =
      (currentSlide.value + 1) % featuredProducts.value.length;
  };

  const prevSlide = () => {
    if (featuredProducts.value.length === 0) return;
    currentSlide.value =
      (currentSlide.value - 1 + featuredProducts.value.length) %
      featuredProducts.value.length;
  };

  const goToSlide = (index: number) => {
    currentSlide.value = index;
  };

  const handleBuyClick = (product: CreativeProduct) => {
    emit('buy', product);
  };

  const {
    isLiked: prefsIsLiked,
    isFavored: prefsIsFavored,
    toggleLike: prefsToggleLike,
    toggleFavor: prefsToggleFavor,
  } = useCreativePrefs(useCurrentMuseumId());

  const isLiked = (product: CreativeProduct) => prefsIsLiked(product.id);
  const isFavored = (product: CreativeProduct) => prefsIsFavored(product.id);

  const handleLikeClick = (product: CreativeProduct) => prefsToggleLike(product.id, product.name);
  const handleFavoriteClick = (product: CreativeProduct) => prefsToggleFavor(product.id, product.name);

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShareClick = (product: CreativeProduct) => {
    shareTitle.value = product.name;
    shareDescription.value = product.description;
    shareVisible.value = true;
  };

  const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    target.src = getDefaultImage(currentSlide.value);
  };

  const getDefaultImage = (_index: number) => {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
      '<rect width="800" height="600" fill="#f5f5f5"/>' +
      '<text x="400" y="300" font-size="24" fill="#999" text-anchor="middle" dominant-baseline="middle">暂无图片</text>' +
      '</svg>'
    );
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
