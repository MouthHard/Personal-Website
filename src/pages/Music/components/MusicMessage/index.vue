<template>
  <Teleport to="body">
    <Transition name="music-msg-fade">
      <div v-if="visible" class="music-msg-container">
        <TransitionGroup
          name="music-msg"
          tag="div"
          class="music-msg-list"
          aria-live="polite"
        >
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="music-msg"
            :class="msg.type"
            @mouseenter="dismiss(msg.id)"
          >
            <span class="music-msg-glow" aria-hidden="true"></span>

            <span class="music-msg-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <template v-if="msg.type === 'success'">
                  <path d="M20 6 L9 17 L4 12" />
                </template>
                <template v-else-if="msg.type === 'info'">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11 L12 16" />
                  <circle
                    cx="12"
                    cy="7.6"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </template>
                <template v-else-if="msg.type === 'error'">
                  <path d="M6 6 L18 18" />
                  <path d="M18 6 L6 18" />
                </template>
                <template v-else>
                  <path d="M12 3.5 L21.5 19.5 H2.5 Z" />
                  <path d="M12 9.5 L12 14" />
                  <circle
                    cx="12"
                    cy="17"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </template>
              </svg>
            </span>

            <span class="music-msg-text">
              <template
                v-for="(seg, index) in splitText(msg.text)"
                :key="index"
              >
                <em v-if="seg.accent" class="music-msg-accent">
                  {{ seg.text }}
                </em>
                <template v-else>{{ seg.text }}</template>
              </template>
            </span>

            <button
              class="music-msg-close"
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

            <span class="music-msg-eq" aria-hidden="true">
              <i
                v-for="n in 5"
                :key="n"
                :style="{ animationDelay: `${n * 0.12}s` }"
              ></i>
            </span>

            <span class="music-msg-progress" aria-hidden="true">
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

  const DEFAULT_DURATION = 2800;

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

  const splitText = (text: string): TextSegment[] =>
    text
      .split(/(「[^」]*」)/g)
      .filter(Boolean)
      .map((part) => ({
        text: part,
        accent: part.startsWith('「') && part.endsWith('」'),
      }));

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
