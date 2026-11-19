<template>
  <div
    class="poem-card"
    :class="{ 'studyroom-poem-card': type }"
    @click="handleClick"
  >
    <div class="scroll-container">
      <img
        v-if="!imgFailed"
        :src="backgroundImage"
        alt=""
        class="bg-img"
        loading="lazy"
        @load="imgLoaded = true"
        @error="imgFailed = true"
      />
      <img v-else :src="errorImage" alt="" class="bg-img" />
      <img
        v-if="!imgLoaded && !imgFailed"
        :src="loadingImage"
        alt=""
        class="bg-img"
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
  import { computed, ref } from 'vue';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import { usePoemMessage } from '../PoemMessage/usePoemMessage';
  import { usePoemInteractions } from '@/composables/aphorism/usePoemInteractions';

  const showMessage = usePoemMessage();
  import LikeIcon from '../../icons/PoemModal/LikeIcon.vue';
  import LoveIcon from '../../icons/PoemModal/LoveIcon.vue';
  import FavoriteIcon from '../../icons/PoemModal/FavoriteIcon.vue';
  import ShareIcon from '../../icons/PoemModal/ShareIcon.vue';
  import CloseIcon from '../../icons/common/CloseIcon.vue';
  import { getBackgroundUrl } from '@/composables/aphorism/usePoemBackground';
  import loadingImage from '@/assets/image/aphorism/loading.webp';
  import errorImage from '@/assets/image/aphorism/error.webp';
  import './index.scss';

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

  const imgLoaded = ref(false);
  const imgFailed = ref(false);

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
