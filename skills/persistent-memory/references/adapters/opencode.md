# OpenCode 适配

## 规则文件格式

OpenCode 使用 `AGENTS.md` 文件（与 Codex 格式兼容）和 `opencode.json` 配置。

## 安装方式

### 全局安装（推荐）

在 `~/.config/opencode/AGENTS.md` 中追加：

```markdown
# 持久化记忆系统

## 会话开始
每次会话开始时，读取以下文件：
- ~/.persistent-memory/INDEX.md（必须）
- ~/.persistent-memory/MEMORY.md（必须）
- ~/.persistent-memory/SOUL.md（如果存在）

## 记忆触发
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

### 项目级安装

在项目根目录 `AGENTS.md` 中追加相同内容。

## 注意事项

- OpenCode 支持 AGENTS.md 的多层发现：全局 → 项目根，项目级优先
- OpenCode 可以直接读写文件和执行命令，完全支持记忆系统
- 与 Codex 的 AGENTS.md 格式兼容，如果已配置 Codex 适配可复用
