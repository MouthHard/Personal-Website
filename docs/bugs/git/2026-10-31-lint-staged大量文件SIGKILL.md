# lint-staged 处理大量文件时 SIGKILL

> **⚠️ 本文档需持续迭代，检查大厂/GitHub 项目的 lint-staged 大文件处理最佳实践。**

## 症状

提交 199+ 个文件时，eslint 和 stylelint 进程被 SIGKILL：

```
[FAILED] eslint --fix [SIGKILL]
[FAILED] stylelint --fix [SIGKILL]
```

## 根因

lint-staged 把 199 个文件分成 5 个 chunk（40+40+40+40+39），每个 chunk 启动独立的 eslint/stylelint 进程。处理大量文件时，Node.js 内存不足（默认 2GB 堆内存限制），操作系统杀掉进程。

**加剧因素**：
- `--fix` 选项需要读写文件，内存占用更高
- SCSS 文件较大（1000+ 行），解析时内存消耗大
- Windows 上 Node.js 内存限制更严格

## 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| A. 增加 Node.js 内存 | 简单 | 治标不治本 |
| B. 减少 lint-staged 文件数 | 降低内存 | 需要配置 |
| C. 分批提交 | 每次 lint 文件少 | 提交次数多 |
| D. 关闭 --fix | 减少内存 | 无法自动修复 |

## 最终方案

**方案 A + B 组合**：

1. 在 `.husky/pre-commit` 中增加 Node.js 内存：
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npx lint-staged
```

2. 在 `.lintstagedrc.json` 中限制并发：
```json
{
  "*.{vue,ts,js}": ["eslint --fix", "prettier --write"],
  "*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "*.json": "prettier --write"
}
```

## 预防

1. 避免一次性提交 200+ 个文件
2. 大规模改动时分批提交
3. 提交前手动运行 lint：`npm run lint && npm run lint:css`