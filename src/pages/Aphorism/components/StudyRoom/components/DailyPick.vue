<template>
  <div
    v-if="dailyPick"
    class="module-card daily-pick"
    @click="$emit('open', dailyPick, getBackgroundUrl(dailyPick.id))"
  >
    <!-- 三折屏风：木框绢面，中屏题诗，左右屏竹影内折 -->
    <div class="screen-wing wing-left" aria-hidden="true">
      <span class="wing-moon"></span>
      <span class="wing-hill"></span>
      <i
        v-for="(stalk, si) in leftGrove"
        :key="'ls' + si"
        class="bamboo"
        :class="stalk.far ? 'bamboo-far' : 'bamboo-near'"
        :style="{
          left: stalk.left + '%',
          height: stalk.height + '%',
          width: stalk.width + 'px',
          opacity: stalk.opacity,
          transform: 'rotate(' + stalk.tilt + 'deg)',
        }"
      >
        <b
          v-for="(leaf, li) in stalk.leaves"
          :key="'ll' + li"
          class="b-leaf"
          :style="{
            top: leaf.top + '%',
            width: leaf.length + 'px',
            opacity: leaf.opacity,
            transform:
              'rotate(' + leaf.rotate + 'deg) scaleX(' + leaf.flip + ')',
          }"
        ></b>
      </i>
      <span class="wing-bird bird-a"></span>
      <span class="wing-bird bird-b"></span>
      <span class="wing-seal">竹</span>
    </div>
    <div class="screen-panel">
      <div class="module-header">
        <span class="module-tag">今日推荐</span>
        <button
          type="button"
          class="refresh-btn"
          title="换一首"
          @click.stop="refreshDailyPick"
        >
          <RefreshIcon />
        </button>
      </div>
      <div class="module-body">
        <h3 class="pick-title">{{ dailyPick.title }}</h3>
        <p class="pick-meta">
          {{ dailyPick.dynasty }} · {{ dailyPick.author }}
        </p>
        <p class="pick-content">
          {{ dailyPick.content.slice(0, 2).join(',') }}
        </p>
      </div>
      <div class="pick-hint">
        <span class="hint-icon">▶</span>
        <span>点击查看全文</span>
        <span class="hint-arrow">→</span>
      </div>
    </div>
    <div class="screen-wing wing-right" aria-hidden="true">
      <span class="wing-moon"></span>
      <span class="wing-hill"></span>
      <i
        v-for="(stalk, si) in rightGrove"
        :key="'rs' + si"
        class="bamboo"
        :class="stalk.far ? 'bamboo-far' : 'bamboo-near'"
        :style="{
          left: stalk.left + '%',
          height: stalk.height + '%',
          width: stalk.width + 'px',
          opacity: stalk.opacity,
          transform: 'rotate(' + stalk.tilt + 'deg)',
        }"
      >
        <b
          v-for="(leaf, li) in stalk.leaves"
          :key="'rl' + li"
          class="b-leaf"
          :style="{
            top: leaf.top + '%',
            width: leaf.length + 'px',
            opacity: leaf.opacity,
            transform:
              'rotate(' + leaf.rotate + 'deg) scaleX(' + leaf.flip + ')',
          }"
        ></b>
      </i>
      <span class="wing-bird bird-a"></span>
      <span class="wing-bird bird-b"></span>
      <span class="wing-seal">韵</span>
    </div>
  </div>
  <div v-else class="module-card daily-pick is-empty">
    <div class="module-header">
      <span class="module-tag">今日推荐</span>
    </div>
    <div class="module-body pick-empty">
      <span class="pe-seal">诗</span>
      <p>今日诗卷备货中，稍后再来</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import RefreshIcon from '../../../icons/StudyRoom/RefreshIcon.vue';
  import { getBackgroundUrl } from '@/composables/aphorism/usePoemBackground';

  defineOptions({ name: 'DailyPick' });

  const props = defineProps<{ poems: Poem[] }>();
  defineEmits<{
    (e: 'open', poem: Poem, backgroundImage: string): void;
  }>();

  // ---- 屏风左右扇竹林：确定性伪随机，保证每次渲染一致不闪烁 ----
  interface BambooLeaf {
    top: number;
    rotate: number;
    flip: number;
    length: number;
    opacity: number;
  }
  interface BambooStalk {
    left: number;
    height: number;
    width: number;
    tilt: number;
    opacity: number;
    far: boolean;
    leaves: BambooLeaf[];
  }

  const seededRandom = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };

  const generateGrove = (seed: number): BambooStalk[] => {
    const rand = seededRandom(seed);
    const count = 8;
    return Array.from({ length: count }, (_, i) => {
      const far = rand() < 0.38;
      const leafCount = 3 + Math.floor(rand() * 3);
      const leaves: BambooLeaf[] = Array.from({ length: leafCount }, () => ({
        top: 14 + rand() * 64,
        rotate: -52 + rand() * 104,
        flip: rand() > 0.5 ? 1 : -1,
        length: 26 + rand() * 22,
        opacity: 0.62 + rand() * 0.38,
      }));
      return {
        left: 4 + (i / count) * 86 + (rand() - 0.5) * 9,
        height: far ? 54 + rand() * 28 : 64 + rand() * 34,
        width: far ? 3 + rand() * 1.5 : 6 + rand() * 3,
        tilt: -16 + rand() * 32,
        opacity: far ? 0.38 + rand() * 0.16 : 0.86 + rand() * 0.14,
        far,
        leaves,
      };
    });
  };

  const leftGrove = generateGrove(20241118);
  const rightGrove = generateGrove(8675309);

  // ---- 今日推荐 ----
  const dailyPick = ref<Poem | null>(null);

  // 精选池：优先取 isFeatured 标记的诗词，池空才退回全库
  const featuredPool = computed(() => {
    const pool = props.poems.filter((p) => p.isFeatured);
    return pool.length > 0 ? pool : props.poems;
  });

  const refreshDailyPick = () => {
    const pool = featuredPool.value;
    if (pool.length === 0) return;
    dailyPick.value = pool[Math.floor(Math.random() * pool.length)];
  };

  const getTodaySeed = () => {
    const today = new Date();
    return (
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate()
    );
  };

  watch(
    () => props.poems.length,
    (len) => {
      if (len > 0 && !dailyPick.value) {
        const pool = featuredPool.value;
        dailyPick.value = pool[getTodaySeed() % pool.length];
      }
    },
    { immediate: true },
  );
</script>
