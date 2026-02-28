# Claude Code 适配

## 规则文件位置

- 全局：`~/.claude/CLAUDE.md`
- 项目：项目根目录 `CLAUDE.md`

## 安装方式

在 `~/.claude/CLAUDE.md` 中添加以下内容（全局生效）：

### 添加到 CLAUDE.md 的内容

```markdown
# 持久化记忆系统

## 会话开始
每次会话开始时，读取以下文件：
- ~/.persistent-memory/INDEX.md（必须）
- ~/.persistent-memory/MEMORY.md（必须）
- ~/.persistent-memory/SOUL.md（如果存在）

读取后告知用户当前记忆条目数量。

## 记忆触发
当用户说"记住"/"记录下来"，或检测到重要信息时：
1. 判断分类（facts/decisions/preferences/context/journal）
2. 生成条目 ID（格式：X-YYYYMMDD-NNN）
3. 写入 ~/.persistent-memory/memories/[分类].md
4. 重写 ~/.persistent-memory/INDEX.md 更新统计

## 条目格式
### [ID] 标题
- **创建**: YYYY-MM-DD
- **最近访问**: YYYY-MM-DD
- **访问次数**: 1
- **重要度**: high|medium|low
- **标签**: tag1, tag2

正文内容...

## 检索
用户问"之前"时，先读 INDEX.md 定位，再读具体分类文件。

## 会话结束
1. 将重要内容写入 journal/YYYY-MM-DD.md
2. 更新访问过条目的元数据
3. 重写 INDEX.md
```

## 与 Claude Code 原生记忆共存

Claude Code 自带 MEMORY.md 在 `~/.claude/`，persistent-memory 在 `~/.persistent-memory/`。

- 方案 A（推荐）：在 CLAUDE.md 中指定以 persistent-memory 为主记忆源
- 方案 B：软链接合并（见 migration.md）

## 注意事项

- Claude Code 可以直接读写文件和执行命令，完全支持记忆系统
- 如果已安装 persistent-memory Skill，Skill 的指令会自动生效，无需手动配置 CLAUDE.md
