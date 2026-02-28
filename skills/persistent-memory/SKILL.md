---
name: persistent-memory
description: |
  跨会话的长期记忆系统。必须使用此 skill 当：用户说"记住"、"记录"、"memory"；用户问"之前怎样"、"上次那个"；获取到账号配置、技术发现、项目背景等重要信息。
  效果：让 AI 像人一样记住重要信息，日常细节按需回忆，不用每次从头开始。
---

# Persistent Memory

## 触发场景

**立即激活** 当用户说：
- "记住xxx"
- "记录下来"
- "之前那个..."
- "上次我们"
- "帮我记得"

## 工作流程

### 1. 会话开始
```bash
cat ~/.claude/memory/LONGTERM.md 2>/dev/null || echo ""
cat ~/.claude/memory/daily/$(date +%Y-%m-%d).md 2>/dev/null || true
```

### 2. 写入记忆
```bash
# 重要信息（账号、配置、偏好）→ LONGTERM.md
echo "- **Key**: value" >> ~/.claude/memory/LONGTERM.md

# 工作细节 → daily/YYYY-MM-DD.md  
DATE=$(date +%Y-%m-%d)
echo "- 完成: xxx" >> ~/.claude/memory/daily/$DATE.md
```

### 3. 搜索记忆
```bash
grep -ri "关键词" ~/.claude/memory/
```

## 文件结构

```
~/.claude/memory/
├── LONGTERM.md        # 账号、技术、项目、偏好
└── daily/            # 工作日志
    └── YYYY-MM-DD.md
```

## 初始化

```bash
mkdir -p ~/.claude/memory/daily
cat > ~/.claude/memory/LONGTERM.md << 'EOF'
# 长期记忆
## 账号
## 技术
## 项目
## 偏好
EOF
```

## 核心原则

1. **用户说"记住" = 立刻写**，不要问
2. **长期信息 → LONGTERM**，**日常工作 → daily**
3. **每月整理**：把 daily 重要内容合并到 LONGTERM
4. **安全**：不记录真实密码、银行卡

## 与 CLAUDE.md 集成

```
## 记忆
- 长期: ~/.claude/memory/LONGTERM.md
- 每日: ~/.claude/memory/daily/$(date +%Y-%m-%d).md
- 会话开始自动读取
- 用户说"记住"时写入
```
