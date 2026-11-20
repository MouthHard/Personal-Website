/**
 * 诗词卡片背景图 composable
 * PoemCard 与 StudyRoomCard 共用同一套背景图选择逻辑
 *
 * 性能优化：图片 URL 列表为模块级常量，所有卡片实例共享，避免重复计算
 */
import { computed, reactive, type ComputedRef } from 'vue';
import loadingCover from '@/assets/image/aphorism/loading.webp';
import errorCover from '@/assets/image/aphorism/error.webp';

const OSS_BASE =
  'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/aphorism';
const POOL_SIZE = 37;

export function poolImage(index: number): string {
  return `${OSS_BASE}/${((index % POOL_SIZE) + POOL_SIZE) % POOL_SIZE}.webp`;
}

/** 根据字符串 id 计算哈希值 */
const hashCode = (id: string | number): number => {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/** 轻量版：仅根据 id 字符串获取背景图（无需完整 Poem 对象） */
export function getBackgroundUrl(id: string | number): string {
  return poolImage(hashCode(id));
}

// ===== 封面加载状态机 =====
// 卡片用 <img>、弹窗用 CSS 背景，两者无法各自感知对方的结果；
// 这里用模块级状态表打通：任一处加载成功/失败，另一处立即同步，语义完全一致。

export type CoverStatus = 'loading' | 'loaded' | 'failed';

/** 占位插画：卡片与弹窗共用，保证两处呈现同一套「加载中 / 加载失败」图 */
export { loadingCover, errorCover };

/** 地址 → 最新加载状态 */
const statusMap = reactive(new Map<string, CoverStatus>());
/** 退避重试定时器，同一地址只保留一个 */
const retryTimers = new Map<string, number>();
/** 已重试次数，成功后清零 */
const retryCounts = new Map<string, number>();
/** 正在主动预加载的地址，避免重复发起 */
const inFlight = new Set<string>();

const MAX_RETRY = 3;
const RETRY_DELAYS = [2000, 4000, 8000];

export function getCoverStatus(url: string): CoverStatus {
  return statusMap.get(url) ?? 'loading';
}

/** 响应式读取某个封面地址的加载状态 */
export function useCoverStatus(source: () => string): ComputedRef<CoverStatus> {
  return computed(() => getCoverStatus(source()));
}

/**
 * 重试时使用的地址：附加计数参数绕开浏览器对失败请求的记忆，
 * 取到的仍是同一张图，成功后视觉上就是「用回原来的图」。
 */
export function coverRetrySrc(url: string, attempt = 0): string {
  if (!url || attempt <= 0) return url;
  return `${url}${url.includes('?') ? '&' : '?'}_r=${attempt}`;
}

/** <img> 加载成功上报 */
export function reportCoverLoaded(url: string): void {
  if (!url) return;
  clearRetry(url);
  retryCounts.delete(url);
  statusMap.set(url, 'loaded');
}

/** <img> 加载失败上报，随后按退避策略自动重试 */
export function reportCoverFailed(url: string): void {
  if (!url) return;
  statusMap.set(url, 'failed');
  scheduleRetry(url);
}

function clearRetry(url: string): void {
  const timer = retryTimers.get(url);
  if (timer !== undefined) {
    clearTimeout(timer);
    retryTimers.delete(url);
  }
}

function scheduleRetry(url: string): void {
  if (retryTimers.has(url)) return;
  const done = retryCounts.get(url) ?? 0;
  if (done >= MAX_RETRY) return;
  const delay = RETRY_DELAYS[Math.min(done, RETRY_DELAYS.length - 1)];
  retryTimers.set(
    url,
    window.setTimeout(() => {
      retryTimers.delete(url);
      const attempt = (retryCounts.get(url) ?? 0) + 1;
      retryCounts.set(url, attempt);
      probe(url, attempt);
    }, delay),
  );
}

/** 静默探测：结果写回状态表，失败继续退避重试 */
function probe(url: string, attempt: number): void {
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => reportCoverLoaded(url);
  img.onerror = () => {
    statusMap.set(url, 'failed');
    scheduleRetry(url);
  };
  img.src = coverRetrySrc(url, attempt);
}

/**
 * 主动预加载：用于没有 <img> 元素、只有 CSS 背景的弹窗。
 * 已成功过则直接返回，不会重复请求。
 */
export function ensureCoverLoaded(url: string): void {
  if (!url || getCoverStatus(url) === 'loaded' || inFlight.has(url)) return;
  inFlight.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    inFlight.delete(url);
    reportCoverLoaded(url);
  };
  img.onerror = () => {
    inFlight.delete(url);
    reportCoverFailed(url);
  };
  img.src = coverRetrySrc(url, retryCounts.get(url) ?? 0);
}
