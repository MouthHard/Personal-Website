<template>
  <Teleport to="body">
    <Transition name="landscape-msg-fade">
      <div v-if="visible" class="landscape-message-container">
        <TransitionGroup
          name="landscape-msg"
          tag="div"
          class="landscape-message-list"
          aria-live="polite"
        >
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="landscape-message"
            :class="msg.type"
            @mouseenter="dismiss(msg.id)"
          >
            <span class="landscape-message-aurora" aria-hidden="true"></span>
            <span class="landscape-message-stars" aria-hidden="true">
              <i v-for="n in STAR_COUNT" :key="n" :style="starStyle(n)"></i>
            </span>

            <span class="landscape-message-icon" aria-hidden="true">
              <StatusWeatherIcon :type="msg.type" />
            </span>

            <span class="landscape-message-text">
              <template
                v-for="(seg, index) in splitText(msg.text)"
                :key="index"
              >
                <em v-if="seg.accent" class="landscape-message-accent">
                  {{ seg.text }}
                </em>
                <template v-else>{{ seg.text }}</template>
              </template>
            </span>

            <button
              class="landscape-message-close"
              type="button"
              aria-label="关闭提示"
              @click.stop="dismiss(msg.id)"
            >
              <MessageCloseIcon />
            </button>

            <span class="landscape-message-decor" aria-hidden="true">
              <WaveDecorIcon />
            </span>

            <span class="landscape-message-progress" aria-hidden="true">
              <i :style="{ animationDuration: `${msg.duration}ms` }"></i>
            </span>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { CSSProperties } from 'vue';
  import './index.scss';
  import './responsive.scss';
  import MessageCloseIcon from '@/pages/Landscape/icons/components/common/LandscapeMessage/MessageCloseIcon.vue';
  import StatusWeatherIcon from '@/pages/Landscape/icons/components/common/LandscapeMessage/StatusWeatherIcon.vue';
  import WaveDecorIcon from '@/pages/Landscape/icons/components/common/LandscapeMessage/WaveDecorIcon.vue';

  type MessageType = 'success' | 'info' | 'error' | 'warning';

  interface MessageItem {
    id: number;
    type: MessageType;
    text: string;
    duration: number;
  }

  interface TextSegment {
    text: string;
    accent: boolean;
  }

  const STAR_COUNT = 12;
  const DEFAULT_DURATION = 3200;

  const visible = ref(false);
  const messages = ref<MessageItem[]>([]);
  const autoCloseTimers = new Map<number, ReturnType<typeof setTimeout>>();
  let idCounter = 0;

  const add = (
    type: MessageType,
    text: string,
    duration = DEFAULT_DURATION,
  ) => {
    visible.value = true;
    const id = ++idCounter;
    messages.value.push({ id, type, text, duration });

    const timer = setTimeout(() => dismiss(id), duration);
    autoCloseTimers.set(id, timer);
  };

  const dismiss = (id: number) => {
    const idx = messages.value.findIndex((m) => m.id === id);
    if (idx === -1) return;

    messages.value.splice(idx, 1);

    const timer = autoCloseTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      autoCloseTimers.delete(id);
    }

    if (messages.value.length === 0) {
      visible.value = false;
    }
  };

  /** 把「…」包裹的关键内容拆出来，单独用主题色高亮 */
  const splitText = (text: string): TextSegment[] =>
    text
      .split(/(「[^」]*」)/g)
      .filter(Boolean)
      .map((part) => ({
        text: part,
        accent: part.startsWith('「') && part.endsWith('」'),
      }));

  /** 固定算式生成星点位置，避免随机导致每次渲染跳动 */
  const starStyle = (n: number): CSSProperties => {
    const size = n % 4 === 0 ? 2.5 : 1.5;
    return {
      top: `${8 + ((n * 37) % 82)}%`,
      left: `${6 + ((n * 53) % 88)}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${((n * 7) % 36) / 10}s`,
    };
  };

  const success = (text: string) => add('success', text);
  const info = (text: string) => add('info', text);
  const error = (text: string) => add('error', text);
  const warning = (text: string) => add('warning', text);

  defineExpose({
    success,
    info,
    error,
    warning,
    dismiss,
  });
</script>
