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
              <WarningBadgeIcon />
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
  import WarningBadgeIcon from '@/pages/Landscape/icons/components/common/ConfirmDialog/WarningBadgeIcon.vue';

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
