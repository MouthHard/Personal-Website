# GitHub 上传指南

> 项目：PersonalWebsite（Vue 3 + Vite 个人博客，纯静态托管在 GitHub Pages）
> 远程仓库：https://github.com/MouthHard/Personal-Website.git（`origin`，已配置）
> 源码分支：`master`；部署分支：`gh-pages`（由构建产物自动生成，**不要手动改动**）

## 一、日常更新代码并推送（最常用）

```bash
# 1. 查看改动了哪些文件
git status

# 2. 暂存全部改动（.gitignore 会自动排除不该上传的文件）
git add -A

# 3. 提交（信息写清楚这次改了什么）
git commit -m "feat: 更新博物馆页面数据"

# 4. 推送到远程 master 分支
git push origin master
```

## 二、首次上传（新环境 / 新仓库）

```bash
# 1. 配置 Git 身份（每台机器只需一次）
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"

# 2. 初始化并关联远程仓库
git init
git remote add origin https://github.com/MouthHard/Personal-Website.git

# 3. 提交并推送
git add -A
git commit -m "初始提交"
git push -u origin master
```

## 三、部署到 GitHub Pages

```bash
# 一键完成：构建 + 推送 dist 到 gh-pages 分支（推荐）
npm run deploy

# 等价的手动步骤
npm run build -- --mode gh-pages
npx gh-pages -d dist -r https://github.com/MouthHard/Personal-Website.git -b gh-pages
```

部署成功后访问：https://mouthhard.github.io/Personal-Website/
（GitHub Pages 构建生效约需 1~2 分钟）

> 注意：`master` 推源码，`gh-pages` 只放构建产物，两条线互不影响。

## 四、常用命令速查

```bash
git status              # 查看工作区状态
git log --oneline -5    # 查看最近 5 条提交
git diff                # 查看未暂存的具体改动
git pull origin master  # 拉取远程最新代码
git restore <文件>       # 丢弃某个文件的改动
git restore --staged .  # 取消暂存（不丢弃改动）
```

## 五、常见问题

**推送报错：认证失败（403 / Authentication failed）**
GitHub 已不支持密码推送，需使用 Personal Access Token 或 SSH：

```bash
# 方式一：HTTPS + Token（推送时密码处填 Token）
git remote set-url origin https://<你的Token>@github.com/MouthHard/Personal-Website.git

# 方式二：改用 SSH
git remote set-url origin git@github.com:MouthHard/Personal-Website.git
```

**推送报错：non-fast-forward / 拒绝推送**
远程有你本地没有的提交，先合并再推：

```bash
git pull --rebase origin master
git push origin master
```

**误提交了大文件或敏感文件**
参见 [file-upload-checklist.md](./file-upload-checklist.md) 的"快速自查命令"；
敏感密钥泄露必须立即在 GitHub 上作废该密钥，并考虑用 `git filter-repo` 清理历史。

**代理导致推送失败（Failed to connect 127.0.0.1:7890）**

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 六、哪些文件该上传？

完整清单见 [file-upload-checklist.md](./file-upload-checklist.md)。核心原则：

- **上传**：`src/`、`public/`、配置文件、`docs/`、`README.md`
- **不上传**：`node_modules/`、`dist/`、`.env`、密钥、日志、**AI IDE / AI 工具生成的文件夹**（如 `.arts/`、`.codeartsdoer/`、`.codegraph/`、`.workbuddy/`、`.cursor/`、`.cline/` 等，均已配置在 `.gitignore`；详见 [file-upload-checklist.md](./file-upload-checklist.md) 第四节完整清单）
- 若发现这些目录已被推送到远程，参考 [file-upload-checklist.md](./file-upload-checklist.md) 第四节用 `git rm -r --cached` 解除跟踪后重新推送
