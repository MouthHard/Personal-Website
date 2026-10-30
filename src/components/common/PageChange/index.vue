<template>
  <div
    v-if="phase !== 'hidden'"
    class="page-change-overlay"
    :class="`is-${phase}`"
    :style="{ '--pc-move': moveMs + 'ms' }"
  >
    <div
      v-for="(img, i) in blockImages"
      :key="i"
      class="pc-block"
      :class="i % 2 === 0 ? 'dir-left' : 'dir-right'"
    >
      <img
        v-if="!imgFailed[i]"
        class="pc-block-img"
        :src="img"
        alt=""
        :style="{ animationDelay: `${i * STAGGER_MS}ms` }"
        @error="imgFailed[i] = true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { CHANGE_IMAGE_BASE, IMAGE_POOL_SIZE } from './preload';

defineOptions({ name: 'PageChange' });

const props = defineProps<{
  duration?: number;

}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const router = useRouter();

/** 图片池：本地 change/ 目录的 20 张图，每次演出随机抽 4 张（同屏不重复） */

/** 布局：1=左上(左入) 2=右上(右入) 3=左下(左入) 4=右下(右入)；加载失败自动回落到渐变底色 */
const blockImages = ref<string[]>([]);

/** Fisher-Yates 洗牌后取前 4 张，保证同屏不重复 */
const pickRandomImages = (count = 4): string[] => {
  const indexes = Array.from({ length: IMAGE_POOL_SIZE }, (_, i) => i + 1);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, count).map((n) => `${CHANGE_IMAGE_BASE}/${n}.webp`);
};

const imgFailed = ref<boolean[]>([]);

/**
 * 导航超过该时长仍未完成，才显示过渡帘幕（快切无感，仅慢加载显示）。
 * 推荐值 400ms：低于它用户感知不到"卡顿"，没必要打扰；高于它才需要反馈。
 */
const SHOW_DELAY = 400;
/** 移入到位后停留时长 */
const HOLD_MS = 500;
/** 每块错开 */
const STAGGER_MS = 70;
const STAGGER_MAX = STAGGER_MS * 3;

/** 单次滑入/滑出时长（舒缓，不要过快） */
const moveMs = computed(() => props.duration ?? 900);

type Phase = 'hidden' | 'inside' | 'exit';
const phase = ref<Phase>('hidden');

let navPending = false;
let exitStarted = false;
let shownAt = 0;

let showTimer: number | null = null;
let holdTimer: number | null = null;
let exitTimer: number | null = null;

let removeBefore: (() => void) | undefined;
let removeAfter: (() => void) | undefined;
let removeError: (() => void) | undefined;

const minShowTotal = () => moveMs.value + STAGGER_MAX + HOLD_MS;
const exitTotal = () => moveMs.value + STAGGER_MAX;

const clearTimer = (id: number | null) => {
  if (id !== null) {
    window.clearTimeout(id);
  }
};

const clearAllTimers = () => {
  clearTimer(showTimer);
  clearTimer(holdTimer);
  clearTimer(exitTimer);
  showTimer = null;
  holdTimer = null;
  exitTimer = null;
};

/** 帘幕开始：随机抽 4 张不重复的图 → 滑入 → 停留，动画由 CSS keyframes 驱动 */
const beginShow = () => {
  if (phase.value !== 'hidden') return;
  blockImages.value = pickRandomImages();
  imgFailed.value = [];
  shownAt = Date.now();
  phase.value = 'inside';
  clearTimer(holdTimer);
  holdTimer = window.setTimeout(maybeExit, minShowTotal());
};

/**
 * 「滑入 + 停留」走满后，若导航已完成就开始退出；
 * 若导航仍未完成，则帘幕保持占满视窗，等 handleNavDone 再次触发。
 */
const maybeExit = () => {
  holdTimer = null;
  if (exitStarted || phase.value !== 'inside') return;
  if (navPending) return;
  const remain = Math.max(0, minShowTotal() - (Date.now() - shownAt));
  if (remain > 0) {
    holdTimer = window.setTimeout(maybeExit, remain);
    return;
  }
  startExit();
};

const startExit = () => {
  if (exitStarted || phase.value !== 'inside') return;
  exitStarted = true;
  clearTimer(holdTimer);
  phase.value = 'exit';
  exitTimer = window.setTimeout(() => {
    exitTimer = null;
    phase.value = 'hidden';
    exitStarted = false;
    shownAt = 0;
    emit('complete');
  }, exitTotal());
};

const handleNavDone = () => {
  navPending = false;
  clearTimer(showTimer);
  showTimer = null;
  if (phase.value === 'inside') {
    maybeExit();
  }
};

onMounted(() => {
  removeBefore = router.beforeEach(() => {
    clearTimer(showTimer);
    showTimer = null;
    navPending = true;
    if (phase.value === 'hidden') {
      if (SHOW_DELAY <= 0) {
        // 立即显示：afterEach 走微任务，会抢先于 setTimeout(0)，故须同步触发
        beginShow();
      } else {
        showTimer = window.setTimeout(beginShow, SHOW_DELAY);
      }
    }
    return true;
  });

  removeAfter = router.afterEach(() => {
    handleNavDone();
  });

  removeError = router.onError(() => {
    handleNavDone();
  });
});

onUnmounted(() => {
  clearAllTimers();
  removeBefore?.();
  removeAfter?.();
  removeError?.();
});

defineExpose({ phase });
</script>

<style scoped lang="scss" src="./index.scss" />