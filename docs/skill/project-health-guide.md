# 项目健康检查与日常维护手册

> PersonalWebsite 项目质量保障命令速查
> 按场景组织，日常开发只需看「每日开发」一节

---

## 一、每日开发（高频）

### 1.1 提交前检查

```bash
git add --dry-run .                     # 预览待提交文件，确认无临时/敏感文件
```

提交时 pre-commit 钩子会自动执行：
- ESLint 修复（`.vue` / `.ts` / `.js`）
- Prettier 格式化（所有代码文件）
- Stylelint 修复（`.css` / `.scss`）

commit-msg 钩子会自动校验提交信息格式（conventional commits）：
- `feat: 新功能` / `fix: 修复` / `docs: 文档` / `style: 格式` / `refactor: 重构` / `test: 测试` / `chore: 杂务`

### 1.2 本地开发服务器

```bash
npm run dev                              # 启动开发服务器（端口 5173）
```

### 1.3 构建验证

```bash
npm run build                            # 类型检查 + 生产构建（含包体积报告）
```

构建产物 `dist/stats.html` 为包体积可视化分析报告，浏览器打开查看。

---

## 二、类型安全（消除类型错误）

### 2.1 全项目类型检查

```bash
npm run typecheck                        # vue-tsc --noEmit，零输出=零错误
```

**何时运行**：
- 修改了 `.ts` / `.vue` 文件的类型、接口、props
- 安装/升级了新依赖
- 构建失败时排查原因

### 2.2 构建时自动触发

`npm run build` 已内置 `npm run typecheck && vite build`，构建失败会报具体类型错误位置。

---

## 三、代码规范（消除格式/风格问题）

### 3.1 ESLint（JS/TS/Vue 代码规范）

```bash
npm run lint                             # 自动修复所有可修复的问题
```

### 3.2 Stylelint（CSS/SCSS 样式规范）

```bash
npm run lint:css                         # 自动修复 SCSS 样式问题
```

### 3.3 Prettier（格式化）

```bash
npm run format                           # 格式化所有源代码文件
```

**何时运行**：
- 代码风格不一致、CI lint 报错时
- 大批量修改后统一格式

---

## 四、测试（消除 Bug）

### 4.1 日常测试

```bash
npm test                                 # watch 模式，文件变动自动重跑
npm run test:run                         # 单次跑完所有测试（CI 同款）
```

### 4.2 覆盖率报告

```bash
npm run test:coverage                    # 生成覆盖率报告
```

报告输出在 `coverage/` 目录，`coverage/index.html` 浏览器打开查看。

**何时运行**：
- 新增/修改了工具函数、composable、store 逻辑
- 修复 Bug 后补充回归测试
- CI 测试失败时本地复现

---

## 五、死代码检测（消除未使用代码）

### 5.1 Knip 全项目扫描

```bash
npm run knip                             # 检测未使用的导出、文件、依赖
```

Knip 会报告：
- 未使用的导出符号（export 了但没人 import）
- 未使用的文件（整个文件没人引用）
- 未使用的依赖（package.json 里装了但代码没用到）
- 未使用的类型

**何时运行**：
- 大规模重构/删除功能后清理残留
- 定期（每月一次）检查项目健康度
- CI 中自动运行

**处理方式**：
- 确认无用 → 删除
- 确认有用但 Knip 检测不到 → 在 `knip.json` 中配置忽略

---

## 六、空状态/错误态/加载态检查（消除空 UI）

> 此项无自动化命令，需人工核查。以下为核查清单。

### 6.1 核查范围

对每个页面及其子组件/子模块/列表，检查三类状态：

| 状态 | 检查点 |
|---|---|
| **空状态** | 数据为空时是否有友好提示（非空白） |
| **加载中** | 数据加载时是否有加载反馈（非闪烁/空白） |
| **错误态** | 数据加载失败时是否有错误提示+重试入口 |

### 6.2 核查方法

1. **空状态**：在 DevTools 中将数据源置空（如 store 数据清空），观察 UI
2. **加载态**：DevTools → Network → Slow 3G，刷新页面观察加载反馈
3. **错误态**：DevTools → Network → 将 JSON 请求改为 404，观察错误提示

### 6.3 原则

- **最小必要**：已完备的不补，不为处理而处理
- **复用既有风格**：空态/错误态 UI 须与所在页面视觉语言一致
- **三件套语言**：icon + text + hint + 主题色渐变底

---

## 七、CI 流水线（GitHub Actions 自动执行）

> push/PR 到 `main` / `master` 时自动触发，无需手动操作。

`.github/workflows/ci.yml` 依次执行：

| 步骤 | 命令 | 检查内容 |
|---|---|---|
| 1 | `npm run typecheck` | 类型安全 |
| 2 | `npm run lint` | 代码规范 |
| 3 | `npm run lint:css` | 样式规范 |
| 4 | `npm run test:run` | 单元测试 |
| 5 | `npm run knip` | 死代码检测 |
| 6 | `npm run build` | 构建验证 |

**CI 失败时**：本地跑对应命令复现，修复后重新 push。

---

## 八、完整健康检查（定期执行）

> 建议每周或大版本发布前执行一次全量检查。

```bash
# 一键全量检查（按顺序执行，任一步失败则停下修复）
npm run typecheck                        # 1. 类型安全
npm run lint                             # 2. 代码规范
npm run lint:css                         # 3. 样式规范
npm run test:run                         # 4. 单元测试
npm run knip                             # 5. 死代码检测
npm run build                            # 6. 构建验证
```

或直接 push 到 GitHub，让 CI 自动跑全部步骤。

---

## 九、命令速查表

| 命令 | 用途 | 自动触发场景 |
|---|---|---|
| `npm run dev` | 开发服务器 | — |
| `npm run build` | 类型检查 + 构建 | deploy 时 |
| `npm run typecheck` | 仅类型检查 | build 内含 |
| `npm run lint` | ESLint 修复 | git commit（lint-staged） |
| `npm run lint:css` | Stylelint 修复 | git commit（lint-staged） |
| `npm run format` | Prettier 格式化 | git commit（lint-staged） |
| `npm test` | 测试（watch） | — |
| `npm run test:run` | 测试（单次） | CI |
| `npm run test:coverage` | 测试 + 覆盖率 | — |
| `npm run knip` | 死代码检测 | CI |

---

## 十、常见问题排查

### 构建失败

```bash
npm run typecheck                        # 先看类型错误
npm run lint                             # 再看 lint 错误
```

### CI 测试失败

```bash
npm run test:run                         # 本地复现
```

### 提交被 pre-commit 拦截

钩子已自动修复能修复的（eslint --fix / prettier --write）。若仍有错误：
- 看终端输出的错误信息
- 手动修复后重新 `git add` + `git commit`

### commit message 被拒

格式须为 `type: description`，如：
- `feat: 添加用户登录页面`
- `fix: 修复购物车数量计算错误`
- `refactor: 重构数据获取层`
- `docs: 更新上传指南`