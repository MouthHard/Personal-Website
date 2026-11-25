# 视频弹窗胶片帧卡片与订阅按钮 VHS 仓门改造

> **日期**：2026-11-01
> **组件**：`VideoShowcase/components/VideoModal`
> **文件**：`index.vue` / `index.scss`

---

## 背景

VideoModal 右侧面板的跨频道节目单卡片需改造为电影胶片帧风格；右侧 6 个 LED 按钮数字需放大加粗；作者信息区需加大名称、去掉介绍；订阅按钮需更有创意的拟物化设计；active 状态 LED 按钮 hover 时需边框流光转圈特效。

---

## 改动内容

### 1. 胶片帧卡片改造（模板 + SCSS）

- **模板**：跨频道卡片改为胶片穿孔（上下各 8 个 `.cc-perf`）+ 胶片帧（`.cc-frame` 含图片/扫描线/badge/时间码）+ 米色标签贴纸（`.cc-label` 含标题/地点 + 红色圆形频道印章 `.cc-stamp`）
- **SCSS**：修复 `.#cc-label` → `.cc-label` 选择器笔误

### 2. LED 按钮数字放大加粗

| 属性 | 旧值 | 新值 |
|------|------|------|
| `font-size` | `0.78rem` | `1.1rem` |
| `font-weight` | `700` | `900` |
| `min-width` | `32px` | `44px` |
| `padding` | `0.1rem 0.35rem` | `0.15rem 0.5rem` |

同步增强 `text-shadow` 辉光强度。

### 3. 作者信息区调整

- **作者名称加大加粗**：`font-size: 1rem → 1.45rem`，`font-weight: 800 → 900`，增强 `text-shadow` 立体感
- **去掉作者介绍**：模板移除 `<span class="author-title">`，SCSS 移除对应样式，`.author-info` 改为 `align-items: center` 单行布局

### 4. 订阅按钮改造为 VHS 录像带仓门式

将订阅按钮彻底重设计为 VHS 录像带仓门隐喻，完全契合 CRT+VHS 主题：

- **`::before` 伪元素** = 底部仓门缝隙（`bottom: 4px; left: 10px; right: 10px; height: 5px`，暗黑凹陷）
- **`::after` 伪元素** = 缝隙内扫光（`background-position` 动画，限制在缝隙范围内）
- **`.follow-led`** = 仓门旁状态指示灯

| 状态 | 视觉效果 |
|------|----------|
| **自然态（未订阅）** | 拉丝金属面板 + 暗黑仓门缝隙 + LED 暗红待机 |
| **hover** | 缝隙内亮起暖橙光 + 橙红扫光从左掠过（磁头扫描）+ LED 橙色脉动预热（`led-warm` 1.2s） |
| **active（按下）** | 整体内凹阴影 + 仓门缝隙微移 |
| **已订阅** | 面板变绿色金属 + 缝隙内绿色光 + 绿色扫描线持续流动（`scan-green` 1.6s 循环）+ LED 亮绿色发光脉动（`led-ready` 2s） |

**关键 keyframes**：
- `led-warm`：hover 时 LED 橙色脉动预热
- `led-ready`：已订阅时 LED 绿色发光呼吸
- `scan-green`：已订阅时缝隙内绿色扫描线持续流动（`background-position: -50% → 150%`）

**踩坑**：初版扫光用 `left` 百分比定位 + `width: 35%`，导致扫光水平范围超出缝隙（缝隙缩进 10px，扫光未缩进）。修复：改用 `background-size: 50%` + `background-position` 动画，扫光严格限制在缝隙范围内。

### 5. Active 按钮 hover 边框流光转圈 + 粒子拖尾

为 `like` / `love` / `bookmark` 三个 active 按钮 hover 时添加边框流光转圈特效：

- **`@property --led-spin`**：角度自定义属性，驱动 conic-gradient 旋转
- **`@keyframes led-spin`**：`--led-spin: 0deg → 360deg`，2.2s 匀速转一圈
- **`::after` 伪元素**：`conic-gradient` 创建沿边框的锥形渐变流光
- **`mask` + `mask-composite: exclude`**：让流光只显示在边框区域（padding 部分），内容区镂空
- **粒子拖尾**：conic-gradient 中 5 个离散光点（45%-72% 区间），亮度递增（0.08→0.55），每个之间有透明间隔，形成粒子跟随效果
- **双层 `drop-shadow`**：`3px 近距离强光` + `7px 远距离柔光`

| 按钮 | 流光配色 |
|------|----------|
| 点赞 (like) | 粉色 `#f472b6` → `#ec4899` → `#ff1493` |
| 喜爱 (love) | 红色 `#f87171` → `#ef4444` → `#ff0033` |
| 收藏 (bookmark) | 绿色 `#34d399` → `#10b981` → `#00ff88` |

---

## 验证结果

- `npx vite build` 构建通过（✓ built in ~30s）
- 所有改动均通过构建验证，无 ESLint 报错

---

## 涉及文件

| 文件 | 改动 |
|------|------|
| `VideoModal/index.vue` | 胶片帧卡片模板、移除 author-title |
| `VideoModal/index.scss` | 修复 `.#cc-label` 笔误、LED 数字放大、作者名称加大、订阅按钮 VHS 仓门重写、active hover 边框流光转圈 + 粒子拖尾、新增 `@property --led-spin` / `@keyframes led-warm` / `led-ready` / `scan-green` / `led-spin` |