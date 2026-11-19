<template>
  <Teleport to="body">
    <Transition name="poem-msg-fade">
      <div v-if="visible" class="poem-message-container">
        <TransitionGroup
          name="poem-msg-item"
          tag="div"
          class="poem-message-list"
        >
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="poem-message"
            :class="msg.type"
            @mouseenter="dismiss(msg.id)"
          >
            <div class="poem-message-bar"></div>
            <div class="poem-message-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <template v-if="msg.type === 'success'">
                  <path d="M5 12 L10 17 L19 7" />
                </template>
                <template v-else-if="msg.type === 'info'">
                  <circle cx="12" cy="12" r="9" stroke-width="1.8" />
                  <path d="M12 8 L12 12" />
                  <circle
                    cx="12"
                    cy="16"
                    r="0.8"
                    fill="currentColor"
                    stroke="none"
                  />
                </template>
                <template v-else-if="msg.type === 'error'">
                  <path d="M6 6 L18 18" />
                  <path d="M18 6 L6 18" />
                </template>
                <template v-else-if="msg.type === 'warning'">
                  <path d="M12 4 L12 13" />
                  <circle
                    cx="12"
                    cy="17"
                    r="0.9"
                    fill="currentColor"
                    stroke="none"
                  />
                  <path
                    d="M4 20 Q12 3, 20 20"
                    stroke-width="1.5"
                    stroke-opacity="0.4"
                  />
                </template>
              </svg>
            </div>
            <span class="poem-message-text">{{ msg.text }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import './index.scss';

  type MessageType = 'success' | 'info' | 'error' | 'warning';

  interface MessageItem {
    id: number;
    type: MessageType;
    text: string;
  }

  const visible = ref(false);
  const messages = ref<MessageItem[]>([]);
  let idCounter = 0;
  let autoCloseTimers: Map<number, ReturnType<typeof setTimeout>> = new Map();

  const add = (type: MessageType, text: string, duration = 2600) => {
    visible.value = true;
    const id = ++idCounter;
    messages.value.push({ id, type, text });

    const timer = setTimeout(() => {
      dismiss(id);
    }, duration);
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

  defineExpose({
    success: (text: string) => add('success', text),
    info: (text: string) => add('info', text),
    error: (text: string) => add('error', text),
    warning: (text: string) => add('warning', text),
    dismiss,
  });
</script>
