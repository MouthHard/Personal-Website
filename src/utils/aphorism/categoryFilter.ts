/**
 * 诗词分类筛选工具
 * 负责根据分类条件筛选诗词
 */

import type { Poem } from '@/typesOfPages/aphorism/poem';

/**
 * 朝代到分类的映射
 * 分类：先秦、秦汉三国、魏晋南北朝、隋唐、五代十国、宋辽金、元明清、近现代
 * 诗词中的朝代保持原样，但能被对应分类筛选出来
 * 
 * 注意：每个朝代只保留一个标准名称，消除同义词
 * 如：元（不用元代）、清（不用清代）、唐（不用唐代）
 */
const DYNASTY_TO_CATEGORY: Record<string, string[]> = {
  '先秦': ['先秦', '春秋', '战国', '夏', '商', '西周', '东周'],
  '秦汉三国': ['秦', '西汉', '东汉', '三国'],
  '魏晋南北朝': ['魏', '西晋', '东晋', '魏晋', '南北朝'],
  '隋唐': ['隋', '唐'],
  '五代十国': ['五代十国'],
  '宋辽金': ['北宋', '南宋', '宋', '辽', '金'],
  '元明清': ['元', '明', '清'],
  '近现代': ['近现代'],
};

/**
 * 分类名称到映射键的映射
 */
const CATEGORY_NAME_MAP: Record<string, string> = {
  '先秦': '先秦',
  '秦汉三国': '秦汉三国',
  '魏晋南北朝': '魏晋南北朝',
  '隋唐': '隋唐',
  '五代十国': '五代十国',
  '宋辽金': '宋辽金',
  '元明清': '元明清',
  '近现代': '近现代',
};

/**
 * 体裁映射表
 */
const FORM_MAP: Record<string, string[]> = {
  shi: ['五绝', '七绝', '五律', '七律', '五言古诗', '七言古诗', '古体诗', '诗'],
  ci: ['词'],
  qu: ['散曲', '曲'],
  'other-rhyme': ['铭', '箴', '颂', '其他韵文'],
  'special-forms': ['回文诗', '藏头诗', '特殊形式'],
};

/**
 * 中文体裁名称到映射键的映射
 */
const FORM_NAME_MAP: Record<string, string> = {
  '诗': 'shi',
  '词': 'ci',
  '曲': 'qu',
  '其他韵文': 'other-rhyme',
  '特殊形式': 'special-forms',
};

/**
 * 题材映射表
 */
const SUBJECT_TAG_MAP: Record<string, string[]> = {
  landscape: ['山水', '田园', '隐逸', '记游', '写景'],
  yongwu: ['咏物', '花', '鸟', '草木', '虫鱼'],
  history: ['咏史', '怀古', '古迹', '旧事'],
  border: ['边塞', '战争', '从军', '出塞'],
  farewell: ['离别', '相思', '闺怨', '寄赠', '送别', '赠友', '思乡', '怀人'],
  fishing: ['垂钓', '闲适', '隐居', '归隐'],
  gongyuan: ['宫怨', '失宠', '幽禁'],
  jilv: ['羁旅', '漂泊', '行役', '游子'],
  romance: ['爱情', '定情', '相思', '闺情'],
  philosophy: ['哲理', '禅理', '悟道', '人生', '感怀'],
  inspiration: ['励志', '壮志', '抒怀', '自勉'],
  drinking: ['饮酒', '宴饮', '对酒', '独酌'],
  festival: ['节日', '元宵', '端午', '中秋', '重阳', '时令'],
};

/**
 * 中文题材名称到映射键的映射
 */
const SUBJECT_NAME_MAP: Record<string, string> = {
  '山水田园': 'landscape',
  '咏物': 'yongwu',
  '咏史怀古': 'history',
  '边塞征战': 'border',
  '离别相思': 'farewell',
  '垂钓闲适': 'fishing',
  '宫怨': 'gongyuan',
  '羁旅': 'jilv',
  '爱情言情': 'romance',
  '哲理': 'philosophy',
  '励志': 'inspiration',
  '饮酒': 'drinking',
  '节日': 'festival',
};

/**
 * 情感映射表
 */
const EMOTION_TAG_MAP: Record<string, string[]> = {
  joy: ['喜悦', '欢乐', '快乐', '幽默'],
  sadness: ['悲伤', '凄婉', '苍凉', '凄凉', '忧愁'],
  nostalgia: ['思乡', '怀人', '羁旅', '漂泊'],
  worry: ['忧虑', '忧国', '忧民', '忧愁'],
  anger: ['愤懑', '愤慨'],
  admiration: ['赞美', '敬仰', '雄浑'],
  heroic: ['豪放', '豪迈', '悲壮', '壮烈'],
  tranquil: ['闲适', '旷达', '冲淡', '淡泊', '恬淡', '清丽', '典雅'],
  lonely: ['孤独', '寂寞'],
  melancholy: ['惆怅', '伤感'],
};

/**
 * 中文情感名称到映射键的映射
 */
const EMOTION_NAME_MAP: Record<string, string> = {
  '欢乐': 'joy',
  '悲伤': 'sadness',
  '思乡': 'nostalgia',
  '忧愁': 'worry',
  '愤怒': 'anger',
  '仰慕': 'admiration',
  '豪迈': 'heroic',
  '恬淡': 'tranquil',
  '孤独': 'lonely',
  '惆怅': 'melancholy',
};

/**
 * 流派映射表
 */
const SCHOOL_TAG_MAP: Record<string, string[]> = {
  tianlu: ['婉约', '婉约派', '花间', '温李诗派'],
  haofang: ['豪放', '豪放派', '豪迈', '阳羡词派'],
  qingkuang: ['闲适旷', '闲适旷达', '冲淡', '恬淡', '清旷'],
  gelian: ['格调派', '格律派', '肌理派'],
  tianyuan: ['山水田园诗派', '田园', '田园派'],
  biansai: ['边塞诗派', '边塞', '边塞战争'],
  jiangxi: ['江西诗派', '韩孟诗派', '元白诗派', '江湖诗派', '四灵派', '中兴四大家', '前后七子', '公安派', '竟陵派', '性灵派', '浙西词派'],
};

/**
 * 中文流派名称到映射键的映射
 */
const SCHOOL_NAME_MAP: Record<string, string> = {
  '婉约派': 'tianlu',
  '豪放派': 'haofang',
  '清旷派': 'qingkuang',
  '格律派': 'gelian',
  '田园派': 'tianyuan',
  '边塞派': 'biansai',
  '江西诗派': 'jiangxi',
};

/**
 * 用途映射表
 */
const USAGE_MAP: Record<string, string[]> = {
  reading: ['劝学', '修身', '哲理', '启蒙'],
  examination: ['励志', '祝寿', '壮志', '自勉'],
  friendship: ['赠友', '送别', '离别', '思念', '祝福', '酬唱'],
  commemoration: ['哀悼', '咏史纪念', '纪念'],
  yingzhi: ['应制', '酬唱', '宴饮'],
  folk: ['民歌', '民谣', '叙事'],
};

/**
 * 中文用途名称到映射键的映射
 */
const USAGE_NAME_MAP: Record<string, string> = {
  '启蒙读物': 'reading',
  '科举应试': 'examination',
  '酬唱赠答': 'friendship',
  '咏史纪念': 'commemoration',
  '应制': 'yingzhi',
  '民歌': 'folk',
};

/**
 * 根据朝代筛选诗词
 */
function filterByDynasty(poem: Poem, subCategoryId: string): boolean {
  const mapKey = CATEGORY_NAME_MAP[subCategoryId] || subCategoryId;
  const dynasties = DYNASTY_TO_CATEGORY[mapKey];
  return dynasties ? dynasties.includes(poem.dynasty) : false;
}

/**
 * 根据体裁筛选诗词
 */
function filterByForm(poem: Poem, subCategoryId: string): boolean {
  const mapKey = FORM_NAME_MAP[subCategoryId] || subCategoryId;
  const forms = FORM_MAP[mapKey];
  return forms && poem.form ? forms.some((f) => poem.form?.includes(f)) : false;
}

/**
 * 根据题材筛选诗词
 */
function filterBySubject(poem: Poem, subCategoryId: string): boolean {
  const mapKey = SUBJECT_NAME_MAP[subCategoryId] || subCategoryId;
  const mappedTags = SUBJECT_TAG_MAP[mapKey];
  if (mappedTags) {
    return mappedTags.some((tag) => poem.tags?.includes(tag));
  }
  return poem.tags?.includes(subCategoryId) || false;
}

/**
 * 根据情感筛选诗词
 */
function filterByEmotion(poem: Poem, subCategoryId: string): boolean {
  const mapKey = EMOTION_NAME_MAP[subCategoryId] || subCategoryId;
  const mappedTags = EMOTION_TAG_MAP[mapKey];
  if (mappedTags) {
    return mappedTags.some((tag) => poem.tags?.includes(tag));
  }
  return poem.tags?.includes(subCategoryId) || false;
}

/**
 * 根据流派筛选诗词
 */
function filterBySchool(poem: Poem, subCategoryId: string): boolean {
  const mapKey = SCHOOL_NAME_MAP[subCategoryId] || subCategoryId;
  const mappedTags = SCHOOL_TAG_MAP[mapKey];
  if (mappedTags) {
    return mappedTags.some((tag) => poem.tags?.includes(tag));
  }
  return poem.tags?.includes(subCategoryId) || false;
}

/**
 * 根据用途筛选诗词
 */
function filterByUsage(poem: Poem, subCategoryId: string): boolean {
  const mapKey = USAGE_NAME_MAP[subCategoryId] || subCategoryId;
  return USAGE_MAP[mapKey]?.some((tag) => poem.tags?.includes(tag)) || false;
}

/**
 * 根据分类筛选诗词
 * @param poems 诗词列表
 * @param categoryId 主分类ID
 * @param subCategoryId 子分类ID
 * @returns 符合条件的诗词列表
 */
export function filterPoemsByCategory(
  poems: Poem[],
  params: { categoryId?: string; subCategoryId?: string },
): Poem[] {
  const { categoryId, subCategoryId } = params;

  if (!categoryId || categoryId === 'all') {
    return poems;
  }

  if (!subCategoryId || subCategoryId === 'all' || subCategoryId === '全部诗词') {
    return poems;
  }

  return poems.filter((poem) => {
    switch (categoryId) {
      case 'dynasty':
        return filterByDynasty(poem, subCategoryId);
      case 'form':
        return filterByForm(poem, subCategoryId);
      case 'subject':
        return filterBySubject(poem, subCategoryId);
      case 'emotion':
        return filterByEmotion(poem, subCategoryId);
      case 'school':
        return filterBySchool(poem, subCategoryId);
      case 'usage':
        return filterByUsage(poem, subCategoryId);
      default:
        return false;
    }
  });
}

/**
 * 搜索诗词
 * @param poems 诗词列表
 * @param query 搜索关键词
 * @returns 符合条件的诗词列表
 */
interface SearchEntry {
  poem: Poem;
  text: string;
}

/**
 * 模块级搜索索引缓存：数据列表引用不变时只构建一次小写索引，
 * 避免每次搜索对每个字段重复 toLowerCase()
 */
let searchIndexCache: { source: Poem[]; entries: SearchEntry[] } | null = null;

function buildSearchEntries(poems: Poem[]): SearchEntry[] {
  return poems.map((poem) => ({
    poem,
    text: [
      poem.title,
      poem.author,
      poem.dynasty,
      poem.form ?? '',
      poem.content.join('\u0001'),
      (poem.tags ?? []).join('\u0001'),
      poem.annotation ?? '',
      poem.translation ?? '',
      poem.background ?? '',
      poem.appreciation ?? '',
      poem.poetIntroduction ?? '',
    ]
      .join('\u0001')
      .toLowerCase(),
  }));
}

function getSearchEntries(poems: Poem[]): SearchEntry[] {
  if (!searchIndexCache || searchIndexCache.source !== poems) {
    searchIndexCache = { source: poems, entries: buildSearchEntries(poems) };
  }
  return searchIndexCache.entries;
}

export function searchPoems(poems: Poem[], query: string): Poem[] {
  if (!query.trim()) return poems;

  const lowerQuery = query.toLowerCase();
  const entries = getSearchEntries(poems);
  const result: Poem[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.text.includes(lowerQuery)) {
      result.push(entry.poem);
    }
  }

  return result;
}
