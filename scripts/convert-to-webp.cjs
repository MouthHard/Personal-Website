/**
 * 将 src/assets/image 下的 png/jpg/jpeg 批量转换为 webp。
 *
 * 特性：
 *  1. 转换前先把原图复制一份到 <project>/.workbuddy/backup/png-originals-<时间戳>/（该目录已被 .gitignore 忽略），
 *     转换成功后再删除 src/assets/image 下的原图，做到「目录里只留 webp」。
 *     万一删除失败会自动降级为「移动到备份目录」，保证不会因为权限问题中断整批任务。
 *  2. 目标文件名优先复用同序号已存在的 .webp 名称，避免因源文件命名笔误产生重复文件
 *     （例如 02-metal-bookmar.png -> 02-metal-bookmark.webp）
 *  3. 输出体积对比统计，方便核对压缩效果
 *
 * 用法: node scripts/convert-to-webp.cjs [--keep-originals]
 *       --keep-originals  原图保留在 src/assets/image 中（仅复制备份，不删除）
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const KEEP_ORIGINALS = process.argv.includes('--keep-originals');
const QUALITY = 85;

// 源文件命名笔误修正表（key: 源文件去扩展名, value: 目标文件去扩展名）
// 代码中引用的是 hall-cover/08-treasure-hall.webp，而源 png 少写了一个 l
const TYPO_FIXES = {
  '08-treasure-hal': '08-treasure-hall',
  '05-maritime-immersiv': '05-maritime-immersive',
};

const root = path.join(__dirname, '..');
const dir = path.join(root, 'src', 'assets', 'image');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
const backupDir = path.join(root, '.workbuddy', 'backup', `png-originals-${stamp}`);

const isSource = (f) => /\.(png|jpe?g)$/i.test(f);
const baseName = (f) => f.replace(/\.(png|jpe?g)$/i, '');

(async () => {
  const all = fs.readdirSync(dir);
  const sources = all.filter(isSource).sort();
  const webps = all.filter((f) => /\.webp$/i.test(f));

  if (!sources.length) {
    console.log('没有需要转换的 png/jpg/jpeg 文件');
    return;
  }

  fs.mkdirSync(backupDir, { recursive: true });

  // 序号前缀 -> 已存在的 webp 文件名，用于修正源文件命名笔误
  const byPrefix = new Map();
  for (const w of webps) {
    const m = w.match(/^(\d+)/);
    if (m) byPrefix.set(m[1], w);
  }

  const stats = [];
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of sources) {
    const src = path.join(dir, file);
    const base = TYPO_FIXES[baseName(file)] || baseName(file);
    const prefix = (base.match(/^(\d+)/) || [])[1];
    const destName = (prefix && byPrefix.get(prefix)) || `${base}.webp`;
    const dest = path.join(dir, destName);

    // 1. 备份原图到归档目录（仅复制，原图暂留）
    const backupPath = path.join(backupDir, file);
    fs.copyFileSync(src, backupPath);

    // 2. 转换
    const before = fs.statSync(src).size;
    await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    const after = fs.statSync(dest).size;

    // 3. 删除原图（--keep-originals 时保留）；删除失败则降级为移动到归档目录
    if (!KEEP_ORIGINALS) {
      try {
        fs.unlinkSync(src);
      } catch (e) {
        fs.renameSync(src, backupPath);
        console.warn(`  [warn] ${file} 删除失败，已移动到归档目录 (${e.message.split('\n')[0]})`);
      }
    }

    const meta = await sharp(dest).metadata();
    beforeTotal += before;
    afterTotal += after;
    stats.push({
      source: file,
      target: destName,
      width: meta.width,
      height: meta.height,
      beforeKB: +(before / 1024).toFixed(1),
      afterKB: +(after / 1024).toFixed(1),
      ratio: `${(before / after).toFixed(1)}x`,
    });
    console.log(`${file} -> ${destName}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
  }

  fs.writeFileSync(path.join(backupDir, 'conversion-stats.json'), JSON.stringify(stats, null, 2), 'utf8');

  const rest = fs.readdirSync(dir).filter(isSource);
  console.log('---------------------------------------------');
  console.log(`转换完成: ${stats.length} 个文件`);
  console.log(`总体积: ${(beforeTotal / 1024 / 1024).toFixed(2)}MB -> ${(afterTotal / 1024 / 1024).toFixed(2)}MB (压缩 ${(beforeTotal / afterTotal).toFixed(1)}x)`);
  console.log(`原图备份: ${backupDir}`);
  console.log(`剩余未转换 png/jpg: ${rest.length}${rest.length ? ' -> ' + rest.join(', ') : ''}`);
})();
