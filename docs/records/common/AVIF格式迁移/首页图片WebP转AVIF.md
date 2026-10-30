# 首页图片 WebP 转 AVIF

> 日期：2026-10-30
> 涉及文件：`src/App.vue`、`src/assets/css/SolarSystem.scss`、`index.html`

---

## 背景

过渡图 AVIF 优化成功后，用户决定将全站 OSS 图片从 WebP 转为 AVIF，以获得更好的压缩效率和加载速度。首页为第一批。

## 格式对比

### 实测数据（首页 10 张图片）

| 格式 | 单张平均 | 10 张总计 | 缩减 |
|------|---------|----------|------|
| WebP（原始） | 37KB | 370KB | 基准 |
| AVIF q60 | 19KB | 190KB | **45%** |

### 格式选择理由

| 维度 | AVIF | WebP | JPEG |
|------|------|------|------|
| 同质量体积 | **最小** | 小 22% | 基准 |
| 浏览器支持(2026) | 全部 | 全部 | 全部 |
| 编码速度 | 慢（一次性） | 快 | 快 |
| 透明通道 | ✓ | ✓ | ✗ |

AVIF 在 2026 年所有现代浏览器支持，编码慢是一次性成本，运行时解码速度与 WebP 相当。

## 实现逻辑

### 转换流程
1. 从 OSS 下载 10 张 WebP 到 `public/test/`
2. 用 sharp 转为 AVIF q60：`sharp(input).avif({ quality: 60 }).toFile(output)`
3. 删除 WebP 原图，只保留 AVIF
4. 用户上传 AVIF 到 OSS
5. 代码中批量替换 `.webp` → `.avif`

### 代码替换
用 sed 批量替换 3 个文件中的 `app/*.webp` → `app/*.avif`：
- `src/App.vue`：7 处行星导航图标
- `src/assets/css/SolarSystem.scss`：2 处背景图（bg.avif, Sun.avif）
- `index.html`：3 处 preload 声明

### 质量选择
| 用途 | 参数 | 理由 |
|------|------|------|
| 行星图标 | AVIF q60 | 小尺寸，中质量够用 |
| 背景图 | AVIF q60 | 全屏但非核心内容 |

## 踩坑记录

### OSS 直接操作的风险
用户问是否能直接在 OSS 上转化。回答：不能，风险太大：
1. 没有 OSS AccessKey，无法通过 API 操作
2. 直接覆盖生产文件无法回滚
3. 安全风险：密钥泄露

采用安全流程：下载 → 本地压缩 → 用户上传 → 代码替换。

## 验证结果
- ✅ `npm run build` 通过
- ✅ 无残留 `.webp` 引用
- ✅ GitHub Pages 部署成功
- ✅ 访问 https://mouthhard.github.io/Personal-Website/ 验证

## 后续待办
- 继续处理其他页面的 OSS 图片（风景画廊大图、缩略图等）
- 风景画廊大图建议用 AVIF q75（核心内容，需更高质量）
- 缩略图建议用 AVIF q55（小尺寸，中质量够用）
- 可考虑用 `<picture>` 标签提供降级（如需支持旧浏览器）