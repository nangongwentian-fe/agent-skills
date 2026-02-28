# Cursor 适配

## 规则文件格式

`.cursor/rules/` 目录下的 `.mdc` 文件，支持 YAML frontmatter。

## 安装方式

创建文件：`.cursor/rules/persistent-memory.mdc`

```markdown
---
description: 持久化跨会话记忆系统 — 读写 ~/.persistent-memory/
globs:
alwaysApply: true
---

# 持久化记忆系统

## 会话开始
请读取以下文件获取用户上下文：
- `~/.persistent-memory/INDEX.md`（必须）
- `~/.persistent-memory/MEMORY.md`（必须）
- `~/.persistent-memory/SOUL.md`（如果存在）

## 触发写入
当用户说"记住"或检测到重要信息时：
1. 判断分类（facts/decisions/preferences/context）
2. 生成条目 ID（格式：X-YYYYMMDD-NNN）
3. 追加到 ~/.persistent-memory/memories/[分类].md
4. 重写 ~/.persistent-memory/INDEX.md

## 条目格式
### [ID] 标题
- **创建**: YYYY-MM-DD
- **最近访问**: YYYY-MM-DD
- **访问次数**: 1
- **重要度**: high|medium|low
- **标签**: tag1, tag2

正文...

## 检索
用户问"之前"时，先读 INDEX.md 定位，再读具体分类文件。
```

## 注意事项

- Cursor Agent 模式可以执行终端命令，能完整使用记忆系统的读写功能
- Cursor Chat/Ask 模式只能建议，不能直接操作文件，需要用户手动执行
- `alwaysApply: true` 确保每次对话都加载记忆指令
