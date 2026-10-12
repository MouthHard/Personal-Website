<template>
  <Teleport to="body">
    <div class="travel-toast-container">
      <TransitionGroup name="toast-slide" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
          @mouseenter="dismiss(toast.id)"
        >
          <div class="toast-glow"></div>
          <component :is="getIcon(toast.type)" class="toast-icon" />
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import type { Component } from 'vue';
  import ThumbUpIcon from '../../icons/common/ThumbUpIcon.vue';
  import BookmarkIcon from '../../icons/common/BookmarkIcon.vue';
  import CheckIcon from '../../icons/common/CheckIcon.vue';
  import LinkIcon from '../../icons/common/LinkIcon.vue';
  import ShoppingBagIcon from '../../icons/common/ShoppingBagIcon.vue';
  import HeartIcon from '../../icons/common/HeartIcon.vue';
  import SparklesIcon from '../../icons/common/SparklesIcon.vue';
  import CloseIcon from '../../icons/common/CloseIcon.vue';
  import WarningIcon from '../../icons/common/WarningIcon.vue';
  import { useTravelToast, type ToastType } from '@/composables/travelGuide/useTravelToast';

  const { toasts, dismiss } = useTravelToast();

  const ICON_MAP: Record<ToastType, Component> = {
    like: ThumbUpIcon,
    want: BookmarkIcon,
    eaten: CheckIcon,
    share: LinkIcon,
    'souvenir-want': ShoppingBagIcon,
    'souvenir-bought': CheckIcon,
    'route-fav': HeartIcon,
    'route-done': CheckIcon,
    info: SparklesIcon,
    remove: CloseIcon,
    success: CheckIcon,
    warning: WarningIcon,
  };

  const getIcon = (type: ToastType): Component => ICON_MAP[type] || SparklesIcon;
</script>

<style scoped lang="scss" src="./index.scss" />