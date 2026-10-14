<template>
  <Teleport to="body">
    <Transition name="spot-modal">
      <div
        v-if="visible && spot"
        class="spot-modal-mask"
        @click.self="emit('close')"
      >
        <div class="spot-modal" role="dialog" aria-modal="true">
          <!-- 螺栓框架四角 -->
          <span class="bolt bolt-tl"></span>
          <span class="bolt bolt-bl"></span>
          <span class="bolt bolt-br"></span>

          <!-- 顶部控制台状态条（含关闭按钮） -->
          <div class="modal-statusbar">
            <span class="statusbar-led"></span>
            <span class="statusbar-power-label">POWER</span>
            <span class="statusbar-spacer"></span>
            <button class="statusbar-close" aria-label="关闭" @click="emit('close')">
              <CloseIcon width="18" height="18" />
            </button>
          </div>

          <div class="modal-body">
            <ModalAside
              :spot="spot"
              @toggle-like="emit('toggle-like', $event)"
              @toggle-want="emit('toggle-want', $event)"
              @toggle-been="emit('toggle-been', $event)"
              @share="emit('share', $event)"
              @navigate="emit('navigate', $event)"
            />
            <ModalContent :spot="spot" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import CloseIcon from '../../icons/common/CloseIcon.vue';
  import ModalAside from './ModalAside/index.vue';
  import ModalContent from './ModalContent/index.vue';
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';

  defineProps<{
    visible: boolean;
    spot: ScenerySpot | null;
  }>();

  const emit = defineEmits<{
    close: [];
    'toggle-favorite': [spotId: string];
    'toggle-like': [spotId: string];
    'toggle-want': [spotId: string];
    'toggle-been': [spotId: string];
    share: [spotId: string];
    navigate: [spotId: string];
  }>();
</script>

<style scoped lang="scss" src="./index.scss" />
