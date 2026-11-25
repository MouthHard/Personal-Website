<template>
  <div>
    <!-- 过渡帘幕：每个应用在本会话首次进入时完整播一次（这一次必然要取 chunk，帘幕用来遮住加载）；
         之后该应用的 chunk 与 keep-alive 都在，切过去是瞬时的，改回「导航超过 400ms 才显示」的兜底策略。
         导航迟迟不完成时帘幕会保持覆盖并逐级提示，失败则就地给出重试，不会退场留白屏。 -->
    <PageChange />

    <ErrorBoundary>
      <div id="mainPage" ref="mainPageEl">
        <!-- 左侧分类 tab：与行星一一对应，悬停时对应行星暂停并高亮 -->
        <nav class="app-tabs" aria-label="子应用分类">
          <button
            v-for="value in routeArr"
            :key="value.routeId"
            type="button"
            class="app-tab"
            :class="{ 'is-active': activeTabId === value.routeId }"
            @mouseenter="activeTabId = value.routeId"
            @mouseleave="activeTabId = ''"
            @focus="activeTabId = value.routeId"
            @blur="activeTabId = ''"
            @click="jumpToRouter(value.routeName)"
          >
            <span class="app-tab-index">0{{ value.routeId }}</span>
            <span
              class="app-tab-dot"
              :style="{ backgroundImage: `url(${value.bg})` }"
            ></span>
            <span class="app-tab-name">{{ value.pageName }}</span>
          </button>
        </nav>

        <!-- 轨迹星图：整层统一做 3D 透视倾斜，行星各自反向抵消保持正对镜头 -->
        <div class="trajectory">
          <div class="solar-plane">
            <!-- 太阳 -->
            <div id="sun"></div>
            <template v-for="value in routeArr" :key="value.routeId">
              <p
                class="orbit"
                :class="[
                  `orbit-${value.routeId}`,
                  { 'is-highlighted': activeTabId === value.routeId },
                ]"
                @click="jumpToRouter(value.routeName)"
              >
                <span class="planet-slot">
                  <button
                    type="button"
                    class="planet-btn"
                    :aria-label="value.pageName"
                  >
                    <span
                      class="planet-surface"
                      :style="{ backgroundImage: `url(${value.bg})` }"
                    ></span>
                  </button>
                  <span
                    v-if="value.routeId === '3' || value.routeId === '5'"
                    class="planet-moon"
                    aria-hidden="true"
                  ></span>
                </span>
              </p>
            </template>
            <!-- 小行星带：位于火星与木星轨道之间 -->
            <div class="asteroid-belt" aria-hidden="true"></div>
          </div>
        </div>

        <!-- 背景流星：低频掠过，给深空增加动静对比 -->
        <div class="meteors" aria-hidden="true">
          <span class="meteor meteor-a"></span>
          <span class="meteor meteor-b"></span>
        </div>
      </div>

      <div id="tabContainer" ref="tabContainer">
        <!-- 主要这里的 v-slot={Component}只能是Component而不能是其他变量名如componentA或者componentB，估计是Vue内定的变量名;
				并且要求和<component>标签中的:is绑定的变量名一致 -->
        <router-view v-slot="{ Component }">
          <Transition name="page-switch" mode="out-in">
            <keep-alive :include="keepAliveNames">
              <component
                :is="Component"
                :key="router.currentRoute.value.path"
              ></component>
            </keep-alive>
          </Transition>
        </router-view>
      </div>
    </ErrorBoundary>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import type { RouteItem } from '@/typesOfPages/common';
  import { ErrorBoundary } from '@/components/common/ErrorBoundary';
  import PageChange from '@/components/common/PageChange/index.vue';
  import { preloadPageChangeImages } from '@/components/common/PageChange/preload';

  const router = useRouter();
  /** 当前高亮的分类 id：由左侧 tab 悬停或键盘聚焦驱动 */
  const activeTabId = ref<string>('');

  const keepAliveNames = computed(() =>
    router
      .getRoutes()
      .map((r) => r.meta?.keepAlive)
      .filter((v): v is string => typeof v === 'string'),
  );

  // DOM 引用
  const mainPageEl = ref<HTMLElement>();
  const tabContainer = ref<HTMLElement>();

  const routeArr: RouteItem[] = [
    {
      routeId: '1',
      routeName: '/music',
      pageName: '音乐',
      bg: 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/app/Saturn.avif',
    },
    {
      routeId: '2',
      routeName: '/game',
      pageName: '游戏',
      bg: 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/app/Venus.avif',
    },
    {
      routeId: '3',
      routeName: '/aphorism',
      pageName: '诗词',
      bg: 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/app/Earth.avif',
    },
    {
      routeId: '4',
      routeName: '/history',
      pageName: '历史',
      bg: 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/app/Mars.avif',
    },
    {
      routeId: '5',
      routeName: '/travel-guide',
      pageName: '旅游',
      bg: 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/app/Jupiter.avif',
    },
    {
      routeId: '6',
      routeName: '/museum',
      pageName: '博物馆',
      bg: 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/app/Mercury.avif',
    },
    {
      routeId: '7',
      routeName: '/landscape',
      pageName: '风景',
      bg: 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/app/Uranus.avif',
    },
  ];

  const jumpToRouter = (route: string): void => {
    router.push(route);
  };

  // 监听路由变化
  watch(
    () => router.currentRoute.value.path,
    (newPath: string) => {
      if (tabContainer.value) {
        if (newPath === '/') {
          tabContainer.value.style.display = 'none';
        } else {
          tabContainer.value.style.display = 'block';
          tabContainer.value.style.zIndex = '5';
        }
      }
    },
  );

  /** 鼠标视差：把指针相对屏幕中心的位置写入 CSS 变量，供太阳系平面做轻微倾斜 */
  const handlePointerMove = (event: MouseEvent): void => {
    if (!mainPageEl.value) return;
    const px = event.clientX / window.innerWidth - 0.5;
    const py = event.clientY / window.innerHeight - 0.5;
    mainPageEl.value.style.setProperty('--px', px.toFixed(3));
    mainPageEl.value.style.setProperty('--py', py.toFixed(3));
  };

  // 生命周期钩子
  onMounted(() => {
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    // 页面路由跳转后切换场景
    if (tabContainer.value) {
      if (router.currentRoute.value.path === '/') {
        tabContainer.value.style.display = 'none';
      } else {
        tabContainer.value.style.display = 'block';
        tabContainer.value.style.zIndex = '5';
      }
    }

    // 首屏渲染后空闲时预加载页面切换过渡图，缓存命中后切换瞬间展示
    preloadPageChangeImages();
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', handlePointerMove);
  });
</script>
<style scoped lang="scss" src="@/assets/css/SolarSystem.scss" />
