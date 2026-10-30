<template>
  <div v-if="error" class="error-boundary">
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
          <span v-for="i in 16" :key="i" class="error-boundary__tick" :class="{ 'is-major': i % 4 === 0 }" />
        </div>

        <div class="error-boundary__header-bar">
          <div class="error-boundary__hazard-strip" />
          <span class="error-boundary__header-text">SYSTEM FAULT</span>
          <div class="error-boundary__hazard-strip" />
        </div>

        <div class="error-boundary__alarm-row">
          <span class="error-boundary__alarm-led" />
          <span class="error-boundary__alarm-label">ALARM</span>
          <span class="error-boundary__alarm-code">{{ errorCode }}</span>
        </div>

        <div class="error-boundary__icon-wrap">
          <WarningTriangleIcon class="error-boundary__icon" />
        </div>

        <h2 class="error-boundary__title">{{ errorTitle }}</h2>
        <p class="error-boundary__desc">{{ errorDescription }}</p>

        <div class="error-boundary__fields">
          <button class="error-boundary__field" :class="{ 'is-copied': copiedField === 'code' }"
            @click="copyToClipboard(errorCode, 'code', '错误代码')">
            <span class="error-boundary__field-led" />
            <span class="error-boundary__field-label">错误代码</span>
            <span class="error-boundary__field-value">{{ errorCode }}</span>
            <CopyIcon class="error-boundary__field-icon" />
          </button>

          <button class="error-boundary__field error-boundary__field--message"
            :class="{ 'is-copied': copiedField === 'message' }"
            @click="copyToClipboard(errorMessage, 'message', '错误信息')">
            <span class="error-boundary__field-led" />
            <span class="error-boundary__field-label">错误信息</span>
            <span
              class="error-boundary__field-value error-boundary__field-value--mono">{{ errorMessage || '（暂无错误描述）' }}</span>
            <CopyIcon class="error-boundary__field-icon" />
          </button>

          <button class="error-boundary__field" :class="{ 'is-copied': copiedField === 'time' }"
            @click="copyToClipboard(errorTime, 'time', '发生时间')">
            <span class="error-boundary__field-led" />
            <span class="error-boundary__field-label">发生时间</span>
            <span
              class="error-boundary__field-value error-boundary__field-value--mono">{{ errorTime || '（未记录）' }}</span>
            <CopyIcon class="error-boundary__field-icon" />
          </button>
        </div>

        <div class="error-boundary__actions">
          <button class="error-boundary__btn error-boundary__btn--primary" @click="handleRetry">
            <RefreshIcon />
            <span>重新加载</span>
          </button>
          <button class="error-boundary__btn error-boundary__btn--secondary" @click="goHome">
            <HomeIcon />
            <span>返回首页</span>
          </button>
        </div>

        <button class="error-boundary__dev-toggle" :class="{ 'is-active': showDevInfo }"
          @click="showDevInfo = !showDevInfo">
          <span class="error-boundary__toggle-track">
            <span class="error-boundary__toggle-knob" />
          </span>
          <span>诊断信息</span>
          <ChevronDownIcon class="error-boundary__dev-toggle-chevron" />
        </button>

        <p class="error-boundary__hint">
          问题持续存在？<a href="mailto:support@example.com" class="error-boundary__link">联系技术支持</a>
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
            <button class="error-boundary__dev-close" @click="showDevInfo = false">
              <CloseIcon />
            </button>
          </div>

          <div class="error-boundary__dev-body">
            <button class="error-boundary__dev-section" :class="{ 'is-copied': copiedField === 'dev-code' }"
              @click="copyToClipboard(errorCode, 'dev-code', '错误代码')">
              <span class="error-boundary__dev-label">&gt; 错误代码</span>
              <code class="error-boundary__dev-code">{{ errorCode }}</code>
            </button>
            <button class="error-boundary__dev-section" :class="{ 'is-copied': copiedField === 'dev-message' }"
              @click="copyToClipboard(errorMessage, 'dev-message', '错误信息')">
              <span class="error-boundary__dev-label">&gt; 错误信息</span>
              <pre class="error-boundary__dev-pre">{{ errorMessage || '（暂无错误描述）' }}</pre>
            </button>
            <button class="error-boundary__dev-section" :class="{ 'is-copied': copiedField === 'dev-time' }"
              @click="copyToClipboard(errorTime, 'dev-time', '发生时间')">
              <span class="error-boundary__dev-label">&gt; 发生时间</span>
              <code class="error-boundary__dev-code">{{ errorTime || '（未记录）' }}</code>
            </button>
            <button class="error-boundary__dev-section" :class="{ 'is-copied': copiedField === 'dev-stack' }"
              @click="copyToClipboard(errorStack, 'dev-stack', '调用堆栈')">
              <span class="error-boundary__dev-label">&gt; 调用堆栈</span>
              <pre class="error-boundary__dev-pre">{{ errorStack || '（无堆栈信息）' }}</pre>
            </button>
            <button class="error-boundary__dev-section" :class="{ 'is-copied': copiedField === 'dev-route' }"
              @click="copyToClipboard(errorRoute, 'dev-route', '当前路由')">
              <span class="error-boundary__dev-label">&gt; 当前路由</span>
              <code class="error-boundary__dev-code">{{ errorRoute || '（未获取）' }}</code>
            </button>
            <button class="error-boundary__dev-section" :class="{ 'is-copied': copiedField === 'dev-component' }"
              @click="copyToClipboard(errorComponentName, 'dev-component', '组件信息')">
              <span class="error-boundary__dev-label">&gt; 组件信息</span>
              <code class="error-boundary__dev-code">{{
                errorComponentName || '（未捕获）'
              }}</code>
            </button>
            <button class="error-boundary__dev-section" :class="{ 'is-copied': copiedField === 'dev-ua' }"
              @click="copyToClipboard(errorUserAgent, 'dev-ua', '浏览器环境')">
              <span class="error-boundary__dev-label">&gt; 浏览器环境</span>
              <code class="error-boundary__dev-code">{{ errorUserAgent || '（未获取）' }}</code>
            </button>
            <button class="error-boundary__dev-copy" :class="{ 'is-copied': copiedField === 'all' }"
              @click="copyErrorInfo">
              <CopyIcon />
              <span>{{ copiedField === 'all' ? '已复制 ✓' : '复制全部信息' }}</span>
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
import { ref, computed, onErrorCaptured } from 'vue';
import { useRouter } from 'vue-router';
import WarningTriangleIcon from '@/assets/icons/WarningTriangleIcon.vue';
import CopyIcon from '@/assets/icons/CopyIcon.vue';
import RefreshIcon from '@/assets/icons/RefreshIcon.vue';
import HomeIcon from '@/assets/icons/HomeIcon.vue';
import ChevronDownIcon from '@/assets/icons/ChevronDownIcon.vue';
import CloseIcon from '@/assets/icons/CloseIcon.vue';

const error = ref<Error | null>(null);
const errorStack = ref<string>('');
const errorRoute = ref<string>('');
const errorUserAgent = ref<string>('');
const errorComponentName = ref<string>('');
const errorTime = ref<string>('');
const showDevInfo = ref(false);
const copiedField = ref<string>('');
const copyMessage = ref<string>('');
const router = useRouter();

onErrorCaptured((err: Error, _instance, info) => {
  error.value = err;
  errorStack.value = err.stack || '';
  errorRoute.value = router.currentRoute.value.fullPath;
  errorUserAgent.value = navigator.userAgent;
  errorComponentName.value = info || '';
  errorTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  console.error('[ErrorBoundary]', err);
  return false;
});

const errorTitle = computed(() => {
  if (
    error.value?.message?.includes('fetch') ||
    error.value?.message?.includes('network')
  ) {
    return '信号丢失';
  }
  if (error.value?.message?.includes('timeout')) {
    return '请求超时';
  }
  return '系统故障';
});

const errorDescription = computed(() => {
  if (
    error.value?.message?.includes('fetch') ||
    error.value?.message?.includes('network')
  ) {
    return '无法建立上行链路，请检查网络连接';
  }
  if (error.value?.message?.includes('timeout')) {
    return '服务器响应超时，请稍后重试';
  }
  return '组件渲染失败，正在尝试恢复';
});

const errorMessage = computed(() => {
  return error.value?.message || '';
});

const errorCode = computed(() => {
  if (
    error.value?.message?.includes('fetch') ||
    error.value?.message?.includes('network')
  ) {
    return 'ERR_NETWORK_ERROR';
  }
  if (error.value?.message?.includes('timeout')) {
    return 'ERR_REQUEST_TIMEOUT';
  }
  return 'ERR_COMPONENT_RENDER';
});

const handleRetry = (): void => {
  error.value = null;
};

const goHome = (): void => {
  error.value = null;
  router.push('/');
};

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
