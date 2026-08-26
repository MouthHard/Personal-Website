<template>
  <div class="poem-card" @click="handleClick">
    <div class="scroll-container" :style="backgroundStyle">
      <h3 class="poem-title">{{ poem.title }}</h3>

      <div class="meta-info">
        <span class="dynasty-badge">{{ poem.dynasty }}</span>
        <span class="author-name">{{ poem.author }}</span>
      </div>

      <div v-if="poem.tags && poem.tags.length > 0" class="poem-tags">
        <span v-for="(tag, index) in displayTags" :key="index" class="tag">
          {{ tag }}
        </span>
      </div>

      <div class="poem-content">
        <p v-for="(line, index) in previewLines" :key="index" class="content-line">
          {{ line }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Poem } from '@/typesOfPages/aphorism/poem';
import { getBackgroundUrl } from '@/composables/aphorism/usePoemBackground';
import './index.scss';

const props = defineProps<{
  poem: Poem;
}>();

const emit = defineEmits<{
  (e: 'click', poem: Poem, backgroundImage: string): void;
  (e: 'tag-click', tag: string): void;
}>();

const backgroundImage = getBackgroundUrl(props.poem.id);
const backgroundStyle = computed(() => ({
  backgroundImage: `url('${backgroundImage}')`,
}));

const previewLines = computed(() => {
  return props.poem.content.slice(0, 6);
});

const displayTags = computed(() => props.poem.tags?.slice(0, 3) ?? []);

const handleClick = () => {
  emit('click', props.poem, backgroundImage);
};
</script>

<style scoped lang="scss">

</style>
