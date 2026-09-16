<template>
  <section class="immersive-section">
    <div class="section-header">
      <h2 class="section-title">沉浸式体验</h2>
      <button class="more-button" @click="emit('update:activeTab', 'special')">更多</button>
    </div>
    <div v-if="immersiveExperiences.length === 0" class="empty-state">
      <div class="empty-icon">
        <VideoIcon />
      </div>
      <h3 class="empty-title">暂无沉浸式体验</h3>
      <p class="empty-description">该博物馆暂未提供沉浸式体验内容</p>
    </div>
    <div v-else class="immersive-content">
      <div
        v-for="(item, index) in immersiveExperiences"
        :key="index"
        class="immersive-item"
        @click="emit('update:activeTab', 'special')"
      >
        <div class="immersive-image">
          <img v-if="item.image" loading="lazy" :src="item.image" />
        </div>
        <div class="immersive-info">
          <h3 class="immersive-title"><SparkleIcon class="title-deco" /> {{ item.title }}</h3>
          <p class="immersive-description">{{ item.description }}</p>
          <div class="immersive-actions">
            <button class="immersive-button" @click.stop="emit('update:activeTab', 'special')">体验详情</button>
            <div class="action-buttons">
              <button
                class="action-button like-button"
                :class="{ active: likedIds.has(index) }"
                @click.stop="toggleLike(index, item.title)"
              >
                <span class="button-icon">
                  <LikeFilledIcon v-if="likedIds.has(index)" />
                  <LikeIcon v-else />
                </span>
                <span class="button-text">点赞</span>
              </button>
              <button class="action-button share-button" @click.stop="handleShare(item)">
                <span class="button-icon"><ShareIcon /></span>
                <span class="button-text">分享</span>
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
  import { computed, reactive, ref } from 'vue';
  import type { Museum, ImmersiveExperience } from '@/typesOfPages/museum';
  import { useMuseumDataStore } from '@/stores/museum';
  import { VideoIcon, SparkleIcon, LikeIcon, LikeFilledIcon, ShareIcon } from '@/pages/Museum/icons/common';
  import { ShareModal } from '@/pages/Museum/components/common';
  import { useMuseumMessage } from '@/composables/museum/useMessage';

  interface Props {
    museum: Museum;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{ 'update:activeTab': [tab: string] }>();
  const store = useMuseumDataStore();
  const msg = useMuseumMessage();

  const likedIds = reactive(new Set<number>());

  const toggleLike = (index: number, title?: string) => {
    if (likedIds.has(index)) {
      likedIds.delete(index);
      if (title) msg.like.cancel();
    } else {
      likedIds.add(index);
      if (title) msg.like.success(title);
    }
  };

  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareDescription = ref('');

  const handleShare = (item: ImmersiveExperience) => {
    shareTitle.value = item.title;
    shareDescription.value = item.description;
    shareVisible.value = true;
  };

  const immersiveExperiences = computed(() => {
    if (!props.museum) return [];
    return store.getImmersiveByMuseumId(props.museum.id);
  });
</script>

<style lang="scss" scoped src="./index.scss"></style>
