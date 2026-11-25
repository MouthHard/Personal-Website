import { museumMessage } from '@/pages/Museum/components/MuseumMessage';

type MsgType = 'success' | 'info' | 'warning' | 'error';

const show = (type: MsgType, message: string) => museumMessage[type](message);

export const useMuseumMessage = () => ({
  like: {
    success: (title: string) => show('success', `已为「${title}」点赞`),
    cancel: () => show('info', '已取消点赞'),
  },

  favorite: {
    success: (title: string) => show('success', `「${title}」已收藏到我的足迹`),
    cancel: (title: string) => show('info', `已从我的足迹移除「${title}」`),
  },

  follow: {
    success: (name: string) =>
      show('success', `已关注「${name}」，可在我的足迹查看`),
    cancel: (name: string) => show('info', `已取消关注「${name}」`),
  },
});
