<template>
  <div
    v-if="payload"
    class="error-boundary"
    :class="{ 'is-soft': isSoft, 'is-region': isRegion }"
  >
    <div class="error-boundary__grid-bg"></div>
    <div class="error-boundary__scanline"></div>
    <div class="error-boundary__vignette"></div>

    <div class="error-boundary__dialog" :class="{ 'is-expanded': showDevInfo }">
      <div class="error-boundary__main">
        <span class="error-boundary__rivet error-boundary__rivet--tl" />
        <span class="error-boundary__rivet error-boundary__rivet--tr" />
        <span class="error-boundary__rivet error-boundary__rivet--bl" />
        <span class="error-boundary__rivet error-boundary__rivet--br" />

        <div class="error-boundary__ticks">
          <span
            v-for="i in 16"
            :key="i"
            class="error-boundary__tick"
            :class="{ 'is-major': i % 4 === 0 }"
          />
        </div>

        <div class="error-boundary__header-bar">
          <div class="error-boundary__hazard-strip" />
          <span class="error-boundary__header-text">{{ headerText }}</span>
          <div class="error-boundary__hazard-strip" />
        </div>

        <div class="error-boundary__alarm-row">
          <span class="error-boundary__alarm-led" />
          <span class="error-boundary__alarm-label">{{ alarmLabel }}</span>
          <span class="error-boundary__alarm-code">{{ errorCode }}</span>
        </div>

        <div class="error-boundary__icon-wrap">
          <WarningTriangleIcon class="error-boundary__icon" />
        </div>

        <h2 class="error-boundary__title">{{ errorTitle }}</h2>
        <p class="error-boundary__desc">{{ errorDescription }}</p>

        <div class="error-boundary__fields">
          <button
            class="error-boundary__field"
            :class="{ 'is-copied': copiedField === 'code' }"
            @click="copyToClipboard(errorCode, 'code', '错误代码')"
          >
            <span class="error-boundary__field-led" />
            <span class="error-boundary__field-label">错误代码</span>
            <span class="error-boundary__field-value">{{ errorCode }}</span>
            <CopyIcon class="error-boundary__field-icon" />
          </button>

          <button
            class="error-boundary__field error-boundary__field--message"
            :class="{ 'is-copied': copiedField === 'message' }"
            @click="copyToClipboard(errorMessage, 'message', '错误信息')"
          >
            <span class="error-boundary__field-led" />
            <span class="error-boundary__field-label">错误信息</span>
            <span
              class="error-boundary__field-value error-boundary__field-value--mono"
            >
              {{ errorMessage || '（暂无错误描述）' }}
            </span>
            <CopyIcon class="error-boundary__field-icon" />
          </button>

          <button
            class="error-boundary__field"
            :class="{ 'is-copied': copiedField === 'time' }"
            @click="copyToClipboard(errorTime, 'time', '发生时间')"
          >
            <span class="error-boundary__field-led" />
            <span class="error-boundary__field-label">发生时间</span>
            <span
              class="error-boundary__field-value error-boundary__field-value--mono"
            >
              {{ errorTime || '（未记录）' }}
            </span>
            <CopyIcon class="error-boundary__field-icon" />
          </button>
        </div>

        <div class="error-boundary__actions">
          <button
            class="error-boundary__btn error-boundary__btn--primary"
            @click="handleRetry"
          >
            <RefreshIcon />
            <span>{{ retryLabel }}</span>
          </button>
          <button
            v-if="!isResource"
            class="error-boundary__btn error-boundary__btn--soft"
            @click="reloadPage"
          >
            <RefreshIcon />
            <span>刷新页面</span>
          </button>
          <button
            class="error-boundary__btn error-boundary__btn--secondary"
            @click="goHome"
          >
            <HomeIcon />
            <span>返回首页</span>
          </button>
        </div>

        <button
          class="error-boundary__dev-toggle"
          :class="{ 'is-active': showDevInfo }"
          @click="showDevInfo = !showDevInfo"
        >
          <span class="error-boundary__toggle-track">
            <span class="error-boundary__toggle-knob" />
          </span>
          <span>诊断信息</span>
          <ChevronDownIcon class="error-boundary__dev-toggle-chevron" />
        </button>

        <p class="error-boundary__hint">
          问题持续存在？点上方「错误信息」即可复制诊断详情
        </p>
      </div>

      <div class="error-boundary__dev-panel">
        <span class="error-boundary__rivet error-boundary__rivet--tl" />
        <span class="error-boundary__rivet error-boundary__rivet--tr" />
        <span class="error-boundary__rivet error-boundary__rivet--bl" />
        <span class="error-boundary__rivet error-boundary__rivet--br" />
        <div class="error-boundary__dev-content">
          <div class="error-boundary__dev-crt-overlay" />
          <div class="error-boundary__dev-header">
            <div class="error-boundary__dev-header-left">
              <span class="error-boundary__dev-rec-led" />
              <h3 class="error-boundary__dev-title">FLIGHT RECORDER</h3>
            </div>
            <button
              class="error-boundary__dev-close"
              @click="showDevInfo = false"
            >
              <CloseIcon />
            </button>
          </div>

          <div class="error-boundary__dev-body">
            <button
              class="error-boundary__dev-section"
              :class="{ 'is-copied': copiedField === 'dev-code' }"
              @click="copyToClipboard(errorCode, 'dev-code', '错误代码')"
            >
              <span class="error-boundary__dev-label">&gt; 错误代码</span>
              <code class="error-boundary__dev-code">{{ errorCode }}</code>
            </button>
            <button
              class="error-boundary__dev-section"
              :class="{ 'is-copied': copiedField === 'dev-message' }"
              @click="copyToClipboard(errorMessage, 'dev-message', '错误信息')"
            >
              <span class="error-boundary__dev-label">&gt; 错误信息</span>
              <pre class="error-boundary__dev-pre">{{
                errorMessage || '（暂无错误描述）'
              }}</pre>
            </button>
            <button
              class="error-boundary__dev-section"
              :class="{ 'is-copied': copiedField === 'dev-time' }"
              @click="copyToClipboard(errorTime, 'dev-time', '发生时间')"
            >
              <span class="error-boundary__dev-label">&gt; 发生时间</span>
              <code class="error-boundary__dev-code">
                {{ errorTime || '（未记录）' }}
              </code>
            </button>
            <button
              class="error-boundary__dev-section"
              :class="{ 'is-copied': copiedField === 'dev-stack' }"
              @click="copyToClipboard(errorStack, 'dev-stack', '调用堆栈')"
            >
              <span class="error-boundary__dev-label">&gt; 调用堆栈</span>
              <pre class="error-boundary__dev-pre">{{
                errorStack || '（无堆栈信息）'
              }}</pre>
            </button>
            <button
              class="error-boundary__dev-section"
              :class="{ 'is-copied': copiedField === 'dev-route' }"
              @click="copyToClipboard(errorRoute, 'dev-route', '当前路由')"
            >
              <span class="error-boundary__dev-label">&gt; 当前路由</span>
              <code class="error-boundary__dev-code">
                {{ errorRoute || '（未获取）' }}
              </code>
            </button>
            <button
              class="error-boundary__dev-section"
              :class="{ 'is-copied': copiedField === 'dev-component' }"
              @click="
                copyToClipboard(errorComponentName, 'dev-component', '组件信息')
              "
            >
              <span class="error-boundary__dev-label">&gt; 组件信息</span>
              <code class="error-boundary__dev-code">
                {{ errorComponentName || '（未捕获）' }}
              </code>
            </button>
            <button
              class="error-boundary__dev-section"
              :class="{ 'is-copied': copiedField === 'dev-ua' }"
              @click="copyToClipboard(errorUserAgent, 'dev-ua', '浏览器环境')"
            >
              <span class="error-boundary__dev-label">&gt; 浏览器环境</span>
              <code class="error-boundary__dev-code">
                {{ errorUserAgent || '（未获取）' }}
              </code>
            </button>
            <button
              class="error-boundary__dev-copy"
              :class="{ 'is-copied': copiedField === 'all' }"
              @click="copyErrorInfo"
            >
              <CopyIcon />
              <span>
                {{ copiedField === 'all' ? '已复制 ✓' : '复制全部信息' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="eb-toast">
      <div v-if="copyMessage" class="error-boundary__toast">
        <CopyIcon class="error-boundary__toast-icon" />
        <span class="error-boundary__toast-text">{{ copyMessage }}</span>
      </div>
    </Transition>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
  import { ref, computed, onErrorCaptured, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import WarningTriangleIcon from '@/assets/icons/WarningTriangleIcon.vue';
  import CopyIcon from '@/assets/icons/CopyIcon.vue';
  import RefreshIcon from '@/assets/icons/RefreshIcon.vue';
  import HomeIcon from '@/assets/icons/HomeIcon.vue';
  import ChevronDownIcon from '@/assets/icons/ChevronDownIcon.vue';
  import CloseIcon from '@/assets/icons/CloseIcon.vue';
  import {
    ERROR_CODES,
    SOFT_CODES,
    formatErrorTime,
    reloadTo,
    subscribeError,
    type ErrorPayload,
  } from './channel';

  defineOptions({ name: 'ErrorBoundary' });

  const props = withDefaults(
    defineProps<{
      /** 错误卡的出现范围：全屏（路由级）或局部（页面内区域） */
      mode?: 'fullscreen' | 'region';
      /** 是否接收后代组件抛出的错误 */
      autoCapture?: boolean;
      /** 局部错误卡的作用域；与 channel 里的 scope 对应 */
      scope?: string;
    }>(),
    { mode: 'fullscreen', autoCapture: true, scope: '' },
  );

  const payload = ref<ErrorPayload | null>(null);
  const showDevInfo = ref(false);
  const copiedField = ref<string>('');
  const copyMessage = ref<string>('');
  const router = useRouter();

  const isRegion = computed(() => props.mode === 'region');
  /** 超时与资源未就绪是软失败：不是代码出错，文案和灯色都要区别于故障 */
  const isSoft = computed(
    () => !!payload.value && SOFT_CODES.includes(payload.value.code),
  );
  const isResource = computed(() => payload.value?.kind === 'resource');

  const headerText = computed(() =>
    isSoft.value
      ? 'SLOW LINK'
      : isResource.value
        ? 'LINK FAULT'
        : 'SYSTEM FAULT',
  );
  const alarmLabel = computed(() => (isSoft.value ? 'WAITING' : 'ALARM'));
  const retryLabel = computed(() =>
    isResource.value ? '重新加载' : '重新渲染',
  );

  const errorTitle = computed(() => {
    switch (payload.value?.code) {
      case ERROR_CODES.ENTRY_TIMEOUT:
        return '进入超时';
      case ERROR_CODES.CHUNK_LOAD:
        return '资源未就绪';
      case ERROR_CODES.NETWORK:
        return '信号丢失';
      default:
        return '系统故障';
    }
  });

  const errorDescription = computed(() => {
    switch (payload.value?.code) {
      case ERROR_CODES.ENTRY_TIMEOUT:
        return '页面加载耗时过长，这并不代表站点出错。刷新通常就能恢复。';
      case ERROR_CODES.CHUNK_LOAD:
        return '站点刚更新或网络波动，画面资源没有取到，重新加载即可。';
      case ERROR_CODES.NETWORK:
        return '无法建立上行链路，请检查网络连接';
      default:
        return '组件渲染时发生异常，可先重新渲染，再决定是否刷新整页。';
    }
  });

  const errorMessage = computed(() => payload.value?.message || '');
  const errorCode = computed(() => payload.value?.code || ERROR_CODES.GLOBAL);
  const errorStack = computed(() => payload.value?.stack || '');
  const errorRoute = computed(() => payload.value?.route || '');
  const errorUserAgent = computed(() => payload.value?.userAgent || '');
  const errorComponentName = computed(() => payload.value?.component || '');
  const errorTime = computed(() => payload.value?.time || '');

  /** 防止 ErrorBoundary 自身出错后与全局 handler 互相触发形成循环 */
  let lastKey = '';
  let lastAt = 0;

  const show = (next: ErrorPayload): void => {
    const key = `${next.code}|${next.message}`;
    const now = Date.now();
    if (key === lastKey && now - lastAt < 300) return;
    lastKey = key;
    lastAt = now;
    payload.value = {
      route: router.currentRoute.value.fullPath,
      userAgent: navigator.userAgent,
      time: formatErrorTime(),
      ...next,
    };
    console.error('[ErrorBoundary]', next.code, next.message);
  };

  const reset = (): void => {
    payload.value = null;
    showDevInfo.value = false;
  };

  const reloadPage = (): void => {
    reloadTo(router.currentRoute.value.path);
  };

  /** 资源类必须整页重载才能清掉模块缓存；代码类只需重渲染 */
  const handleRetry = (): void => {
    if (!payload.value) return;
    if (isResource.value) {
      reloadPage();
      return;
    }
    reset();
  };

  const goHome = (): void => {
    reset();
    router.push('/').catch(() => undefined);
  };

  onErrorCaptured((err, instance, info) => {
    if (!props.autoCapture) return true;
    const normalized =
      err instanceof Error
        ? err
        : new Error(typeof err === 'string' ? err : '未知错误');
    show({
      kind: 'runtime',
      code: ERROR_CODES.COMPONENT,
      message: normalized.message || '组件渲染时发生异常',
      stack: normalized.stack || '',
      component: info || instance?.$options?.name || '',
      scope: props.scope || undefined,
    });
    return false;
  });

  let unsubscribe: (() => void) | undefined;
  onMounted(() => {
    unsubscribe = subscribeError((next) => {
      if ((next.scope ?? '') !== props.scope) return;
      show(next);
    });
  });
  onUnmounted(() => {
    unsubscribe?.();
  });

  defineExpose({ show, reset });

  const copyToClipboard = async (
    text: string,
    fieldId: string,
    fieldLabel?: string,
  ): Promise<void> => {
    if (!text) {
      copyMessage.value = fieldLabel
        ? `该${fieldLabel}为空，无法复制`
        : '内容为空，无法复制';
      setTimeout(() => {
        copyMessage.value = '';
      }, 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      copiedField.value = fieldId;
      copyMessage.value = fieldLabel
        ? `已复制${fieldLabel}信息`
        : '已复制到剪贴板';
      setTimeout(() => {
        copiedField.value = '';
        copyMessage.value = '';
      }, 2000);
    } catch {
      copiedField.value = '';
      copyMessage.value = '复制失败，请手动选择文本';
      setTimeout(() => {
        copyMessage.value = '';
      }, 2000);
    }
  };

  const copyErrorInfo = async (): Promise<void> => {
    const info = [
      `=== Error Boundary Report ===`,
      `Time: ${errorTime.value}`,
      `Code: ${errorCode.value}`,
      `Message: ${errorMessage.value}`,
      `Route: ${errorRoute.value}`,
      `Component: ${errorComponentName.value}`,
      `UserAgent: ${errorUserAgent.value}`,
      ``,
      `Stack:`,
      errorStack.value || '(no stack)',
    ].join('\n');

    await copyToClipboard(info, 'all', '全部诊断');
  };
</script>

<style lang="scss" src="./index.scss" />
