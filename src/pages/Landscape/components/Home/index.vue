<template>
  <div class="home-page">
    <SectionNavigator />

    <div data-nav-anchor>
      <FeaturedCarousel />
    </div>
    <div data-nav-anchor>
      <HotTopics />
    </div>
    <div data-nav-anchor>
      <PopularDestinations />
    </div>

    <div data-nav-anchor>
      <LazyLoadWrapper>
        <TravelGuides />
      </LazyLoadWrapper>
    </div>

    <div data-nav-anchor>
      <LazyLoadWrapper>
        <PhotographerRecommendations />
      </LazyLoadWrapper>
    </div>

    <div data-nav-anchor>
      <LazyLoadWrapper>
        <VideoShowcase />
      </LazyLoadWrapper>
    </div>

    <div data-nav-anchor>
      <LazyLoadWrapper>
        <VisualFeast
          :items="items"
          @open-detail="$emit('open-detail', $event)"
        />
      </LazyLoadWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  import type { LandscapeItem } from '@/typesOfPages/landscape';
  import LazyLoadWrapper from '@/components/common/LazyLoadWrapper/index.vue';
  import SectionNavigator from './components/SectionNavigator/index.vue';

  const FeaturedCarousel = defineAsyncComponent(
    () => import('./components/FeaturedCarousel/index.vue'),
  );
  const HotTopics = defineAsyncComponent(
    () => import('./components/HotTopics/index.vue'),
  );
  const PopularDestinations = defineAsyncComponent(
    () => import('./components/PopularDestinations/index.vue'),
  );

  const TravelGuides = defineAsyncComponent(
    () => import('./components/TravelGuides/index.vue'),
  );
  const PhotographerRecommendations = defineAsyncComponent(
    () => import('./components/PhotographerRecommendations/index.vue'),
  );
  const VideoShowcase = defineAsyncComponent(
    () => import('./components/VideoShowcase/index.vue'),
  );
  const VisualFeast = defineAsyncComponent(
    () => import('./components/VisualFeast/index.vue'),
  );

  defineProps<{
    items: LandscapeItem[];
  }>();

  defineEmits<{
    'open-detail': [item: LandscapeItem];
  }>();
</script>

<style scoped lang="scss" src="./index.scss" />
