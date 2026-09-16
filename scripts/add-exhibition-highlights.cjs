/* eslint-disable */
/**
 * 给 exhibitions.json 每条展览补充 highlights 字段（3-5 条展览亮点短句）
 * 根据 title 关键词 + category 通用亮点组合生成
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'static-data', 'museum', 'exhibitions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 按 category 的通用亮点
const categoryHighlights = {
  历史文化: [
    '系统梳理该主题的历史脉络与文化演变',
    '汇集多件珍贵文物与文献史料',
    '辅以场景复原与多媒体互动展示',
  ],
  艺术精品: [
    '集中呈现该门类艺术的高峰成就',
    '精选代表性作品，配以专业鉴赏文字',
    '光影设计突出展品质感与细节',
  ],
  民俗风情: [
    '还原真实民俗场景与生活样貌',
    '汇集服饰、器具、影像等多元实物',
    '展现地域文化的独特气质与传承',
  ],
  科技考古: [
    '展示最新考古发掘与研究成果',
    '结合科技手段解读文物背后的信息',
    '呈现学术争议与前沿观点',
  ],
};

// 按 title 关键词的特定亮点（优先匹配，置顶）
const titleKeywords = [
  { kw: '青铜', highlights: ['汇聚商周至汉代青铜礼器、兵器与乐器', '解读纹饰、铭文与铸造工艺'] },
  { kw: '陶瓷', highlights: ['梳理从原始瓷到明清官窑的完整谱系', '呈现釉色、器型与装饰技法演变'] },
  { kw: '书画', highlights: ['展出稀世书画名作，限时展陈以保护文物', '辅以高清放大与笔法解读'] },
  { kw: '玉器', highlights: ['汇集各时代玉器精品，涵盖礼玉、饰玉、葬玉', '解读玉料、工艺与象征意义'] },
  { kw: '编钟', highlights: ['曾侯乙编钟原件震撼呈现', '可聆听跨越两千余年的双音钟乐'] },
  { kw: '兵马俑', highlights: ['秦兵马俑原大陶俑近距离观摩', '解读秦代军阵、服饰与制作工艺'] },
  { kw: '马王堆', highlights: ['马王堆汉墓出土帛画、漆器与丝织品', '再现西汉贵族生活与丧葬观念'] },
  { kw: '三星堆', highlights: ['青铜面具、立人像等古蜀文明代表性器物', '探索神秘古蜀文化与中原文明的关系'] },
  { kw: '丝绸之路', highlights: ['串联丝路沿线出土文物与外销品', '呈现东西方商贸、宗教与艺术交流'] },
  { kw: '宫廷', highlights: ['复原宫廷原状陈列，再现皇室生活场景', '汇集宫廷用器、服饰与文献档案'] },
  { kw: '紫禁城', highlights: ['纪念紫禁城建成的重要历史节点', '以建筑与文物双线讲述宫城六百年'] },
  { kw: '海昏侯', highlights: ['海昏侯墓出土金器、青铜器与简牍', '解读西汉列侯的财富与政治身份'] },
  { kw: '徽州', highlights: ['徽派建筑、徽商文化与文房四宝并置', '呈现徽州区域文化的整体面貌'] },
  { kw: '红山', highlights: ['红山文化玉龙、玉凤等典型器物', '探索中华文明起源的多元路径'] },
  { kw: '彩陶', highlights: ['马家窑、半山等彩陶代表器型', '解读纹饰符号与文化内涵'] },
];

function generateHighlights(item) {
  const result = [];
  // 1. 先匹配 title 关键词
  for (const rule of titleKeywords) {
    if (item.title.includes(rule.kw)) {
      result.push(...rule.highlights);
      break;
    }
  }
  // 2. 补充 category 通用亮点
  const cat = item.category || '历史文化';
  const catHls = categoryHighlights[cat] || categoryHighlights['历史文化'];
  for (const h of catHls) {
    if (result.length >= 4) break;
    if (!result.includes(h)) result.push(h);
  }
  // 3. 兜底补足到至少 3 条
  while (result.length < 3) {
    result.push('配套专业讲解与导览服务');
  }
  // 4. 最多 5 条
  return result.slice(0, 5);
}

let updated = 0;
for (const item of data.items) {
  if (!item.highlights || !Array.isArray(item.highlights) || item.highlights.length === 0) {
    item.highlights = generateHighlights(item);
    updated++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Updated ${updated} / ${data.items.length} exhibitions with highlights`);
console.log('Sample:', JSON.stringify(data.items[0], null, 2));