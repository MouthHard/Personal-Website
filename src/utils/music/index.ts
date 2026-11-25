// 音乐相关工具函数和静态映射

/** OSS 域名（图片池与站点同源策略一致） */
const OSS_BASE = 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com';

/**
 * 图片池边界（经线上实测，2026-11-25）：
 * - landscape：1–36 可用，0 与 37+ 均 404
 * - aphorism：1–34 可用，0 与 35+ 均 404（34 于 11:57 补传）
 *
 * 之前散落在各处的 `* 21` / `* 41` / POOL_SIZE=37 都会抽到 404 图，统一收口到此处。
 * 若后续再补传新图，只需同步这里的池大小即可。
 */
const LANDSCAPE_POOL_SIZE = 36;
const APHORISM_POOL_SIZE = 34;

/** 随机风景封面（1–36） */
export const randomLandscapeCover = (): string =>
  `${OSS_BASE}/landscape/${Math.floor(Math.random() * LANDSCAPE_POOL_SIZE) + 1}.webp`;

/** 随机诗词封面（1–34） */
export const randomAphorismCover = (): string =>
  `${OSS_BASE}/aphorism/${Math.floor(Math.random() * APHORISM_POOL_SIZE) + 1}.webp`;

/**
 * 本地过渡图封面：public/change/1–20.webp（同源、稳定有效）。
 * 原 OSS 上的 music/mv/*.webp 四张封面已全部 404，临时改用它，
 * 待音乐页面改造时再替换为正式素材。
 */
export const localChangeCover = (index: number): string =>
  `${import.meta.env.BASE_URL}change/${index}.webp`;

// 格式化歌曲时长（秒 -> mm:ss）
export const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

// 格式化播放次数
export const formatPlayCount = (count: number): string => {
  if (count >= 100000000) {
    return (count / 100000000).toFixed(1) + '亿';
  } else if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

// 根据播放模式获取下一首歌曲索引
export const getNextIndex = (
  currentIndex: number,
  total: number,
  mode: string,
): number => {
  switch (mode) {
    case 'single':
      return currentIndex;
    case 'random': {
      if (total <= 1) return 0;
      let next = currentIndex;
      while (next === currentIndex) {
        next = Math.floor(Math.random() * total);
      }
      return next;
    }
    case 'loop':
      return (currentIndex + 1) % total;
    case 'sequence':
    default:
      return currentIndex + 1 >= total ? -1 : currentIndex + 1;
  }
};

// 根据播放模式获取上一首歌曲索引
export const getPrevIndex = (
  currentIndex: number,
  total: number,
  mode: string,
): number => {
  switch (mode) {
    case 'random': {
      if (total <= 1) return 0;
      let prev = currentIndex;
      while (prev === currentIndex) {
        prev = Math.floor(Math.random() * total);
      }
      return prev;
    }
    case 'loop':
    case 'single':
    case 'sequence':
    default:
      return currentIndex <= 0 ? total - 1 : currentIndex - 1;
  }
};

// 根据当前时间获取歌词索引
export const getCurrentLyricIndex = (
  lyrics: { time: number; text: string }[],
  currentTime: number,
): number => {
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return i;
    }
  }
  return 0;
};
