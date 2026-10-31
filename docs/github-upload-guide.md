# GitHub 项目上传规范

> PersonalWebsite（Vue 3 + Vite + TypeScript，GitHub Pages 托管）
> 仓库：https://github.com/MouthHard/Personal-Website.git
> 源码分支：`feat/update-site` ｜ 部署分支：`gh-pages`（构建产物，不要手动改动）
>
> **⚠️ 每次执行之前都要检查大厂、热门、github上的项目的上传规范和项目规范，并依次来迭代我的上传文档md**

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

## 二、必须上传的文件清单

> 以下为项目正常运行所需的全量文件，除此之外的文件均不应上传。
> `.gitignore` 负责排除其余文件，提交前用 `git add --dry-run .` 检查。

### ✅ 必须上传的文件

#### 根目录配置文件

| 文件 | 作用 | 是否必须 |
|---|---|---|
| `index.html` | Vite 入口模板 | ✅ |
| `package.json` | 依赖与脚本 | ✅ |
| `package-lock.json` | 依赖版本锁定 | ✅ |
| `vite.config.ts` | 构建配置（含 `base: "/Personal-Website/"`） | ✅ |
| `tsconfig.json` | TypeScript 配置 | ✅ |
| `tsconfig.node.json` | Node 环境 TS 配置 | ✅ |
| `.gitignore` | Git 忽略规则 | ✅ |
| `.gitattributes` | 换行/编码规则（UTF-8 + LF） | ✅ |
| `.editorconfig` | 编辑器缩进/编码规范 | ✅ |
| `.eslintrc.cjs` | ESLint 代码规范 | ✅ |
| `.prettierrc` | Prettier 格式化规则 | ✅ |
| `stylelint.config.cjs` | Stylelint SCSS 样式规范 | ✅ |
| `commitlint.config.cjs` | Commitlint 提交信息规范 | ✅ |
| `.lintstagedrc.json` | lint-staged 暂存文件 lint 配置 | ✅ |
| `.husky/pre-commit` | Git pre-commit 钩子 | ✅ |
| `.husky/commit-msg` | Git commit-msg 钩子 | ✅ |
| `.github/workflows/ci.yml` | GitHub Actions CI 流水线 | ✅ |
| `README.md` | 仓库说明 | ✅ |

#### 源代码与数据目录

| 目录 | 作用 | 是否必须 |
|---|---|---|
| `src/` | 全部源代码（页面、组件、路由、样式、图标） | ✅ |
| `public/static-data/` | JSON 数据文件 | ✅ |
| `public/change/` | 过渡动画图片（20 个 WebP） | ✅ |
| `public/favicon.svg` | 站点图标 | ✅ |
| `public/logo.png` | 站点 Logo | ✅ |
| `docs/` | 项目文档（含上传规范、bug 记录） | ✅ |
| `tests/` | 单元测试 | ✅ |
| `types/vite-env.d.ts` | Vite 环境类型声明（手写，非自动生成） | ✅ |

### ❌ 禁止上传的文件

#### 构建产物与依赖

| 文件/目录 | 说明 | 忽略方式 | 远程是否残留 |
|---|---|---|---|
| `dist/` | 构建输出（只推 gh-pages 分支） | `.gitignore` | 需确认 |
| `node_modules/` | npm 依赖 | `.gitignore` | 需确认 |
| `types/auto-imports.d.ts` | Vite 自动生成 | `.gitignore` | 否 |
| `types/components.d.ts` | Vite 自动生成 | `.gitignore` | 否 |

#### AI 工具目录（误提交到远程，需清理）

| 文件/目录 | 说明 | 忽略方式 | 远程是否残留 |
|---|---|---|---|
| `.arts/` | CodeArts AI 运行时目录 | `.gitignore` | **是，需清理** |
| `.codeartsdoer/` | CodeArts Doer 记忆目录 | `.gitignore` | **是，需清理** |

> **清理方法**（网络恢复后执行）：
> ```bash
> git rm -r --cached .arts .codeartsdoer dist node_modules 2>/dev/null
> git commit -m "chore: 清理误提交的AI工具目录和构建产物"
> git push origin feat/update-site
> ```

#### 临时文件与目录

| 文件/目录 | 说明 | 忽略方式 | 远程是否残留 |
|---|---|---|---|
| `public/test/` | 临时测试目录（AVIF 转换用，已上传 OSS） | `.gitignore` + 已删除本地 | 否（已清理） |
| `gh-pages:test/` | gh-pages 分支的 test/ 目录（构建产物） | 删除 `public/test/` 后下次部署自动消失 | **是，下次部署后消失** |
| `.tmp-sass-check.css.map` | SCSS 编译临时文件 | `.gitignore` | 否 |
| `nul` | Windows 保留文件名 | `.gitignore` | 否 |
| `*.log` | 日志文件 | `.gitignore` | 否 |
| `temp/` `tmp-*/` | 临时目录 | `.gitignore` | 否 |

#### 环境与密钥

| 文件 | 说明 | 忽略方式 |
|---|---|---|
| `.env` `.env.*.local` | 环境变量 | `.gitignore` |
| `.env.production` `.env.gh-pages` | 部署环境变量 | `.gitignore` |
| `*.pem` `*.key` `id_rsa*` `*.ppk` | SSH 密钥 | `.gitignore` |

#### AI 工具目录（禁止上传）

以下目录由 AI IDE/Agent 自动生成，均已写入 `.gitignore`：

```
.arts/  .codeartsdoer/  .codegraph/  .workbuddy/  .scratchpad/
.cursor/  .claude/  .cline/  .windsurf/  .codeium/  .copilot/
.continue/  .aider/  .specstory/  .amp/  .augment/
```

#### 编辑器与系统文件

| 文件 | 说明 | 忽略方式 |
|---|---|---|
| `.DS_Store` | macOS 系统文件 | `.gitignore` |
| `.idea/` `.vscode/` | IDE 配置 | `.gitignore` |
| `*.suo` `*.ntvs*` `*.sln` | Visual Studio | `.gitignore` |

> 若误提交，用 `git rm -r --cached <目录>` 解除跟踪后重新推送。

---

## 二·一、提交前必检清单（每次提交都要执行）

> **⚠️ 自迭代提醒：每次提交前都要重新检查本清单，确保只上传必须的文件。**
>
> **执行顺序：从上到下逐条检查，全部通过后才能 `git commit`。**

```bash
# ── 第1步：清理临时文件 ──
rm -f nul .tmp-sass-check.css.map

# ── 第2步：确认 public/test/ 不存在 ──
# 如果存在，Vite 构建会把它复制到 dist/，导致 gh-pages 分支有 test/ 目录
ls public/test/ 2>/dev/null && echo "⚠️ public/test/ 存在！请删除: rm -rf public/test/" || echo "✓ public/test/ 不存在"

# ── 第3步：预览待提交文件 ──
git add --dry-run .

# ── 第4步：检查是否有不该提交的文件 ──
# 确认 dry-run 输出中不包含以下文件/目录：
#   dist/  node_modules/  public/test/  .arts/  .codeartsdoer/  *.log  .env*
# 如果有，说明 .gitignore 配置有遗漏，需要先修复

# ── 第5步：确认所有改动已暂存 ──
git add -A
git diff --cached --stat   # 查看暂存的改动

# ── 第6步：提交 ──
git commit -m "feat: 说明"

# ── 第7步：提交后验证（防止 lint-staged stash 丢失） ──
git stash list             # 应该为空
git diff HEAD              # 应该为空
# 如果 stash list 有残留，立即执行 git stash pop 解决冲突
```

### 快速检查脚本（一键执行）

```bash
# 复制以下命令一次性执行，全部显示 ✓ 才能提交
rm -f nul .tmp-sass-check.css.map
echo "--- 检查1: public/test/ ---"
ls public/test/ 2>/dev/null && echo "✗ 删除 public/test/" || echo "✓"
echo "--- 检查2: AI工具目录未被跟踪 ---"
git ls-files .arts .codeartsdoer .codegraph 2>/dev/null | head -1 && echo "✗ 有AI目录被跟踪" || echo "✓"
echo "--- 检查3: dist/ 未被跟踪 ---"
git ls-files dist/ 2>/dev/null | head -1 && echo "✗ dist被跟踪" || echo "✓"
echo "--- 检查4: node_modules/ 未被跟踪 ---"
git ls-files node_modules/ 2>/dev/null | head -1 && echo "✗ node_modules被跟踪" || echo "✓"
echo "--- 检查5: 无临时文件 ---"
git ls-files | grep -E "nul$|\.tmp-sass|\.log$" | head -1 && echo "✗ 有临时文件" || echo "✓"
```

---

## 三、标准操作流程

### 日常更新与推送（含 GitHub Pages 部署）

> 每次推送到 `feat/update-site` 后，必须紧接着构建并部署到 `gh-pages` 分支，确保线上站点同步更新。

```bash
# ── 提交前准备 ──
rm -f nul .tmp-sass-check.css.map        # 0. 清理 Windows 临时文件
git status                                # 1. 查看改动，确认所有改动都是预期的
git add --dry-run .                       # 2. 预览待提交文件（检查无临时文件/临时目录）

# ── 源码提交 ──
git add -A                                # 3. 暂存全部改动（必须先 add，再 commit）
git commit -m "feat: 说明"                # 4. 提交（husky 会自动 lint）

# ── 提交后验证（防止 lint-staged stash 丢失改动） ──
git stash list                            # 5. 检查是否有残留 stash（关键！）
git diff HEAD                             # 6. 确认工作区与 HEAD 一致（无输出=一致）
# 如果 stash list 有残留，立即执行：git stash pop 并解决冲突

# ── 推送源码 ──
git fetch origin                          # 7. 拉取远程引用
git merge origin/feat/update-site         # 8. 整合远程提交（Windows 禁用 rebase）
git push origin feat/update-site          # 9. 推送源码

# ── 构建并部署到 GitHub Pages ──
npx vite build --mode gh-pages            # 10. 构建产物到 dist/
npx gh-pages -d dist -r https://github.com/MouthHard/Personal-Website.git -b gh-pages  # 11. 部署 dist 到 gh-pages 分支
```

部署成功后访问：https://mouthhard.github.io/Personal-Website/

> **注意**：PowerShell 下构建必须用 `npx vite build --mode gh-pages`，不要走 `npm run build -- --mode gh-pages`（参数解析会失败）。

### ⚠️ lint-staged stash 陷阱（曾导致 235 个文件改动丢失）

**根因**：`git commit` 时如果工作区有未暂存改动，lint-staged 会自动 `git stash` 这些改动，运行 lint 工具后再 `git stash pop` 恢复。如果 lint 工具（`eslint --fix` / `stylelint --fix`）修改了文件，`stash pop` 会冲突失败，改动留在 stash 中不被恢复。

**预防措施**：
1. **提交前必须 `git add -A`**：确保所有改动都已暂存，lint-staged 不会 stash 任何东西
2. **提交后必须 `git stash list`**：确认无残留 stash
3. **提交后必须 `git diff HEAD`**：确认工作区与 HEAD 一致
4. **如果有残留 stash**：立即 `git stash pop` 解决冲突，不要继续后续操作

**恢复丢失的改动**：
```bash
git stash list                            # 查看残留 stash
git stash pop                             # 尝试恢复
# 如有冲突，逐文件解决后：
git add -A && git commit -m "fix: 恢复stash中丢失的改动"
```

---

## 四、排障指南

### non-fast-forward（推送被拒）

远程有本地没有的提交，**不要 `--force`**：

```bash
git fetch origin feat/update-site
git merge origin/feat/update-site
git push origin feat/update-site
```

### Windows 大小写冲突（checkout / rebase 报错）

**核心原则：Windows 上用 `git merge`，禁用 `git rebase` / `git pull --rebase`。**

```bash
git restore <冲突文件>
git fetch origin feat/update-site
git merge origin/feat/update-site
git push origin feat/update-site
```

### PowerShell 构建参数解析失败

`npm run build -- --mode gh-pages` 在 PowerShell 下报错。改用：

```bash
npx vite build --mode gh-pages
```

### 网络波动（fetch / push 超时）

```bash
git config --get http.proxy             # 确认无代理（无输出=正常）
# 等待几十秒后重试，不要连续反复重试
```

### 认证失败（403）

```bash
# HTTPS + Token
git remote set-url origin https://<Token>@github.com/MouthHard/Personal-Website.git
# SSH
git remote set-url origin git@github.com:MouthHard:Personal-Website.git
```

### pre-commit 钩子失败（husky + lint-staged）

提交时 husky 会自动运行 ESLint + Stylelint 检查暂存文件，失败则阻止提交：

```bash
# 常见错误1：ESLint no-empty（空 catch 块）
# 修复：在 catch 块中加注释或语句
} catch { /* 忽略错误，使用默认值 */ }

# 常见错误2：Stylelint 找不到临时文件
# 原因：文件系统竞态，重试提交即可

# 提交被拒绝后，修复问题再重新提交（不要用 --no-verify 跳过）
git add -A && git commit -m "feat: 说明"
```

### lint-staged stash 丢失改动（最严重！）

**症状**：commit 成功但大量改动丢失，`git stash list` 有残留。

```bash
# 1. 确认是否有残留 stash
git stash list
# 输出 "stash@{0}: lint-staged automatic backup" 说明改动被 stash 了

# 2. 恢复改动
git stash pop
# 如有冲突，取 stash 版本（通常是最新的）：
git checkout --theirs -- $(git diff --name-only --diff-filter=U)
git add -A

# 3. 重新提交
git commit -m "fix: 恢复lint-staged stash中丢失的改动"

# 4. 验证已完全恢复
git stash list                            # 应该为空
git diff HEAD                             # 应该为空
```

**预防**：每次 commit 前先 `git add -A`，commit 后立即 `git stash list` 检查。

### 误提交临时文件

```bash
# Windows 可能产生 nul、.tmp-sass-check.css.map 等临时文件
# 提交前先清理
rm -f nul .tmp-sass-check.css.map

# 临时目录（如 public/test/）加入 .gitignore
# 若已误提交，解除跟踪：
git rm -r --cached <目录>
git commit -m "chore: 移除临时目录的git跟踪"
```

---

## 五、规范要求

1. **提交前必查**：`git add --dry-run .`，确认只有上述必须上传的文件
2. **提交前必暂存**：`git add -A` 暂存全部改动后再 `git commit`，避免 lint-staged stash 陷阱
3. **提交后必验证**：`git stash list`（无残留）+ `git diff HEAD`（无输出），确保改动未丢失
4. **推送前必拉**：先 `git fetch` 再 `git merge`（Windows 禁用 rebase）
5. **推送后必部署**：源码推送到 `feat/update-site` 后，必须执行 `npx vite build --mode gh-pages` 构建 + `npx gh-pages` 部署到 `gh-pages` 分支，确保线上站点同步
6. **禁止强推**：不使用 `--force`，保留完整历史
7. **构建命令**：统一用 `npx vite build --mode gh-pages`
8. **产物分离**：`dist/` 只推 `gh-pages` 分支，不提交源码分支
9. **网络波动**：确认无代理后重试，不调整全局代理配置
10. **禁止跳过钩子**：不用 `--no-verify`，除非确认是 stash 中代码本身的历史 lint 问题

---

## 六、工具链冲突清单

> 完整报告见 `docs/bugs/2026-10-31-工具链冲突全面检查报告.md`

### 🔴 高风险冲突

| # | 冲突 | 工具 | 预防 |
|---|------|------|------|
| 1 | lint-staged stash 丢失改动 | lint-staged + husky | 提交前 `git add -A`，提交后 `git stash list` 验证 |
| 2 | stylelint 96 个规则错误 | stylelint + 项目代码 | 放宽 keyframes-name-pattern 等规则（见下方） |
| 3 | lint-staged SIGKILL | lint-staged + Node.js | `.husky/pre-commit` 加 `NODE_OPTIONS="--max-old-space-size=4096"` |

### 🟡 中风险冲突

| # | 冲突 | 工具 | 预防 |
|---|------|------|------|
| 4 | @typescript-eslint v5 与 TS 5.9 | eslint + typescript | 升级到 @typescript-eslint v6+ |
| 5 | public/test/ 反复提交 | git + .gitignore | `git rm -r --cached` 解除跟踪 |
| 6 | stylelint 不认识 :deep | stylelint + Vue 3 | 配置 ignorePseudoClasses: ['deep'] |

### 推荐配置修改

**stylelint.config.cjs**（放宽与项目代码冲突的规则）：
```js
rules: {
  // 现有规则...
  'keyframes-name-pattern': null,                    // 允许 camelCase keyframe
  'declaration-block-single-line-max-declarations': null,  // 允许单行多声明
  'selector-pseudo-class-no-unknown': [true, {
    ignorePseudoClasses: ['deep', 'global']          // Vue scoped CSS
  }],
}
```

**.husky/pre-commit**（增加内存限制）：
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npx lint-staged
```

---

## 七、速查命令

```bash
git status                                # 当前状态
git add --dry-run .                       # 预览待提交文件
git add -A                                # 暂存全部改动（提交前必须执行）
git commit -m "feat: 说明"                # 提交
git stash list                            # 检查残留 stash（提交后必须执行）
git diff HEAD                             # 确认工作区与HEAD一致（无输出=一致）
git log --oneline -5                      # 最近 5 条提交
git diff                                  # 未暂存改动
git restore <文件>                         # 丢弃改动
git restore --staged .                    # 取消暂存
git fetch origin                          # 拉取远程引用
git merge origin/feat/update-site         # 整合远程提交
git push origin feat/update-site          # 推送源码
npx vite build --mode gh-pages            # 构建部署产物
npx gh-pages -d dist -r https://github.com/MouthHard/Personal-Website.git -b gh-pages  # 部署到 gh-pages
```
