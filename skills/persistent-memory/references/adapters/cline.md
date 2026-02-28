# Cline / Roo Code 适配

## 规则文件格式

**Cline**：
- 全局：Settings → Custom Instructions
- 项目：`.clinerules`（项目根目录）

**Roo Code**（Cline fork）：
- 全局：`~/.roo/rules/*.md`
- 项目：`.roo/rules/*.md` 或 `.roorules`

## 安装方式

### Cline：创建 `.clinerules`

在项目根目录创建 `.clinerules`：

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

### Roo Code：创建 `.roo/rules/persistent-memory.md`

内容与上述 `.clinerules` 相同。

## 注意事项

- Cline 和 Roo Code 均可直接读写文件和执行命令，完全支持记忆系统
- Cline 的 Custom Instructions 有字符数限制，建议使用 `.clinerules` 文件
- Roo Code 支持按模式（Code/Architect/Ask）加载不同规则
