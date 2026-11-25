/**
 * 过渡图本地路径（public/change/ 目录，随应用同源分发，自动拼接 Vite base 路径）
 *
 * 加载策略：不全量预加载 20 张（6.5MB 会抢首屏带宽）。
 * App 挂载时只加载「首批 4 张」，每次演出取走这批、再空闲加载下一批，
 * 缓存随用户实际切换渐进填充。
 */
export const CHANGE_IMAGE_BASE = `${import.meta.env.BASE_URL}change`;

/** 图片池大小 */
export const IMAGE_POOL_SIZE = 20;

/** 每次演出使用的图片数（2×2 四宫格） */
const IMAGES_PER_SHOW = 4;

/** 洗牌后取前 N 张，保证同屏不重复 */
const pickBatch = (): string[] => {
  const indexes = Array.from({ length: IMAGE_POOL_SIZE }, (_, i) => i + 1);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes
    .slice(0, IMAGES_PER_SHOW)
    .map((n) => `${CHANGE_IMAGE_BASE}/${n}.webp`);
};

/** 立即加载一组图片到浏览器缓存 */
const loadBatch = (urls: string[]): void => {
  for (const src of urls) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  }
};

/** 空闲时加载一组图片；不支持 requestIdleCallback 时降级为超时加载 */
const loadBatchWhenIdle = (urls: string[]): void => {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => loadBatch(urls), { timeout: 3000 });
  } else {
    window.setTimeout(() => loadBatch(urls), 1500);
  }
};

/** 已预加载、等待下一次演出使用的批次 */
let pendingBatch: string[] = [];

/**
 * App 挂载时调用：只预加载首批 4 张（约 700KB），而非全部 20 张。
 * 重复调用不会重复加载。
 */
export const preloadPageChangeImages = (): void => {
  if (pendingBatch.length) return;
  pendingBatch = pickBatch();
  loadBatch(pendingBatch);
};

/**
 * 演出开始时调用：取走已预加载的批次，并空闲预加载下一批。
 * 若预加载尚未执行（组件先于 App 挂载完成），则现场抽一批兜底。
 */
export const takePreloadedBatch = (): string[] => {
  const batch = pendingBatch.length ? pendingBatch : pickBatch();
  pendingBatch = pickBatch();
  loadBatchWhenIdle(pendingBatch);
  return batch;
};
