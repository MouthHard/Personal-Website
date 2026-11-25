# lint-staged stash 陷阱导致 235 个文件改动丢失

> **⚠️ 本文档需持续迭代，检查大厂/GitHub 项目的 lint-staged 最佳实践。**

## 症状

commit 成功后，大量文件改动丢失。`git stash list` 显示残留 stash：
```
stash@{0}: lint-staged automatic backup
```

本次事故导致 239 个文件的改动被 stash 但从未恢复，235 个文件改动丢失。

## 根因

lint-staged 的工作流程：
1. 用户执行 `git commit`
2. lint-staged 检测到工作区有未暂存的改动
3. lint-staged 自动 `git stash` 这些改动
4. lint-staged 运行 lint 工具（`eslint --fix`、`stylelint --fix`）
5. lint 工具 **修改了文件**（`--fix` 自动修复）
6. lint-staged 尝试 `git stash pop` 恢复改动
7. **stash pop 产生冲突**（lint 修改的文件与 stash 中的改动冲突）
8. stash pop 失败，改动留在 stash 中
9. commit 只提交了暂存区的改动，stash 中的改动丢失

**关键点**：lint-staged 的 `--fix` 选项会修改文件，这是 stash pop 冲突的根源。

## 排查过程

```bash
git reflog -20                    # 发现 reset to HEAD~1 操作
git stash list                    # 发现 "lint-staged automatic backup"
git diff 6c113d0 635437b --stat   # stash 包含 239 个文件改动
```

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| A. 提交前 `git add -A` | 简单，lint-staged 不会 stash | 需要养成习惯 |
| B. lint-staged 不用 `--fix` | 不会修改文件，不会冲突 | 无法自动修复 lint 问题 |
| C. 关闭 lint-staged stash | 改动不会被 stash | lint 可能检查到未暂存的改动 |
| D. 提交后检查 stash | 能发现丢失 | 治标不治本 |

## 最终方案

**方案 A + D 组合**：
1. 提交前必须 `git add -A`（确保所有改动已暂存）
2. 提交后必须 `git stash list`（确认无残留）
3. 提交后必须 `git diff HEAD`（确认工作区与 HEAD 一致）

## 验证

```bash
git stash list    # 应该为空
git diff HEAD     # 应该为空
```

## 预防

1. **提交前**：`git add -A` 暂存全部改动
2. **提交后**：`git stash list` + `git diff HEAD` 双重验证
3. **如果有残留 stash**：立即 `git stash pop` 解决冲突
4. **不要在有大量未暂存改动时 commit**：先 `git add -A` 再 commit