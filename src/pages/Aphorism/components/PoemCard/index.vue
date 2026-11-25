<template>
  <div
    class="poem-card"
    :class="{ 'studyroom-poem-card': type }"
    @click="handleClick"
  >
    <div class="scroll-container">
      <!-- 配图常驻：即使加载失败也保留元素，重试成功后无需重建即可显示原图 -->
      <img
        :src="imgSrc"
        alt=""
        class="bg-img"
        loading="lazy"
        decoding="async"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <!-- 加载中 / 加载失败占位：盖在原图之上，原图就绪后自动移除 -->
      <img
        v-if="showPlaceholder"
        :src="placeholderSrc"
        alt=""
        class="bg-img bg-img-placeholder"
        aria-hidden="true"
      />

      <button
        v-if="removable"
        type="button"
        class="remove-btn"
        :class="type"
        :title="removeTitle"
        @click.stop="handleRemove"
      >
        <CloseIcon />
      </button>

      <h3 class="poem-title">{{ poem.title }}</h3>

      <div class="meta-info">
        <span class="dynasty-badge">{{ poem.dynasty }}</span>
        <span class="author-name">{{ poem.author }}</span>
      </div>

      <div v-if="poem.tags && poem.tags.length > 0" class="poem-tags">
        <span v-for="tag in displayTags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <div class="poem-content">
        <p
          v-for="(line, index) in previewLines"
          :key="`line-${index}-${line}`"
          class="content-line"
        >
          {{ line }}
        </p>
      </div>

      <div class="poem-actions">
        <button
          type="button"
          class="action-btn like-btn"
          :class="{ active: isLiked }"
          :title="isLiked ? '取消点赞' : '点赞'"
          @click.stop="toggleLike"
        >
          <LikeIcon
            :fill="isLiked ? 'currentColor' : 'none'"
            :stroke-width="isLiked ? 0 : 2.5"
          />
        </button>
        <button
          type="button"
          class="action-btn love-btn"
          :class="{ active: isLoved }"
          :title="isLoved ? '取消喜爱' : '喜爱'"
          @click.stop="toggleLove"
        >
          <LoveIcon
            :fill="isLoved ? 'currentColor' : 'none'"
            :stroke-width="isLoved ? 0 : 2.5"
          />
        </button>
        <button
          type="button"
          class="action-btn favorite-btn"
          :class="{ active: isFavorite }"
          :title="isFavorite ? '取消收藏' : '收藏'"
          @click.stop="toggleFavorite"
        >
          <FavoriteIcon
            :fill="isFavorite ? 'currentColor' : 'none'"
            :stroke-width="isFavorite ? 0 : 2.5"
          />
        </button>
        <button
          type="button"
          class="action-btn share-btn"
          title="分享"
          @click.stop="sharePoem"
        >
          <ShareIcon fill="none" :stroke-width="2.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import { usePoemMessage } from '../PoemMessage/usePoemMessage';
  import { usePoemInteractions } from '@/composables/aphorism/usePoemInteractions';

  const showMessage = usePoemMessage();
  import LikeIcon from '../../icons/PoemModal/LikeIcon.vue';
  import LoveIcon from '../../icons/PoemModal/LoveIcon.vue';
  import FavoriteIcon from '../../icons/PoemModal/FavoriteIcon.vue';
  import ShareIcon from '../../icons/PoemModal/ShareIcon.vue';
  import CloseIcon from '../../icons/common/CloseIcon.vue';
  import {
    coverRetrySrc,
    errorCover,
    getBackgroundUrl,
    loadingCover,
    reportCoverFailed,
    reportCoverLoaded,
    useCoverStatus,
  } from '@/composables/aphorism/usePoemBackground';
  import './index.scss';
  import './responsive.scss';

  const props = defineProps<{
    poem: Poem;
    type?: 'loved' | 'favorites';
    removable?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'click', poem: Poem, backgroundImage: string): void;
    (e: 'tag-click', tag: string): void;
    (e: 'remove', poemId: number): void;
  }>();

  const {
    isLiked,
    isLoved,
    isFavorite,
    toggleLike,
    toggleLove,
    toggleFavorite,
    sharePoem,
  } = usePoemInteractions(() => props.poem);

  const backgroundImage = getBackgroundUrl(props.poem.id);

  // 封面状态与弹窗共享：卡片先失败、弹窗重试成功时，这里也会收到 loaded 并自动恢复原图
  const coverStatus = useCoverStatus(() => backgroundImage);
  const imgSrc = ref(backgroundImage);
  /** 本卡片自己的 <img> 是否已成功渲染，只有它成功才撤掉占位层 */
  const locallyLoaded = ref(false);
  let srcBump = 0;

  const showPlaceholder = computed(() => !locallyLoaded.value);
  const placeholderSrc = computed(() =>
    coverStatus.value === 'failed' ? errorCover : loadingCover,
  );

  const handleImageLoad = () => {
    locallyLoaded.value = true;
    reportCoverLoaded(backgroundImage);
  };

  const handleImageError = () => {
    locallyLoaded.value = false;
    reportCoverFailed(backgroundImage);
  };

  // 别处（弹窗）已确认这张图能加载，但本卡片的 <img> 还停在失败的地址上，
  // 换一个带重试参数的地址重新取图，成功后占位层自然撤掉。
  watch(coverStatus, (status) => {
    if (status !== 'loaded' || locallyLoaded.value || srcBump >= 3) return;
    srcBump += 1;
    imgSrc.value = coverRetrySrc(backgroundImage, srcBump);
  });

  const previewLines = computed(() => {
    if (props.poem.highlight && props.poem.highlight.length > 0) {
      return props.poem.highlight;
    }
    return props.poem.content.slice(0, 4);
  });

  const displayTags = computed(() => props.poem.tags?.slice(0, 3) ?? []);

  const removeTitle = computed(() =>
    props.type === 'loved' ? '取消喜爱' : '取消收藏',
  );

  const handleClick = () => {
    emit('click', props.poem, backgroundImage);
  };

  const handleRemove = () => {
    emit('remove', props.poem.id);
    if (props.type === 'loved') {
      showMessage.love.cancel(props.poem.title, 'poem');
    } else if (props.type === 'favorites') {
      showMessage.favorite.cancel(props.poem.title, 'poem');
    }
  };
</script>

<style scoped lang="scss"></style>
