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
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <template v-if="msg.type === 'success'">
                  <circle
                    cx="17.3"
                    cy="6.6"
                    r="2.1"
                    fill="currentColor"
                    fill-opacity=".22"
                  />
                  <path d="M2.4 18.4 L8.4 9.2 L12 14.4 L15 10.4 L21.6 18.4" />
                  <path d="M2.4 18.4 H21.6" />
                </template>
                <template v-else-if="msg.type === 'info'">
                  <circle cx="12" cy="12" r="8.6" />
                  <path
                    d="M15.4 8.6 L13.5 13.5 L8.6 15.4 L10.5 10.5 Z"
                    fill="currentColor"
                    fill-opacity=".18"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="1.05"
                    fill="currentColor"
                    stroke="none"
                  />
                </template>
                <template v-else-if="msg.type === 'error'">
                  <path
                    d="M17 13.6 A3.2 3.2 0 0 0 16.4 7.4 A4.3 4.3 0 0 0 8 8.2 A3 3 0 0 0 7.9 13.6"
                  />
                  <path d="M12.6 12.4 L10.4 16.2 H12.9 L10.9 19.8" />
                </template>
                <template v-else>
                  <circle cx="8.8" cy="8.6" r="2.9" />
                  <path
                    d="M8.8 2.4 V3.8 M8.8 13.4 V14.8 M2.6 8.6 H4 M13.6 8.6 H15 M4.4 4.2 L5.4 5.2 M12.2 12 L13.2 13"
                  />
                  <path
                    d="M13.4 19.2 A3.2 3.2 0 0 1 13.6 13 A4.2 4.2 0 0 1 21.4 13.8 A2.8 2.8 0 0 1 21.2 19.2 Z"
                  />
                </template>
              </svg>
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
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <path d="M6 6 L18 18" />
                <path d="M18 6 L6 18" />
              </svg>
            </button>

            <span class="landscape-message-decor" aria-hidden="true">
              <svg viewBox="0 0 420 40" preserveAspectRatio="none">
                <path
                  d="M0 34 L46 14 L84 27 L124 7 L168 33 L206 19 L246 30 L288 11 L330 26 L368 9 L420 27 L420 40 L0 40 Z"
                  fill="currentColor"
                  opacity=".22"
                />
                <path
                  d="M0 40 L34 29 L72 35 L108 23 L146 37 L188 27 L230 38 L272 24 L314 35 L354 22 L390 32 L420 26 L420 40 Z"
                  fill="currentColor"
                  opacity=".38"
                />
              </svg>
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
