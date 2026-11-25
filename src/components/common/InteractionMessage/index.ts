import { poemMessage } from '@/components/common/PoemMessage';

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

export const showMessage = {
  success: (message: string) => {
    poemMessage.success(message);
  },
  info: (message: string) => {
    poemMessage.info(message);
  },
  error: (message: string) => {
    poemMessage.error(message);
  },
  warning: (message: string) => {
    poemMessage.warning(message);
  },
  like: {
    success: (title: string) => {
      poemMessage.success(`已为「${title}」点赞`);
    },
    cancel: () => {
      poemMessage.info('已取消点赞');
    },
  },

  love: {
    success: (title: string, type: ContentType) => {
      const typeText = getContentTypeText(type);
      poemMessage.success(`「${title}」已添加到「我的喜欢 - ${typeText}」`);
    },
    cancel: (title: string, type: ContentType) => {
      const typeText = getContentTypeText(type);
      poemMessage.info(`已从「我的喜欢 - ${typeText}」移除「${title}」`);
    },
  },

  favorite: {
    success: (title: string, type: ContentType) => {
      const typeText = getContentTypeText(type);
      poemMessage.success(`「${title}」已收藏到「我的收藏 - ${typeText}」`);
    },
    cancel: (title: string, type: ContentType) => {
      const typeText = getContentTypeText(type);
      poemMessage.info(`已从「我的收藏 - ${typeText}」移除「${title}」`);
    },
  },

  follow: {
    success: (name: string) => {
      poemMessage.success(`已关注「${name}」，可在「我的关注」查看`);
    },
    cancel: (name: string) => {
      poemMessage.info(`已取消关注「${name}」`);
    },
  },

  share: {
    success: (title: string) => {
      poemMessage.success(`已复制「${title}」分享链接`);
    },
    platform: (platformName: string) => {
      poemMessage.success(`已分享到 ${platformName}`);
    },
    copied: () => {
      poemMessage.success('链接已复制到剪贴板');
    },
    error: () => {
      poemMessage.error('复制失败，请手动复制');
    },
  },

  download: {
    success: (title: string) => {
      poemMessage.success(`「${title}」下载已开始`);
    },
    error: () => {
      poemMessage.error('下载失败，请稍后重试');
    },
  },
};
