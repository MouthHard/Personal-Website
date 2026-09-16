// 博物馆图片池分配器
// 108 张图片分 5 个模块池，通过 (museumId * 31 + index + offset) % poolSize 分配
// 详见 docs/museum-image-pool-naming.md

const OSS_BASE =
  'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/museum';

// ─── 文物子池（按材质分类，分配时尽量类型对应）───
const ARTIFACT_SUBPOOLS = {
  bronze: [
    'artifact/bronze/01-houmuwuding.webp',
    'artifact/bronze/02-siyangfangzun.webp',
    'artifact/bronze/03-maogongding.webp',
    'artifact/bronze/04-zenghouyibianzhong.webp',
    'artifact/bronze/05-lianhefanghu.webp',
    'artifact/bronze/06-fuhaoxiaozun.webp',
    'artifact/bronze/07-yuewanggoujianjian.webp',
    'artifact/bronze/08-changxingongdeng.webp',
    'artifact/bronze/09-hezun.webp',
    'artifact/bronze/10-jinhuoniaozun.webp',
  ],
  ceramic: [
    'artifact/ceramic/01-ruyaotianqingxi.webp',
    'artifact/ceramic/02-yuanqinghuaxiaohe.webp',
    'artifact/ceramic/03-chenghuadoucaijigangbei.webp',
    'artifact/ceramic/04-misecilianhuawan.webp',
    'artifact/ceramic/05-longquanyaocongshi.webp',
    'artifact/ceramic/06-jianyaotuhaizhan.webp',
    'artifact/ceramic/07-tangsancailuotuo.webp',
    'artifact/ceramic/08-dawenkoucaitao.webp',
    'artifact/ceramic/09-majiayaocaitaoguan.webp',
    'artifact/ceramic/10-cuiqingyouciping.webp',
  ],
  painting: [
    'artifact/painting/01-qingmingshanghetu.webp',
    'artifact/painting/02-qianlijiangshantu.webp',
    'artifact/painting/03-wuniutu.webp',
    'artifact/painting/04-buniantu.webp',
    'artifact/painting/05-fuchunshanjutu.webp',
    'artifact/painting/06-luoshenfutu.webp',
    'artifact/painting/07-pingfutie.webp',
    'artifact/painting/08-xuweizahuatujuan.webp',
    'artifact/painting/09-qiuyingtaoyuan.webp',
    'artifact/painting/10-dunhuangxiejing.webp',
  ],
  jade: [
    'artifact/jade/01-cuiyubaicai.webp',
    'artifact/jade/02-rouxingshi.webp',
    'artifact/jade/03-liangzhuyucong.webp',
    'artifact/jade/04-hongshanyulong.webp',
    'artifact/jade/05-yucongwang.webp',
    'artifact/jade/06-toudiaolongwenbi.webp',
    'artifact/jade/07-liangzhuyubi.webp',
    'artifact/jade/08-jinluyuyi.webp',
  ],
  gold: [
    'artifact/gold/01-jinouyonggubei.webp',
    'artifact/gold/02-xiangjinmanao.webp',
    'artifact/gold/03-putaoxiangnang.webp',
    'artifact/gold/04-huashujinbuyao.webp',
    'artifact/gold/05-yinluyuyi.webp',
    'artifact/gold/06-liujinyinhu.webp',
    'artifact/gold/07-jinleisifengzan.webp',
    'artifact/gold/08-cuojinyinlongfeng.webp',
  ],
  stone: [
    'artifact/stone/01-jigushuochangyong.webp',
    'artifact/stone/02-matafeiyan.webp',
    'artifact/stone/03-renmianyuwen.webp',
    'artifact/stone/04-jincishengmu.webp',
    'artifact/stone/05-tianlongshifotou.webp',
    'artifact/stone/06-daifodingji.webp',
    'artifact/stone/07-tongdujinxieshuren.webp',
    'artifact/stone/08-taoyingding.webp',
  ],
  misc: [
    'artifact/misc/01-sushadanyi.webp',
    'artifact/misc/02-mawangduibohua.webp',
    'artifact/misc/03-heidicaihuiqiguan.webp',
    'artifact/misc/04-kesiliantangruya.webp',
    'artifact/misc/05-shujin.webp',
    'artifact/misc/06-lizujintongqun.webp',
  ],
} as const;

// 文物全池（活动/新闻/专馆文物等无 category 时回退使用）
const ARTIFACT_POOL: string[] = [
  ...ARTIFACT_SUBPOOLS.bronze,
  ...ARTIFACT_SUBPOOLS.ceramic,
  ...ARTIFACT_SUBPOOLS.painting,
  ...ARTIFACT_SUBPOOLS.jade,
  ...ARTIFACT_SUBPOOLS.gold,
  ...ARTIFACT_SUBPOOLS.stone,
  ...ARTIFACT_SUBPOOLS.misc,
];

// 数据 category → 子池映射（29 种 category → 7 个子池）
const CATEGORY_TO_SUBPOOL: Record<string, keyof typeof ARTIFACT_SUBPOOLS> = {
  bronze: 'bronze',
  iron: 'bronze',
  weapon: 'bronze',
  ceramic: 'ceramic',
  terracotta: 'ceramic',
  enamel: 'ceramic',
  painting: 'painting',
  calligraphy: 'painting',
  ancient_book: 'painting',
  jade: 'jade',
  gem: 'jade',
  gold_silver: 'gold',
  clock: 'gold',
  treasure: 'gold',
  stone: 'stone',
  seal: 'stone',
  carving: 'stone',
  sculpture: 'stone',
  brick: 'stone',
  inscription: 'stone',
  textile: 'misc',
  lacquer: 'misc',
  wood: 'misc',
  bone: 'misc',
  ivory: 'misc',
  other: 'misc',
  religious: 'misc',
  daily: 'misc',
  stationery: 'misc',
};

// ─── 展览池 12 张（扁平化，展览/专馆展览复用，用 offset 区分）───
const EXHIBITION_POOL: string[] = [
  'exhibition/01-calligraphy.webp',
  'exhibition/02-bronze-age.webp',
  'exhibition/03-ancient-ceramic.webp',
  'exhibition/04-court-treasure.webp',
  'exhibition/05-terracotta-army.webp',
  'exhibition/06-forbidden-city-600.webp',
  'exhibition/07-maritime-silk-road.webp',
  'exhibition/08-sanxingdui.webp',
  'exhibition/09-digital-immersive.webp',
  'exhibition/10-intangible-heritage.webp',
  'exhibition/11-vr-immersive.webp',
  'exhibition/12-hologram.webp',
];

// ─── 文创池 18 张（扁平化）───
const CREATIVE_POOL: string[] = [
  'creative/01-notebook.webp',
  'creative/02-metal-bookmark.webp',
  'creative/03-oracle-bookmark.webp',
  'creative/04-folding-fan.webp',
  'creative/05-postcard.webp',
  'creative/06-ding-replica.webp',
  'creative/07-mask-replica.webp',
  'creative/08-lamp-model.webp',
  'creative/09-jade-dragon.webp',
  'creative/10-blue-vase.webp',
  'creative/11-flying-scarf.webp',
  'creative/12-bronze-brooch.webp',
  'creative/13-pattern-tote.webp',
  'creative/14-round-fan.webp',
  'creative/15-blue-tea-set.webp',
  'creative/16-jianzhan-cup.webp',
  'creative/17-bell-music-box.webp',
  'creative/18-puzzle.webp',
];

// ─── 专馆封面池 12 张 ───
const HALL_COVER_POOL: string[] = [
  'hall-cover/01-bronze-hall.webp',
  'hall-cover/02-ceramic-hall.webp',
  'hall-cover/03-painting-hall.webp',
  'hall-cover/04-jade-hall.webp',
  'hall-cover/05-bell-hall.webp',
  'hall-cover/06-mawangdui-hall.webp',
  'hall-cover/07-gold-hall.webp',
  'hall-cover/08-treasure-hall.webp',
  'hall-cover/09-jin-hall.webp',
  'hall-cover/10-tibetan-hall.webp',
  'hall-cover/11-dian-hall.webp',
  'hall-cover/12-silk-hall.webp',
];

// ─── 沉浸体验池 6 张 ───
const IMMERSIVE_POOL: string[] = [
  'immersive/01-vr-palace.webp',
  'immersive/02-ar-sanxingdui.webp',
  'immersive/03-digital-dunhuang.webp',
  'immersive/04-hologram-bells.webp',
  'immersive/05-maritime-immersive.webp',
  'immersive/06-5d-time-travel.webp',
];

// ─── 跨模块复用偏移量（防止同馆不同模块撞图）───
const POOL_OFFSETS = {
  artifact: 0, // 文物列表
  activity: 100, // 活动图片（复用文物池）
  news: 200, // 新闻图片（复用文物池）
  hallArtifact: 300, // 专馆内文物（复用文物池）
  exhibition: 0, // 展览列表
  hallExhibition: 100, // 专馆内展览（复用展览池）
  creative: 0, // 文创列表
  hallCover: 0, // 专馆封面
  immersive: 0, // 沉浸体验
} as const;

// ─── 核心分配算法 ───
function allocate(
  pool: readonly string[],
  museumId: number,
  index: number,
  offset: number,
): string {
  const poolSize = pool.length;
  const poolIndex = ((museumId * 31 + index + offset) % poolSize + poolSize) % poolSize;
  return `${OSS_BASE}/${pool[poolIndex]}`;
}

// ─── 文物图片（全池分配，用于无 category 的场景）───
function getArtifactImage(museumId: number, index: number): string {
  return allocate(ARTIFACT_POOL, museumId, index, POOL_OFFSETS.artifact);
}

// ─── 文物图片（按 category 选对应子池分配，类型尽量对得上）───
export function getArtifactImageByCategory(
  museumId: number,
  index: number,
  category?: string,
): string {
  if (category) {
    const subpoolKey = CATEGORY_TO_SUBPOOL[category];
    if (subpoolKey) {
      const subpool = ARTIFACT_SUBPOOLS[subpoolKey];
      return allocate(subpool, museumId, index, 0);
    }
  }
  return getArtifactImage(museumId, index);
}

// ─── 活动图片（复用文物池，offset=100）───
export function getActivityImage(museumId: number, index: number): string {
  return allocate(ARTIFACT_POOL, museumId, index, POOL_OFFSETS.activity);
}

// ─── 新闻图片（复用文物池，offset=200）───
export function getNewsImage(museumId: number, index: number): string {
  return allocate(ARTIFACT_POOL, museumId, index, POOL_OFFSETS.news);
}

// ─── 专馆内文物图片（复用文物池，offset=300）───
export function getHallArtifactImage(museumId: number, index: number): string {
  return allocate(ARTIFACT_POOL, museumId, index, POOL_OFFSETS.hallArtifact);
}

// ─── 展览图片 ───
export function getExhibitionImage(museumId: number, index: number): string {
  return allocate(EXHIBITION_POOL, museumId, index, POOL_OFFSETS.exhibition);
}

// ─── 专馆内展览图片（复用展览池，offset=100）───
export function getHallExhibitionImage(museumId: number, index: number): string {
  return allocate(EXHIBITION_POOL, museumId, index, POOL_OFFSETS.hallExhibition);
}

// ─── 文创图片 ───
export function getCreativeImage(museumId: number, index: number): string {
  return allocate(CREATIVE_POOL, museumId, index, POOL_OFFSETS.creative);
}

// ─── 专馆封面图片 ───
export function getHallCoverImage(museumId: number, index: number): string {
  return allocate(HALL_COVER_POOL, museumId, index, POOL_OFFSETS.hallCover);
}

// ─── 沉浸体验图片 ───
export function getImmersiveImage(museumId: number, index: number): string {
  return allocate(IMMERSIVE_POOL, museumId, index, POOL_OFFSETS.immersive);
}

