<template>
  <section v-if="slides.length > 0" class="featured-section">
    <div class="section-header">
      <div class="header-plate">
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
            <VideoIcon />
          </span>
          <div class="header-text">
            <span class="title-label">FEATURED COLLECTION</span>
            <h2 class="section-title">山河流转</h2>
            <p class="section-subtitle">· 精选影像集</p>
          </div>
        </div>

        <span class="plate-chapter" aria-hidden="true">CHAPTER · 01</span>
      </div>
    </div>

    <div
      class="carousel-container"
      @mouseenter="pauseAutoPlay"
      @mouseleave="onMouseLeave"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div class="carousel-content">
        <div class="carousel-perspective">
          <div
            class="carousel-track"
            :class="{ 'no-transition': isJumping }"
            :style="{ transform: `translateX(-${position * 100}%)` }"
          >
            <div
              v-for="(slide, i) in renderSlides"
              :key="getSlideKey(slide, i)"
              class="carousel-slide"
              :class="{
                active: position === i,
                prev: position === i - 1,
                next: position === i + 1,
              }"
              :style="{
                '--accent': slide.accent,
                '--accent-soft': slide.accentSoft,
                '--accent-glow': slide.accentGlow,
              }"
            >
              <div class="slide-image">
                <LandscapeImage :src="slide.image" loading="lazy" />
                <div class="image-tint"></div>
                <div class="image-vignette"></div>
                <!-- 大序号水印：当前片的胶片帧编号 -->
                <div
                  v-if="position === i"
                  class="frame-index"
                  aria-hidden="true"
                >
                  {{ String(realIndex + 1).padStart(2, '0') }}
                </div>

                <!-- Z2 标签轨：分类眉标 + 媒体 + 画质 + 关键词 -->
                <div class="label-rail">
                  <span class="rail-eyebrow">
                    <i class="eyebrow-bar"></i>
                    {{ slide.category }}
                  </span>
                  <span class="rail-divider"></span>
                  <span class="media-chip">
                    <PlayIcon v-if="slide.mediaType === 'video'" />
                    <ImageFilledIcon v-else />
                    <span>
                      {{ slide.mediaType === 'video' ? '视频' : '图片' }}
                    </span>
                    <span
                      v-if="slide.mediaType === 'video' && slide.duration"
                      class="media-duration"
                    >
                      · {{ formatDuration(slide.duration) }}
                    </span>
                  </span>
                  <span class="quality-plate">{{ slide.quality }}</span>
                  <span class="rail-divider"></span>
                  <span
                    v-for="tag in slide.tags.slice(0, 2)"
                    :key="tag"
                    class="tag-chip"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="slide.tags.length > 2" class="tag-chip more">
                    +{{ slide.tags.length - 2 }}
                  </span>
                </div>

                <div class="slide-overlay" @mousemove="handleParallax">
                  <div
                    class="slide-content"
                    :style="{
                      '--mx': `${parallax.x}px`,
                      '--my': `${parallax.y}px`,
                    }"
                  >
                    <!-- Z4 信息规格卡：标题、定位与作者信息同处一块底板 -->
                    <div class="spec-card">
                      <div class="title-block">
                        <p class="title-kicker">FEATURED · 精选影像</p>
                        <h3 class="slide-title">{{ slide.title }}</h3>
                        <p class="slide-location">
                          <LocationIcon :stroke-width="2" />
                          {{ slide.location }}
                        </p>
                      </div>
                      <div class="spec-head">
                        <div class="author-info">
                          <span class="author-avatar">
                            <LandscapeImage
                              v-if="slide.authorAvatar"
                              :src="slide.authorAvatar"
                              :alt="slide.author"
                              variant="avatar"
                            />
                            <span v-else class="author-fallback">
                              {{ slide.author.slice(0, 1) }}
                            </span>
                          </span>
                          <span class="author-meta">
                            <span class="author-name">
                              {{ slide.author }}
                              <StarIcon
                                v-if="slide.authorVerified"
                                class="verified"
                              />
                            </span>
                            <span class="author-sub">
                              <span v-if="slide.authorRating">
                                {{ slide.authorRating }} 分
                              </span>
                              <span v-if="slide.camera" class="meta-dot">
                                ·
                              </span>
                              <span v-if="slide.camera">
                                {{ slide.camera }}
                              </span>
                              <span v-if="slide.date" class="meta-dot">·</span>
                              <span v-if="slide.date">{{ slide.date }}</span>
                            </span>
                          </span>
                        </div>
                        <span class="spec-sheen"></span>
                      </div>
                      <div class="spec-stats">
                        <div
                          class="spec-stat like"
                          :class="{
                            active: interactionStore.isLiked(
                              getSlideId(slide.id),
                            ),
                          }"
                        >
                          <ThumbUpIcon
                            :filled="
                              interactionStore.isLiked(getSlideId(slide.id))
                            "
                          />
                          <span
                            :key="`l-${fmt(interactionStore.getCount(getSlideId(slide.id)).likes)}`"
                            class="stat-num"
                          >
                            {{
                              fmt(
                                interactionStore.getCount(getSlideId(slide.id))
                                  .likes,
                              )
                            }}
                          </span>
                          <small>赞</small>
                        </div>
                        <div
                          class="spec-stat love"
                          :class="{
                            active: interactionStore.isLoved(
                              getSlideId(slide.id),
                            ),
                          }"
                        >
                          <HeartIcon
                            :filled="
                              interactionStore.isLoved(getSlideId(slide.id))
                            "
                          />
                          <span
                            :key="`v-${fmt(interactionStore.getCount(getSlideId(slide.id)).loves)}`"
                            class="stat-num"
                          >
                            {{
                              fmt(
                                interactionStore.getCount(getSlideId(slide.id))
                                  .loves,
                              )
                            }}
                          </span>
                          <small>爱</small>
                        </div>
                        <div
                          class="spec-stat favorite"
                          :class="{
                            active: interactionStore.isFavorited(
                              getSlideId(slide.id),
                            ),
                          }"
                        >
                          <BookmarkIcon
                            :filled="
                              interactionStore.isFavorited(getSlideId(slide.id))
                            "
                          />
                          <span
                            :key="`f-${fmt(interactionStore.getCount(getSlideId(slide.id)).favorites)}`"
                            class="stat-num"
                          >
                            {{
                              fmt(
                                interactionStore.getCount(getSlideId(slide.id))
                                  .favorites,
                              )
                            }}
                          </span>
                          <small>藏</small>
                        </div>
                        <div class="spec-stat view">
                          <EyeIcon />
                          <span
                            :key="`w-${fmt(interactionStore.getCount(getSlideId(slide.id)).views)}`"
                            class="stat-num"
                          >
                            {{
                              fmt(
                                interactionStore.getCount(getSlideId(slide.id))
                                  .views,
                              )
                            }}
                          </span>
                          <small>览</small>
                        </div>
                        <div class="spec-stat share">
                          <ShareIcon />
                          <span
                            :key="`s-${fmt(interactionStore.getCount(getSlideId(slide.id)).shares)}`"
                            class="stat-num"
                          >
                            {{
                              fmt(
                                interactionStore.getCount(getSlideId(slide.id))
                                  .shares,
                              )
                            }}
                          </span>
                          <small>享</small>
                        </div>
                      </div>
                    </div>

                    <!-- Z5 交互工具条 -->
                    <div class="action-bar">
                      <button
                        class="primary-action"
                        :class="{
                          active: interactionStore.isLiked(
                            getSlideId(slide.id),
                          ),
                          bursting: burstIds[getSlideId(slide.id)],
                        }"
                        title="点赞"
                        @click="onLike(slide)"
                      >
                        <ThumbUpIcon
                          :filled="
                            interactionStore.isLiked(getSlideId(slide.id))
                          "
                        />
                        <span>点赞</span>
                        <i class="burst" aria-hidden="true"></i>
                      </button>
                      <span class="bar-divider"></span>
                      <button
                        class="icon-action love"
                        :class="{
                          active: interactionStore.isLoved(
                            getSlideId(slide.id),
                          ),
                        }"
                        title="喜爱"
                        @click="handleToggleLove(slide)"
                      >
                        <HeartIcon
                          :filled="
                            interactionStore.isLoved(getSlideId(slide.id))
                          "
                        />
                      </button>
                      <button
                        class="icon-action favorite"
                        :class="{
                          active: interactionStore.isFavorited(
                            getSlideId(slide.id),
                          ),
                        }"
                        title="收藏"
                        @click="handleToggleFavorite(slide)"
                      >
                        <BookmarkIcon
                          :filled="
                            interactionStore.isFavorited(getSlideId(slide.id))
                          "
                        />
                      </button>
                      <button
                        class="icon-action share"
                        title="分享"
                        @click="handleShare(slide)"
                      >
                        <ShareIcon />
                      </button>
                      <span class="bar-divider"></span>
                      <button
                        class="icon-action download"
                        title="下载"
                        @click="handleDownload(slide)"
                      >
                        <DownloadIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div :key="`p-${realIndex}`" class="auto-progress">
          <span class="auto-progress-fill"></span>
        </div>

        <div class="carousel-controls">
          <button class="control-btn prev" title="上一张" @click="prevSlide">
            <ChevronLeftIcon />
          </button>
          <div class="slide-counter">
            <span class="current">
              {{ String(realIndex + 1).padStart(2, '0') }}
            </span>
            <span class="divider">/</span>
            <span class="total">
              {{ String(totalSlides).padStart(2, '0') }}
            </span>
          </div>
          <button class="control-btn next" title="下一张" @click="nextSlide">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>

    <div class="carousel-dots">
      <button
        v-for="i in totalSlides"
        :key="i"
        :class="['dot', { active: realIndex === i - 1 }]"
        :title="`第 ${i} 张`"
        @click="goToSlide(i - 1)"
      ></button>
    </div>

    <ShareMenu v-model:visible="showShareMenu" :work="shareWork" />
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
  import { useHomeViewData } from '@/composables/landscape';
  import { useInteractionStore } from '@/stores/landscape';
  import {
    formatNumber as fmt,
    formatDuration,
  } from '@/utils/landscape/format';
  import { convertSlideToInteractionItem } from '@/utils/landscape/interaction';

  const { featuredSlides } = useHomeViewData();
  const slides = computed(() => featuredSlides());
  const totalSlides = computed(() => slides.value.length);
  type Slide = ReturnType<typeof featuredSlides>[number];
  import ShareMenu from '../../../common/ShareMenu/index.vue';
  import LandscapeImage from '../../../common/LandscapeImage/index.vue';
  import type { InteractionItem } from '@/typesOfPages/landscape';
  import { showMessage } from '@/utils/landscape';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import PlayIcon from '@/pages/Landscape/icons/common/PlayIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import StarIcon from '@/pages/Landscape/icons/common/StarIcon.vue';
  import VideoIcon from '@/pages/Landscape/icons/common/VideoIcon.vue';
  import ChevronLeftIcon from '@/pages/Landscape/icons/common/ChevronLeftIcon.vue';
  import ChevronRightIcon from '@/pages/Landscape/icons/common/ChevronRightIcon.vue';
  import ImageFilledIcon from '@/pages/Landscape/icons/components/home/FeaturedCarousel/ImageFilledIcon.vue';

  const interactionStore = useInteractionStore();

  /**
   * 轨道位置：1..n 对应真实图片；0 = 末张克隆，n+1 = 首张克隆。
   * UI 显示用 realIndex，滑动动画用 position，两者解耦才能实现首尾无缝循环。
   */
  const position = ref(1);
  /** 静默归位中：临时关闭 transition，避免从克隆位跳回真实位时产生倒带动画 */
  const isJumping = ref(false);
  let autoPlayTimer: number | null = null;
  let resetTimer: number | null = null;
  const showShareMenu = ref(false);
  const currentShareSlide = ref<Slide | null>(null);
  /** 指针视差位移，由 mousemove 写入，驱动标题层微动 */
  const parallax = ref({ x: 0, y: 0 });
  /** 正在迸发粒子的 slide id 集合，动画结束后移除 */
  const burstIds = ref<Record<string, boolean>>({});
  /** 触屏滑动起点 X */
  let touchStartX = 0;

  /** 真实索引 0..n-1 */
  const realIndex = computed(() => {
    const n = totalSlides.value;
    if (n === 0) return 0;
    return (((position.value - 1) % n) + n) % n;
  });

  /** 轨道渲染序列：末张克隆 + 真实列表 + 首张克隆 */
  const renderSlides = computed(() => {
    const list = slides.value;
    if (list.length === 0) return [];
    return [list[list.length - 1], ...list, list[0]];
  });

  const getSlideKey = (slide: Slide, i: number): string => {
    if (i === 0) return 'clone-last';
    if (i === renderSlides.value.length - 1) return 'clone-first';
    return slide.id || `slide-${i}`;
  };

  const shareWork = computed(() => {
    const slide = currentShareSlide.value;
    if (!slide) return {};
    return {
      type:
        slide.mediaType === 'video' ? ('video' as const) : ('image' as const),
      title: slide.title,
      cover: slide.image,
      author: slide.author,
      location: slide.location,
      category: slide.category,
    };
  });

  const clearReset = (): void => {
    if (resetTimer !== null) {
      window.clearTimeout(resetTimer);
      resetTimer = null;
    }
  };

  /** 关过渡 → 改位置 → 双帧后恢复过渡，归位过程对眼睛不可见 */
  const jumpTo = (target: number): void => {
    isJumping.value = true;
    position.value = target;
    void nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isJumping.value = false;
          clearReset();
        });
      });
    });
  };

  /** 滑到克隆位后，等过渡播完再静默回到对应的真实位 */
  const scheduleWrapReset = (): void => {
    clearReset();
    const n = totalSlides.value;
    if (position.value === n + 1) {
      resetTimer = window.setTimeout(() => jumpTo(1), 640);
    } else if (position.value === 0) {
      resetTimer = window.setTimeout(() => jumpTo(n), 640);
    }
  };

  /** 归位等待中或归位动画中，忽略新的导航指令，避免打断轨道 */
  const isLocked = (): boolean => isJumping.value || resetTimer !== null;

  const nextSlide = (): void => {
    if (isLocked() || position.value >= totalSlides.value + 1) return;
    position.value++;
    scheduleWrapReset();
  };

  const prevSlide = (): void => {
    if (isLocked() || position.value <= 0) return;
    position.value--;
    scheduleWrapReset();
  };

  const goToSlide = (index: number): void => {
    if (isLocked()) return;
    clearReset();
    position.value = index + 1;
  };

  const pauseAutoPlay = (): void => {
    if (autoPlayTimer) {
      window.clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  const startAutoPlay = (): void => {
    // 关键：先清掉旧定时器。此前 watch(immediate) 与 onMounted 各建一个，
    // 两个 interval 同时到点会让每次自动切换一次跳两张。
    pauseAutoPlay();
    autoPlayTimer = window.setInterval(() => {
      if (!document.hidden) {
        nextSlide();
      }
    }, 5000);
  };

  const getSlideId = (id: string) => id;

  const convertToInteractionItem = (slide: Slide): InteractionItem => {
    return convertSlideToInteractionItem(
      slide,
      (id) => interactionStore.getCount(id),
      '',
    );
  };

  const handleToggleFavorite = (slide: Slide) => {
    const item = convertToInteractionItem(slide);
    const isAdded = interactionStore.toggleFavorite(item);
    const mediaType = slide.mediaType === 'video' ? 'video' : 'image';
    if (isAdded) {
      showMessage.favorite.success(slide.title, mediaType);
    } else {
      showMessage.favorite.cancel(slide.title, mediaType);
    }
  };

  const handleToggleLove = (slide: Slide) => {
    const item = convertToInteractionItem(slide);
    const isAdded = interactionStore.toggleLove(item);
    const mediaType = slide.mediaType === 'video' ? 'video' : 'image';
    if (isAdded) {
      showMessage.love.success(slide.title, mediaType);
    } else {
      showMessage.love.cancel(slide.title, mediaType);
    }
  };

  const handleToggleLike = (slide: Slide) => {
    const item = convertToInteractionItem(slide);
    const isAdded = interactionStore.toggleLike(item);
    if (isAdded) {
      showMessage.like.success(slide.title);
    } else {
      showMessage.like.cancel();
    }
  };

  /** 点赞：原业务逻辑 + 粒子迸发反馈（不写回 store，纯视觉） */
  const onLike = (slide: Slide): void => {
    handleToggleLike(slide);
    const id = getSlideId(slide.id);
    burstIds.value[id] = true;
    window.setTimeout(() => {
      delete burstIds.value[id];
    }, 700);
  };

  /** 指针视差：把鼠标位置换算成 ±12px 的位移 */
  const handleParallax = (e: MouseEvent): void => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    parallax.value = { x: nx * -24, y: ny * -16 };
  };

  /** 鼠标离开：恢复视差并重启自动播 */
  const onMouseLeave = (): void => {
    parallax.value = { x: 0, y: 0 };
    startAutoPlay();
  };

  const onTouchStart = (e: TouchEvent): void => {
    touchStartX = e.changedTouches[0]?.clientX ?? 0;
  };

  const onTouchEnd = (e: TouchEvent): void => {
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0) prevSlide();
    else nextSlide();
  };

  /** 键盘左右箭头翻页 */
  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  };

  const handleShare = (slide: Slide) => {
    currentShareSlide.value = slide;
    showShareMenu.value = true;
  };

  const handleDownload = async (slide: Slide) => {
    try {
      const response = await fetch(slide.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slide.title}-${slide.id}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showMessage.download.success(slide.title);
    } catch (error) {
      console.error('Download failed:', error);
      showMessage.download.error();
      window.open(slide.image, '_blank');
    }
  };

  onMounted(() => {
    startAutoPlay();
    window.addEventListener('keydown', handleKeydown);
  });

  watch(
    () => slides.value.length,
    (len) => {
      if (len > 0) {
        position.value = Math.min(Math.max(position.value, 1), len);
        interactionStore.registerBatch(
          slides.value.map((s) => ({
            id: getSlideId(s.id),
            counts: {
              likes: s.likes || 0,
              views: s.views || 0,
              loves: s.loves || 0,
              favorites: s.favorites || 0,
              shares: s.shares || 0,
            },
          })),
        );
        startAutoPlay();
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    pauseAutoPlay();
    clearReset();
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<style scoped lang="scss" src="./index.scss" />
