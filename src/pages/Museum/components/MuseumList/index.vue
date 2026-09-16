<template>
  <div class="museum-container">
    <div class="museum-header">
      <div class="header-title">
        <span class="title-icon">
          <MuseumBuildingIcon />
        </span>
        <h2 class="section-title">
          {{ selectedProvince ? selectedProvince + '的博物馆' : '博物馆列表' }}
        </h2>
        <span v-if="displayMuseums.length > 0" class="museum-count">
          {{ displayMuseums.length }}
        </span>
      </div>
      <MuseumSearchBox
        ref="searchBoxRef"
        :museums="museums"
        :selected-province="selectedProvince"
        @filtered="handleFiltered"
      />
    </div>

    <div v-if="displayMuseums.length > 0" class="museum-grid">
      <div
        v-for="(museum, index) in displayMuseums"
        :key="museum.id"
        class="museum-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="openMuseumDetail(museum)"
      >
        <div class="museum-image">
          <div class="museum-badge-wrapper">
            <div class="museum-badge">
              <span class="badge-icon">
                <SparkleIcon />
              </span>
              {{ museum.type }}
            </div>
            <div class="visitor-count">
              <VisitorsIcon />
              <span>{{ museum.visitors > 0 ? formatNumber(museum.visitors) + ' 年访问量' : '暂无数据' }}</span>
            </div>
          </div>

          <div class="image-container">
            <img
              :src="getMuseumImage(museum)"
              :alt="String(museum.id)"
              loading="lazy"
              @error="handleImageError"
            />
            <div v-if="imageErrors[museum.id]" class="image-placeholder">
              <span class="placeholder-icon">
                <MuseumBuildingIcon />
              </span>
            </div>

            <div class="image-stats">
              <span class="stat-item" title="文物数量">
                <span class="stat-icon">
                  <VaseIcon />
                </span>
                <template v-if="museum.artifacts > 0">
                  <span class="stat-value">{{ formatNumber(museum.artifacts) }}</span>
                  <span>件文物</span>
                </template>
                <span v-else class="stat-value">暂无数据</span>
              </span>
              <span class="stat-item" title="展览数量">
                <span class="stat-icon">
                  <PaletteIcon />
                </span>
                <span class="stat-value">{{ museum.exhibitions }}</span>
                <span>个展览</span>
              </span>
            </div>
          </div>
        </div>

        <div class="museum-info">
          <h3 class="museum-name">{{ museum.name }}</h3>

          <div class="museum-meta">
            <span class="museum-location">
              <LocationIcon />
              {{ museum.province }}
            </span>
            <span class="museum-type-tag">{{ museum.type }}</span>
          </div>

          <p class="museum-description">{{ museum.description }}</p>

          <div class="quick-actions">
            <button
              class="action-btn primary"
              @click.stop="openMuseumDetail(museum)"
            >
              <span>查看详情</span>
            </button>

          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <div class="no-results-bg" aria-hidden="true">
        <span class="bg-icon bg-icon-1"><MuseumBuildingIcon /></span>
        <span class="bg-icon bg-icon-2"><VaseIcon /></span>
        <span class="bg-icon bg-icon-3"><PaletteIcon /></span>
        <span class="bg-icon bg-icon-4"><SparkleIcon /></span>
        <span class="bg-icon bg-icon-5"><MapIcon /></span>
        <span class="bg-icon bg-icon-6"><CameraIcon /></span>
        <span class="bg-icon bg-icon-7"><GlobeIcon /></span>
        <span class="bg-icon bg-icon-8"><StarIcon /></span>
        <span class="bg-icon bg-icon-9"><SearchXIcon /></span>
        <span class="bg-icon bg-icon-10"><LocationIcon /></span>
        <span class="bg-icon bg-icon-11"><VideoIcon /></span>
        <span class="bg-icon bg-icon-12"><ImageIcon /></span>
      </div>
      <div class="no-results-content">
        <div class="no-results-icon">
          <SearchXIcon />
        </div>
        <h3>未找到相关博物馆</h3>
        <p class="no-results-desc">
          <span v-if="selectedProvince">在「{{ selectedProvince }}」省份下</span>未匹配到相关博物馆
        </p>
        <p class="no-results-hint">尝试调整筛选条件，或浏览全部博物馆</p>
        <button class="reset-btn" @click="handleReset">
          <MuseumBuildingIcon />
          <span>浏览全部博物馆</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Museum } from '@/typesOfPages/museum';
  import { formatNumber, generateMuseumRoute } from '@/utils/museum';
  import { getMuseumImage } from '@/utils/museum/imagePool';
  import {
    LocationIcon,
    VisitorsIcon,

    MuseumBuildingIcon,
    SparkleIcon,
    VaseIcon,
    PaletteIcon,
    SearchXIcon,
    MapIcon,
    CameraIcon,
    GlobeIcon,
    StarIcon,
    VideoIcon,
    ImageIcon,
  } from '../../icons/common';
  import MuseumSearchBox from './components/MuseumSearchBox/index.vue';

  interface Props {
    museums: Museum[];
    selectedProvince: string;
  }

  const props = defineProps<Props>();
  const router = useRouter();

  const displayMuseums = ref<Museum[]>([]);
  const imageErrors = reactive<Record<number, boolean>>({});
  const searchBoxRef = ref<InstanceType<typeof MuseumSearchBox> | null>(null);

  const emit = defineEmits<{
    'reset-province': [];
  }>();

  const handleFiltered = (filtered: Museum[]) => {
    displayMuseums.value = filtered;
  };

  const handleReset = () => {
    searchBoxRef.value?.clear();
    emit('reset-province');
  };

  const openMuseumDetail = (museum: Museum) => {
    const routePath = generateMuseumRoute(museum.province, museum.id);
    router.push(routePath);
  };

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    const museumId = parseInt(img.alt);
    if (museumId) {
      imageErrors[museumId] = true;
    }
    img.style.display = 'none';
  };
</script>

<style lang="scss" scoped src="./index.scss"></style>
