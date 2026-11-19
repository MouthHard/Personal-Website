/**
 * ============================================================================
 * 诗词模块 - 诗词实体类型 - aphorism/poem.ts
 * ============================================================================
 * 【前端同学必读】
 * 本文件定义了诗词（Poem）的数据类型。
 * 当前数据源为本地静态 JSON：public/static-data/aphorism/poems/aphorisms.json，
 * 由 services/aphorism.ts 统一加载；此结构保留了此前后端 API 的字段形状，
 * 便于未来重新对接后端时平滑迁移。
 *
 * 【数据来源】
 * - Poem ← aphorisms.json 的 items 元素（经 services/aphorism.ts 加载）
 *
 * 【字段来源说明】
 * 所有字段均来自本地静态数据，前端负责展示与交互。
 * 部分可选字段（标注 ?）在某些诗词中可能为空，前端需做兜底处理。
 * viewCount / likeCount 目前本地数据未填写，交互计数由本地 localStorage 维护。
 *
 * 【字段含义对照】
 * - content: 诗词正文（数组类型，每行一个元素，方便前端逐行渲染）
 * - form: 体裁（如"五言绝句"、"七言律诗"）
 * - annotation: 注释（对古文词汇的解释，数组格式，每项含词语 term 和解释 explanation）
 * - translation: 白话译文
 * - background: 创作背景（含时代背景 era 和创作背景 creation 两部分）
 * - appreciation: 赏析（含艺术特色 artistic、思想感情 emotion、名句赏析 highlightAnalysis、文学地位 status）
 * - poetIntroduction: 诗人简介（结构化对象，含字号、生卒年、籍贯、身份、称号、传记）
 * - isFeatured: 是否精选（用于精选/推荐位展示）
 *
 * ============================================================================
 */

/**
 * 诗词实体 — 对应 aphorisms.json 中的单条数据
 *
 * @property id               - 诗词唯一标识（数字型）
 * @property title            - 诗词标题（如 "静夜思"）
 * @property author           - 作者（如 "李白"）
 * @property dynasty          - 朝代（如 "唐"）
 * @property content          - 诗词正文（数组格式，每行一个字符串）
 * @property highlight        - 卡片展示精华句（可选，≤4 行名句/精华，用于卡片预览；缺省时回退到 content 前 4 行）
 * @property form             - 体裁（可选，如 "五言绝句"）
 * @property tags             - 标签列表（可选，如 ["思乡", "月亮"]）
 * @property imageUrl         - 配图 URL（可选）
 * @property annotation       - 注释（可选，对古文词汇的解释，数组格式每项含 term 和 explanation）
 * @property translation      - 白话译文（可选）
 * @property background       - 创作背景（可选，含时代背景 era 和创作背景 creation）
 * @property appreciation     - 赏析（可选，含艺术特色、思想感情、名句赏析、文学地位）
 * @property poetIntroduction - 诗人简介（可选，结构化对象含字号、生卒年、籍贯、身份、称号、传记）
 * @property viewCount        - 浏览次数（可选，本地数据暂未填写）
 * @property likeCount        - 点赞次数（可选，本地数据暂未填写）
 * @property isFeatured       - 是否精选（可选，用于精选/推荐位）
 * @property createdAt        - 创建时间（可选，ISO 格式字符串）
 * @property updatedAt        - 更新时间（可选，ISO 格式字符串）
 */
export interface Poem {
  id: number;
  title: string;
  author: string;
  dynasty: string;
  content: string[];
  highlight?: string[];
  form?: string;
  tags?: string[];
  imageUrl?: string;
  annotation?: Array<{ term: string; explanation: string }>;
  translation?: string;
  background?: { era: string; creation: string };
  appreciation?: {
    artistic: string;
    emotion: string;
    highlightAnalysis: Array<{ verse: string; analysis: string }>;
    status: string;
  };
  poetIntroduction?: {
    courtesyName?: string;
    pseudonym?: string;
    birthDeath?: string;
    hometown?: string;
    identity?: string;
    title?: string;
    biography: string;
  };
  viewCount?: number;
  likeCount?: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
