/**
 * 诗词卡片背景图 composable
 * PoemCard 与 StudyRoomCard 共用同一套背景图选择逻辑
 *
 * 性能优化：图片 URL 列表为模块级常量，所有卡片实例共享，避免重复计算
 */
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
