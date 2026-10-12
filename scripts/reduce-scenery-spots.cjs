/**
 * 削减景点数量脚本
 * 每省保留 2-4 个景点：
 *   - 至少 1 个 nature + 1 个 culture
 *   - 优选 rating 高 + reviewCount 多的
 *   - 总数原 <=4 则全保留
 * 同步更新 overview.topAttractions / routes.spots / activities / seasonal 等
 */
const fs = require('fs');
const path = require('path');

const SCENERY_DIR = path.resolve(__dirname, '..', 'public', 'static-data', 'travel-guide', 'scenery');

function parseReviewCount(s) {
  if (!s) return 0;
  const m = String(s).replace(/,/g, '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function score(spot) {
  return (spot.rating || 4.5) * 1000 + parseReviewCount(spot.reviewCount) * 0.01;
}

function pickSpots(spots) {
  if (spots.length <= 4) return spots;
  const nature = spots.filter(s => s.type === 'nature').sort((a, b) => score(b) - score(a));
  const culture = spots.filter(s => s.type === 'culture').sort((a, b) => score(b) - score(a));
  const result = [];
  const natureCount = Math.min(2, nature.length);
  const cultureCount = Math.min(2, culture.length);
  for (let i = 0; i < natureCount; i++) result.push(nature[i]);
  for (let i = 0; i < cultureCount; i++) result.push(culture[i]);
  if (result.length < 2 && spots.length >= 2) {
    return spots.slice(0, Math.min(4, spots.length));
  }
  return result;
}

const files = fs.readdirSync(SCENERY_DIR).filter(f => f.endsWith('.json'));
let totalBefore = 0;
let totalAfter = 0;
const summary = [];

for (const file of files) {
  const filePath = path.join(SCENERY_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(data.spots)) continue;
  const before = data.spots.length;
  totalBefore += before;
  const kept = pickSpots(data.spots);
  totalAfter += kept.length;
  const keptNames = kept.map(s => s.name);
  data.spots = kept;

  if (Array.isArray(data.overview?.topAttractions)) {
    data.overview.topAttractions = data.overview.topAttractions.filter(a => keptNames.includes(a.name));
  }
  if (Array.isArray(data.routes)) {
    data.routes = data.routes.filter(r => !Array.isArray(r.spots) || r.spots.some(n => keptNames.includes(n)));
  }
  if (Array.isArray(data.activities)) {
    data.activities = data.activities.filter(a => keptNames.includes(a.location) || keptNames.includes(a.name));
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  summary.push(`${file}: ${before} -> ${kept.length} | ${kept.map(s => s.name).join(', ')}`);
}

console.log(`削减前: ${totalBefore} 景点 -> 削减后: ${totalAfter} 景点`);
console.log(summary.join('\n'));