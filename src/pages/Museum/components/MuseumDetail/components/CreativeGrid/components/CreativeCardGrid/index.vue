<template>
  <div>
    <div class="category-filter">
      <h3 class="filter-title">所有文创产品</h3>
      <div class="filter-buttons">
        <button
          class="filter-btn"
          :class="{ active: selectedCategory === '全部' }"
          @click="selectedCategory = '全部'"
        >
          全部
        </button>
        <button
          v-for="category in ALL_CATEGORIES"
          :key="category"
          class="filter-btn"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="empty-state">
      <div class="empty-icon">
        <EmptyBoxIcon />
      </div>
      <h3 class="empty-title">{{ selectedCategory === '全部' ? '暂无文创产品' : '该分类暂无文创' }}</h3>
      <p class="empty-description">{{ selectedCategory === '全部' ? '该博物馆暂未上架文创产品，敬请期待' : '该博物馆暂无「' + selectedCategory + '」类文创产品，请浏览其他分类' }}</p>
    </div>

    <div v-else class="creative-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="creative-card-wrapper"
      >
        <div class="creative-card">
          <div class="hanger">
            <div class="rope"></div>
            <div class="ring"></div>
          </div>

          <div class="creative-image">
            <img loading="lazy" :src="product.image" :alt="product.name" />
          </div>
          <div class="creative-info">
            <div class="creative-header">
              <span class="creative-category">{{ product.category }}</span>
              <div class="action-buttons">
                <button
                  class="action-btn like-btn"
                  :class="{ active: isLiked(product) }"
                  title="点赞"
                  @click.stop="handleLikeClick(product)"
                >
                  <LikeFilledIcon v-if="isLiked(product)" />
                  <LikeIcon v-else />
                </button>
                <button

                  class="action-btn star-btn"
                  :class="{ active: isFavored(product) }"
                  title="收藏"
                  @click.stop="handleFavoriteClick(product)"
                >
                  <StarFilledIcon v-if="isFavored(product)" />
                  <StarIcon v-else />
                </button>
                <button
                  class="action-btn share-btn"
                  title="分享"
                  @click.stop="handleShareClick(product)"
                >
                  <ShareIcon />
                </button>
              </div>
            </div>
            <h3 class="creative-name">{{ product.name }}</h3>
            <p class="creative-desc">{{ product.description }}</p>
            <div class="creative-footer">
              <p class="creative-price">¥{{ product.price }}</p>
              <button class="buy-btn">加入购物车</button>
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
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { CreativeProduct } from '@/typesOfPages/museum/index';
  import {

    StarIcon,
    StarFilledIcon,
    ShareIcon,
    LikeIcon,
    LikeFilledIcon,
    EmptyBoxIcon,
  } from '@/pages/Museum/icons/common';
  import { ShareModal } from '@/pages/Museum/components/common';
  import { useCreativePrefs } from '@/composables/museum/useCreativePrefs';
  import { useCurrentMuseumId } from '@/composables/museum/useCurrentMuseumId';

  const props = defineProps<{
    creativeProducts: CreativeProduct[];
  }>();

  const selectedCategory = ref('全部');

  const ALL_CATEGORIES = ['文具', '家居', '服饰', '饰品', '茶具', '摆件', '图书', '玩具', '数码', '食品', '复制品', '香具'];

  const filteredProducts = computed(() => {
    if (selectedCategory.value === '全部') {
      return props.creativeProducts;
    }
    return props.creativeProducts.filter(
      (product) => product.category === selectedCategory.value,
    );
  });

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
</script>

<style lang="scss" scoped src="./index.scss"></style>
