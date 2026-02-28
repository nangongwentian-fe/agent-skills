---
name: persistent-memory
description: |
  跨会话的长期记忆系统。让 AI 记住账号、配置、技术发现、项目背景等重要信息，像人一样累积经验。
  触发场景：用户说"记住"/"记录"；用户问"之前"/"上次"；获取到重要信息；会话结束；收到 flush 信号。
---

# Persistent Memory

## 概述

基于文件的三层记忆系统，让 AI 具备长期记忆能力。每次会话开始时自动读取记忆中相关信息，工作过程中主动记录新知识。

## 存储位置

```
~/.persistent-memory/
├── MEMORY.md           # 长期记忆（精选持久信息）
├── memory/
│   └── YYYY-MM-DD.md   # 每日工作日志
└── HEARTBEAT.md        # 心跳检查清单
```

## 触发场景（必须激活）

- 用户说"记住xxx"、"记录下来"
- 用户问"之前怎样"、"上次那个"
- 获取到账号、配置、技术发现、项目背景
- 完成重要任务或重大发现
- 会话结束有新内容
- 收到 flush/整理记忆信号

## 工作流程

### 1. 会话开始（自动）

```bash
# 读取长期记忆
cat ~/.persistent-memory/MEMORY.md

# 读取今日和昨日
cat ~/.persistent-memory/memory/$(date +%Y-%m-%d).md 2>/dev/null
cat ~/.persistent-memory/memory/$(date -d "yesterday" +%Y-%m-%d).md 2>/dev/null
```

### 2. 记住信息

**长期信息 → MEMORY.md**
```bash
echo "## 已完成任务" >> ~/.persistent-memory/MEMORY.md
echo "- 2026-02-28: 安装了 Agent Reach" >> ~/.persistent-memory/MEMORY.md
```

**日常细节 → memory/YYYY-MM-DD.md**
```bash
DATE=$(date +%Y-%m-%d)
echo "### 新学到" >> ~/.persistent-memory/memory/$DATE.md
echo "- fxtwitter API 可获取推文完整内容" >> ~/.persistent-memory/memory/$DATE.md
```

### 3. 搜索记忆

```bash
grep -ri "关键词" ~/.persistent-memory/
ls -t ~/.persistent-memory/memory/ | head -7
```

### 4. 整理记忆（定期）

- 周期性（每次心跳或每周）回顾近期日记
- 将重要内容合并到 MEMORY.md
- 删除 MEMORY.md 中过时信息

## 文件结构说明

### MEMORY.md - 长期记忆

精选的持久信息，结构示例：

```markdown
# MEMORY.md - 长期记忆

## 关于我
- **名字**: AI 助手
- **性格**: 活泼、接地气

## 关于用户
- **名字**: [用户名字]
- **语言**: 中文
- **时区**: GMT+8

## 已完成任务
- 2026-02-27: 安装 nginx

## 技术知识
- fxtwitter API 可获取推文
- OpenClaw 敏感配置被 redacted

## 待完成
- [ ] 优化成本趋势图

## 记住的账号
- **@xxx**: 具体信息
```

### memory/YYYY-MM-DD.md - 每日日记

原始工作日志，结构示例：

```markdown
# 2026-02-28 每日记录

## 今日事项

### 项目进展
- 安装了 Agent Reach
- 配置了 Twitter（等待 Cookie）

## 待办
- [ ] 配置 Twitter
```

### HEARTBEAT.md - 心跳清单

可选，用于主动检查：

```markdown
# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.
```

## 核心原则

1. **用户说"记住" = 立刻写**，不问
2. **长期 → MEMORY.md**，**日常 → memory/YYYY-MM-DD.md**
3. **定期整理**：每周或每次心跳时合并到 MEMORY.md
4. **安全**：不记录真实密码、银行卡等敏感信息

## 与 AI 集成

在项目的 AGENTS.md 或 CLAUDE.md 添加：

```markdown
## 记忆
- 长期: ~/.persistent-memory/MEMORY.md
- 每日: ~/.persistent-memory/memory/$(date +%Y-%m-%d).md
- 会话开始读取，用户说"记住"时写入
```

## 初始化

```bash
mkdir -p ~/.persistent-memory/memory
cat > ~/.persistent-memory/MEMORY.md << 'EOF'
# MEMORY.md - 长期记忆

## 关于我
- **名字**: [AI名字]
- **性格**: [性格描述]

## 关于用户
- **名字**: [用户名]
- **语言**: [语言]
- **时区**: [时区]

## 已完成任务

## 技术知识

## 待完成

## 记住的账号
EOF
```
