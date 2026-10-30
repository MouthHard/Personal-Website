/** 过渡图本地路径（public/change/ 目录，随应用同源分发，自动拼接 Vite base 路径） */
export const CHANGE_IMAGE_BASE = `${import.meta.env.BASE_URL}change`;

/** 图片池大小 */
export const IMAGE_POOL_SIZE = 20;

/**
 * 在浏览器空闲时预加载所有过渡图片到缓存。
 * 本地资源同源加载，无 DNS/TCP 开销，缓存命中后页面切换瞬间展示。
 */
export const preloadPageChangeImages = (): void => {
  const run = (): void => {
    for (let i = 1; i <= IMAGE_POOL_SIZE; i++) {
      const img = new Image();
      img.src = `${CHANGE_IMAGE_BASE}/${i}.webp`;
    }
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 3000 });
  } else {
    window.setTimeout(run, 1500);
  }
};