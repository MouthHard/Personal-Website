<template>
  <div
    v-if="phase !== 'hidden'"
    class="page-change-overlay"
    :class="`is-${phase}`"
    :style="{
      '--pc-in': inMs + 'ms',
      '--pc-out-up': EXIT_UP_MS + 'ms',
      '--pc-out-down': EXIT_DOWN_MS + 'ms',
      '--pc-total': minShowTotal() + exitTotal() + 'ms',
    }"
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
        @error="imgFailed[i] = true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { takePreloadedBatch } from './preload';
  import {
    ERROR_CODES,
    isChunkLoadError,
    reloadTo,
    requestError,
    shouldAutoReload,
    type ErrorPayload,
  } from '@/components/common/ErrorBoundary/channel';

  defineOptions({ name: 'PageChange' });

  const props = defineProps<{
    /** 单块滑入时长（ms），默认 800。退场节奏固定，不受它影响 */
    duration?: number;

    /** 非首次进入的兜底阈值（ms），默认 400。只有导航超过它才出帘幕 */
    showDelay?: number;
  }>();

  const emit = defineEmits<{
    (e: 'complete'): void;
  }>();

  const router = useRouter();

  /** 当前演出的 4 张图：来自 preload 模块已预加载的批次，取走后立即预加载下一批 */
  const blockImages = ref<string[]>([]);

  const imgFailed = ref<boolean[]>([]);

  /**
   * 2.52s 完整演出的时间预算：
   * 进场 800 + 错峰 60×3 = 980（四图合拢）
   * 合拢后静止 320 → 1300ms 起开始退场
   * 退场上排 600（延迟 0/40）、下排 900（延迟 280/320）→ 最晚 1220ms 收完
   */
  const IN_MS = 800;
  const STAGGER_MS = 60;
  const STAGGER_MAX = STAGGER_MS * 3;
  const HOLD_MS = 320;
  const EXIT_UP_MS = 600;
  const EXIT_DOWN_MS = 900;
  const EXIT_DELAY_MAX = 320;

  /** 导航迟迟不完成的最长等待，超过就交错误页（软失败） */
  const WAIT_MS = 12_000;
  const DEFAULT_SHOW_DELAY = 400;

  const inMs = computed(() => props.duration ?? IN_MS);
  const showDelay = computed(() => props.showDelay ?? DEFAULT_SHOW_DELAY);

  const minShowTotal = () => inMs.value + STAGGER_MAX + HOLD_MS;
  /** 必须算上最晚一块的延迟，否则最后 320ms 会被提前卸载截断 */
  const exitTotal = () => EXIT_DELAY_MAX + EXIT_DOWN_MS;

  /* ------------------------------------------------------------------ *
   * 应用首次进入的记忆（应用粒度，sessionStorage，失败不写）
   * ------------------------------------------------------------------ */
  const VISITED_KEY = 'page-change:visited-apps';

  const APP_NAMES: Record<string, string> = {
    music: '音乐',
    game: '游戏',
    aphorism: '诗词',
    history: '历史',
    'travel-guide': '旅游',
    museum: '博物馆',
    landscape: '风景',
  };

  const appKeyOf = (path: string): string =>
    path.split('/').filter(Boolean)[0] ?? '';

  let visitedApps = new Set<string>();

  const loadVisited = (): void => {
    try {
      const raw = window.sessionStorage.getItem(VISITED_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      visitedApps = new Set(
        Array.isArray(parsed)
          ? parsed.filter((v): v is string => typeof v === 'string')
          : [],
      );
    } catch {
      visitedApps = new Set();
    }
  };

  const markVisited = (key: string): void => {
    if (!key || visitedApps.has(key)) return;
    visitedApps.add(key);
    try {
      window.sessionStorage.setItem(
        VISITED_KEY,
        JSON.stringify([...visitedApps]),
      );
    } catch {
      // 写入失败只影响下次是否重播，忽略
    }
  };

  /* ------------------------------------------------------------------ *
   * 状态机
   * phase 只描述帘幕自身的动画，不再感知加载结果。
   * 唯一的交棒出口是 handoff()：帘幕在挂就播完再交，已经收起就立即交。
   * ------------------------------------------------------------------ */
  type Phase = 'hidden' | 'inside' | 'exit';

  type PendingAction =
    { type: 'error'; payload: ErrorPayload } | { type: 'reload'; path: string };

  const phase = ref<Phase>('hidden');
  const appName = ref('');
  const pendingPath = ref('');

  let navPending = false;
  let exitStarted = false;
  let shownAt = 0;
  let pendingAction: PendingAction | null = null;

  let showTimer: number | null = null;
  let holdTimer: number | null = null;
  let exitTimer: number | null = null;
  let waitTimer: number | null = null;

  let removeBefore: (() => void) | undefined;
  let removeAfter: (() => void) | undefined;
  let removeError: (() => void) | undefined;

  const clearTimer = (id: number | null): void => {
    if (id !== null) window.clearTimeout(id);
  };

  const clearAllTimers = (): void => {
    clearTimer(showTimer);
    clearTimer(holdTimer);
    clearTimer(exitTimer);
    clearTimer(waitTimer);
    showTimer = null;
    holdTimer = null;
    exitTimer = null;
    waitTimer = null;
  };

  const runAction = (action: PendingAction): void => {
    if (action.type === 'reload') {
      reloadTo(action.path);
      return;
    }
    requestError(action.payload);
  };

  /** 所有异常只有一个出口，保证动画不会被中途切断 */
  const handoff = (action: PendingAction): void => {
    clearTimer(showTimer);
    clearTimer(waitTimer);
    showTimer = null;
    waitTimer = null;
    navPending = false;

    if (phase.value === 'inside') {
      pendingAction = action;
      startExit();
      return;
    }
    if (phase.value === 'exit') {
      pendingAction = action;
      return;
    }
    runAction(action);
  };

  /** 12s 仍没拿到内容：超时是软失败，独立错误码由错误页给出区别于故障的文案 */
  const startWaitTimer = (): void => {
    clearTimer(waitTimer);
    waitTimer = window.setTimeout(() => {
      waitTimer = null;
      if (!navPending) return;
      handoff({
        type: 'error',
        payload: {
          kind: 'resource',
          code: ERROR_CODES.ENTRY_TIMEOUT,
          message: `进入「${appName.value || '目标页面'}」超时，页面还在加载或网络较慢`,
        },
      });
    }, WAIT_MS);
  };

  /** 帘幕开始：随机抽 4 张不重复的图 → 滑入 → 停留，动画由 CSS keyframes 驱动 */
  const beginShow = (): void => {
    if (phase.value !== 'hidden') return;
    blockImages.value = takePreloadedBatch();
    imgFailed.value = [];
    shownAt = Date.now();
    phase.value = 'inside';
    clearTimer(holdTimer);
    holdTimer = window.setTimeout(maybeExit, minShowTotal());
    if (navPending) startWaitTimer();
  };

  /**
   * 滑入 + 停留走满就退场，与导航是否完成无关。
   * 加载慢时宁可露出空壳，也不能把动画拖长——否则就不是「完整播一次」而是「随时被打断」。
   */
  const maybeExit = (): void => {
    holdTimer = null;
    if (exitStarted || phase.value !== 'inside') return;
    const remain = Math.max(0, minShowTotal() - (Date.now() - shownAt));
    if (remain > 0) {
      holdTimer = window.setTimeout(maybeExit, remain);
      return;
    }
    startExit();
  };

  const startExit = (): void => {
    if (exitStarted || phase.value !== 'inside') return;
    exitStarted = true;
    clearTimer(holdTimer);
    holdTimer = null;
    // 12s 计时属于「导航等待」，与帘幕退场无关，不能在这里清掉
    phase.value = 'exit';
    exitTimer = window.setTimeout(() => {
      exitTimer = null;
      phase.value = 'hidden';
      exitStarted = false;
      shownAt = 0;
      const action = pendingAction;
      pendingAction = null;
      if (action) runAction(action);
      emit('complete');
    }, exitTotal());
  };

  const handleNavDone = (): void => {
    navPending = false;
    clearTimer(showTimer);
    clearTimer(waitTimer);
    showTimer = null;
    waitTimer = null;
    if (phase.value === 'inside') maybeExit();
  };

  onMounted(() => {
    loadVisited();

    removeBefore = router.beforeEach((to) => {
      clearTimer(showTimer);
      showTimer = null;
      navPending = true;

      const key = appKeyOf(to.path);
      const isAppEntry = to.matched.length > 0 && key !== '';
      appName.value = APP_NAMES[key] ?? '';
      pendingPath.value = to.fullPath;

      if (phase.value !== 'hidden') return true;

      // 每个应用在本会话首次进入时完整播一次；之后 chunk 与 keep-alive 都在，快切无需再遮
      const firstEnterOfApp = isAppEntry && !visitedApps.has(key);
      if (firstEnterOfApp || showDelay.value <= 0) {
        // afterEach 走微任务，会抢先于 setTimeout(0)，故须同步触发
        beginShow();
      } else {
        showTimer = window.setTimeout(beginShow, showDelay.value);
      }
      return true;
    });

    removeAfter = router.afterEach((to) => {
      markVisited(appKeyOf(to.path));
      handleNavDone();
    });

    removeError = router.onError((err: unknown) => {
      console.error('[RouterError]', err);
      const isChunk = isChunkLoadError(err);

      // 发版后旧 chunk 404：自动重载一次即可自愈。必须等帘幕播完，
      // 否则用户会看到动画刚起就被刷新打断。限次护栏在 channel 里。
      if (isChunk && shouldAutoReload()) {
        handoff({
          type: 'reload',
          path: pendingPath.value || router.currentRoute.value.path,
        });
        return;
      }

      handoff({
        type: 'error',
        payload: {
          kind: isChunk ? 'resource' : 'runtime',
          code: isChunk ? ERROR_CODES.CHUNK_LOAD : ERROR_CODES.ENTRY_FAILED,
          message: isChunk
            ? `「${appName.value || '目标页面'}」的画面没有取到，可能是网络波动或站点刚更新`
            : '进入页面时发生异常，请重试',
        },
      });
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
