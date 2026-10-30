# pre-commit 钩子提交失败

> 日期：2026-10-30
> 模块：Git 提交流程

---

## 症状

`git commit` 时 husky pre-commit 钩子报错，提交被阻止：
- ESLint: `no-empty` 错误（空 catch 块）
- Stylelint: 找不到临时文件（文件系统竞态）

## 根因

1. **ESLint no-empty**：`src/stores/landscape/interaction.ts` 第 54 行 `} catch { }` 是空 catch 块，违反 `no-empty` 规则
2. **Stylelint 竞态**：Stylelint 在处理 SCSS 文件时创建临时文件，Windows 文件系统竞态导致临时文件被删除前就尝试访问

## 排查过程

1. `git commit` 失败，查看 husky 输出
2. 定位到 ESLint error: `55:13 error Empty block statement no-empty`
3. 定位到 Stylelint error: `ENOENT: no such file or directory`
4. 修复 ESLint 错误后重新提交，Stylelint 竞态自行消失

## 方案对比

| 方案 | 做法 | 优缺点 |
|------|------|---------|
| **修复 lint 错误** ⭐ | catch 块加注释 | ✅ 正道，不跳过检查 |
| `--no-verify` 跳过 | 绕过 pre-commit | ❌ 危险，可能提交有问题的代码 |
| 修改 ESLint 规则 | 关闭 no-empty | ❌ 过度放宽，掩盖其他潜在问题 |

## 最终方案

```typescript
// 修复前
} catch { }

// 修复后
} catch { /* localStorage 读取失败时忽略，使用空状态 */ }
```

## 验证

- 重新提交成功 ✓
- 后续提交未再出现同类错误 ✓

## 预防

- catch 块不要留空，至少加注释说明为什么忽略
- 提交前可手动跑一次 `npx eslint src/ --ext .ts,.vue` 提前发现问题
- Stylelint 临时文件竞态是 Windows 已知问题，重试即可，不需特殊处理
- 不要用 `--no-verify` 跳过钩子