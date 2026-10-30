# 过渡图本地化与AVIF优化

> 日期：2026-10-30
> 涉及文件：`src/components/common/PageChange/`、`public/change/`、`src/App.vue`

---

## 背景

用户发现页面切换时，过渡帘幕的 4 块图片经常空白（只有渐变底色），图片加载不出来。

## 诊断过程

### 第一步：发现图片从 OSS 远程加载
PageChange 组件从 `https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/change/` 加载 20 张过渡图。

### 第二步：检查 OSS HTTP 头
```
Content-Length: 1252152 (1.19MB/张)
Cache-Control: 无
Content-Disposition: attachment
```
三个问题：
1. 单张 1.19MB，20 张共 24MB，预加载来不及完成
2. 无 Cache-Control，浏览器缓存不可靠
3. Content-Disposition: attachment 可能影响缓存策略

### 第三步：方案 A（远程预加载）失败
在 App.vue onMounted 中用 requestIdleCallback 预加载 20 张图。但图片太大（24MB），用户首次切换前预加载未完成。

### 第四步：本地化 + 压缩
下载 20 张图到 `public/change/`，用 sharp 压缩到 1920×1080 webp q80（23MB → 6MB）。

### 第五步：路径修复
`base: "/Personal-Website/"` 导致 `/change/1.webp` 404，需用 `import.meta.env.BASE_URL` 拼接正确路径。

### 第六步：图片仍然加载慢
即使本地化后，1-2MB/张的图片在过渡动画 1.6 秒内仍可能加载不完。加上预加载 20 张占满浏览器并发连接（6 个），过渡图片排队等待。

### 第七步：AVIF 格式转换
将 20 张图从 WebP 转为 AVIF q60，体积再降 22%（6MB → 4.6MB），4 张过渡图仅 1.4MB。

## 方案对比

| 方案 | 思路 | 为什么选/不选 |
|------|------|--------------|
| A. 远程预加载 | requestIdleCallback 预加载 | ❌ 图片太大，来不及完成 |
| B. 就绪后才动画 | 等 onload 再显示 | ❌ 延迟过渡出现时机，更卡 |
| C. 本地打包 | 下载到 public/ | ✅ 消除网络不确定性 |
| D. A+就绪选图 | 预加载池+只选已加载的 | ❌ 过度工程，浏览器缓存已做同样的事 |

最终方案：**C（本地化）+ AVIF 压缩 + requestIdleCallback 预加载**

## 实现逻辑

### 文件结构
```
PageChange/
├── index.vue      # 过渡组件
├── index.scss     # 样式
└── preload.ts     # 常量 + 预加载函数
```

### preload.ts
```typescript
export const CHANGE_IMAGE_BASE = `${import.meta.env.BASE_URL}change`;
export const IMAGE_POOL_SIZE = 20;
export const preloadPageChangeImages = (): void => { ... };
```

### 加载时序
1. HTML 解析：`<link rel="preload">` 高优先级加载（已移除，dev 模式 404）
2. App.vue onMounted：`requestIdleCallback` 预加载 20 张到缓存
3. 页面切换：`<img>` 命中缓存，瞬间展示

### 过渡触发条件
`SHOW_DELAY = 400ms`：导航超过 400ms 才显示过渡帘幕。快切无感，仅慢加载显示。

## 踩坑记录

### Vite base 路径
**问题**：`base: "/Personal-Website/"` 但代码用 `/change`，生成 `/change/1.webp` → 404。
**修复**：用 `import.meta.env.BASE_URL` 动态拼接 → `/Personal-Website/change/1.webp`。

### index.html preload 在 dev 模式 404
**问题**：`<link rel="preload" href="/change/1.webp">` 在 dev 模式不被 Vite 处理，404。
**修复**：移除 HTML preload，依赖 JS 预加载（`import.meta.env.BASE_URL` 在 dev/prod 都正确）。

### 浏览器缓存旧代码
**问题**：HMR 更新了模块，但组件 `blockImages` ref 保留旧 OSS URL 状态。
**修复**：硬刷新（Ctrl+Shift+R）。

## 验证结果
- ✅ `npm run build` 通过
- ✅ ESLint 通过
- ✅ 20 张 AVIF 图片在 `public/change/`（共 4.6MB）
- ✅ GitHub Pages 部署成功

## 后续待办
- 可进一步压缩过渡图质量（q50 → 3MB）
- 可考虑按需加载（只预加载前 4 张，其余懒加载）