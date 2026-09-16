# GitHub 项目上传规范

> PersonalWebsite（Vue 3 + Vite + TypeScript，GitHub Pages 托管）
> 仓库：https://github.com/MouthHard/Personal-Website.git
> 源码分支：`master` ｜ 部署分支：`gh-pages`（构建产物，不要手动改动）

---

## 一、项目结构

```
src/
├── assets/            # 静态资源（CSS、字体、本地图片）
├── components/        # 全局通用组件（跨 2+ 页面复用）
├── composables/       # Vue 组合式函数（use* 命名，含响应式逻辑）
├── constants/         # 静态常量、配置、枚举、映射表（零逻辑零依赖）
├── pages/             # 页面级组件（按路由模块组织）
├── router/            # 路由配置
├── services/          # 数据获取层（fetch/API/IO，不含 UI 依赖）
├── stores/            # Pinia 状态管理（Composition API 风格）
├── typesOfPages/      # TypeScript 类型定义（按页面维度组织）
└── utils/             # 纯工具函数（无 Vue/IO/UI 依赖）
```

**数据流**：`public/static-data/*.json` → `services/` fetch → `stores/` 状态管理 → `composables/` 视图逻辑 → `pages/` UI 渲染

**页面组件结构**：
```
pages/ExamplePage/
├── index.vue / index.scss
├── components/ComponentName/index.vue
└── icons/              # 统一用 icons 复数命名
```

---

## 二、文件上传清单

### 必须上传

| 文件 / 目录 | 说明 |
|---|---|
| `src/` | 全部源代码 |
| `public/` | 静态资源（`static-data/` JSON + `App/` 图片素材） |
| `index.html` | Vite 入口 |
| `package.json` / `package-lock.json` | 依赖与锁定 |
| `vite.config.ts` | 构建配置（含 `base: "/Personal-Website/"`） |
| `tsconfig.json` / `tsconfig.node.json` | TS 配置 |
| `.gitignore` / `.gitattributes` | Git 规则（UTF-8 + LF） |
| `docs/` / `README.md` | 文档与说明 |

### 建议上传

`.editorconfig`、`.eslintrc.cjs`、`.prettierrc`、`tests/`、`scripts/`

### 禁止上传（已在 `.gitignore`）

| 类别 | 内容 |
|---|---|
| 依赖/产物 | `node_modules/`、`dist/`、`.vite/` |
| 敏感文件 | `.env`、`*.pem`、`*.key`、`id_rsa*`、`config.js` |
| 临时文件 | `*.log`、`temp/`、`tmp-*/`、`*.tar.gz`、`backup*/` |
| 编辑器配置 | `.idea/`、`.vscode/` |
| **AI 工具目录** | 见下表 |

### AI 工具目录（一律不上传）

| 目录 | 来源 |
|---|---|
| `.arts/` `.codeartsdoer/` `.scratchpad/` | 华为云 CodeArts |
| `.codegraph/` `.workbuddy/` | CodeGraph / AI 助手 |
| `.cursor/` `.claude/` `.cline/` `.windsurf/` `.codeium/` `.copilot/` `.continue/` `.aider/` `.specstory/` `.amp/` `.augment/` | 各 AI IDE |

---

## 三、标准操作流程

### 日常更新与推送

```bash
git status                              # 1. 查看改动
git add --dry-run .                     # 2. 预览待提交文件（检查有无 AI 目录）
git add -A && git commit -m "feat: 说明" # 3. 暂存并提交
git fetch origin                        # 4. 拉取远程引用
git merge origin/master                 # 5. 整合远程提交（Windows 禁用 rebase）
git push origin master                  # 6. 推送
```

### 部署到 GitHub Pages

```bash
# 构建（PowerShell 下必须用 npx，不要走 npm run build -- --mode gh-pages）
npx vite build --mode gh-pages

# 部署 dist 到 gh-pages 分支
npx gh-pages -d dist -r https://github.com/MouthHard/Personal-Website.git -b gh-pages
```

部署成功后访问：https://mouthhard.github.io/Personal-Website/

### 首次配置（新环境）

```bash
git config --global user.name "用户名"
git config --global user.email "邮箱"
git remote add origin https://github.com/MouthHard/Personal-Website.git
```

---

## 四、排障指南

### non-fast-forward（推送被拒）

远程有本地没有的提交，**不要 `--force`**：

```bash
git fetch origin master
git log --oneline HEAD..origin/master   # 查看远程多出的提交
git merge origin/master                 # 用 merge 整合
git push origin master
```

### Windows 大小写冲突（checkout / rebase 报错）

Windows 文件系统不区分大小写，`LightBulbIcon.vue` 与 `LightbulbIcon.vue` 视为同一文件。

**核心原则：Windows 上用 `git merge`，禁用 `git rebase` / `git pull --rebase`。**

```bash
git restore <冲突文件>                  # 恢复误删的 tracked 文件
git fetch origin master
git merge origin/master
git push origin master
```

### PowerShell 构建参数解析失败

`npm run build -- --mode gh-pages` 在 PowerShell 下会把 `gh-pages` 当位置参数。改用：

```bash
npx vite build --mode gh-pages
```

### 网络波动（fetch / push 超时）

```bash
git config --get http.proxy             # 确认无代理（无输出=正常）
git config --get https.proxy
# 直接重试，等待几十秒，不要连续反复重试
```

### 认证失败（403）

GitHub 不支持密码，需用 Token 或 SSH：

```bash
# HTTPS + Token
git remote set-url origin https://<Token>@github.com/MouthHard/Personal-Website.git
# SSH
git remote set-url origin git@github.com:MouthHard/Personal-Website.git
```

### AI 工具目录误提交

```bash
git rm -r --cached .workbuddy           # 解除跟踪（文件保留本地）
git commit -m "chore: 停止跟踪 AI 工具目录"
git push origin master
```

### 自动生成类型文件被跟踪

`types/auto-imports.d.ts`、`types/components.d.ts` 已写入 `.gitignore` 但仍被跟踪：

```bash
git rm --cached types/auto-imports.d.ts types/components.d.ts
git commit -m "chore: 停止跟踪自动生成的类型文件"
```

---

## 五、规范要求

1. **提交前必查**：`git add --dry-run .`，任何 `.` 开头的 AI 目录不得出现
2. **推送前必拉**：先 `git fetch` 再 `git merge`（Windows 禁用 rebase）
3. **禁止强推**：不使用 `--force`，保留完整历史
4. **构建命令**：统一用 `npx vite build --mode gh-pages`
5. **产物分离**：`dist/` 只推 `gh-pages` 分支，不提交源码分支
6. **网络波动**：确认无代理后重试，不调整全局代理配置

---

## 六、速查命令

```bash
git status                              # 当前状态
git add --dry-run .                     # 预览待提交文件
git log --oneline -5                    # 最近 5 条提交
git diff                                # 未暂存改动
git restore <文件>                       # 丢弃改动
git restore --staged .                  # 取消暂存
git fetch origin                        # 拉取远程引用
git merge origin/master                 # 整合远程提交
git push origin master                  # 推送源码
npx vite build --mode gh-pages          # 构建部署产物
npx gh-pages -d dist -r https://github.com/MouthHard/Personal-Website.git -b gh-pages  # 部署
```
