<template>
  <div class="module-card famous-lines">
    <div class="module-header">
      <span class="module-tag">名句拾遗</span>
      <div class="line-nav">
        <button type="button" title="上一句" @click="prevFamousLine">‹</button>
        <button type="button" title="下一句" @click="nextFamousLine">›</button>
      </div>
    </div>
    <div v-if="visibleFamousLines.length > 0" class="module-body lines-strip">
      <div
        v-for="item in visibleFamousLines"
        :key="`${item.id}-${item.line}`"
        class="line-card"
        @click="openFamousLine(item)"
      >
        <div class="line-text">
          <span
            v-for="(ch, ci) in item.chars"
            :key="ci"
            class="type-char"
            :class="{ 'is-punct': /[，。！？、；：,.!?]/.test(ch) }"
          >
            {{ ch }}
          </span>
        </div>
        <p class="line-source">《{{ item.title }}》· {{ item.author }}</p>
      </div>
    </div>
    <div v-else class="module-body module-empty">
      <EmptyPoemIcon class="me-icon" />
      <p>名句摘抄中，稍后再来</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import EmptyPoemIcon from '../../../icons/common/EmptyPoemIcon.vue';
  import { getBackgroundUrl } from '@/composables/aphorism/usePoemBackground';

  defineOptions({ name: 'FamousLines' });

  const props = defineProps<{ poems: Poem[] }>();
  const emit = defineEmits<{
    (e: 'open', poem: Poem, backgroundImage: string): void;
  }>();

  interface FamousLine {
    id: number;
    line: string;
    chars: string[];
    title: string;
    author: string;
    dynasty: string;
  }
  const famousLines = computed<FamousLine[]>(() => {
    const out: FamousLine[] = [];
    props.poems.forEach((p) => {
      // 每首诗只取第一句作为代表名句，避免同一首在多张卡片重复出现
      const line = p.highlight?.find((s) => s.trim());
      if (line) {
        out.push({
          id: p.id,
          line,
          chars: Array.from(line),
          title: p.title,
          author: p.author,
          dynasty: p.dynasty,
        });
      }
    });
    return out;
  });
  const famousLineIndex = ref(0);
  // 环形窗口：从当前索引起展示 5 张，营造"翻不完的句子堆"观感
  const visibleFamousLines = computed<FamousLine[]>(() => {
    const total = famousLines.value.length;
    if (total === 0) return [];
    const win: FamousLine[] = [];
    const size = Math.min(5, total);
    for (let i = 0; i < size; i++) {
      win.push(famousLines.value[(famousLineIndex.value + i) % total]);
    }
    return win;
  });
  const prevFamousLine = () => {
    const total = famousLines.value.length;
    if (total === 0) return;
    famousLineIndex.value = (famousLineIndex.value - 1 + total) % total;
  };
  const nextFamousLine = () => {
    const total = famousLines.value.length;
    if (total === 0) return;
    famousLineIndex.value = (famousLineIndex.value + 1) % total;
  };
  const openFamousLine = (item: FamousLine) => {
    const poem = props.poems.find((p) => p.id === item.id);
    if (poem) {
      emit('open', poem, getBackgroundUrl(poem.id));
    }
  };
</script>
