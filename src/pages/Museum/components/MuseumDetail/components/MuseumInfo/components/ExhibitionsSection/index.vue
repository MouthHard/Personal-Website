<template>
  <section class="exhibitions-section">
    <div class="section-header">
      <h2 class="section-title">最新展览</h2>
      <button class="more-button" @click="emit('update:activeTab', 'exhibitions')">更多</button>
    </div>
    <div v-if="homeExhibitions.length === 0" class="empty-state">
      <div class="empty-icon">
        <EmptyBoxIcon />
      </div>
      <h3 class="empty-title">暂无展览信息</h3>
      <p class="empty-description">该博物馆暂未举办展览，敬请期待</p>
    </div>
    <div v-else class="exhibitions-container">
      <div
        v-for="(exhibition, index) in homeExhibitions"
        :key="index"
        class="exhibition-card"
        @click="emit('update:activeTab', 'exhibitions')"
      >
        <div class="image-container">
          <img loading="lazy" :src="exhibition.image" @error="handleImageError" />
          <div class="image-placeholder" style="display: none">
            <span class="placeholder-icon"><ImageIcon /></span>
          </div>
        </div>
        <div class="exhibition-info">
          <h3 class="exhibition-title">{{ exhibition.title }}</h3>
          <p class="exhibition-description">{{ exhibition.description }}</p>
          <div class="action-buttons">
            <button
              class="action-button favorite-button"
              :class="{ active: isFavorited(exhibition.id) }"
              @click.stop="toggleFavorite(exhibition.id, exhibition.title)"
            >
              <span class="button-icon">
                <StarFilledIcon v-if="isFavorited(exhibition.id)" />
                <StarIcon v-else />
              </span>
              <span class="button-text">{{ isFavorited(exhibition.id) ? '已收藏' : '收藏' }}</span>
            </button>
            <button
              class="action-button follow-button"
              :class="{ active: isFollowed(exhibition.id) }"
              @click.stop="toggleFollow(exhibition.id, exhibition.title)"
            >
              <span class="button-icon">
                <BellFilledIcon v-if="isFollowed(exhibition.id)" />
                <BellIcon v-else />
              </span>
              <span class="button-text">{{ isFollowed(exhibition.id) ? '已关注' : '关注' }}</span>
            </button>
            <button class="action-button share-button" @click.stop="handleShare(exhibition)">
              <span class="button-icon"><ShareIcon /></span>
              <span class="button-text">分享</span>
            </button>
          </div>
          <p class="exhibition-date"><CalendarIcon class="date-icon" />  {{ exhibition.date }}</p>
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
import { computed, ref } from "vue";
import type { Museum } from "@/typesOfPages/museum";
import type { Exhibition } from "@/typesOfPages/museum/index";
import { useMuseumDataStore } from "@/stores/museum";
import { EmptyBoxIcon, ImageIcon, StarIcon, StarFilledIcon, BellIcon, BellFilledIcon, ShareIcon, CalendarIcon } from "@/pages/Museum/icons/common";
import { useExhibitionPrefs } from "@/composables/museum/useExhibitionPrefs";
import { ShareModal } from "@/pages/Museum/components/common";

interface Props {
  museum: Museum;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:activeTab': [tab: string] }>();
const store = useMuseumDataStore();

const { isFollowed, isFavorited, toggleFollow, toggleFavorite } = useExhibitionPrefs(() => props.museum.id);

const shareVisible = ref(false);
const shareTitle = ref('');
const shareDescription = ref('');

const handleShare = (exhibition: Exhibition) => {
  shareTitle.value = exhibition.title;
  shareDescription.value = exhibition.description;
  shareVisible.value = true;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target) {
    target.style.display = "none";
    const placeholder = target.nextElementSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = "flex";
    }
  }
};

const homeExhibitions = computed(() => {
  if (!props.museum) return [];
  return store.getExhibitionsByMuseumId(props.museum.id);
});
</script>

<style lang="scss" scoped src="./index.scss"></style>
