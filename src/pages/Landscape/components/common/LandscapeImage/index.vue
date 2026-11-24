<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import loadingPlaceholder from '@/assets/image/landscape/loading.webp';
  import failPlaceholder from '@/assets/image/landscape/fail.webp';

  defineOptions({ name: 'LandscapeImage', inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      /** 允许缺省：数据未提供地址时保留占位图，不渲染 src */
      src?: string;
      /** scene = 大图卡片（根元素块级铺满）；avatar = 头像（根元素自适应内容） */
      variant?: 'scene' | 'avatar';
    }>(),
    { src: undefined, variant: 'scene' },
  );

  type ImageStatus = 'loading' | 'loaded' | 'error';

  const status = ref<ImageStatus>('loading');
  const retryCount = ref(0);

  /** 重试时给 URL 追加参数突破浏览器错误缓存；保留原 URL 已有的 query */
  const displaySrc = computed(() => {
    if (!props.src) return undefined;
    if (retryCount.value === 0) return props.src;
    const separator = props.src.includes('?') ? '&' : '?';
    return `${props.src}${separator}__retry=${retryCount.value}`;
  });

  const onLoad = (): void => {
    status.value = 'loaded';
  };

  const onError = (): void => {
    status.value = 'error';
  };

  const retry = (): void => {
    retryCount.value++;
    status.value = 'loading';
  };

  watch(
    () => props.src,
    () => {
      retryCount.value = 0;
      status.value = 'loading';
    },
  );
</script>

<template>
  <span class="landscape-image" :class="[`is-${status}`, `is-${variant}`]">
    <!-- 外部 class / loading / alt 经 $attrs 原样落到 img，现有样式零改动 -->
    <img v-bind="$attrs" :src="displaySrc" @load="onLoad" @error="onError" />

    <!-- 加载中：两种变体统一用 AI 占位图（自带文案），头像靠 object-position
         对准图片右侧的文案区，小容器里「正在加载」小字仍可读（见 index.scss） -->
    <span v-if="status === 'loading'" class="li-placeholder li-loading">
      <img
        class="li-photo"
        :class="`li-photo-${variant}`"
        :src="loadingPlaceholder"
        alt=""
        aria-hidden="true"
      />
    </span>

    <!-- 失败：同样统一用 AI 占位图（自带文案与按钮外观），叠透明热区保证重试可点
         必须用 v-else-if 精确限定 error，否则 loaded 时也会落入此分支导致占位图盖住正常图 -->
    <span v-else-if="status === 'error'" class="li-placeholder li-error">
      <img
        class="li-photo"
        :class="`li-photo-${variant}`"
        :src="failPlaceholder"
        alt=""
        aria-hidden="true"
      />
      <button
        type="button"
        class="li-retry li-retry-hit"
        aria-label="点击重新加载图片"
        @click.stop="retry"
      ></button>
    </span>
  </span>
</template>

<style scoped lang="scss" src="./index.scss" />
