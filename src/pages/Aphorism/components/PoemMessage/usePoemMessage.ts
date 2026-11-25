import { createApp } from 'vue';
import PoemMessage from './index.vue';

type MessageType = 'success' | 'info' | 'error' | 'warning';

type ContentType =
  'image' | 'video' | 'guide' | 'photographer' | 'game' | 'poem';

const getContentTypeText = (type: ContentType): string => {
  const typeMap: Record<ContentType, string> = {
    image: '图片',
    video: '视频',
    guide: '攻略',
    photographer: '摄影师',
    game: '游戏',
    poem: '诗词',
  };
  return typeMap[type] || '内容';
};

let messageInstance: InstanceType<typeof PoemMessage> | null = null;
let app: ReturnType<typeof createApp> | null = null;

const getInstance = () => {
  if (messageInstance) return messageInstance;

  const container = document.createElement('div');
  document.body.appendChild(container);

  app = createApp(PoemMessage);
  messageInstance = app.mount(container) as InstanceType<typeof PoemMessage>;

  return messageInstance;
};

const show = (type: MessageType, text: string) => {
  const instance = getInstance();
  instance[type](text);
};

export const usePoemMessage = () => {
  return {
    success: (text: string) => show('success', text),
    info: (text: string) => show('info', text),
    error: (text: string) => show('error', text),
    warning: (text: string) => show('warning', text),

    like: {
      success: (title: string) => show('success', `已为「${title}」点赞`),
      cancel: () => show('info', '已取消点赞'),
    },

    love: {
      success: (title: string, type: ContentType) => {
        show(
          'success',
          `「${title}」已添加到「我的喜欢 - ${getContentTypeText(type)}」`,
        );
      },
      cancel: (title: string, type: ContentType) => {
        show(
          'info',
          `已从「我的喜欢 - ${getContentTypeText(type)}」移除「${title}」`,
        );
      },
    },

    favorite: {
      success: (title: string, type: ContentType) => {
        show(
          'success',
          `「${title}」已收藏到「我的收藏 - ${getContentTypeText(type)}」`,
        );
      },
      cancel: (title: string, type: ContentType) => {
        show(
          'info',
          `已从「我的收藏 - ${getContentTypeText(type)}」移除「${title}」`,
        );
      },
    },

    share: {
      success: (title: string) => show('success', `已复制「${title}」分享链接`),
      platform: (platformName: string) =>
        show('success', `已分享到 ${platformName}`),
      copied: () => show('success', '链接已复制到剪贴板'),
      error: () => show('error', '复制失败，请手动复制'),
    },
  };
};
