<template>
  <Teleport to="body">
    <Transition name="share-fade">
      <div
        v-if="visible"
        class="share-mask"
        @click.self="$emit('close')"
      >
        <div class="share-modal" role="dialog" aria-modal="true">
          <button class="share-close" aria-label="关闭" @click="$emit('close')">
            <CloseIcon class="close-icon" />
          </button>

          <div class="share-hex-mesh" aria-hidden="true"></div>

          <div class="share-portal-ring" aria-hidden="true">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>

          <header class="share-header">
            <span class="share-title-glyph"><ShareTitleGlyphIcon /></span>
            <h2 class="share-title">分享至</h2>
            <span class="share-title-glyph"><ShareTitleGlyphIcon /></span>
          </header>
          <p class="share-subtitle">{{ title }}</p>

          <div class="share-energy-line" aria-hidden="true"></div>

          <div class="share-platforms">
            <button
              v-for="platform in platforms"
              :key="platform.key"
              class="platform-node"
              :class="`platform-${platform.key}`"
              :aria-label="`分享到${platform.name}`"
              @click="handleShare(platform.key)"
            >
              <div class="platform-hex" aria-hidden="true"></div>
              <div class="platform-icon-wrap">
                <component :is="platform.icon" class="platform-icon" />
              </div>
              <span class="platform-name">{{ platform.name }}</span>
              <div class="platform-orbit" aria-hidden="true"></div>
            </button>
          </div>

          <div class="share-text-bar">
            <div class="share-text-display">
              <ClipboardIcon class="text-clip-icon" />
              <span class="share-text-content">{{ displayText }}</span>
            </div>
            <button
              class="copy-text-btn"
              :class="{ copied: textCopied }"
              @click="handleCopyText"
            >
              <CheckIcon v-if="textCopied" class="copy-check-icon" />
              <ClipboardIcon v-else class="copy-btn-icon" />
              <span>{{ textCopied ? '已复制文案' : '复制文案' }}</span>
            </button>
          </div>

          <div class="share-copy-bar">
            <div class="copy-url-display">
              <LinkIcon class="copy-link-icon" />
              <span class="copy-url-text">{{ displayUrl }}</span>
              <span class="copy-cursor" aria-hidden="true"></span>
            </div>
            <button
              class="copy-btn"
              :class="{ copied: copied }"
              @click="handleCopyLink"
            >
              <CheckIcon v-if="copied" class="copy-check-icon" />
              <LinkIcon v-else class="copy-btn-icon" />
              <span>{{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>

          <Transition name="toast-fade">
            <div v-if="toast" class="share-toast">
              <CheckIcon class="toast-icon" />
              <span>{{ toast }}</span>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import CloseIcon from '../../icons/common/CloseIcon.vue';
  import WeChatIcon from '../../icons/common/WeChatIcon.vue';
  import MomentsIcon from '../../icons/common/MomentsIcon.vue';
  import WeiboIcon from '../../icons/common/WeiboIcon.vue';
  import QQIcon from '../../icons/common/QQIcon.vue';
  import QZoneIcon from '../../icons/common/QZoneIcon.vue';
  import ZhihuIcon from '../../icons/common/ZhihuIcon.vue';
  import DoubanIcon from '../../icons/common/DoubanIcon.vue';
  import TiebaIcon from '../../icons/common/TiebaIcon.vue';
  import RedBookIcon from '../../icons/common/RedBookIcon.vue';
  import BilibiliIcon from '../../icons/common/BilibiliIcon.vue';
  import DouyinIcon from '../../icons/common/DouyinIcon.vue';
  import KuaishouIcon from '../../icons/common/KuaishouIcon.vue';
  import DingTalkIcon from '../../icons/common/DingTalkIcon.vue';
  import FeishuIcon from '../../icons/common/FeishuIcon.vue';
  import TwitterIcon from '../../icons/common/TwitterIcon.vue';
  import EmailIcon from '../../icons/common/EmailIcon.vue';
  import LinkIcon from '../../icons/common/LinkIcon.vue';
  import ClipboardIcon from '../../icons/common/ClipboardIcon.vue';
  import CheckIcon from '../../icons/common/CheckIcon.vue';
  import ShareTitleGlyphIcon from '../../icons/common/ShareTitleGlyphIcon.vue';

  type PlatformKey = 'wechat' | 'moments' | 'weibo' | 'qq' | 'qzone' | 'zhihu' | 'douban' | 'tieba' | 'redbook' | 'bilibili' | 'douyin' | 'kuaishou' | 'dingtalk' | 'feishu' | 'twitter' | 'email' | 'copy';

  const props = defineProps<{
    visible: boolean;
    title: string;
    shareText: string;
    shareUrl?: string;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'shared', platform: PlatformKey): void;
  }>();

  const platforms = [
    { key: 'wechat' as const, name: '微信', icon: WeChatIcon },
    { key: 'moments' as const, name: '朋友圈', icon: MomentsIcon },
    { key: 'weibo' as const, name: '微博', icon: WeiboIcon },
    { key: 'qq' as const, name: 'QQ', icon: QQIcon },
    { key: 'qzone' as const, name: 'QQ空间', icon: QZoneIcon },
    { key: 'zhihu' as const, name: '知乎', icon: ZhihuIcon },
    { key: 'douban' as const, name: '豆瓣', icon: DoubanIcon },
    { key: 'tieba' as const, name: '贴吧', icon: TiebaIcon },
    { key: 'redbook' as const, name: '小红书', icon: RedBookIcon },
    { key: 'bilibili' as const, name: 'B站', icon: BilibiliIcon },
    { key: 'douyin' as const, name: '抖音', icon: DouyinIcon },
    { key: 'kuaishou' as const, name: '快手', icon: KuaishouIcon },
    { key: 'dingtalk' as const, name: '钉钉', icon: DingTalkIcon },
    { key: 'feishu' as const, name: '飞书', icon: FeishuIcon },
    { key: 'twitter' as const, name: 'Twitter', icon: TwitterIcon },
    { key: 'email' as const, name: '邮件', icon: EmailIcon },
  ];

  const copied = ref(false);
  const textCopied = ref(false);
  const toast = ref('');
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  let copiedTimer: ReturnType<typeof setTimeout> | null = null;

  const fullUrl = computed(() => props.shareUrl || (typeof window !== 'undefined' ? window.location.href : ''));
  const displayUrl = computed(() => {
    const url = fullUrl.value;
    return url.length > 42 ? url.slice(0, 42) + '...' : url;
  });
  const displayText = computed(() => {
    const text = props.shareText || props.title;
    return text.length > 46 ? text.slice(0, 46) + '...' : text;
  });

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  };

  const showToast = (msg: string) => {
    toast.value = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.value = ''; }, 2500);
  };

  const handleShare = async (key: PlatformKey) => {
    const url = fullUrl.value;
    const text = props.shareText || props.title;

    if (key === 'wechat' || key === 'moments') {
      const ok = await copyToClipboard(url);
      showToast(ok ? '链接已复制，请在微信中粘贴' : '复制失败，请手动复制');
    } else if (key === 'weibo') {
      const u = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      window.open(u, '_blank', 'width=600,height=500');
      showToast('已打开微博分享窗口');
    } else if (key === 'qq') {
      const u = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      window.open(u, '_blank', 'width=600,height=500');
      showToast('已打开QQ分享窗口');
    } else if (key === 'qzone') {
      const u = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      window.open(u, '_blank', 'width=600,height=500');
      showToast('已打开QQ空间分享窗口');
    } else if (key === 'tieba') {
      const u = `http://tieba.baidu.com/f/commit/share/openShareApi?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      window.open(u, '_blank', 'width=600,height=500');
      showToast('已打开百度贴吧分享窗口');
    } else if (key === 'zhihu' || key === 'douban') {
      const ok = await copyToClipboard(text);
      showToast(ok ? '文案已复制，可前往对应平台粘贴' : '复制失败，请手动复制');
    } else if (key === 'redbook') {
      const ok = await copyToClipboard(`${text} ${url}`);
      showToast(ok ? '文案与链接已复制，可粘贴到小红书' : '复制失败，请手动复制');
    } else if (key === 'bilibili' || key === 'douyin' || key === 'kuaishou' || key === 'feishu') {
      const ok = await copyToClipboard(url);
      showToast(ok ? '链接已复制，可前往对应平台粘贴' : '复制失败，请手动复制');
    } else if (key === 'dingtalk') {
      const u = `https://qr.dingtalk.com/action/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      window.open(u, '_blank', 'width=600,height=500');
      showToast('已打开钉钉分享窗口');
    } else if (key === 'twitter') {
      const u = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      window.open(u, '_blank', 'width=600,height=500');
      showToast('已打开 Twitter 分享窗口');
    } else if (key === 'email') {
      const u = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
      window.location.href = u;
      showToast('已打开邮件客户端');
    }

    emit('shared', key);
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(fullUrl.value);
    if (ok) {
      copied.value = true;
      showToast('链接已复制到剪贴板');
      if (copiedTimer) clearTimeout(copiedTimer);
      copiedTimer = setTimeout(() => { copied.value = false; }, 2500);
    } else {
      showToast('复制失败，请手动复制');
    }
    emit('shared', 'copy');
  };

  const handleCopyText = async () => {
    const text = props.shareText || props.title;
    const ok = await copyToClipboard(text);
    if (ok) {
      textCopied.value = true;
      showToast('分享文案已复制');
      if (copiedTimer) clearTimeout(copiedTimer);
      copiedTimer = setTimeout(() => { textCopied.value = false; }, 2500);
    } else {
      showToast('复制失败，请手动复制');
    }
  };

  watch(() => props.visible, (v) => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = v ? 'hidden' : '';
    if (!v) {
      copied.value = false;
      textCopied.value = false;
      toast.value = '';
      if (toastTimer) clearTimeout(toastTimer);
      if (copiedTimer) clearTimeout(copiedTimer);
    }
  });
</script>

<style scoped lang="scss" src="./index.scss" />