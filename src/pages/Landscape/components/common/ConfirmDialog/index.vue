<template>
  <Teleport to="body">
    <Transition name="confirm-dialog">
      <div v-if="visible" class="confirm-overlay" @click="handleCancel">
        <div class="confirm-dialog" @click.stop>
          <div class="cd-vents"></div>
          <div class="cd-screw screw-tl"></div>
          <div class="cd-screw screw-tr"></div>
          <div class="cd-screw screw-bl"></div>
          <div class="cd-screw screw-br"></div>

          <button class="cd-close" aria-label="关闭" @click="handleCancel">
            <CloseIcon :stroke-width="2.5" />
          </button>

          <div class="cd-body">
            <div class="cd-badge">
              <div class="cd-badge-rotor"></div>
              <div class="cd-badge-pulse"></div>
              <svg viewBox="0 0 72 72" class="cd-badge-svg">
                <g stroke="#9a7a3a" stroke-width="1.4" opacity="0.55">
                  <line x1="36" y1="3" x2="36" y2="9" />
                  <line x1="36" y1="63" x2="36" y2="69" />
                  <line x1="3" y1="36" x2="9" y2="36" />
                  <line x1="63" y1="36" x2="69" y2="36" />
                  <line x1="12" y1="12" x2="16" y2="16" />
                  <line x1="56" y1="56" x2="60" y2="60" />
                  <line x1="60" y1="12" x2="56" y2="16" />
                  <line x1="16" y1="56" x2="12" y2="60" />
                </g>
                <circle
                  cx="36"
                  cy="36"
                  r="26"
                  fill="url(#warnGrad)"
                  stroke="#e8c068"
                  stroke-width="2.5"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="23"
                  fill="none"
                  stroke="rgba(0,0,0,0.3)"
                  stroke-width="1"
                />
                <defs>
                  <radialGradient id="warnGrad" cx="35%" cy="28%">
                    <stop offset="0%" stop-color="#ffe88a" />
                    <stop offset="30%" stop-color="#f5b840" />
                    <stop offset="70%" stop-color="#c08020" />
                    <stop offset="100%" stop-color="#804808" />
                  </radialGradient>
                </defs>
                <rect
                  x="32.5"
                  y="19"
                  width="7"
                  height="26"
                  rx="3.5"
                  fill="#2a1004"
                />
                <circle cx="36" cy="51" r="4" fill="#2a1004" />
              </svg>
            </div>

            <h3 class="cd-title">{{ title }}</h3>

            <div class="cd-screen">
              <div class="cd-scanlines"></div>
              <div class="cd-screen-glow"></div>
              <p class="cd-message">{{ message }}</p>
            </div>
          </div>

          <div class="cd-actions">
            <button class="cd-btn cd-cancel" @click="handleCancel">
              <span class="cd-btn-face">{{ cancelText }}</span>
              <span class="cd-btn-side"></span>
            </button>
            <button class="cd-btn cd-confirm" @click="handleConfirm">
              <span class="cd-btn-face">{{ confirmText }}</span>
              <span class="cd-btn-side"></span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import CloseIcon from '@/pages/Landscape/icons/common/CloseIcon.vue';

  interface Props {
    visible: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'confirm'): void;
    (e: 'cancel'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '提示',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
  });

  const emit = defineEmits<Emits>();

  const handleConfirm = () => {
    emit('update:visible', false);
    emit('confirm');
  };

  const handleCancel = () => {
    emit('update:visible', false);
    emit('cancel');
  };
</script>

<style scoped lang="scss" src="./index.scss" />
