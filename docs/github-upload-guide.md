# GitHub 项目上传规范

> PersonalWebsite（Vue 3 + Vite + TypeScript）
> 仓库：https://github.com/MouthHard/Personal-Website.git
> 源码分支：`feat/update-site` → 合并到 `master`
> **主站**：腾讯云 EdgeOne Pages（监听 `master`，推送后自动构建）https://site.jinfengyulu.cn
> **备用站**：GitHub Pages，`gh-pages` 分支（构建产物，不要手动改动）
>
> **⚠️ 每次执行之前都要检查大厂、热门、github上的项目的上传规范和项目规范，并依次来迭代我的上传文档md**
>
> **2026-11-24 自迭代（参考 Conventional Commits 1.0.0 / GitHub Flow 官方实践 / 主流大厂仓库规范）**：
> - 提交信息统一 `type(scope): 描述`（scope 可选），type 用 `feat/fix/docs/style/refactor/test/chore/ci/build`，小写、祈使语气、结尾不加句号；本仓 `.husky/commit-msg` + `@commitlint/config-conventional` 已强制。
> - 一个提交只做一件事（one logical change per commit），便于 revert / cherry-pick / 自动生成 changelog。
> - 分支命名前缀与 type 对齐（`feat/**`、`fix/**`、`chore/**`），CI 触发分支 `feat/**` 已覆盖。
> - CI 是合并门禁：typecheck / lint / stylelint / test / knip / build 任一失败都不推送，不靠 `--no-verify` 绕过。
> - 密钥（Token / *.pem / .env*）永不入库，凭据走 git credential manager 或环境变量。
> - **stash 基线校验**：本仓存在历史遗留 stash（`stash@{0}` 等，2026-10 前的备份），所以"提交后 stash 应为空"改为"提交后 stash 数量与提交前基线一致，且无新增 `lint-staged automatic backup`"。

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
├── styles/            # 全局样式（global.scss，仅在 main.ts 引入）
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
| `vite.config.ts` | 构建配置（`base` 由 `VITE_BASE` 控制，缺省 `/Personal-Website/`） | ✅ |
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
| `knip.config.ts` | Knip 未使用代码/依赖检测配置 | ✅ |
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
| `dist/` | 构建输出（只推 gh-pages 分支） | `.gitignore` | 否（已核实） |
| `dist/stats.html` | 包体积可视化报告（仅 production 构建生成，约 2MB），不是站点资源 | 构建产物，随 dist 清理 | 否（不入库，但别发布到 gh-pages） |
| `node_modules/` | npm 依赖 | `.gitignore` | 否（已核实） |
| `types/auto-imports.d.ts` | Vite 自动生成 | `.gitignore` | 否 |
| `types/components.d.ts` | Vite 自动生成 | `.gitignore` | 否 |

> 构建若用 `--mode gh-pages`（非 production），不会生成 `stats.html`；用 `npm run build` 会生成，部署前需删除，避免把 2MB 报告推到 gh-pages。

#### AI 工具目录（曾误提交，现已清理）

| 文件/目录 | 说明 | 忽略方式 | 远程是否残留 |
|---|---|---|---|
| `.arts/` | CodeArts AI 运行时目录 | `.gitignore` | 否（已清理） |
| `.codeartsdoer/` | CodeArts Doer 记忆目录 | `.gitignore` | 否（已清理） |
| `.playwright-cli/` | Playwright CLI 运行缓存 | `.gitignore` | 否（本轮补入忽略） |

> 清理方法（如再次误入库）：
> ```bash
> git rm -r --cached .arts .codeartsdoer .playwright-cli 2>/dev/null
> git commit -m "chore: 清理误提交的AI工具目录"
> ```

#### 临时文件与目录

| 文件/目录 | 说明 | 忽略方式 | 远程是否残留 |
|---|---|---|---|
| `public/test/` | 临时测试目录（AVIF 转换用，已上传 OSS） | `.gitignore` + 已删除本地 | 否（已清理） |
| `gh-pages:test/` | gh-pages 分支残留的 test/ 目录 | 不用 `-a/--add` 部署（默认 `-v .` 会清掉 dist 不存在的旧文件） | 部署一次即清除 |
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
.playwright-cli/
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
git stash list             # 对比提交前基线：数量不变、无新增 lint-staged backup
git diff HEAD              # 应该为空
# 若 stash 数量增加，立即 git stash pop 解决冲突；历史遗留 stash 不要动
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
echo "--- 检查6: 索引里无大小写重复路径 ---"
git ls-files | awk '{print tolower($0)"\t"$0}' | sort | awk -F'\t' '{if($1==p1 && $2!=p2) print "✗ 重复: "p2" <-> "$2; p1=$1; p2=$2}'
echo "--- 检查7: 类型检查通过 ---"
npx vue-tsc --noEmit && echo "✓ 类型检查 0 错误"
```

---

## 三、标准操作流程

### 日常更新与推送（主站：EdgeOne Pages 自动构建）

> 主站由 EdgeOne Pages 监听 `master` 自动构建，代码合入 `master` 后无需任何本地构建命令。
> `gh-pages` 备用站默认不再随每次提交同步，仅在需要更新备用站时执行文末「备用站部署」。

```bash
# ── 提交前准备 ──
rm -f nul .tmp-sass-check.css.map        # 0. 清理 Windows 临时文件
git status                                # 1. 查看改动，确认所有改动都是预期的
git add --dry-run .                       # 2. 预览待提交文件（检查无临时文件/临时目录）

# ── 源码提交 ──
git add -A                                # 3. 暂存全部改动（必须先 add，再 commit）
git commit -m "feat: 说明"                # 4. 提交（husky 会自动 lint）

# ── 提交后验证（防止 lint-staged stash 丢失改动） ──
git stash list                            # 5. 对比提交前基线：数量不变、无新增 lint-staged backup（关键！）
git diff HEAD                             # 6. 确认工作区与 HEAD 一致（无输出=一致）
# 若 stash 数量增加，立即 git stash pop 解决冲突；历史遗留 stash（2026-10 备份）不要动

# ── 推送源码 ──
git fetch origin                          # 7. 拉取远程引用
git merge origin/feat/update-site         # 8. 整合远程提交（Windows 禁用 rebase）
git push origin feat/update-site          # 9. 推送源码

# ── 发布到主站 ──
# 10. 在 GitHub 上开 PR：feat/update-site → master，合并后 EdgeOne Pages 自动构建并上线
# 11. 构建完成后访问 https://site.jinfengyulu.cn 验收（资源路径应为 /assets/...）
```

主站访问：https://site.jinfengyulu.cn

> **EdgeOne 项目配置（不要改）**：
> - 生产分支：`master`｜框架预设：Vite｜根目录：`/`｜输出目录：`dist`｜构建命令：`npm run build`｜安装命令：`npm install`
> - 环境变量：`VITE_BASE=/`（根路径部署，缺省会退化成 `/Personal-Website/` 导致全站 404）、`NODE_VERSION=22`（Vite 7 要求 Node ≥ 20.19 / 22.12）
> - `static-data/*.json` 在 CDN 上是一年期缓存，靠 `vite define` 注入的 `__BUILD_TIME__` 版本号自动绕过，**不要手工给 JSON 路径改参数**

### 备用站部署（gh-pages，可选）

> 仅在需要更新 GitHub Pages 备用站时执行；主站已由 EdgeOne 自动发布，不依赖这一步。

```bash
npx vue-tsc --noEmit                      # 1. 类型检查（应为 0 错误）
npx vite build --mode gh-pages            # 2. 构建产物到 dist/（不生成 stats.html，base 缺省 /Personal-Website/）
rm -f dist/stats.html                     # 3. 防御性清理：stats.html 不是站点资源
npx gh-pages -d dist --nojekyll -b gh-pages -m "deploy: 更新站点" \
  -r https://github.com/MouthHard/Personal-Website.git   # 4. 部署到 gh-pages（禁用 -a）
```

备用站访问：https://mouthhard.github.io/Personal-Website/

> **注意**：
> - PowerShell 下构建必须用 `npx vite build --mode gh-pages`，不要走 `npm run build -- --mode gh-pages`（参数解析会失败）。`npm run build`（production）会生成 2MB 的 `dist/stats.html`，故部署走 gh-pages 模式。
> - **绝对不要加 `-a/--add`**：加上后只增不删，gh-pages 分支会永久残留旧文件（历史上的 `test/` 目录就是这样留下的）。默认 `-v .`（remove pattern）会删除 dist 里不存在的旧文件，正是需要的。
> - `--nojekyll` 会写入 `.nojekyll`，避免 GitHub Pages 走 Jekyll 处理 `_` 开头的文件。

### ⚠️ lint-staged stash 陷阱（曾导致 235 个文件改动丢失）

**根因**：`git commit` 时如果工作区有未暂存改动，lint-staged 会自动 `git stash` 这些改动，运行 lint 工具后再 `git stash pop` 恢复。如果 lint 工具（`eslint --fix` / `stylelint --fix`）修改了文件，`stash pop` 会冲突失败，改动留在 stash 中不被恢复。

**预防措施**：
1. **提交前必须 `git add -A`**：确保所有改动都已暂存，lint-staged 不会 stash 任何东西
2. **提交后必须 `git stash list`**：确认数量与提交前基线一致、无新增 lint-staged backup
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

### 仓库里出现大小写重复的目录（同一份代码两份）

**成因**：Windows 文件系统大小写不敏感，`Food/` 与 `food/`、`Aphorism/` 与 `aphorism/` 在本地是同一个目录，但在 Linux/CI 上是两个目录，于是仓库里出现「同一份代码两份」。

**排查**（应输出为空）：
```bash
git ls-files | awk '{print tolower($0)"\t"$0}' | sort | awk -F'\t' '{if($1==p1 && $2!=p2) print p2" <-> "$2; p1=$1; p2=$2}'
```

**修复**：保留与 import 一致的那个大小写，把另一个从索引移除（只动索引，不删本地文件）：
```bash
# 例：import 用 @/utils/aphorism/...，则大写那份是残留
git rm -r --cached src/utils/Aphorism
git commit -m "chore: 移除大小写重复的冗余目录"
```
> 已在本轮清理：`src/pages/TravelGuide/components/food/**`（8 个文件，import 统一用 `Food/`）、`src/utils/Aphorism/categoryFilter.ts`（import 统一用 `aphorism/`）。

### CI 与本地预检

`.github/workflows/ci.yml` 的触发分支为 `main` / `master` / `feat/**`，推送功能分支即会校验。
其中 typecheck、ESLint、stylelint、vitest、knip、build 均为**硬性门禁**（不再有 `continue-on-error`）。
本地提交前建议跑同一套：

```bash
npm run typecheck && npm run lint:check && npm run lint:css:check && npm run test:run && npm run knip && npm run build
```

> knip 只保留「未用文件 / 未用依赖 / 未解析导入」三类高置信度检查；导出级与类型级检查因 Vue barrel
> 重导出与 unplugin 自动导入导致假阳性过高而关闭，详见 `knip.config.ts` 的注释。

### PowerShell 构建参数解析失败

`npm run build -- --mode gh-pages` 在 PowerShell 下报错。改用：

```bash
npx vite build --mode gh-pages
```

### 网络波动（fetch / push 超时）

```bash
git config --get http.proxy             # 确认无代理（无输出=正常）
git ls-remote origin HEAD               # 快速探测连通性（成功会输出 commit hash）
# 等待几十秒后重试，不要连续反复重试
```

若 `git ls-remote` 卡住/超时：先查 `C:\Windows\System32\drivers\etc\hosts` 是否把 `github.com` 指向了失效 IP（历史上 `140.82.116.3` 曾失效）。此时不要改全局代理，用临时 CONNECT 代理绕开 hosts：

```bash
# 在项目外临时目录写 10 行 Node CONNECT 代理，指向可直连 IP（如 20.205.243.166:443）
git -c http.proxy=http://127.0.0.1:18080 ls-remote origin HEAD   # 验证后再用它 push
```

网络恢复后可移除 hosts 里的失效条目；**不要**设置全局 `http.proxy`，避免影响其他仓库。

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
3. **提交后必验证**：`git stash list`（数量=提交前基线、无新增 backup）+ `git diff HEAD`（无输出），确保改动未丢失
4. **推送前必拉**：先 `git fetch` 再 `git merge`（Windows 禁用 rebase）
5. **发布方式**：主站走 EdgeOne Pages——推送到 `feat/update-site` 并合并进 `master` 即自动构建上线，本地不需要构建；`gh-pages` 仅在需要同步备用站时手动部署
6. **禁止强推**：不使用 `--force`，保留完整历史
7. **构建命令**：本地校验用 `npx vite build --mode gh-pages`；EdgeOne 侧固定 `npm run build`，类型检查须 0 错误（当前已达成）
8. **产物分离**：`dist/` 只推 `gh-pages` 分支，不提交源码分支；`dist/stats.html` 不发布
9. **禁止 `--add`**：部署一律不加 `-a`，否则旧文件永久残留
10. **网络波动**：确认无代理后重试，不调整全局代理配置
11. **禁止跳过钩子**：不用 `--no-verify`，除非确认是 stash 中代码本身的历史 lint 问题
12. **路径大小写唯一**：新增目录/文件前确认仓库内没有仅大小写不同的同名路径（见四、排障指南）
13. **EdgeOne 配置不可动**：`VITE_BASE=/` 与 `NODE_VERSION=22` 两个环境变量必须保留，生产分支必须为 `master`；改动会导致全站 404 或构建失败

---

## 六、工具链冲突清单

> 完整报告见 `docs/bugs/2026-10-31-工具链冲突全面检查报告.md`

### 🔴 高风险冲突

| # | 冲突 | 工具 | 预防 |
|---|------|------|------|
| 1 | lint-staged stash 丢失改动 | lint-staged + husky | 提交前 `git add -A`，提交后 `git stash list` 验证 |
| 2 | stylelint 96 个规则错误 | stylelint + 项目代码 | 已在 `stylelint.config.cjs` 放宽（见下方），当前 0 错误 |
| 3 | lint-staged SIGKILL | lint-staged + Node.js | `.husky/pre-commit` 需加 `NODE_OPTIONS="--max-old-space-size=4096"`（**尚未落地，大提交时注意**） |

### 🟡 中风险冲突

| # | 冲突 | 工具 | 预防 |
|---|------|------|------|
| 4 | @typescript-eslint v5 与 TS 5.9 | eslint + typescript | 已升级到 v8.73（匹配 TS 5.9） |
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
git stash list                            # 检查 stash 数量是否=提交前基线（提交后必须执行）
git diff HEAD                             # 确认工作区与HEAD一致（无输出=一致）
git log --oneline -5                      # 最近 5 条提交
git diff                                  # 未暂存改动
git restore <文件>                         # 丢弃改动
git restore --staged .                    # 取消暂存
git fetch origin                          # 拉取远程引用
git merge origin/feat/update-site         # 整合远程提交
git push origin feat/update-site          # 推送源码（合并进 master 后 EdgeOne 自动构建主站）
npx vite build --mode gh-pages            # 【备用站】构建产物
rm -f dist/stats.html                     # 【备用站】清掉包体积报告，别发布
npx gh-pages -d dist --nojekyll -b gh-pages -m "deploy: 更新站点" \
  -r https://github.com/MouthHard/Personal-Website.git   # 【备用站】部署（禁用 -a）
```
