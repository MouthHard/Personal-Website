<template>
  <aside class="section-navigator" :class="{ 'is-expanded': expanded }">
    <div
      class="sn-card"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
    >
      <div class="sn-head">
        <span class="sn-head-icon"><CompassIcon :stroke-width="1.6" /></span>
        <div class="sn-head-text">
          <strong class="sn-head-title">星图航线</strong>
          <span class="sn-head-sub">Star route · 站点导航</span>
        </div>
      </div>

      <nav class="sn-track" aria-label="模块快速导航">
        <span class="sn-line" aria-hidden="true"></span>
        <span
          class="sn-comet"
          :class="{ 'is-flying': cometVisible }"
          :style="{ '--sn-comet-y': cometY + 'px' }"
          aria-hidden="true"
        ></span>
        <button
          v-for="(stop, i) in stops"
          :key="stop.id"
          class="sn-stop"
          :class="{ 'is-active': activeIndex === i }"
          type="button"
          :aria-label="`定位到 ${stop.label}`"
          :aria-current="activeIndex === i ? 'true' : undefined"
          @click="goTo(i)"
          @mousemove="onStopMove"
          @mouseleave="onStopLeave"
        >
          <span class="sn-dot">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="sn-label">{{ stop.label }}</span>
          <span class="sn-marker" aria-hidden="true"></span>
        </button>
      </nav>

      <div class="sn-foot">点击站点 · 标题停靠视窗上 1/4</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted, onUnmounted } from 'vue';
  import CompassIcon from '@/pages/Landscape/icons/common/CompassIcon.vue';

  type ScrollMode = 'auto' | 'smooth';

  /** 7 个竖排模块，顺序与 Home/index.vue 的锚点顺序一致 */
  const stops = [
    { id: 'featured', label: '山河流转' },
    { id: 'topics', label: '万象景章' },
    { id: 'destinations', label: '梦境之地' },
    { id: 'guides', label: '行者手记' },
    { id: 'photographers', label: '追帧旅人' },
    { id: 'videos', label: '流光掠影' },
    { id: 'feast', label: '视觉盛宴' },
  ] as const;

  /** 标题停靠位置：视窗高度的 1/4，露出模块内容 */
  const DOCK_RATIO = 0.25;
  /** 判定当前站点时，用视窗 1/3 作为分割线 */
  const ACTIVE_RATIO = 0.33;

  const expanded = ref(false);
  const activeIndex = ref(0);

  /** 流光：点击后沿星轨从旧站点滑到新站点，纯装饰，不参与定位计算 */
  const cometY = ref(0);
  const cometVisible = ref(false);
  let cometTimer: number | undefined;

  let scrollRoot: HTMLElement | null = null;
  let anchors: HTMLElement[] = [];
  let scrollRaf = 0;
  let relocateTimer: number | undefined;
  /** 点击定位期间的标记，避免平滑滚动过程抢占高亮 */
  let navigating = false;
  let navTimer: number | undefined;

  const getContainer = (): HTMLElement | null =>
    document.querySelector<HTMLElement>('.home-page');

  const collectAnchors = (): void => {
    anchors = Array.from(
      document.querySelectorAll<HTMLElement>('[data-nav-anchor]'),
    );
  };

  /**
   * 把某个锚点的顶部滚到视窗 DOCK_RATIO 处。
   * 用 getBoundingClientRect 差值换算，避免依赖 offsetParent。
   */
  const alignTo = (
    el: HTMLElement | undefined,
    behavior: ScrollMode = 'smooth',
  ): void => {
    if (!scrollRoot || !el) return;
    const rootTop = scrollRoot.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const target =
      elTop -
      rootTop +
      scrollRoot.scrollTop -
      scrollRoot.clientHeight * DOCK_RATIO;
    scrollRoot.scrollTo({ top: Math.max(0, target), behavior });
  };

  /** 磁吸：站点向指针方向轻微位移，只作用于按钮自身，不影响内容锚点 */
  const onStopMove = (event: MouseEvent): void => {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    btn.style.setProperty('--sn-mx', `${(dx * 5).toFixed(2)}px`);
    btn.style.setProperty('--sn-my', `${(dy * 2.5).toFixed(2)}px`);
  };

  const onStopLeave = (event: MouseEvent): void => {
    const btn = event.currentTarget as HTMLElement;
    btn.style.setProperty('--sn-mx', '0px');
    btn.style.setProperty('--sn-my', '0px');
  };

  /** 沿星轨滑一束流光：from → to，620ms 后收起 */
  const playComet = (from: number, to: number): void => {
    if (from === to) return;
    const track = document.querySelector<HTMLElement>('.sn-track');
    const buttons = document.querySelectorAll<HTMLElement>('.sn-stop');
    const a = buttons[from];
    const b = buttons[to];
    if (!track || !a || !b) return;

    if (cometTimer) window.clearTimeout(cometTimer);
    const trackTop = track.getBoundingClientRect().top;
    const centerOf = (el: HTMLElement): number => {
      const rect = el.getBoundingClientRect();
      return rect.top - trackTop + rect.height / 2;
    };

    cometY.value = centerOf(a);
    cometVisible.value = true;
    void nextTick(() => {
      requestAnimationFrame(() => {
        cometY.value = centerOf(b);
      });
    });
    cometTimer = window.setTimeout(() => {
      cometVisible.value = false;
    }, 620);
  };

  /**
   * 点击站点后的二次校正：
   * 1) 先瞬间把目标滚到 dock 位置，触发途中 LazyLoadWrapper 的交叉观察；
   * 2) 骨架换成真实内容后高度会变，等两帧再精确对齐一次；
   * 3) 再留一个稍长的兜底，覆盖异步组件加载完成时的高度变化。
   */
  const goTo = (index: number): void => {
    const from = activeIndex.value;
    activeIndex.value = index;
    playComet(from, index);
    navigating = true;
    if (navTimer) window.clearTimeout(navTimer);
    if (relocateTimer) window.clearTimeout(relocateTimer);

    alignTo(anchors[index], 'auto');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => alignTo(anchors[index], 'smooth'));
    });

    relocateTimer = window.setTimeout(() => {
      alignTo(anchors[index], 'smooth');
      navTimer = window.setTimeout(() => {
        navigating = false;
        syncActiveByScroll();
      }, 600);
    }, 260);
  };

  /** 滚动时按「越过视窗 1/3 线的最后一个锚点」高亮当前站点 */
  const syncActiveByScroll = (): void => {
    if (!scrollRoot || navigating || anchors.length === 0) return;
    // 顶部时懒加载骨架尚未展开，锚点高度不真实，强制高亮第一个
    if (scrollRoot.scrollTop < 20) {
      activeIndex.value = 0;
      return;
    }
    const rootTop = scrollRoot.getBoundingClientRect().top;
    const line = rootTop + scrollRoot.clientHeight * ACTIVE_RATIO;
    let current = 0;
    anchors.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= line) current = i;
    });
    activeIndex.value = current;
  };

  const onScroll = (): void => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      syncActiveByScroll();
    });
  };

  onMounted(() => {
    scrollRoot = getContainer();
    collectAnchors();
    scrollRoot?.addEventListener('scroll', onScroll, { passive: true });
    syncActiveByScroll();
  });

  onUnmounted(() => {
    scrollRoot?.removeEventListener('scroll', onScroll);
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    if (relocateTimer) window.clearTimeout(relocateTimer);
    if (navTimer) window.clearTimeout(navTimer);
    if (cometTimer) window.clearTimeout(cometTimer);
  });
</script>

<style lang="scss" src="./index.scss" />
