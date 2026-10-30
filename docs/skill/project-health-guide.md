# 项目健康检查与日常维护手册

> **⚠️ 每次执行之前都要参考网上热门、大厂、或 GitHub 上高星项目的规范和实践，结合本项目实际情况迭代本文档。**
>
> 本文档覆盖项目日常维护、性能优化、代码质量检查等方面。
> 参考：Vue 3 官方指南、Vite 最佳实践、web.dev 性能指标、Google Lighthouse。

---

## 一、技术栈

| 层面 | 技术 | 版本要求 |
|------|------|---------|
| 框架 | Vue 3（`<script setup>` + Composition API） | 3.4+ |
| 构建 | Vite | 5+ |
| 语言 | TypeScript（strict） | 5+ |
| 状态 | Pinia | 2+ |
| 样式 | SCSS + scoped | — |
| UI 库 | Element Plus | 按需引入 |
| 图表 | ECharts | 按需引入 |
| 部署 | GitHub Pages（gh-pages 分支） | — |

---

## 二、代码质量检查

### 提交前（husky 自动执行）

```bash
# pre-commit: lint-staged（ESLint + Stylelint）
# commit-msg: commitlint（提交信息格式）
git commit -m "feat: 说明"    # 自动触发检查
```

### 手动全量检查

```bash
npx eslint src/ --ext .ts,.vue     # ESLint 全量
npx stylelint "src/**/*.scss"      # Stylelint 全量
npx vue-tsc --noEmit               # TypeScript 类型检查
```

### 常见问题修复

| 问题 | 原因 | 修复 |
|------|------|------|
| `no-empty` | 空 catch 块 | 加注释 `/* 忽略 */` |
| `vue/no-v-html` | v-html XSS 风险 | 确信安全则忽略，否则改用文本插值 |
| CRLF 警告 | Windows 换行 | `.gitattributes` 已配置 LF，无需处理 |

---

## 三、性能优化清单

### 图片优化（参考 web.dev/image-optimization）

| 场景 | 推荐格式 | 参数 | 理由 |
|------|---------|------|------|
| 风景大图 | AVIF | q75, 1920px | 核心内容，高质量 |
| 缩略图 | AVIF | q55, 600px | 小尺寸，中质量 |
| 过渡背景 | AVIF | q60, 1920×1080 | 1-2秒闪现 |
| 图标/头像 | AVIF | q60, 原尺寸 | 小文件 |
| 动画图 | AVIF | q50 | 非关键 |

**格式优先级**：AVIF > WebP > JPEG（2026 年全浏览器支持 AVIF）

**转换工具**：`sharp`（Node.js，项目已安装）

```bash
# 批量转换示例
node -e "
  const sharp = require('sharp');
  sharp(input).resize(1920, 1080, {fit:'cover'}).avif({quality:60}).toFile(output);
"
```

### 包体积优化（参考 Vite 最佳实践）

```bash
# 检查包体积
npm run build  # 查看各 chunk 大小
```

**当前大 chunk**：
- `element-plus`：871KB → 考虑按需引入
- `echarts`：493KB → 考虑按需引入或懒加载
- `vue-vendor`：127KB → 正常

**优化手段**：
1. `manualChunks` 拆分第三方库（已配置）
2. 路由懒加载 `() => import('./page')` （已配置）
3. Tree shaking：确保 `import { specific }` 而非 `import *`

### 加载性能（参考 web.dev/vitals）

| 指标 | 目标 | 检查方式 |
|------|------|---------|
| LCP | < 2.5s | Lighthouse / PageSpeed Insights |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| TTFB | < 800ms | Network 面板 |

**关键路径优化**：
1. 首屏图片用 `<link rel="preload">` 预加载
2. 非首屏路由懒加载
3. OSS 图片开启 CDN 缓存
4. 本地静态资源随应用同源分发

---

## 四、日常维护任务

### 每次开发前

```bash
git pull origin feat/update-site    # 同步最新代码
npm install                         # 同步依赖
```

### 每次开发后

```bash
npm run build                       # 构建验证
# 按上传指南执行提交和部署
```

### 定期检查（每月）

- [ ] 依赖安全更新：`npm audit`
- [ ] 依赖版本更新：检查 `package.json` 过时依赖
- [ ] 死代码清理：删除未使用的组件、工具函数、类型定义
- [ ] 图片格式审计：新图片是否用了 AVIF
- [ ] 包体积审计：检查是否有新的大 chunk
- [ ] Lighthouse 跑分：https://mouthhard.github.io/Personal-Website/

---

## 五、项目结构健康指标

### 应保持的规范

| 规范 | 说明 |
|------|------|
| 组件命名 | PascalCase，目录名 = 组件名 |
| 文件结构 | `index.vue` + `index.scss`，不拆太碎 |
| composables | `use*` 命名，含响应式逻辑 |
| utils | 纯函数，无 Vue/IO 依赖 |
| types | 按页面维度组织在 `typesOfPages/` |
| 图标 | SVG 组件，放 `icons/` 目录 |

### 应避免的反模式

| 反模式 | 为什么不好 | 正确做法 |
|--------|-----------|---------|
| 组件超过 300 行 | 难维护、难复用 | 拆子组件 |
| SCSS 嵌套超过 4 层 | 选择器性能差、难覆盖 | 用 BEM 或扁平化 |
| 在 utils 中 import Vue | 破坏纯函数原则 | 移到 composables |
| 在 template 中写复杂逻辑 | 难测试、难调试 | 移到 computed |
| 硬编码 OSS URL | 环境切换困难 | 用常量或环境变量 |

---

## 六、排障速查

| 症状 | 可能原因 | 排查步骤 |
|------|---------|---------|
| 页面空白 | JS 加载失败 | Console 看报错，Network 看 JS 状态码 |
| 图片不显示 | 路径/格式/CORS | Network 看 img 请求状态码 |
| 样式丢失 | scoped 选择器不匹配 | 检查 DOM 结构是否与选择器嵌套一致 |
| 过渡不出现 | 导航 < 400ms | 正常行为，或用 Slow 3G 测试 |
| 构建失败 | 类型错误/lint 错误 | 看 build 输出的 error 行 |
| 部署后不更新 | gh-pages 缓存 | 等几分钟，或 Ctrl+Shift+R |