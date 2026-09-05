# 项目文件上传清单（GitHub Pages 个人博客）

> 适用项目：Vue 3 + Vite + TypeScript 纯静态个人博客，构建产物部署在 GitHub Pages（gh-pages 分支）。
> 远程仓库：https://github.com/MouthHard/Personal-Website.git

## 一、必须上传的文件

| 文件 / 目录 | 作用 | 说明 |
|---|---|---|
| `src/` | 全部源代码 | 页面、组件、路由、样式、图标，核心内容 |
| `public/` | 静态资源 | `static-data/` 下的 JSON 是网站运行数据，`App/` 等图片为页面素材，**必须上传** |
| `index.html` | Vite 入口 | 构建的模板入口 |
| `package.json` | 项目配置 | 依赖与脚本（`deploy` 脚本一键构建+发布） |
| `package-lock.json` | 依赖锁定 | 保证任何人 `npm install` 后依赖版本一致 |
| `vite.config.ts` | 构建配置 | 含 `base: "/Personal-Website/"`，GitHub Pages 子路径必需 |
| `tsconfig.json` / `tsconfig.node.json` | TS 配置 | 类型检查与编译 |
| `.gitignore` | Git 忽略规则 | 保证不该上传的文件被排除 |
| `.gitattributes` | 换行/编码规则 | 强制 UTF-8 + LF，避免 Windows 下乱码 |
| `docs/` | 项目文档 | 上传指南、本清单 |
| `README.md` | 项目说明 | 仓库首页展示 |

## 二、建议上传的文件

| 文件 / 目录 | 作用 | 说明 |
|---|---|---|
| `.editorconfig` | 编辑器规范 | 统一缩进、编码，多人/多机协作友好 |
| `.eslintrc.cjs` | ESLint 配置 | 代码规范检查 |
| `.prettierrc` | Prettier 配置 | 代码格式化规则 |
| `tests/` | 单元测试 | 保留测试能力，便于回归 |
| `scripts/` | 数据生成脚本 | 生成 `public/static-data/` JSON 的工具脚本，更新数据时需要 |

## 三、不需要上传的文件（已在 `.gitignore` 配置）

| 文件 / 目录 | 原因 |
|---|---|
| `node_modules/` | 依赖包，`npm install` 可恢复，体积巨大 |
| `dist/` | 构建产物，由 `npm run deploy` 自动生成并推送到 `gh-pages` 分支，**master 分支不需要** |
| `.vite/` | Vite 缓存 |
| `.env` / `.env.*` | 环境变量，可能含密钥 |
| `config.js` | 本地配置 |
| `*.log`、`temp/`、`tmp-*/` | 日志与临时文件 |
| `*.pem` / `*.key` / `id_rsa*` 等 | SSH 密钥与敏感凭据，**绝不能上传** |
| `*.tar.gz` / `deploy-*` / `backup*/` | 部署包与备份 |
| **AI IDE / AI 工具工作目录**（见下表） | 工具运行时自动生成，属于个人环境缓存，**一律不上传** |
| `.idea/` / `.vscode/` | 编辑器个人配置 |

## 四、AI IDE / AI 工具工作目录（禁止上传）

以下目录均由 AI IDE / AI Agent 在本地自动生成（配置、索引、会话记忆、缓存等），属于个人环境产物，**不应也不会被上传到 GitHub**。它们均已写入 `.gitignore`：

| 目录 | 来源 |
|---|---|
| `.arts/`、`.codeartsdoer/`、`.scratchpad/` | 华为云 CodeArts / CodeArts Agent |
| `.codegraph/` | CodeGraph 代码索引 |
| `.workbuddy/` | AI 编程助手会话/记忆 |
| `.cursor/` | Cursor |
| `.claude/` | Claude Code |
| `.cline/` | Cline |
| `.windsurf/` | Windsurf |
| `.codeium/` | Codeium |
| `.copilot/` | GitHub Copilot |
| `.continue/` | Continue |
| `.aider/` | Aider |
| `.specstory/` | SpecStory |
| `.amp/` / `.augment/` | 其他 AI IDE 工具 |

> 如果以后某次提交误将这类目录推到了远程仓库，按以下步骤清理（文件保留在本地）：
>
> ```bash
> # 1. 解除跟踪（-r 用于目录；也可对具体文件执行）
> git rm -r --cached .workbuddy
> git commit -m "chore: 停止跟踪AI工具工作目录"
> git push origin feat/update-site
> ```

## 五、注意事项（当前仓库的遗留问题）

1. **`types/auto-imports.d.ts`、`types/components.d.ts`**：已写入 `.gitignore`，但因为是"先提交、后忽略"，目前仍被 Git 跟踪。建议执行以下命令解除跟踪（文件保留在本地，不影响构建，构建时会自动重新生成）：

   ```bash
   git rm --cached types/auto-imports.d.ts types/components.d.ts
   git commit -m "chore: 停止跟踪自动生成的类型文件"
   ```

2. **`types/vite-env.d.ts`**：本地已删除但删除未提交，确认不需要后执行 `git add -A` 一并提交即可。

3. **图片等二进制资源**：`src/` 和 `public/` 中的 `.webp/.png` 是网站素材，属于源码的一部分，正常上传即可；`.gitattributes` 已将其标记为 binary，不会被换行符转换破坏。

4. **仓库体积**：`public/static-data/` 有约 200 个 JSON，是博客内容数据，无法精简；如未来数据大幅膨胀，可考虑启用 Git LFS。

## 五、快速自查命令

```bash
# 确认哪些文件会被提交（不会实际提交）
git add --dry-run .

# 查看当前被跟踪的顶层目录统计
git ls-files | cut -d/ -f1 | sort | uniq -c | sort -rn

# 确认敏感文件未被跟踪
git ls-files | grep -E "\.(pem|key|env)$"
```
