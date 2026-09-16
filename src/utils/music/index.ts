// 音乐相关工具函数和静态映射

// 格式化歌曲时长（秒 -> mm:ss）
export const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

// 格式化播放次数
export const formatPlayCount = (count: number): string => {
  if (count >= 100000000) {
    return (count / 100000000).toFixed(1) + "亿";
  } else if (count >= 10000) {
    return (count / 10000).toFixed(1) + "万";
  }
  return count.toString();
};

// 根据播放模式获取下一首歌曲索引
export const getNextIndex = (
  currentIndex: number,
  total: number,
  mode: string
): number => {
  switch (mode) {
    case "single":
      return currentIndex;
    case "random":
      if (total <= 1) return 0;
      let next = currentIndex;
      while (next === currentIndex) {
        next = Math.floor(Math.random() * total);
      }
      return next;
    case "loop":
      return (currentIndex + 1) % total;
    case "sequence":
    default:
      return currentIndex + 1 >= total ? -1 : currentIndex + 1;
  }
};

// 根据播放模式获取上一首歌曲索引
export const getPrevIndex = (
  currentIndex: number,
  total: number,
  mode: string
): number => {
  switch (mode) {
    case "random":
      if (total <= 1) return 0;
      let prev = currentIndex;
      while (prev === currentIndex) {
        prev = Math.floor(Math.random() * total);
      }
      return prev;
    case "loop":
    case "single":
    case "sequence":
    default:
      return currentIndex <= 0 ? total - 1 : currentIndex - 1;
  }
};

// 根据当前时间获取歌词索引
export const getCurrentLyricIndex = (
  lyrics: { time: number; text: string }[],
  currentTime: number
): number => {
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return i;
    }
  }
  return 0;
};
