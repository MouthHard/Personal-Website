# GitHub 项目上传规范

> PersonalWebsite（Vue 3 + Vite + TypeScript，GitHub Pages 托管）
> 仓库：https://github.com/MouthHard/Personal-Website.git
> 源码分支：`feat/update-site` ｜ 部署分支：`gh-pages`（构建产物，不要手动改动）

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

### 根目录配置文件

| 文件 | 作用 |
|---|---|
| `index.html` | Vite 入口模板 |
| `package.json` | 依赖与脚本（`deploy` 一键构建+发布） |
| `package-lock.json` | 依赖版本锁定 |
| `vite.config.ts` | 构建配置（含 `base: "/Personal-Website/"`） |
| `tsconfig.json` | TypeScript 配置 |
| `tsconfig.node.json` | Node 环境 TS 配置 |
| `.gitignore` | Git 忽略规则 |
| `.gitattributes` | 换行/编码规则（UTF-8 + LF） |
| `.editorconfig` | 编辑器缩进/编码规范 |
| `.eslintrc.cjs` | ESLint 代码规范 |
| `.prettierrc` | Prettier 格式化规则 |
| `README.md` | 仓库说明 |

### 源代码与数据目录

| 目录 | 作用 |
|---|---|
| `src/` | 全部源代码（页面、组件、路由、样式、图标） |
| `public/` | 静态资源（`static-data/` JSON 数据 + 图片素材） |
| `docs/` | 项目文档 |
| `tests/` | 单元测试 |
| `scripts/` | 数据生成/转换脚本 |
| `types/vite-env.d.ts` | Vite 环境类型声明（手写，非自动生成） |

### AI 工具目录（禁止上传）

以下目录由 AI IDE/Agent 自动生成，均已写入 `.gitignore`：

```
.arts/  .codeartsdoer/  .codegraph/  .workbuddy/  .scratchpad/
.cursor/  .claude/  .cline/  .windsurf/  .codeium/  .copilot/
.continue/  .aider/  .specstory/  .amp/  .augment/
```

若误提交，用 `git rm -r --cached <目录>` 解除跟踪后重新推送。

---

## 三、标准操作流程

### 日常更新与推送

```bash
git status                              # 1. 查看改动
git add --dry-run .                     # 2. 预览待提交文件（检查无临时文件）
git add -A && git commit -m "feat: 说明" # 3. 暂存并提交
git fetch origin                        # 4. 拉取远程引用
git merge origin/feat/update-site       # 5. 整合远程提交（Windows 禁用 rebase）
git push origin feat/update-site        # 6. 推送
```

### 部署到 GitHub Pages

```bash
# 构建（PowerShell 下必须用 npx，不要走 npm run build -- --mode gh-pages）
npx vite build --mode gh-pages

# 部署 dist 到 gh-pages 分支
npx gh-pages -d dist -r https://github.com/MouthHard/Personal-Website.git -b gh-pages
```

部署成功后访问：https://mouthhard.github.io/Personal-Website/

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
git remote set-url origin git@github.com:MouthHard/Personal-Website.git
```

---

## 五、规范要求

1. **提交前必查**：`git add --dry-run .`，确认只有上述必须上传的文件
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
git merge origin/feat/update-site       # 整合远程提交
git push origin feat/update-site        # 推送源码
npx vite build --mode gh-pages          # 构建部署产物
npx gh-pages -d dist -r https://github.com/MouthHard/Personal-Website.git -b gh-pages  # 部署
```
