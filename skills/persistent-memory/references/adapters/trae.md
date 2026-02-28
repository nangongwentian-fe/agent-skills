# Trae 适配

## 规则文件格式

Trae 使用 Project Rules 功能，通过 Settings → Rules 或项目配置目录。

## 安装方式

### 方式一：Trae Rules 设置（推荐）

在 Trae Settings → Rules → 添加新规则：

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

### 方式二：项目配置目录

创建 `.trae/rules/persistent-memory.md`，内容与上述相同。

## 注意事项

- Trae 的 Builder 模式（SOLO）可以直接操作文件，适合完整使用记忆系统
- Trae 的 Chat 模式能力受限，建议在 Builder 模式下使用
