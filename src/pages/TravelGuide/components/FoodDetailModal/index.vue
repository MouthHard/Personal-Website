<template>
  <Teleport to="body">
    <Transition name="detail-fade">
      <div
        v-if="visible && food"
        class="detail-mask"
        @click.self="$emit('close')"
      >
        <div class="detail-modal" role="dialog" aria-modal="true">
          <!-- 晶体棱面角标 -->
          <span class="detail-corner detail-corner-tl"></span>
          <span class="detail-corner detail-corner-tr"></span>
          <span class="detail-corner detail-corner-bl"></span>
          <span class="detail-corner detail-corner-br"></span>

          <!-- 顶部数据脉冲条 -->
          <div class="detail-statusbar">
            <span class="statusbar-pulse"></span>
            <span class="statusbar-text">FOOD_DATA_STREAM</span>
            <span class="statusbar-sep">//</span>
            <span class="statusbar-mode">ANALYSIS</span>
            <span class="statusbar-spacer"></span>
            <span class="statusbar-id">ID:0x{{ food.id.slice(0, 4).toUpperCase() }}</span>
          </div>

          <!-- 扫描脉冲线 -->
          <div class="detail-scanline"></div>

          <button class="detail-close" aria-label="关闭" @click="$emit('close')">
            <CloseIcon class="close-icon" />
          </button>

          <div class="detail-body">
            <aside class="detail-aside">
              <!-- 样本标签 -->
              <div class="detail-aside-tag">
                <span class="aside-tag-dot"></span>
                <span class="aside-tag-text">SPECIMEN</span>
                <span class="aside-tag-line"></span>
              </div>

              <div class="detail-hero">
                <img
                  :src="food.image"
                  :alt="food.name"
                  class="detail-image"
                />
                <div class="detail-hero-shade"></div>
                <div class="detail-hero-grid"></div>

                <div class="detail-hero-badges">
                  <span v-if="food.category" class="detail-badge-category">
                    {{ food.category }}
                  </span>
                  <span class="detail-badge-rating">
                    <StarIcon class="badge-star" />
                    {{ food.rating ?? 0 }}
                    <span v-if="food.reviewCount" class="badge-review-count">({{ food.reviewCount }})</span>
                  </span>
                </div>
              </div>

              <div class="detail-aside-price">
                <span class="aside-price-label">PRICE</span>
                <span class="aside-price-divider"></span>
                <span class="aside-price-symbol">¥</span>
                <span class="aside-price-amount">{{ food.price }}</span>
                <span class="aside-price-unit">/份</span>
              </div>

              <div class="detail-actions">
                <button
                  class="action-btn action-like"
                  :class="{ active: isThumbsUp }"
                  :aria-label="isThumbsUp ? '取消点赞' : '点赞'"
                  @click="$emit('toggle-thumbs-up')"
                >
                  <ThumbUpIcon class="action-icon" :filled="isThumbsUp" />
                  <span class="action-label">点赞</span>
                </button>
                <button

                  class="action-btn action-share"
                  aria-label="分享"
                  @click="$emit('share')"
                >
                  <LinkIcon class="action-icon" />
                  <span class="action-label">分享</span>
                </button>
              </div>

              <div v-if="food" class="detail-checkin">
                <button
                  class="checkin-btn checkin-eaten"
                  :class="{ active: isEaten(food.id) }"
                  @click="handleToggleEaten"
                >
                  <UtensilsIcon class="checkin-icon" :filled="isEaten(food.id)" />
                  <span>已吃</span>
                </button>
                <button
                  class="checkin-btn checkin-want"
                  :class="{ active: isWant(food.id) }"
                  @click="handleToggleWant"
                >
                  <HeartIcon class="checkin-icon" :filled="isWant(food.id)" />
                  <span>想吃</span>
                </button>
              </div>
            </aside>

            <div class="detail-content">
              <header class="detail-header">
                <div class="detail-header-mark">
                  <span class="header-mark-bar"></span>
                  <span class="header-mark-text">DATA_CRYSTAL</span>
                </div>
                <h2 class="detail-name">{{ food.name }}</h2>
                <div v-if="food.taste || food.cookingMethod" class="detail-meta-row">
                  <span v-if="food.taste" class="detail-meta-chip detail-meta-taste">
                    <span class="meta-chip-label">口味</span>
                    <span class="meta-chip-value">{{ food.taste }}</span>
                  </span>
                  <span v-if="food.cookingMethod" class="detail-meta-chip detail-meta-cook">
                    <span class="meta-chip-label">做法</span>
                    <span class="meta-chip-value">{{ food.cookingMethod }}</span>
                  </span>
                </div>
              </header>

              <section v-if="food.description" class="detail-block">
                <h3 class="detail-block-title">
                  <SparklesIcon class="block-icon" />
                  <span>美食简介</span>
                  <span class="block-title-tag">01</span>
                </h3>
                <p class="detail-block-text">{{ food.description }}</p>
              </section>

              <section v-if="food.tags?.length" class="detail-block">
                <h3 class="detail-block-title">
                  <HashIcon class="block-icon" />
                  <span>特色标签</span>
                  <span class="block-title-tag">02</span>
                </h3>
                <div class="detail-tags">
                  <span
                    v-for="(tag, i) in food.tags"
                    :key="i"
                    class="detail-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </section>

              <section v-if="food.recommendations" class="detail-block">
                <h3 class="detail-block-title">
                  <UtensilsIcon class="block-icon" />
                  <span>品鉴建议</span>
                  <span class="block-title-tag">03</span>
                </h3>
                <div class="detail-recommend">
                  <div
                    v-if="food.recommendations.pairings?.length"
                    class="recommend-row"
                  >
                    <span class="recommend-label">推荐搭配</span>
                    <div class="recommend-items">
                      <span
                        v-for="(pair, i) in food.recommendations.pairings"
                        :key="i"
                        class="recommend-chip"
                      >
                        {{ pair }}
                      </span>
                    </div>
                  </div>
                  <div
                    v-if="food.recommendations.eatingMethod"
                    class="recommend-row"
                  >
                    <span class="recommend-label">食用方式</span>
                    <p class="recommend-text">
                      {{ food.recommendations.eatingMethod }}
                    </p>
                  </div>
                </div>
              </section>

              <section v-if="food.history" class="detail-block">
                <h3 class="detail-block-title">
                  <ScrollIcon class="block-icon" />
                  <span>历史渊源</span>
                  <span class="block-title-tag">04</span>
                </h3>
                <p class="detail-block-text">{{ food.history }}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import HeartIcon from '../../icons/common/HeartIcon.vue';
  import StarIcon from '../../icons/common/StarIcon.vue';
  import SparklesIcon from '../../icons/common/SparklesIcon.vue';
  import ScrollIcon from '../../icons/common/ScrollIcon.vue';
  import CloseIcon from '../../icons/common/CloseIcon.vue';
  import HashIcon from '../../icons/common/HashIcon.vue';
  import UtensilsIcon from '../../icons/common/UtensilsIcon.vue';
  import ThumbUpIcon from '../../icons/common/ThumbUpIcon.vue';

  import LinkIcon from '../../icons/common/LinkIcon.vue';
  import { useCheckin } from './useCheckin';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';

  import type { Food } from '@/typesOfPages/travelGuide';

  const props = defineProps<{
    visible: boolean;
    food: Food | null;
    isThumbsUp?: boolean;
  }>();

  defineEmits<{
    (e: 'close'): void;
    (e: 'toggle-thumbs-up'): void;
    (e: 'share'): void;
  }>();

  const { isWant, isEaten, toggleCheckin } = useCheckin();
  const { show: showToast } = useTravelToast();

  const handleToggleEaten = () => {
    if (!props.food) return;
    const wasEaten = isEaten(props.food.id);
    toggleCheckin(props.food.id, 'eaten');
    showToast({
      type: 'eaten',
      message: wasEaten ? `已取消品鉴「${props.food.name}」` : `已品鉴「${props.food.name}」`,
    });
  };

  const handleToggleWant = () => {
    if (!props.food) return;
    const wasWant = isWant(props.food.id);
    toggleCheckin(props.food.id, 'want');
    showToast({
      type: 'want',
      message: wasWant ? `「${props.food.name}」已移出想吃清单` : `「${props.food.name}」已收入想吃清单`,
    });
  };
</script>

<style scoped lang="scss" src="./index.scss" />
