# GitHub 上传指南

## 前置准备

1. 确保已安装 Git
2. 确保已配置 Git 用户信息：
   ```bash
   git config --global user.name "你的用户名"
   git config --global user.email "你的邮箱"
   ```

## 上传本地代码到 GitHub

### 1. 初始化 Git 仓库（如果还没有）

```bash
git init
```

### 2. 添加所有文件到暂存区

```bash
git add .
```

### 3. 提交更改

```bash
git commit -m "初始提交"
```

### 4. 关联远程仓库

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

### 5. 推送到远程仓库

```bash
# 首次推送
git push -u origin master

# 或推送到 main 分支
git push -u origin main
```

## 常用 Git 命令

### 查看状态
```bash
git status
```

### 查看提交历史
```bash
git log --oneline
```

### 查看远程仓库
```bash
git remote -v
```

### 拉取远程更新
```bash
git pull origin master
```

### 创建新分支
```bash
git checkout -b 新分支名
```

### 切换分支
```bash
git checkout 分支名
```

### 合并分支
```bash
git merge 分支名
```

## 项目部署到 GitHub Pages

### 方式一：使用 npm script（推荐）

```bash
npm run deploy
```

### 方式二：手动部署

```bash
# 1. 构建项目
npm run build

# 2. 部署到 gh-pages 分支
npx gh-pages -d dist
```

## 注意事项

1. **不要上传的文件**（已在 `.gitignore` 中配置）：
   - `node_modules/` - 依赖包
   - `dist/` - 构建产物
   - `.vite/` - Vite 缓存
   - `types/auto-imports.d.ts` - 自动生成的类型文件
   - `types/components.d.ts` - 自动生成的组件类型文件
   - `.env` - 环境变量文件
   - `*.log` - 日志文件

2. **必须上传的文件**：
   - `src/` - 源代码
   - `public/` - 静态资源
   - `scripts/` - 脚本文件
   - `package.json` - 项目配置
   - `package-lock.json` - 依赖锁定文件
   - `.gitignore` - Git 忽略配置
   - `index.html` - 入口文件
   - `vite.config.ts` - Vite 配置
   - `tsconfig.json` - TypeScript 配置

3. **建议上传的文件**：
   - `README.md` - 项目说明文档
   - `docs/` - 项目文档
   - `.editorconfig` - 编辑器配置
   - `.prettierrc` - Prettier 配置
   - `.eslintrc.cjs` - ESLint 配置

## 常见问题

### 推送失败：认证错误

```bash
# 使用 SSH 方式
git remote set-url origin git@github.com:用户名/仓库名.git

# 或使用 Personal Access Token
git remote set-url origin https://你的token@github.com/用户名/仓库名.git
```

### 推送失败：分支冲突

```bash
# 先拉取远程更新
git pull origin master --rebase

# 然后再推送
git push origin master
```

### 撤销未提交的更改

```bash
# 撤销工作区的更改
git restore .

# 撤销暂存区的更改
git restore --staged .

# 撤销最后一次提交
git reset --soft HEAD~1
```