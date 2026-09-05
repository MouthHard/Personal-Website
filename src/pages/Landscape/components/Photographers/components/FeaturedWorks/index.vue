<template>
  <section class="featured-works-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">
          <ApertureIcon />
        </span>
        精选作品
      </h2>
      <p class="section-desc">来自优秀摄影师的代表作品</p>
    </div>
    <div v-if="featuredWorks.length > 0" class="film-carrier">
      <div class="film-strip-edge top">
        <div class="sprocket-row"></div>
        <div class="edge-code">KODAK SAFETY FILM 5032 ▼</div>
      </div>
      <div class="film-body">
        <button class="scroll-dial left" @click="scrollLeft">
          <div class="dial-outer">
            <div class="dial-ring outer-ring"></div>
            <div class="dial-ring inner-ring"></div>
            <div class="dial-arrow">
              <ChevronLeftIcon :stroke-width="3" />
            </div>
          </div>
        </button>
        <div ref="scrollContainerRef" class="works-scroll-container">
          <div class="works-scroll">
            <div
              v-for="(work, index) in featuredWorks"
              :key="work.id || `work-${index}`"
              class="work-item"
              :style="{ '--index': index }"
              @click="$emit('preview', work)"
            >
              <div class="film-frame">
                <div class="frame-edge top-edge"></div>
                <div class="frame-edge bottom-edge"></div>
                <div class="film-gate"></div>
                <img loading="lazy" :src="work.image" :alt="work.title" />

                <div class="work-overlay">

                  <div class="work-info">
                    <h3 class="work-title">{{ work.title }}</h3>
                    <p class="work-author">{{ work.author }}</p>
                  </div>
                </div>
              </div>
              <div class="frame-meta">
                <span class="frame-number">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="frame-divider">—</span>
                <span class="frame-id">A</span>
              </div>
            </div>
          </div>
        </div>
        <button class="scroll-dial right" @click="scrollRight">
          <div class="dial-outer">
            <div class="dial-ring outer-ring"></div>
            <div class="dial-ring inner-ring"></div>
            <div class="dial-arrow">
              <ChevronRightIcon :stroke-width="3" />
            </div>
          </div>
        </button>
      </div>
      <div class="film-strip-edge bottom">
        <div class="sprocket-row"></div>
        <div class="edge-code">▲ 5032 FILM SAFETY KODAK</div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <ImageEmptyIcon />
      </div>
      <p class="empty-text">暂无精选作品</p>
      <span class="empty-hint">优秀作品即将呈现</span>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';

  import { useLandscapeDataStore } from '@/stores/landscape';
  import { useInteractionStore } from '@/stores/landscape';
  import ApertureIcon from '@/pages/Landscape/icon/components/photographers/FeaturedWorks/ApertureIcon.vue';
  import ChevronLeftIcon from '@/pages/Landscape/icon/common/ChevronLeftIcon.vue';
  import ChevronRightIcon from '@/pages/Landscape/icon/common/ChevronRightIcon.vue';
  import ImageEmptyIcon from '@/pages/Landscape/icon/common/ImageIcon.vue';

  defineEmits<{
    preview: [work: any];
  }>();

  const interactionStore = useInteractionStore();
  const dataStore = useLandscapeDataStore();


  const featuredWorks = computed(() =>
    dataStore
      .getAllImages()
      .slice(0, 20)
      .map((img) => {
        const photographer = dataStore.getPhotographer(img.authorId)
        return {
          id: img.id,
          image: img.thumbnail || img.url,
          title: img.title,
          author: photographer?.name || img.author || '未知摄影师',
          authorId: img.authorId,
          authorAvatar: photographer?.avatar,
          location: img.location,
          category: img.category,
          type: 'image',
          likes: img.likes,
          views: img.views,
          loves: img.loves,
          favorites: img.favorites || 0,
          shares: img.shares,
        }
      })
  );

  const scrollContainerRef = ref<HTMLElement | null>(null);

  const getItemStep = () => {
    const el = scrollContainerRef.value;
    if (!el) return 346;
    const firstItem = el.querySelector('.work-item') as HTMLElement;
    if (!firstItem) return 346;
    return firstItem.offsetWidth + 6;
  };

  const scrollLeft = () => {
    const el = scrollContainerRef.value;
    if (!el) return;
    if (el.scrollLeft <= 5) {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: -getItemStep(), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const el = scrollContainerRef.value;
    if (!el) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: getItemStep(), behavior: 'smooth' });
    }
  };

  let scrollRAF: number;
  let scrollHandler: (() => void) | null = null;

  onMounted(() => {
    const el = scrollContainerRef.value;
    if (el) {
      scrollHandler = () => {
        cancelAnimationFrame(scrollRAF);
        scrollRAF = requestAnimationFrame(() => {
          // 滚动处理
        });
        
      };
      el.addEventListener('scroll', scrollHandler, { passive: true });
    }

    interactionStore.registerBatch(
      featuredWorks.value.map((work) => ({
        id: work.id,
        counts: {
          likes: work.likes || 0,
          loves: work.loves || 0,
          favorites: work.favorites || 0,
          views: work.views || 0,
          shares: work.shares || 0,
        },
      })),
    );
  });

  onUnmounted(() => {
    cancelAnimationFrame(scrollRAF);
    const el = scrollContainerRef.value;
    if (el && scrollHandler) {
      el.removeEventListener('scroll', scrollHandler);
    }
  });
</script>

<style scoped lang="scss" src="./index.scss" />
