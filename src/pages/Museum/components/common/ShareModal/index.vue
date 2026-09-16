<template>
  <Teleport to="body">
    <transition name="share-modal">
      <div
        v-if="visible"
        class="share-modal-overlay"
        @click.self="close"
      >
        <div
          class="share-modal"
          role="dialog"
          aria-modal="true"
        >
          <!-- 顶部标题栏 -->
          <div class="modal-header">
            <div class="header-glow"></div>
            <h3 class="modal-title">
              <span class="title-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </span>
              分享到
            </h3>
            <button class="close-btn" @click="close" aria-label="关闭">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- 分享内容预览 -->
          <div class="share-preview">
            <div class="preview-shine"></div>
            <div class="preview-content">
              <div class="preview-label">分享内容</div>
              <div class="preview-title">{{ title }}</div>
              <div v-if="description" class="preview-desc">{{ description }}</div>
            </div>
          </div>

          <!-- 媒体平台网格 -->
          <div class="platform-section">
            <div class="section-label">社交媒体</div>
            <div class="platform-grid">
              <button
                v-for="platform in platforms"
                :key="platform.key"
                class="platform-item"
                @click="handlePlatformClick(platform)"
              >
                <div
                  class="platform-icon"
                  :style="{ '--platform-color': platform.color, '--platform-color-light': platform.colorLight }"
                >
                  <span class="platform-letter">{{ platform.letter }}</span>
                  <div class="icon-shine"></div>
                </div>
                <span class="platform-name">{{ platform.name }}</span>
              </button>
            </div>
          </div>

          <!-- 分隔线 -->
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">其他方式</span>
            <span class="divider-line"></span>
          </div>

          <!-- 其他操作 -->
          <div class="other-actions">
            <button class="action-item" @click="copyLink">
              <div class="action-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span class="action-name">复制链接</span>
            </button>
            <button class="action-item" @click="showQrCode">
              <div class="action-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="3" height="3" rx="0.5" />
                  <rect x="18" y="18" width="3" height="3" rx="0.5" />
                  <rect x="14" y="18" width="3" height="3" rx="0.5" />
                  <rect x="18" y="14" width="3" height="3" rx="0.5" />
                </svg>
              </div>
              <span class="action-name">二维码</span>
            </button>
            <button class="action-item" @click="saveImage">
              <div class="action-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <span class="action-name">保存图片</span>
            </button>
            <button class="action-item" @click="reportContent">
              <div class="action-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
              <span class="action-name">举报</span>
            </button>
          </div>

          <!-- 底部提示 -->
          <div class="modal-footer">
            <span class="footer-text">分享内容仅用于个人学习交流，请勿用于商业用途</span>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { watch, onUnmounted, onMounted } from 'vue';
  import { showMessage } from '@/components/common/InteractionMessage';

  interface Platform {
    name: string;
    key: string;
    letter: string;
    color: string;
    colorLight: string;
  }

  interface Props {
    visible: boolean;
    title: string;
    description?: string;
    url?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    url: '',
  });

  const emit = defineEmits<{
    'update:visible': [value: boolean];
    share: [platform: string];
  }>();

  const close = () => emit('update:visible', false);

  const platforms: Platform[] = [
    { name: '微信', key: 'wechat', letter: '微', color: '#07C160', colorLight: '#4ade80' },
    { name: 'QQ', key: 'qq', letter: 'Q', color: '#12B7F5', colorLight: '#60d4f7' },
    { name: '微博', key: 'weibo', letter: '博', color: '#E6162D', colorLight: '#ff5a6e' },
    { name: '知乎', key: 'zhihu', letter: '知', color: '#0084FF', colorLight: '#3aa5ff' },
    { name: '豆瓣', key: 'douban', letter: '豆', color: '#2E8B57', colorLight: '#52b887' },
    { name: '小红书', key: 'rednote', letter: '红', color: '#FE2C55', colorLight: '#ff6b8a' },
    { name: '抖音', key: 'douyin', letter: '抖', color: '#25F4EE', colorLight: '#5ff8f1' },
    { name: 'B站', key: 'bilibili', letter: 'B', color: '#FB7299', colorLight: '#fc9cb5' },
    { name: '邮箱', key: 'email', letter: '邮', color: '#3498DB', colorLight: '#5dade2' },
  ];

  const handlePlatformClick = (platform: Platform) => {
    showMessage.share.platform(platform.name);
    emit('share', platform.key);
    close();
  };

  const copyLink = async () => {
    const link = props.url || window.location.href;
    try {
      await navigator.clipboard.writeText(link);
      showMessage.share.copied();
    } catch {
      showMessage.share.error();
    }
    close();
  };

  const showQrCode = () => {
    showMessage.share.platform('二维码');
    close();
  };

  const saveImage = () => {
    showMessage.share.platform('保存图片');
    close();
  };

  const reportContent = () => {
    showMessage.share.platform('举报');
    close();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.visible) {
      close();
    }
  };

  watch(
    () => props.visible,
    (val) => {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  );

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  });
</script>

<style lang="scss" scoped src="./index.scss"></style>