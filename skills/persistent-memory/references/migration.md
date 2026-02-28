# 数据迁移指南

## 从旧版 persistent-memory 迁移

### 检测旧结构

如果存在以下旧结构（无 INDEX.md，有 memory/ 目录）：

```
~/.persistent-memory/
├── MEMORY.md        ← 扁平格式
├── memory/          ← 旧日记目录
├── SENSITIVE.md
└── HEARTBEAT.md
```

### 迁移步骤

```bash
# 1. 备份
cp -r ~/.persistent-memory/ ~/.persistent-memory.backup/

# 2. 创建新目录
mkdir -p ~/.persistent-memory/{memories,journal,archive,.sensitive}

# 3. 迁移每日日记：memory/ → journal/
mv ~/.persistent-memory/memory/*.md ~/.persistent-memory/journal/ 2>/dev/null
rmdir ~/.persistent-memory/memory/ 2>/dev/null

# 4. 迁移敏感信息
mv ~/.persistent-memory/SENSITIVE.md ~/.persistent-memory/.sensitive/secrets.md 2>/dev/null

# 5. 创建 .gitignore
cat > ~/.persistent-memory/.gitignore << 'EOF'
.sensitive/
.token.gpg
*.db
.DS_Store
EOF
```

**第 6 步（AI 手动执行）**：
1. 读取旧 MEMORY.md 的全部内容
2. 将每条信息按分类写入 memories/facts.md、decisions.md、preferences.md、context.md
3. 提取用户画像信息写入 SOUL.md
4. 保留精炼后的核心摘要在新 MEMORY.md
5. 生成 INDEX.md

## 从 Claude Code 原生记忆迁移

Claude Code 使用 `~/.claude/memory/` 目录。

### 方案一：软链接（推荐）

```bash
# 将 Claude Code 的记忆目录链接到 persistent-memory
ln -s ~/.persistent-memory ~/.claude/memory
```

优点：两边同步，零存储

### 方案二：复制

```bash
cp -r ~/.claude/memory/* ~/.persistent-memory/
```

优点：独立存储

### 方案三：合并

```bash
cat ~/.claude/memory/LONGTERM.md >> ~/.persistent-memory/MEMORY.md
cp ~/.claude/memory/daily/*.md ~/.persistent-memory/journal/
```

### 目录对照

| Claude Code | Persistent Memory（新版） |
|-------------|--------------------------|
| ~/.claude/memory/LONGTERM.md | ~/.persistent-memory/MEMORY.md |
| ~/.claude/memory/daily/ | ~/.persistent-memory/journal/ |

## 向后兼容检测

AI 在会话开始时自动执行：

```
if INDEX.md 存在:
    → 新版本，正常流程
elif MEMORY.md 存在 AND (memory/ 或 journal/ 目录存在):
    → 旧版本，提示迁移
    → 「检测到旧版记忆格式，是否升级到新版？」
else:
    → 全新用户，引导初始化（见 setup.md）
```
