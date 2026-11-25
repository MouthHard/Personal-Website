export function formatNumber(num: number | string): string {
  // 兜底：误传 "45.6k"/"1.3w" 等字符串时先解析，避免 NaN 比较落到 toString 原样输出
  if (typeof num === 'string') return formatNumber(parseCount(num));
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return bytes + ' B';
}

export interface SlideAccent {
  accent: string;
  accentSoft: string;
  accentGlow: string;
}

/**
 * 依据 categoryTags 的 theme 维度给每张轮播图映射一套主题色。
 * 返回实心色 / 柔色 / 光晕色，供卡片 CSS 变量直接使用。
 * 按 subCategory 关键字匹配，未命中走中性蓝，保证任何数据都有稳定配色。
 */
export function resolveSlideAccent(
  tags:
    | Array<{ dimension: string; category: string; subCategory: string }>
    | undefined,
): SlideAccent {
  const sub = (tags || [])
    .filter((t) => t.dimension === 'theme')
    .map((t) => t.subCategory);

  const has = (keywords: string[]): boolean =>
    sub.some((s) => keywords.some((k) => s.includes(k)));

  if (has(['aurora', 'night', 'startrail', 'galaxy', 'astro', 'moon'])) {
    return {
      accent: '#7dd3fc',
      accentSoft: '#1e3a5f',
      accentGlow: 'rgba(56,189,248,0.28)',
    };
  }
  if (has(['sunset', 'sunrise', 'golden', 'dawn', 'dusk', 'morning'])) {
    return {
      accent: '#f3c07c',
      accentSoft: '#5a3a1f',
      accentGlow: 'rgba(243,168,92,0.26)',
    };
  }
  if (
    has(['city', 'urban', 'architecture', 'street', 'building', 'night-city'])
  ) {
    return {
      accent: '#c4b5fd',
      accentSoft: '#2e2757',
      accentGlow: 'rgba(167,139,250,0.26)',
    };
  }
  if (has(['mountain', 'snow', 'peak', 'alpine', 'glacier', 'hill'])) {
    return {
      accent: '#d7e7f5',
      accentSoft: '#2b3d54',
      accentGlow: 'rgba(203,225,245,0.22)',
    };
  }
  if (has(['ocean', 'sea', 'beach', 'coast', 'island', 'water', 'lake'])) {
    return {
      accent: '#7ee7dc',
      accentSoft: '#174a48',
      accentGlow: 'rgba(45,212,191,0.26)',
    };
  }
  if (has(['forest', 'wood', 'jungle', 'grass', 'meadow', 'green'])) {
    return {
      accent: '#a7e8b4',
      accentSoft: '#1e4630',
      accentGlow: 'rgba(110,231,160,0.24)',
    };
  }
  if (has(['desert', 'sand', 'dune', 'canyon', 'earth'])) {
    return {
      accent: '#e8b98c',
      accentSoft: '#543522',
      accentGlow: 'rgba(230,160,110,0.24)',
    };
  }
  return {
    accent: '#bcd6f5',
    accentSoft: '#25344c',
    accentGlow: 'rgba(125,211,252,0.22)',
  };
}

export function parseCount(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const lower = value.toLowerCase().replace(/,/g, '');
  if (lower.endsWith('k')) return parseFloat(lower) * 1000;
  if (lower.endsWith('w') || lower.endsWith('万'))
    return parseFloat(lower) * 10000;
  if (lower.endsWith('m')) return parseFloat(lower) * 1000000;
  if (lower.endsWith('亿')) return parseFloat(lower) * 100000000;
  return parseFloat(lower) || 0;
}
