<template>
  <transition name="modal">
    <div v-if="visible" class="modal-overlay" @click="$emit('close')">
      <div class="upload-modal" @click.stop>
        <!-- 背景装饰 -->
        <div class="modal-bg-decoration">
          <div class="glow-orb orb-1"></div>
          <div class="glow-orb orb-2"></div>
          <div class="glow-orb orb-3"></div>
          <div class="grid-pattern"></div>
        </div>

        <button class="modal-close" @click="$emit('close')">
          <CloseIcon :stroke-width="2" />
        </button>

        <!-- 头部 -->
        <div class="modal-header">
          <div class="header-badge">
            <UploadIcon :stroke-width="2" />
            <span>创作中心</span>
          </div>
          <h2 class="upload-title">上传风景作品</h2>
          <p class="upload-subtitle">分享你眼中的壮丽世界，让更多人看到你的摄影作品</p>
        </div>

        <!-- 上传区域 -->
        <div class="upload-area">
          <div class="upload-area-glow"></div>
          <div class="upload-icon">
            <div class="icon-ring"></div>
            <div class="icon-pulse"></div>
            <UploadIcon :stroke-width="2" />
          </div>
          <p class="upload-text">拖拽文件到此处或点击上传</p>
          <p class="upload-hint">支持以下格式</p>
          <div class="format-badges">
            <span class="format-badge">JPG</span>
            <span class="format-badge">PNG</span>
            <span class="format-badge">WEBP</span>
            <span class="format-badge video">MP4</span>
          </div>
          <input type="file" accept="image/*,video/*" @change="handleUpload" />
        </div>

        <!-- 底部信息 -->
        <div class="modal-footer">
          <div class="footer-item">
            <ClockIcon :stroke-width="2" />
            <span>单次最大 50MB</span>
          </div>
          <div class="footer-item">
            <ShieldIcon :stroke-width="2" />
            <span>原创内容受保护</span>
          </div>
          <div class="footer-item">
            <CheckCircleIcon :stroke-width="2" />
            <span>上传即同意社区规范</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import CloseIcon from '@/pages/Landscape/icon/common/CloseIcon.vue';
import UploadIcon from '@/pages/Landscape/icon/common/UploadIcon.vue';
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue';
import ShieldIcon from '@/pages/Landscape/icon/common/ShieldIcon.vue';
import CheckCircleIcon from '@/pages/Landscape/icon/components/common/UploadModal/CheckCircleIcon.vue';
import { showMessage } from '@/utils/landscape';

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  upload: [file: File];
}>();

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const handleUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > MAX_FILE_SIZE) {
      showMessage.error('文件大小不能超过 50MB');
      target.value = '';
      return;
    }
    emit('upload', file);
    target.value = '';
  }
};
</script>

<style scoped lang="scss" src="./index.scss" />
